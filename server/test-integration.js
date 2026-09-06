/**
 * test-integration.js — Full integration test for Memora backend migration.
 * Run from server/ directory: node test-integration.js
 */

const BASE = 'http://localhost:3001/api';

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data: json };
}

const get  = (p)    => req('GET', p);
const post = (p, b) => req('POST', p, b);
const put  = (p, b) => req('PUT', p, b);
const del  = (p)    => req('DELETE', p);

function pass(msg) { console.log('  ✓', msg); }
function fail(msg, detail) { console.log('  ✗', msg, detail ? `— ${JSON.stringify(detail)}` : ''); }
function section(title) { console.log(`\n── ${title} ─────────────────────────────────`); }

let patientId, caregiverId, memId, remId, gameId;

async function run() {
  console.log('=== Memora Backend Integration Test ===\n');

  // ── 1. Health ──────────────────────────────────────────────────
  section('Health');
  let r = await get('/health');
  r.ok ? pass('GET /health → 200') : fail('GET /health', r.data);

  r = await get('/health/db');
  r.ok ? pass(`GET /health/db → 200 (DB connected)`) : fail('DB not connected', r.data);

  // ── 2. Users ───────────────────────────────────────────────────
  section('Users');

  // Create patient (simulates identity.js getOrCreatePatientId)
  r = await post('/users', { name: 'Mrs. Das (Test)', role: 'patient' });
  if (r.ok && r.data.user?.id) {
    patientId = r.data.user.id;
    pass(`POST /users patient → id ${patientId}`);
  } else {
    fail('POST /users patient', r.data);
    // Try to use id=1 if exists
    const existing = await get('/users?role=patient');
    patientId = existing.data.users?.[0]?.id;
    if (patientId) pass(`Reusing existing patient id ${patientId}`);
  }

  r = await post('/users', { name: 'Test Caregiver', role: 'caregiver' });
  if (r.ok && r.data.user?.id) {
    caregiverId = r.data.user.id;
    pass(`POST /users caregiver → id ${caregiverId}`);
  } else {
    fail('POST /users caregiver', r.data);
  }

  r = await get(`/users/${patientId}`);
  r.ok ? pass(`GET /users/${patientId} → ${r.data.user?.name}`) : fail('GET /users/:id', r.data);

  // ── 3. Memories ────────────────────────────────────────────────
  section('Memories');

  r = await post('/memories', {
    patient_id:  patientId,
    title:       'Integration Test Memory',
    category:    'Family',
    description: 'Created by the integration test.',
    is_favorite: true,
    media_url:   null,
  });
  if (r.ok && r.data.memory?.id) {
    memId = r.data.memory.id;
    pass(`POST /memories → id ${memId}`);
  } else {
    fail('POST /memories', r.data);
  }

  r = await get(`/memories?patient_id=${patientId}`);
  if (r.ok) {
    pass(`GET /memories?patient_id=${patientId} → ${r.data.memories.length} memories`);
  } else {
    fail('GET /memories', r.data);
  }

  r = await put(`/memories/${memId}`, { title: 'Updated Test Memory', is_favorite: false });
  r.ok ? pass(`PUT /memories/${memId} → updated`) : fail('PUT /memories', r.data);

  // Verify update
  r = await get(`/memories/${memId}`);
  if (r.ok && r.data.memory?.title === 'Updated Test Memory') {
    pass(`GET /memories/${memId} → title confirmed`);
  } else {
    fail('Memory update not persisted', r.data);
  }

  // ── 4. Reminders ───────────────────────────────────────────────
  section('Reminders');

  r = await post('/reminders', {
    patient_id:  patientId,
    caregiver_id: caregiverId,
    title:       'Morning Medicine Test',
    description: 'Take 1 tablet with water.',
    type:        'daily',
    time_at:     '08:00',
    category:    'Health',
  });
  if (r.ok && r.data.reminder?.id) {
    remId = r.data.reminder.id;
    pass(`POST /reminders daily → id ${remId}`);
  } else {
    fail('POST /reminders', r.data);
  }

  r = await post('/reminders', {
    patient_id:  patientId,
    title:       'Specific Date Reminder Test',
    type:        'specific',
    date_on:     '2026-12-01',
    time_at:     '10:00',
    category:    'Appointments',
  });
  r.ok ? pass(`POST /reminders specific → id ${r.data.reminder?.id}`) : fail('POST /reminders specific', r.data);
  const specRemId = r.data.reminder?.id;

  r = await get(`/reminders?patient_id=${patientId}`);
  r.ok ? pass(`GET /reminders?patient_id=${patientId} → ${r.data.reminders.length} reminders`) : fail('GET /reminders', r.data);

  // Daily completion
  const today = new Date().toISOString().split('T')[0];
  r = await post(`/reminders/${remId}/complete`, { patient_id: patientId, date_on: today });
  r.ok ? pass(`POST /reminders/${remId}/complete`) : fail('POST /reminders/complete', r.data);

  // Toggle off
  r = await del(`/reminders/${remId}/complete?patient_id=${patientId}&date=${today}`);
  r.ok ? pass(`DELETE /reminders/${remId}/complete (toggle off)`) : fail('DELETE /reminders/complete', r.data);

  r = await put(`/reminders/${remId}`, { title: 'Updated Medicine Test', time_at: '09:00' });
  r.ok ? pass(`PUT /reminders/${remId}`) : fail('PUT /reminders', r.data);

  // Delete specific reminder
  if (specRemId) {
    r = await del(`/reminders/${specRemId}`);
    r.ok ? pass(`DELETE /reminders/${specRemId}`) : fail('DELETE /reminders', r.data);
  }

  // ── 5. Game Results ────────────────────────────────────────────
  section('Game Results');

  r = await post('/game-results', {
    patient_id:      patientId,
    accuracy:        85,
    difficulty:      2,
    objects_shown:   5,
    objects_correct: 4,
    duration_ms:     12000,
  });
  if (r.ok && r.data.game_result?.id) {
    gameId = r.data.game_result.id;
    pass(`POST /game-results → id ${gameId}`);
  } else {
    fail('POST /game-results', r.data);
  }

  r = await get(`/game-results?patient_id=${patientId}`);
  if (r.ok) {
    const { game_results, stats } = r.data;
    pass(`GET /game-results?patient_id=${patientId} → ${game_results.length} results, avg ${stats?.avg_accuracy}% accuracy`);
  } else {
    fail('GET /game-results', r.data);
  }

  // ── 6. Cleanup ────────────────────────────────────────────────
  section('Cleanup');
  if (memId) {
    r = await del(`/memories/${memId}`);
    r.ok ? pass(`DELETE /memories/${memId}`) : fail('DELETE /memories', r.data);
  }

  console.log('\n=== Done ===\n');
}

run().catch(console.error);
