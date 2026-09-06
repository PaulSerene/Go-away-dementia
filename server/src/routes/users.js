/**
 * routes/users.js — User management endpoints.
 *
 * GET  /api/users           — list all users (optionally filter by role)
 * GET  /api/users/:id       — get a single user
 * POST /api/users           — create a user (patient or caregiver)
 * PUT  /api/users/:id       — update a user's name / device_id
 */

import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/* ── GET /api/users ──────────────────────────────────────── */
// Query params: ?role=patient|caregiver
router.get('/', async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = 'SELECT * FROM users ORDER BY created_at DESC';
    const params = [];

    if (role) {
      query = 'SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC';
      params.push(role);
    }

    const result = await pool.query(query, params);
    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/users/:id ──────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/users ─────────────────────────────────────── */
// Body: { name, role: "patient"|"caregiver", device_id? }
router.post('/', async (req, res, next) => {
  try {
    const { name, role, device_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!['patient', 'caregiver'].includes(role)) {
      return res.status(400).json({ error: 'role must be "patient" or "caregiver"' });
    }

    const result = await pool.query(
      `INSERT INTO users (name, role, device_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), role, device_id || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── PUT /api/users/:id ──────────────────────────────────── */
// Body: { name?, device_id? }
router.put('/:id', async (req, res, next) => {
  try {
    const { name, device_id } = req.body;

    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE users
       SET name = $1, device_id = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [
        name !== undefined ? name.trim() : current.name,
        device_id !== undefined ? device_id : current.device_id,
        req.params.id,
      ]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
