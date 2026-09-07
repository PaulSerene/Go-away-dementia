/**
 * gameUtils.js — Shared utilities for all Memora cognitive games.
 *
 * All games save results to the SAME key as the existing MemoryGame
 * so the Caregiver Dashboard and PatientProgress screens show all activity.
 *
 * Result shape (compatible with existing smriti_game_results):
 *   { gameType, accuracy, correct, total, difficulty, timestamp, responseTime, hintsUsed }
 */

const RESULTS_KEY    = 'smriti_game_results';
const DIFFICULTY_KEY = 'smriti_current_difficulty';

/* ── ADAPTIVE DIFFICULTY (shared across all games) ───────────────
 *
 * Same thresholds as MemoryGame so difficulty is consistent.
 *   >= 80% accuracy → move up
 *   >= 50% accuracy → stay
 *   <  50% accuracy → move down
 * ─────────────────────────────────────────────────────────────── */
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 4;

export function loadDifficulty() {
  const saved = parseInt(localStorage.getItem(DIFFICULTY_KEY), 10);
  if (isNaN(saved) || saved < MIN_LEVEL || saved > MAX_LEVEL) return MIN_LEVEL;
  return saved;
}

export function saveDifficulty(level) {
  localStorage.setItem(DIFFICULTY_KEY, String(level));
}

export function calcNextDifficulty(currentLevel, accuracy) {
  if (accuracy >= 80) return Math.min(currentLevel + 1, MAX_LEVEL);
  if (accuracy >= 50) return currentLevel;
  return Math.max(currentLevel - 1, MIN_LEVEL);
}

export function nextLevelMessage(currentLevel, nextLevel, t) {
  if (t) {
    if (nextLevel > currentLevel) return t('game.nextLevel.up');
    if (nextLevel < currentLevel) return t('game.nextLevel.down');
    return t('game.nextLevel.same');
  }
  // Fallback: English strings (backward-compatible for components not yet using t())
  if (nextLevel > currentLevel) return 'Wonderful! \uD83C\uDF1F Your next activity will be a little more challenging.';
  if (nextLevel < currentLevel) return "Great effort! \uD83D\uDCAA We'll make the next activity a little gentler.";
  return "Well done! \uD83C\uDF38 We'll practise at this level again.";
}

/* ── RESULT SAVING ───────────────────────────────────────────────
 *
 * Appends one game result to localStorage. Also triggers a backend
 * save attempt via the existing gameResults API.
 * ─────────────────────────────────────────────────────────────── */
export function saveResult(result) {
  try {
    const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
    existing.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));
  } catch {
    console.warn('Memora: could not save game result.');
  }
}

/* ── RANDOM HELPERS ──────────────────────────────────────────────*/
export function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ── ACCURACY CALCULATION ────────────────────────────────────────*/
export function calcAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/* ── LEVEL LABEL ─────────────────────────────────────────────────*/
export function levelLabel(level, t) {
  if (t) {
    const keys = { 1: 'game.level.easy', 2: 'game.level.moderate', 3: 'game.level.challenging', 4: 'game.level.advanced' };
    return keys[level] ? t(keys[level]) : t('game.level.label', { n: level });
  }
  // Fallback: English
  const labels = { 1: 'Easy', 2: 'Moderate', 3: 'Challenging', 4: 'Advanced' };
  return labels[level] || 'Level ' + level;
}

/* ── TIMING ──────────────────────────────────────────────────────*/
export function nowIso() {
  return new Date().toISOString();
}
