/**
 * utils/identity.js — Demo user identity for the Memora prototype.
 *
 * PROTOTYPE APPROACH (no authentication):
 *   On first use, this module creates a single "Mrs. Das" patient record
 *   and a single caregiver record in the database, then caches their
 *   integer IDs in localStorage so future calls are instant.
 *
 *   This avoids duplicate records: the IDs are written once and reused.
 *   If the backend is unavailable, functions return null — callers must
 *   handle null gracefully and fall back to localStorage-only mode.
 *
 * localStorage keys (internal — not the smriti_* data keys):
 *   memora_patient_id   — integer DB id of the demo patient
 *   memora_caregiver_id — integer DB id of the demo caregiver
 */

import { users } from './api.js';

const PATIENT_KEY   = 'memora_patient_id';
const CAREGIVER_KEY = 'memora_caregiver_id';

const DEMO_PATIENT   = { name: 'Mrs. Das',          role: 'patient'   };
const DEMO_CAREGIVER = { name: 'Demo Caregiver',     role: 'caregiver' };

/**
 * Returns the cached patient ID from localStorage, or null if missing.
 * Does NOT call the API.
 */
export function getCachedPatientId() {
  const v = parseInt(localStorage.getItem(PATIENT_KEY), 10);
  return isNaN(v) ? null : v;
}

/**
 * Returns the cached caregiver ID from localStorage, or null if missing.
 * Does NOT call the API.
 */
export function getCachedCaregiverId() {
  const v = parseInt(localStorage.getItem(CAREGIVER_KEY), 10);
  return isNaN(v) ? null : v;
}

/**
 * Ensures a demo patient record exists in the database.
 * - If the ID is already cached: returns it immediately.
 * - Otherwise: creates the user via API and caches the ID.
 * - If the API is unavailable: returns null (caller uses localStorage only).
 *
 * Safe to call multiple times — idempotent.
 * @returns {Promise<number|null>}
 */
export async function getOrCreatePatientId() {
  const cached = getCachedPatientId();
  if (cached !== null) return cached;

  const { data, error } = await users.create(DEMO_PATIENT);
  if (error || !data?.user?.id) {
    console.warn('[identity] Could not create patient in DB:', error);
    return null;
  }

  const id = data.user.id;
  localStorage.setItem(PATIENT_KEY, String(id));
  console.log('[identity] Demo patient created, id:', id);
  return id;
}

/**
 * Ensures a demo caregiver record exists in the database.
 * Same semantics as getOrCreatePatientId.
 * @returns {Promise<number|null>}
 */
export async function getOrCreateCaregiverId() {
  const cached = getCachedCaregiverId();
  if (cached !== null) return cached;

  const { data, error } = await users.create(DEMO_CAREGIVER);
  if (error || !data?.user?.id) {
    console.warn('[identity] Could not create caregiver in DB:', error);
    return null;
  }

  const id = data.user.id;
  localStorage.setItem(CAREGIVER_KEY, String(id));
  console.log('[identity] Demo caregiver created, id:', id);
  return id;
}
