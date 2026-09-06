/**
 * routes/health.js — Health and status endpoints.
 *
 * GET /api/health        — basic liveness check (no DB)
 * GET /api/health/db     — checks DB connectivity
 * GET /api/status        — returns build info
 */

import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/* ── GET /api/health ─────────────────────────────────────── */
router.get('/', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'smriti-api',
    timestamp: new Date().toISOString(),
  });
});

/* ── GET /api/health/db ──────────────────────────────────── */
router.get('/db', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    res.json({
      status:      'ok',
      db:          'connected',
      server_time: result.rows[0].server_time,
    });
  } catch (err) {
    // The pg library sometimes leaves err.message empty for socket errors — decode manually
    const detail = err.message && err.message.trim()
      ? err.message
      : err.code === 'ECONNREFUSED'
        ? `Cannot connect to PostgreSQL (ECONNREFUSED). Is it installed and running?`
        : err.code
          ? `PostgreSQL error (code: ${err.code})`
          : 'Unknown database error';

    res.status(503).json({
      status: 'error',
      db:     'unreachable',
      code:   err.code || null,
      detail,
    });
  }
});

/* ── GET /api/status ─────────────────────────────────────── */
router.get('/status', (_req, res) => {
  res.json({
    application: 'Smriti',
    version:     '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    node:        process.version,
    uptime_s:    Math.round(process.uptime()),
  });
});

export default router;
