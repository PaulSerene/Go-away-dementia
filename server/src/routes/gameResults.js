/**
 * routes/gameResults.js — Memory game result endpoints.
 *
 * GET  /api/game-results?patient_id=X   — list game results for a patient
 * POST /api/game-results                — save a new game result
 */

import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/* ── GET /api/game-results ───────────────────────────────── */
// Required: ?patient_id=X
// Optional: ?limit=N (default 50)
router.get('/', async (req, res, next) => {
  try {
    const { patient_id, limit } = req.query;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id query parameter is required' });
    }

    const safeLimit = Math.min(parseInt(limit || '50', 10), 200);

    const result = await pool.query(
      `SELECT * FROM game_results
       WHERE patient_id = $1
       ORDER BY played_at DESC
       LIMIT $2`,
      [patient_id, safeLimit]
    );

    // Also return aggregate stats for the progress screen
    const stats = await pool.query(
      `SELECT
         COUNT(*)::int                            AS total_games,
         ROUND(AVG(accuracy)::numeric, 1)::float  AS avg_accuracy,
         MAX(accuracy)                             AS best_accuracy,
         ROUND(AVG(difficulty)::numeric, 2)::float AS avg_difficulty
       FROM game_results
       WHERE patient_id = $1`,
      [patient_id]
    );

    res.json({
      game_results: result.rows,
      stats: stats.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/game-results ──────────────────────────────── */
// Body: { patient_id, accuracy, difficulty, objects_shown, objects_correct, duration_ms? }
router.post('/', async (req, res, next) => {
  try {
    const {
      patient_id,
      accuracy,
      difficulty,
      objects_shown,
      objects_correct,
      duration_ms,
    } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }

    const acc = parseInt(accuracy, 10);
    const diff = parseInt(difficulty, 10);
    const shown = parseInt(objects_shown, 10) || 0;
    const correct = parseInt(objects_correct, 10) || 0;

    if (isNaN(acc) || acc < 0 || acc > 100) {
      return res.status(400).json({ error: 'accuracy must be 0–100' });
    }
    if (isNaN(diff) || diff < 1 || diff > 3) {
      return res.status(400).json({ error: 'difficulty must be 1, 2, or 3' });
    }

    const result = await pool.query(
      `INSERT INTO game_results
         (patient_id, accuracy, difficulty, objects_shown, objects_correct, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        patient_id,
        acc,
        diff,
        shown,
        correct,
        duration_ms ? parseInt(duration_ms, 10) : null,
      ]
    );

    res.status(201).json({ game_result: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
