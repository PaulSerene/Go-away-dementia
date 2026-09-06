/**
 * routes/reminders.js — Reminder management endpoints.
 *
 * Mirrors the localStorage reminder shape from reminderStorage.js (v2).
 *
 * GET    /api/reminders?patient_id=X            — list reminders
 * GET    /api/reminders/:id                      — get single reminder
 * POST   /api/reminders                          — create reminder
 * PUT    /api/reminders/:id                      — update reminder
 * DELETE /api/reminders/:id                      — delete reminder
 * POST   /api/reminders/:id/complete             — mark daily reminder done for today
 * DELETE /api/reminders/:id/complete?date=YYYY-MM-DD — undo daily completion
 */

import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/* ── GET /api/reminders ──────────────────────────────────── */
// Required: ?patient_id=X   Optional: ?type=daily|specific
router.get('/', async (req, res, next) => {
  try {
    const { patient_id, type } = req.query;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id query parameter is required' });
    }

    let query = `SELECT * FROM reminders WHERE patient_id = $1`;
    const params = [patient_id];

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ reminders: result.rows });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/reminders/:id ──────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM reminders WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ reminder: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/reminders ─────────────────────────────────── */
// Body: { patient_id, title, description?, type, date_on?, time_at?, category?, caregiver_id? }
router.post('/', async (req, res, next) => {
  try {
    const {
      patient_id, caregiver_id, title, description,
      type, date_on, time_at, category,
    } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!['daily', 'specific'].includes(type)) {
      return res.status(400).json({ error: 'type must be "daily" or "specific"' });
    }
    if (type === 'specific' && !date_on) {
      return res.status(400).json({ error: 'date_on is required for specific reminders' });
    }

    const result = await pool.query(
      `INSERT INTO reminders
         (patient_id, caregiver_id, title, description, type, date_on, time_at, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        patient_id,
        caregiver_id || null,
        title.trim(),
        description  || null,
        type,
        type === 'daily' ? null : date_on,
        time_at      || null,
        category     || null,
      ]
    );

    res.status(201).json({ reminder: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── PUT /api/reminders/:id ──────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await pool.query('SELECT * FROM reminders WHERE id = $1', [req.params.id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const cur = existing.rows[0];
    const {
      title, description, type, date_on,
      time_at, category, completed,
    } = req.body;

    const result = await pool.query(
      `UPDATE reminders
       SET title       = $1,
           description = $2,
           type        = $3,
           date_on     = $4,
           time_at     = $5,
           category    = $6,
           completed   = $7,
           updated_at  = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        title       !== undefined ? title.trim() : cur.title,
        description !== undefined ? description  : cur.description,
        type        !== undefined ? type         : cur.type,
        date_on     !== undefined ? date_on      : cur.date_on,
        time_at     !== undefined ? time_at      : cur.time_at,
        category    !== undefined ? category     : cur.category,
        completed   !== undefined ? completed    : cur.completed,
        req.params.id,
      ]
    );

    res.json({ reminder: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── DELETE /api/reminders/:id ───────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM reminders WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ deleted: true, id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/reminders/:id/complete ────────────────────── */
// Marks a daily reminder as complete for a given date.
// Body: { patient_id, date_on? }  (date_on defaults to today)
router.post('/:id/complete', async (req, res, next) => {
  try {
    const { patient_id, date_on } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }

    // Use provided date or today (ISO date string in DB local time)
    const dateStr = date_on || new Date().toISOString().slice(0, 10);

    const result = await pool.query(
      `INSERT INTO daily_reminder_completions (reminder_id, patient_id, date_on)
       VALUES ($1, $2, $3)
       ON CONFLICT (reminder_id, patient_id, date_on) DO NOTHING
       RETURNING *`,
      [req.params.id, patient_id, dateStr]
    );

    res.json({
      completed: true,
      reminder_id: parseInt(req.params.id, 10),
      patient_id,
      date_on: dateStr,
      already_existed: result.rowCount === 0,
    });
  } catch (err) {
    next(err);
  }
});

/* ── DELETE /api/reminders/:id/complete ──────────────────── */
// Undoes a daily completion.
// Query: ?patient_id=X&date=YYYY-MM-DD
router.delete('/:id/complete', async (req, res, next) => {
  try {
    const { patient_id, date } = req.query;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id query param is required' });
    }

    const dateStr = date || new Date().toISOString().slice(0, 10);

    await pool.query(
      `DELETE FROM daily_reminder_completions
       WHERE reminder_id = $1 AND patient_id = $2 AND date_on = $3`,
      [req.params.id, patient_id, dateStr]
    );

    res.json({ uncompleted: true, reminder_id: parseInt(req.params.id, 10), date_on: dateStr });
  } catch (err) {
    next(err);
  }
});

export default router;
