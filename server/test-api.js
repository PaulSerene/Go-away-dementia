// Quick API smoke test — run with: node test-api.js
const BASE = 'http://localhost:3001/api';

async function test(label, url, method = 'GET', body = null) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(url, opts);
    const json = await r.json().catch(() => null);
    const icon = r.ok ? '✓' : (r.status < 500 ? '⚠' : '✗');
    console.log(`${icon} [${r.status}] ${label}`);
    if (!r.ok) console.log('   ', json?.error || JSON.stringify(json));
  } catch (e) {
    console.log(`✗ [ERR] ${label} — ${e.message}`);
  }
}

async function main() {
  console.log('=== Smriti API Smoke Test ===\n');

  await test('GET /api/health', `${BASE}/health`);
  await test('GET /api/health/db (expect 503+detail)', `${BASE}/health/db`);
  await test('GET /api/health/status', `${BASE}/health/status`);

  // Users — no patient_id restriction on list
  await test('GET /api/users', `${BASE}/users`);
  await test('GET /api/users?role=patient', `${BASE}/users?role=patient`);
  await test('GET /api/users/999 (expect 404 or 503)', `${BASE}/users/999`);
  await test('POST /api/users missing body (expect 400)', `${BASE}/users`, 'POST', {});
  await test('POST /api/users bad role (expect 400)', `${BASE}/users`, 'POST', { name: 'Test', role: 'admin' });

  // Memories — patient_id required
  await test('GET /api/memories missing patient_id (expect 400)', `${BASE}/memories`);
  await test('GET /api/memories?patient_id=1', `${BASE}/memories?patient_id=1`);
  await test('POST /api/memories missing patient_id (expect 400)', `${BASE}/memories`, 'POST', { title: 'T' });

  // Reminders — patient_id required
  await test('GET /api/reminders missing patient_id (expect 400)', `${BASE}/reminders`);
  await test('GET /api/reminders?patient_id=1', `${BASE}/reminders?patient_id=1`);
  await test('POST /api/reminders bad type (expect 400)', `${BASE}/reminders`, 'POST', { patient_id: 1, title: 'T', type: 'weekly' });

  // Game results — patient_id required
  await test('GET /api/game-results missing patient_id (expect 400)', `${BASE}/game-results`);
  await test('GET /api/game-results?patient_id=1', `${BASE}/game-results?patient_id=1`);
  await test('POST /api/game-results bad accuracy (expect 400)', `${BASE}/game-results`, 'POST', { patient_id: 1, accuracy: 999, difficulty: 1 });

  // 404
  await test('GET /api/nonexistent (expect 404)', `${BASE}/nonexistent`);

  console.log('\n=== Done ===');
}

main();
