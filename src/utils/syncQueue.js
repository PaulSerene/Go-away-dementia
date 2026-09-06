/**
 * syncQueue.js — Offline sync queue for Memora.
 *
 * PURPOSE
 * ───────
 * When a mutation (create / update / delete) fails because the backend is
 * unavailable, the operation is pushed to this persistent queue.  When
 * connectivity returns, processQueue() replays all pending operations
 * against the live API in FIFO order.
 *
 * KEY INVARIANTS
 * ──────────────
 * • Queue is stored in localStorage ('memora_sync_queue') — survives refresh.
 *   Offline work is NEVER silently lost.
 * • Each item stores enough information to replay the exact API call.
 * • After a successful create_memory / create_reminder the server-assigned
 *   integer id is written back into the localStorage record (_dbId) so that
 *   subsequent edits/deletes can reference the correct server id.
 * • Items that fail MAX_RETRIES times are dropped with a console warning.
 *
 * SUPPORTED OPERATIONS
 * ────────────────────
 *   create_memory       update_memory       delete_memory
 *   create_reminder     update_reminder     delete_reminder
 *   complete_reminder   uncomplete_reminder
 *   save_game_result
 *
 * QUEUE ITEM SHAPE
 * ────────────────
 *   {
 *     id:        string   — unique queue item identifier
 *     operation: string   — one of SUPPORTED OPERATIONS above
 *     payload:   object   — API-ready data for this operation
 *     localId:   string|null — local record id (create ops only)
 *     createdAt: string   — ISO timestamp
 *     retries:   number   — failed attempt count
 *   }
 */

import {
  memories    as memoriesApi,
  reminders   as remindersApi,
  gameResults as gameResultsApi,
} from './api.js';
import { loadReminders, saveReminders } from './reminderStorage.js';

/* ── Constants ──────────────────────────────────────────────── */

const QUEUE_KEY    = 'memora_sync_queue';
const MEMORIES_KEY = 'smriti_memories';
const MAX_RETRIES  = 5;

/* ── Queue persistence helpers ──────────────────────────────── */

function loadQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    console.warn('[syncQueue] Cannot persist queue to localStorage.');
  }
}

/* ── localStorage helpers for memories ─────────────────────────
 * Duplicated here intentionally — importing from component files
 * would create circular dependencies and tight coupling.
 * ─────────────────────────────────────────────────────────────*/

function loadLocalMemories() {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalMemories(list) {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(list));
  } catch {
    console.warn('[syncQueue] Cannot save memories to localStorage.');
  }
}

/* ── Public API ─────────────────────────────────────────────── */

/**
 * Add an operation to the persistent sync queue.
 *
 * @param {string}      operation - one of SUPPORTED OPERATIONS
 * @param {object}      payload   - data for the API call
 * @param {string|null} localId   - local record id (for create ops)
 */
export function enqueue(operation, payload, localId = null) {
  const queue = loadQueue();
  queue.push({
    id:        'sq-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    operation,
    payload,
    localId,
    createdAt: new Date().toISOString(),
    retries:   0,
  });
  saveQueue(queue);
  console.log(`[syncQueue] Enqueued "${operation}"`, { localId });
}

/**
 * Returns the current number of pending items in the queue.
 * @returns {number}
 */
export function queueLength() {
  return loadQueue().length;
}

/**
 * Process all pending queue items against the live API.
 *
 * Call this:
 *   - on app startup when online
 *   - when the browser transitions from offline → online
 *
 * @param {number|null} patientId — demo patient's PostgreSQL id.
 *   Items whose payload has no patient_id will use this as fallback.
 * @returns {Promise<number>} — count of items that still remain (failed)
 */
export async function processQueue(patientId) {
  const queue = loadQueue();
  if (queue.length === 0) return 0;

  console.log(`[syncQueue] Processing ${queue.length} queued operation(s)…`);

  const failed = [];

  for (const item of queue) {
    if (item.retries >= MAX_RETRIES) {
      console.warn(
        `[syncQueue] Dropping after ${MAX_RETRIES} retries: ${item.operation} (${item.id})`
      );
      continue; // silently drop
    }

    let success = false;

    try {
      switch (item.operation) {

        /* ── Memories ─────────────────────────────────────── */

        case 'create_memory': {
          const pid = item.payload.patient_id ?? patientId;
          if (!pid) break; // patient identity not yet available — keep in queue
          const { data, error } = await memoriesApi.create({ ...item.payload, patient_id: pid });
          if (!error && data?.memory?.id) {
            success = true;
            // Write the server-assigned id back to the local record
            const mems = loadLocalMemories();
            const tagged = mems.map((m) =>
              m.id === item.localId ? { ...m, _dbId: data.memory.id } : m
            );
            saveLocalMemories(tagged);
            console.log(
              `[syncQueue] create_memory: local "${item.localId}" → db ${data.memory.id}`
            );
          }
          break;
        }

        case 'update_memory': {
          const { dbId, ...body } = item.payload;
          // No server id means the record was never synced — nothing to update on server
          if (!dbId) { success = true; break; }
          const { error } = await memoriesApi.update(dbId, body);
          if (!error) success = true;
          break;
        }

        case 'delete_memory': {
          const { dbId } = item.payload;
          // No server id means the record was never synced — nothing to delete on server
          if (!dbId) { success = true; break; }
          const { error } = await memoriesApi.remove(dbId);
          if (!error) success = true;
          break;
        }

        /* ── Reminders ────────────────────────────────────── */

        case 'create_reminder': {
          const pid = item.payload.patient_id ?? patientId;
          if (!pid) break;
          const { data, error } = await remindersApi.create({
            ...item.payload,
            patient_id: pid,
          });
          if (!error && data?.reminder?.id) {
            success = true;
            const rems = loadReminders();
            const tagged = rems.map((r) =>
              r.id === item.localId ? { ...r, _dbId: data.reminder.id } : r
            );
            saveReminders(tagged);
            console.log(
              `[syncQueue] create_reminder: local "${item.localId}" → db ${data.reminder.id}`
            );
          }
          break;
        }

        case 'update_reminder': {
          const { dbId, ...body } = item.payload;
          if (!dbId) { success = true; break; }
          const { error } = await remindersApi.update(dbId, body);
          if (!error) success = true;
          break;
        }

        case 'delete_reminder': {
          const { dbId } = item.payload;
          if (!dbId) { success = true; break; }
          const { error } = await remindersApi.remove(dbId);
          if (!error) success = true;
          break;
        }

        case 'complete_reminder': {
          const { dbId, patientId: pid, dateOn } = item.payload;
          if (!dbId) { success = true; break; }
          const effectivePid = pid ?? patientId;
          if (!effectivePid) break;
          const { error } = await remindersApi.complete(dbId, effectivePid, dateOn);
          if (!error) success = true;
          break;
        }

        case 'uncomplete_reminder': {
          const { dbId, patientId: pid, dateOn } = item.payload;
          if (!dbId) { success = true; break; }
          const effectivePid = pid ?? patientId;
          if (!effectivePid) break;
          const { error } = await remindersApi.uncomplete(dbId, effectivePid, dateOn);
          if (!error) success = true;
          break;
        }

        /* ── Game results ─────────────────────────────────── */

        case 'save_game_result': {
          const pid = item.payload.patient_id ?? patientId;
          if (!pid) break;
          const { error } = await gameResultsApi.save({ ...item.payload, patient_id: pid });
          if (!error) success = true;
          break;
        }

        default:
          console.warn('[syncQueue] Unknown operation — dropping:', item.operation);
          success = true; // unknown ops are not retried
      }
    } catch (err) {
      console.warn(
        `[syncQueue] Unexpected error for "${item.operation}":`,
        err.message ?? err
      );
    }

    if (!success) {
      failed.push({ ...item, retries: item.retries + 1 });
    }
  }

  saveQueue(failed);

  if (failed.length === 0) {
    console.log('[syncQueue] All queued operations synced successfully.');
  } else {
    console.log(
      `[syncQueue] ${failed.length} operation(s) remain — will retry on next reconnect.`
    );
  }

  return failed.length;
}
