/**
 * routes/index.js — Central route registry.
 *
 * All route modules are mounted here and imported by src/index.js.
 * Add new route files here as features are built.
 */

import { Router } from 'express';
import healthRouter    from './health.js';
import usersRouter     from './users.js';
import memoriesRouter  from './memories.js';
import remindersRouter from './reminders.js';
import gameResultsRouter from './gameResults.js';

const router = Router();

/* ── Health & status ─────────────────────────────────────── */
router.use('/health', healthRouter);

// GET /api/status is mounted on the health router
// as /api/health/status — also expose it at root level for convenience
router.get('/status', (_req, res) => res.redirect('/api/health/status'));

/* ── Feature routes ──────────────────────────────────────── */
router.use('/users',        usersRouter);
router.use('/memories',     memoriesRouter);
router.use('/reminders',    remindersRouter);
router.use('/game-results', gameResultsRouter);

export default router;
