/**
 * db/migrate.js — Runs schema.sql against the configured PostgreSQL database.
 *
 * Usage:
 *   npm run db:migrate
 *
 * Safe to re-run: all statements use IF NOT EXISTS.
 * Creates the `smriti` database automatically if it doesn't exist,
 * by connecting to the `postgres` maintenance database first.
 */

import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

const DB_NAME = process.env.DB_NAME || 'smriti';
const baseConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

/**
 * Produce a clear, human-readable error message from a pg/Node error.
 * The `pg` library sometimes leaves `err.message` empty for network errors,
 * so we decode the error code manually.
 */
function describePgError(err) {
  const code = err.code || '';
  const host = baseConfig.host;
  const port = baseConfig.port;

  switch (code) {
    case 'ECONNREFUSED':
      return (
        `Cannot connect to PostgreSQL at ${host}:${port}.\n` +
        `  → Is PostgreSQL installed and running?\n` +
        `  → On Windows: install from https://www.postgresql.org/download/windows/\n` +
        `  → On macOS:   brew install postgresql && brew services start postgresql\n` +
        `  → On Ubuntu:  sudo apt install postgresql && sudo service postgresql start\n` +
        `  → Then re-run: npm run db:migrate`
      );
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return (
        `Hostname "${host}" could not be resolved.\n` +
        `  → Check DB_HOST in server/.env (should be "localhost" for local dev).`
      );
    case '28P01':
    case '28000':
      return (
        `PostgreSQL rejected the password for user "${baseConfig.user}".\n` +
        `  → Check DB_PASSWORD in server/.env matches your PostgreSQL installation.`
      );
    case '3D000':
      return (
        `Database "${DB_NAME}" does not exist and could not be auto-created.\n` +
        `  → Connect to psql as a superuser and run: CREATE DATABASE "${DB_NAME}";`
      );
    case '42501':
      return (
        `User "${baseConfig.user}" does not have permission to perform this action.\n` +
        `  → The user needs CREATEDB privileges or must be a superuser.`
      );
    default: {
      // err.message is sometimes empty for socket errors — fall back to code
      const msg = err.message && err.message.trim() ? err.message : `(no message, code: ${code || 'unknown'})`;
      return `${msg}${code ? `  [pg error code: ${code}]` : ''}`;
    }
  }
}

async function ensureDatabase() {
  // Connect to the maintenance `postgres` db to check / create our db
  const client = new Client({ ...baseConfig, database: 'postgres' });
  await client.connect();
  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]
  );
  if (res.rowCount === 0) {
    // identifiers can't be parameterised — DB_NAME is from our own .env
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log(`[migrate] Created database "${DB_NAME}".`);
  } else {
    console.log(`[migrate] Database "${DB_NAME}" already exists.`);
  }
  await client.end();
}

async function runSchema() {
  const client = new Client({ ...baseConfig, database: DB_NAME });
  await client.connect();
  await client.query(schemaSQL);
  console.log('[migrate] Schema applied successfully.');
  await client.end();
}

async function main() {
  console.log('[migrate] Starting migration...');
  console.log(`[migrate] Target: ${baseConfig.user}@${baseConfig.host}:${baseConfig.port}/${DB_NAME}`);

  try {
    await ensureDatabase();
  } catch (err) {
    console.error('\n[migrate] ✗ Migration failed at: ensureDatabase()');
    console.error('[migrate] Cause:', describePgError(err));
    process.exit(1);
  }

  try {
    await runSchema();
  } catch (err) {
    console.error('\n[migrate] ✗ Migration failed at: runSchema()');
    console.error('[migrate] Cause:', describePgError(err));
    process.exit(1);
  }

  console.log('[migrate] Done. ✓');
  process.exit(0);
}

main();
