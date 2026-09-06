/**
 * src/index.js — Smriti Express server entry point.
 *
 * Startup order:
 *   1. Load .env
 *   2. Create Express app
 *   3. Mount global middleware (CORS, JSON body parser)
 *   4. Mount API routes under /api
 *   5. 404 and error handlers
 *   6. Start listening
 *
 * The server starts even if PostgreSQL is not yet available.
 * The /api/health/db endpoint will report the DB status separately.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

const app  = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

/* ── MIDDLEWARE ──────────────────────────────────────────── */

// Allow the Vite dev server (port 5173) and any local origin to call the API.
// In production, restrict this to the actual domain.
const allowedOrigins = [
  'http://localhost:5173',  // Vite default
  'http://localhost:4173',  // Vite preview
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── ROUTES ──────────────────────────────────────────────── */
app.use('/api', apiRouter);

// Redirect bare root to health so it's easy to test in a browser
app.get('/', (_req, res) => res.redirect('/api/health'));

/* ── 404 HANDLER ─────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path:  req.originalUrl,
  });
});

/* ── GLOBAL ERROR HANDLER ────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // PostgreSQL connection refused — DB not running / not installed
  if (err.code === 'ECONNREFUSED' || (err.errors && err.errors[0]?.code === 'ECONNREFUSED')) {
    console.error('[db] Cannot reach PostgreSQL:', err.message || err.code);
    return res.status(503).json({
      error:  'Database unavailable. PostgreSQL is not running or not installed.',
      code:   'ECONNREFUSED',
      detail: 'Install and start PostgreSQL, then run: npm run db:migrate',
    });
  }

  const status = err.status || err.statusCode || 500;
  console.error(`[error] ${status} — ${err.message || err}`);
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

/* ── START ───────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   Memora API server running                  ║
║   http://localhost:${PORT}/api/health           ║
║   http://localhost:${PORT}/api/health/db        ║
║   http://localhost:${PORT}/api/status           ║
╚══════════════════════════════════════════════╝
  `.trim());
});

export default app;
