/**
 * db/pool.js — PostgreSQL connection pool.
 *
 * Uses the `pg` library's Pool for connection reuse across requests.
 * All config comes from environment variables — no hardcoded credentials.
 *
 * Imported by routes and the migrate script.
 */

import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME     || 'smriti',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Keep connection pool lean for a local dev prototype
  max:                10,
  idleTimeoutMillis:  30000,
  connectionTimeoutMillis: 5000,
});

// Log connection errors without crashing the server
pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

export default pool;
