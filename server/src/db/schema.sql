-- =============================================================
-- schema.sql — Smriti PostgreSQL schema
--
-- Run via: npm run db:migrate
-- Tables are created with IF NOT EXISTS so re-running is safe.
-- All timestamps stored as TIMESTAMPTZ (timezone-aware).
-- =============================================================

-- ── USERS ────────────────────────────────────────────────────
-- Represents both patients and caregivers.
-- For the SIH prototype a single device may have one patient
-- and one caregiver — the role column distinguishes them.
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  role        VARCHAR(20)  NOT NULL CHECK (role IN ('patient', 'caregiver')),
  device_id   VARCHAR(120),          -- optional: ties a user to a browser/device
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── MEMORIES ─────────────────────────────────────────────────
-- Patient memories (photos, moments, people).
-- media_url is reserved for future image/audio/video support.
CREATE TABLE IF NOT EXISTS memories (
  id            SERIAL PRIMARY KEY,
  patient_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(60),
  is_favorite   BOOLEAN      NOT NULL DEFAULT FALSE,
  media_url     TEXT,                 -- NULL until media feature is built
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── GAME RESULTS ─────────────────────────────────────────────
-- One row per completed "Remember the Objects" game session.
CREATE TABLE IF NOT EXISTS game_results (
  id              SERIAL PRIMARY KEY,
  patient_id      INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accuracy        SMALLINT     NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
  difficulty      SMALLINT     NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  objects_shown   INTEGER      NOT NULL DEFAULT 0,
  objects_correct INTEGER      NOT NULL DEFAULT 0,
  duration_ms     INTEGER,             -- round duration in milliseconds
  played_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── REMINDERS ────────────────────────────────────────────────
-- Mirrors the smriti_reminders localStorage shape (v2).
-- type: 'daily' → repeats every day (date_on is NULL)
--       'specific' → fixed date (date_on is set)
CREATE TABLE IF NOT EXISTS reminders (
  id            SERIAL PRIMARY KEY,
  patient_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id  INTEGER               REFERENCES users(id) ON DELETE SET NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  type          VARCHAR(20)  NOT NULL DEFAULT 'specific'
                             CHECK (type IN ('daily', 'specific')),
  date_on       DATE,                 -- NULL for daily reminders
  time_at       TIME,                 -- e.g. 08:30
  category      VARCHAR(60),
  completed     BOOLEAN      NOT NULL DEFAULT FALSE,  -- for specific reminders
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── DAILY REMINDER COMPLETIONS ────────────────────────────────
-- Tracks per-day completion of 'daily' type reminders.
-- One row = one reminder marked done on one date.
-- Mirrors smriti_daily_completions localStorage key.
CREATE TABLE IF NOT EXISTS daily_reminder_completions (
  id          SERIAL PRIMARY KEY,
  reminder_id INTEGER      NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  patient_id  INTEGER      NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  date_on     DATE         NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (reminder_id, patient_id, date_on)  -- prevent duplicate entries
);

-- ── INDEXES ───────────────────────────────────────────────────
-- Speed up the most common queries

CREATE INDEX IF NOT EXISTS idx_memories_patient       ON memories(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_results_patient   ON game_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_results_played_at ON game_results(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_patient      ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date         ON reminders(date_on);
CREATE INDEX IF NOT EXISTS idx_daily_completions_reminder_date
  ON daily_reminder_completions(reminder_id, date_on);
