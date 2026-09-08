/**
 * utils/api.js — Thin API client for the Smriti backend.
 *
 * DESIGN PRINCIPLE: localStorage-first, backend as optional sync layer.
 *
 * All functions return { data, error }.
 * - If the backend is unreachable, { data: null, error: <message> }
 * - If the call succeeds, { data: <parsed JSON>, error: null }
 *
 * Components should:
 *   1. Read/write from localStorage immediately (fast, offline-safe)
 *   2. Call these API functions to sync with backend when available
 *   3. Never block the UI waiting for the API
 *
 * Usage example:
 *   const { data, error } = await api.memories.list(patientId);
 *   if (error) console.warn('API unavailable:', error);
 *   else syncLocalStorageWithServer(data.memories);
 */

import { getApiBaseUrl } from './platform.js';

/**
 * Environment-aware API base.
 *
 *  Web dev:          '' (empty → Vite proxy handles /api → localhost:3001)
 *  Android emulator: 'http://10.0.2.2:3001' (reaches host PC)
 *  Physical device:  set VITE_API_BASE_URL=http://<LAN-IP>:3001
 *  Production:       set VITE_API_BASE_URL=https://your-api.example.com
 *
 * DO NOT hardcode an IP address here. Use .env or the platform utility.
 */
const BASE = `${getApiBaseUrl()}/api`;


/**
 * Core fetch wrapper.
 * Always returns { data, error } — never throws.
 */
async function request(method, path, body) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE}${path}`, options);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { data: null, error: json.error || `HTTP ${res.status}` };
    }

    return { data: json, error: null };
  } catch (err) {
    // Network error, backend down, etc.
    return { data: null, error: err.message || 'Network error' };
  }
}

const get    = (path)       => request('GET',    path);
const post   = (path, body) => request('POST',   path, body);
const put    = (path, body) => request('PUT',    path, body);
const del    = (path)       => request('DELETE', path);

/* ── Health ──────────────────────────────────────────────── */
export const health = {
  /** Returns { status: 'ok', ... } or error */
  ping: ()   => get('/health'),
  /** Returns DB connectivity status */
  db:   ()   => get('/health/db'),
  /** Returns app version info */
  status: () => get('/health/status'),
};

/* ── Users ───────────────────────────────────────────────── */
export const users = {
  list:   (role)   => get(`/users${role ? `?role=${role}` : ''}`),
  get:    (id)     => get(`/users/${id}`),
  create: (body)   => post('/users', body),
  update: (id, body) => put(`/users/${id}`, body),
};

/* ── Memories ────────────────────────────────────────────── */
export const memories = {
  list:   (patientId)     => get(`/memories?patient_id=${patientId}`),
  get:    (id)            => get(`/memories/${id}`),
  create: (body)          => post('/memories', body),
  update: (id, body)      => put(`/memories/${id}`, body),
  remove: (id)            => del(`/memories/${id}`),
};

/* ── Reminders ───────────────────────────────────────────── */
export const reminders = {
  list:     (patientId, type) =>
    get(`/reminders?patient_id=${patientId}${type ? `&type=${type}` : ''}`),
  get:      (id)              => get(`/reminders/${id}`),
  create:   (body)            => post('/reminders', body),
  update:   (id, body)        => put(`/reminders/${id}`, body),
  remove:   (id)              => del(`/reminders/${id}`),
  /** Mark a daily reminder complete for today (or a given date) */
  complete: (id, patientId, dateOn) =>
    post(`/reminders/${id}/complete`, { patient_id: patientId, date_on: dateOn }),
  /** Undo a daily completion */
  uncomplete: (id, patientId, dateOn) =>
    del(`/reminders/${id}/complete?patient_id=${patientId}${dateOn ? `&date=${dateOn}` : ''}`),
};

/* ── Game Results ────────────────────────────────────────── */
export const gameResults = {
  list: (patientId, limit) =>
    get(`/game-results?patient_id=${patientId}${limit ? `&limit=${limit}` : ''}`),
  save: (body) => post('/game-results', body),
};

/* ── Convenience: check if backend is reachable ──────────── */
export async function isBackendOnline() {
  const { error } = await health.ping();
  return error === null;
}

export default { health, users, memories, reminders, gameResults, isBackendOnline };
