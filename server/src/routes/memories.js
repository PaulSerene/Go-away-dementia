/**
 * routes/memories.js — Patient memory endpoints.
 *
 * GET    /api/memories?patient_id=X   — list memories for a patient
 * GET    /api/memories/:id            — get a single memory
 * POST   /api/memories                — create a memory
 * PUT    /api/memories/:id            — update a memory
 * DELETE /api/memories/:id            — delete a memory
 */

import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/* ── GET /api/memories ───────────────────────────────────── */
// Required query param: ?patient_id=X
router.get('/', async (req, res, next) => {
  try {
    const { patient_id } = req.query;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id query parameter is required' });
    }

    const result = await pool.query(
      `SELECT * FROM memories
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [patient_id]
    );

    res.json({ memories: result.rows });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/memories/:id ───────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM memories WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json({ memory: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/memories ──────────────────────────────────── */
// Body: { patient_id, title, description?, category?, is_favorite?, media_url? }
router.post('/', async (req, res, next) => {
  try {
    const { patient_id, title, description, category, is_favorite, media_url } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    const result = await pool.query(
      `INSERT INTO memories (patient_id, title, description, category, is_favorite, media_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        patient_id,
        title.trim(),
        description || null,
        category   || null,
        is_favorite === true || is_favorite === 'true',
        media_url  || null,
      ]
    );

    res.status(201).json({ memory: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── PUT /api/memories/:id ───────────────────────────────── */
// Body: any subset of { title, description, category, is_favorite, media_url }
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await pool.query('SELECT * FROM memories WHERE id = $1', [req.params.id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const cur = existing.rows[0];
    const { title, description, category, is_favorite, media_url } = req.body;

    const result = await pool.query(
      `UPDATE memories
       SET title       = $1,
           description = $2,
           category    = $3,
           is_favorite = $4,
           media_url   = $5,
           updated_at  = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        title       !== undefined ? title.trim()  : cur.title,
        description !== undefined ? description   : cur.description,
        category    !== undefined ? category      : cur.category,
        is_favorite !== undefined ? (is_favorite === true || is_favorite === 'true') : cur.is_favorite,
        media_url   !== undefined ? media_url     : cur.media_url,
        req.params.id,
      ]
    );

    res.json({ memory: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ── DELETE /api/memories/:id ────────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM memories WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json({ deleted: true, id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

export default router;
