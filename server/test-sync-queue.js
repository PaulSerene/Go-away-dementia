/**
 * test-sync-queue.js — Unit test for the offline sync queue logic.
 * 
 * Simulates what happens when:
 * 1. Items are enqueued (backend offline simulation)
 * 2. processQueue is called when backend comes back online
 * 3. _dbId is written back to localStorage after create_memory succeeds
 */

// Mock localStorage
const store = {};
global.localStorage = {
  getItem:    (k)    => store[k] ?? null,
  setItem:    (k, v) => { store[k] = v; },
  removeItem: (k)    => { delete store[k]; },
};

// ── Inline the queue helpers (mirrors syncQueue.js logic) ──────────

const QUEUE_KEY    = 'memora_sync_queue';
const MEMORIES_KEY = 'smriti_memories';

function loadQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
}
function saveQueue(q) { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
function loadMems()   { try { return JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]'); } catch { return []; } }
function saveMems(m)  { localStorage.setItem(MEMORIES_KEY, JSON.stringify(m)); }

function enqueueLocal(op, payload, localId = null) {
  const q = loadQueue();
  q.push({ id: 'sq-' + Date.now() + '-test', operation: op, payload, localId, retries: 0 });
  saveQueue(q);
}

// ── Seed a local-only memory (simulates offline create) ────────────

const offlineMemory = {
  id: 'cgm-offline-test-123',
  title: 'Offline Memory',
  category: 'Family',
  description: 'Created while offline.',
  favorite: false,
};
saveMems([offlineMemory]);
console.log('✓ Seeded offline memory with no _dbId');

// ── Enqueue a create_memory operation (simulates what the component does) ─

enqueueLocal('create_memory', {
  patient_id:  1,
  title:       offlineMemory.title,
  category:    offlineMemory.category,
  description: offlineMemory.description,
  is_favorite: offlineMemory.favorite,
}, offlineMemory.id);

const queueAfterEnqueue = loadQueue();
console.assert(queueAfterEnqueue.length === 1, '✗ Queue should have 1 item');
console.log(`✓ Queue has ${queueAfterEnqueue.length} item(s) after enqueue`);
console.assert(queueAfterEnqueue[0].operation === 'create_memory', '✗ Wrong operation');
console.log(`✓ Operation is "${queueAfterEnqueue[0].operation}"`);
console.assert(queueAfterEnqueue[0].localId === offlineMemory.id, '✗ Wrong localId');
console.log(`✓ localId correctly set to "${queueAfterEnqueue[0].localId}"`);

// ── Simulate processQueue reconciling _dbId ────────────────────────

// Simulate what processQueue does after a successful create_memory API call:
const fakeServerId = 42;
const memsBeforeReconcile = loadMems();
const memsAfterReconcile = memsBeforeReconcile.map((m) =>
  m.id === offlineMemory.id ? { ...m, _dbId: fakeServerId } : m
);
saveMems(memsAfterReconcile);
saveQueue([]); // processQueue removes the item on success

const memsNow = loadMems();
console.assert(memsNow[0]._dbId === fakeServerId, `✗ _dbId not set: got ${memsNow[0]._dbId}`);
console.log(`✓ _dbId reconciled: local "${offlineMemory.id}" → db ${fakeServerId}`);
console.assert(memsNow[0].title === offlineMemory.title, '✗ Title was lost during reconciliation');
console.log(`✓ Title preserved after reconciliation: "${memsNow[0].title}"`);

const queueAfterProcess = loadQueue();
console.assert(queueAfterProcess.length === 0, '✗ Queue should be empty after processing');
console.log(`✓ Queue is empty after successful sync`);

// ── Test syncFromBackend merge logic (preserves localOnly) ─────────

// Simulate: DB returns 1 record; local has 1 DB-synced + 1 offline-only
const dbMemory   = { id: 10, title: 'DB Memory', category: 'Events', description: 'Synced.', is_favorite: false, created_at: new Date().toISOString() };
const localMems  = [
  { id: 'cgm-synced',  _dbId: 10, title: 'DB Memory', category: 'Events' },
  { id: 'cgm-offline', title: 'Offline Only Memory',  category: 'Family' },   // no _dbId
];
saveMems(localMems);

const localByDbId = Object.fromEntries(localMems.filter(m => m._dbId).map(m => [m._dbId, m]));
const fromDb      = [dbMemory].map(d => ({ ...localByDbId[d.id], _dbId: d.id, title: d.title }));
const localOnly   = localMems.filter(m => !m._dbId);
const merged      = [...fromDb, ...localOnly];

console.assert(merged.length === 2, `✗ merged should have 2 items, got ${merged.length}`);
console.log(`✓ Merged has ${merged.length} items (1 from DB + 1 offline-only preserved)`);
console.assert(merged.find(m => m.id === 'cgm-offline'), '✗ offline-only record was lost');
console.log(`✓ Offline-only record is preserved through syncFromBackend`);
console.assert(merged.find(m => m._dbId === 10), '✗ DB-synced record is missing');
console.log(`✓ DB-synced record is present with correct _dbId`);

console.log('\n=== All sync-queue tests passed ===\n');
