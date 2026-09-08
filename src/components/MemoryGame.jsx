/**
 * MemoryGame.jsx — "Remember the Objects" cognitive memory game.
 *
 * Game phases:
 *   'intro'     → Welcome screen with level info and "I'm Ready" button
 *   'memorise'  → Objects shown for N seconds, then auto-advances
 *   'question'  → Patient selects what they remember
 *   'result'    → Score, accuracy, response time, next-level message
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { gameResults as gameResultsApi } from '../utils/api.js';
import { getCachedPatientId } from '../utils/identity.js';
import { enqueue } from '../utils/syncQueue.js';
import { getGameReadyItems } from '../utils/culturalContent.js';
import { useLanguage } from '../locales/index.js';
import './MemoryGame.css';


/* ── OBJECT POOL ─────────────────────────────────────────────────
 *
 * All possible objects the game can use across any level.
 * We use the cultural content data layer to source gameReady items.
 * ─────────────────────────────────────────────────────────────── */

/**
 * Build the OBJECT_POOL for the current session.
 * 
 * Each item shape:
 *   { id, name, image, alt }
 */
function buildObjectPool() {
  return getGameReadyItems().map((item) => ({
    id:    item.id,
    name:  item.name.en,   // i18n: replace 'en' with locale when ready
    image: item.image,
    alt:   item.description.en,
  }));
}

// Computed once at module load — stable for the lifetime of the session
const OBJECT_POOL = buildObjectPool();

/* ── LEVEL CONFIGURATION ─────────────────────────────────────────
 *
 *   objectCount  — how many target objects the patient must memorise
 *   memoriseMs   — how long (milliseconds) to display the objects
 *   distractors  — how many extra wrong options to show in the question
 *
 * To add Level 4 later: just append another entry here.
 * No other code needs to change.
 * ─────────────────────────────────────────────────────────────── */
const LEVEL_CONFIG = {
  1: { objectCount: 4, memoriseMs: 5000, distractors: 2 },
  2: { objectCount: 5, memoriseMs: 5000, distractors: 2 },
  3: { objectCount: 6, memoriseMs: 4000, distractors: 2 },
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 3;

/* ── ADAPTIVE DIFFICULTY CONSTANTS ──────────────────────────────
 *
 * These thresholds match the spec exactly:
 *   accuracy >= THRESHOLD_UP  → go up one level
 *   accuracy >= THRESHOLD_KEEP → stay at same level
 *   accuracy <  THRESHOLD_KEEP → go down one level
 * ─────────────────────────────────────────────────────────────── */
const THRESHOLD_UP   = 80;  // accuracy % to earn a harder level
const THRESHOLD_KEEP = 50;  // accuracy % to stay at current level

/* ── LOCALSTORAGE HELPERS ─────────────────────────────────────── */

const DIFFICULTY_KEY = 'smriti_current_difficulty';
const RESULTS_KEY    = 'smriti_game_results';

/**
 * Read the saved difficulty level from localStorage.
 * Returns MIN_LEVEL (1) if nothing is saved yet.
 */
function loadDifficulty() {
  const saved = parseInt(localStorage.getItem(DIFFICULTY_KEY), 10);
  if (isNaN(saved) || saved < MIN_LEVEL || saved > MAX_LEVEL) return MIN_LEVEL;
  return saved;
}

/**
 * Write the given difficulty level to localStorage.
 */
function saveDifficulty(level) {
  localStorage.setItem(DIFFICULTY_KEY, String(level));
}

/**
 * Append one game result to the results array in localStorage.
 */
function saveResult(result) {
  const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  existing.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));
}

/* ── ADAPTIVE DIFFICULTY LOGIC ───────────────────────────────────*/
function calcNextDifficulty(currentLevel, accuracy) {
  if (accuracy >= THRESHOLD_UP) {
    return Math.min(currentLevel + 1, MAX_LEVEL);
  }
  if (accuracy >= THRESHOLD_KEEP) {
    return currentLevel;
  }
  return Math.max(currentLevel - 1, MIN_LEVEL);
}

/* ── RANDOM OBJECT SAMPLER ───────────────────────────────────────*/
function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ── SCORE CALCULATOR ────────────────────────────────────────────
 *
 * Accuracy = (correctly selected objects / total target objects) × 100
 * ─────────────────────────────────────────────────────────────── */
function calcScore(selectedIds, correctObjects) {
  const correctIdSet = new Set(correctObjects.map((o) => o.id));
  const totalCorrect = correctIdSet.size;

  let hits = 0;
  let wrong = 0;
  selectedIds.forEach((id) => {
    if (correctIdSet.has(id)) hits++;
    else wrong++;
  });

  const accuracy = totalCorrect > 0 ? Math.round((hits / totalCorrect) * 100) : 0;
  return { hits, wrong, totalCorrect, accuracy };
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
function MemoryGame({ navigate }) {
  const { t } = useLanguage();

  const currentDifficultyNum = useMemo(() => loadDifficulty(), []);
  const levelConfig = LEVEL_CONFIG[currentDifficultyNum] || LEVEL_CONFIG[1];

  const { correctObjects, allOptions } = useMemo(() => {
    const targets = pickRandom(OBJECT_POOL, levelConfig.objectCount);
    const targetIds = new Set(targets.map((o) => o.id));
    const remaining = OBJECT_POOL.filter((o) => !targetIds.has(o.id));
    const distractors = pickRandom(remaining, levelConfig.distractors);
    const options = [...targets, ...distractors].sort(() => Math.random() - 0.5);
    return { correctObjects: targets, allOptions: options };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [phase, setPhase]             = useState('intro');
  const [countdown, setCountdown]     = useState(Math.round(levelConfig.memoriseMs / 1000));
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [attempts, setAttempts]       = useState(0);
  const [answerStart, setAnswerStart] = useState(null);
  const [result, setResult]           = useState(null);

  const timerRef = useRef(null);

  /* ── MEMORISE PHASE TIMER ───────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'memorise') return;

    const totalSeconds = Math.round(levelConfig.memoriseMs / 1000);
    setCountdown(totalSeconds);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setAnswerStart(Date.now());
          setPhase('question');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── HANDLERS ───────────────────────────────────────────────── */

  function handleReady() {
    setPhase('memorise');
  }

  function handleToggle(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    const responseTime = Math.round((Date.now() - answerStart) / 1000);
    const newAttempts  = attempts + 1;
    setAttempts(newAttempts);

    const { hits, wrong, totalCorrect, accuracy } = calcScore(
      [...selectedIds],
      correctObjects,
    );

    const nextDiff = calcNextDifficulty(currentDifficultyNum, accuracy);
    saveDifficulty(nextDiff);

    const gameResult = {
      gameType:       'memory-match',
      difficulty:     currentDifficultyNum,
      nextDifficulty: nextDiff,
      correct:        hits,
      incorrect:      wrong,
      total:          totalCorrect,
      accuracy,
      responseTime,
      attempts:       newAttempts,
      timestamp:      new Date().toISOString(),
    };

    saveResult(gameResult);
    setResult(gameResult);
    setPhase('result');

    // Backend sync (fire-and-forget with offline fallback)
    const patientId = getCachedPatientId();
    if (patientId !== null) {
      const gamePayload = {
        patient_id:      patientId,
        accuracy:        accuracy,
        difficulty:      currentDifficultyNum,
        objects_shown:   totalCorrect,
        objects_correct: hits,
        duration_ms:     responseTime * 1000,
      };
      gameResultsApi.save(gamePayload).then(({ error }) => {
        if (error) {
          enqueue('save_game_result', gamePayload);
        }
      });
    }
  }

  function handleContinue() {
    navigate('patient-home');
  }

  function handlePlayAgain() {
    navigate('patient-activity');
  }

  /* ── LEVEL LABEL ─────────────────────────────────────────────── */
  function getLevelLabel(n) {
    const keys = {
      1: 'game.level.easy',
      2: 'game.level.moderate',
      3: 'game.level.challenging',
    };
    return keys[n] ? t(keys[n]) : t('game.level.label', { n });
  }

  /* ── NEXT LEVEL MESSAGE ─────────────────────────────────────── */
  function getNextLevelMsg(currentLevel, nextLevel) {
    if (nextLevel > currentLevel) return t('game.nextLevel.up');
    if (nextLevel < currentLevel) return t('game.nextLevel.down');
    return t('game.nextLevel.same');
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="mg-screen">

      {/* ── TOP BAR (always visible) ─────────────────────── */}
      <header className="mg-topbar">
        <button
          className="mg-back-btn"
          onClick={() => navigate('games-hub')}
          aria-label={t('nav.games')}
        >
          {t('nav.games')}
        </button>
        <span className="mg-topbar__title">🧠 {t('memoryGame.title')}</span>
        <span className="mg-topbar__level">{getLevelLabel(currentDifficultyNum)}</span>
      </header>

      {/* ── INTRO ─────────────────────────────────────────────── */}
      {phase === 'intro' && (
        <main className="mg-center">
          <div className="mg-card mg-card--intro">
            <span className="mg-big-emoji" aria-hidden="true">🧠</span>

            <div className="mg-level-badge" aria-label={getLevelLabel(currentDifficultyNum)}>
              {getLevelLabel(currentDifficultyNum)}
            </div>

            <h1 className="mg-heading">{t('memoryGame.phase.intro.title')}</h1>
            <p className="mg-subtext">
              {t('memoryGame.phase.intro.desc1')}
              <br />
              {t('memoryGame.phase.intro.desc2')}
            </p>

            <p className="mg-detail">
              {t('game.memory', { n: levelConfig.objectCount, total: Math.round(levelConfig.memoriseMs / 1000) })}
            </p>

            <button
              id="btn-im-ready"
              className="mg-btn mg-btn--primary"
              onClick={handleReady}
            >
              {t('game.btn.ready')}
            </button>
          </div>
        </main>
      )}

      {/* ── MEMORISE ──────────────────────────────────────────── */}
      {phase === 'memorise' && (
        <main className="mg-center">
          <p className="mg-instruction">{t('memoryGame.phase.memorise')}</p>

          <div
            className="mg-countdown"
            aria-live="polite"
            aria-label={t('game.timer', { n: countdown })}
          >
            <span className="mg-countdown__number">{countdown}</span>
            <span className="mg-countdown__label">{t('game.timer.warning', { n: '' }).replace('{n}', '').trim() || 's'}</span>
          </div>

          <div className="mg-object-grid" role="list" aria-label={t('memoryGame.phase.memorise')}>
            {correctObjects.map((obj) => (
              <div key={obj.id} className="mg-object-tile mg-object-tile--image" role="listitem">
                <img
                  className="mg-object-tile__img"
                  src={obj.image}
                  alt={obj.alt || obj.name}
                  loading="eager"
                />
                <span className="mg-object-tile__name">{obj.name}</span>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── QUESTION ──────────────────────────────────────────── */}
      {phase === 'question' && (
        <main className="mg-center">
          <h2 className="mg-question-heading">{t('memoryGame.phase.recall')}</h2>
          <p className="mg-question-hint">
            {t('memoryGame.phase.intro.desc2')}
          </p>

          <div className="mg-option-grid" role="group" aria-label={t('memoryGame.phase.recall')}>
            {allOptions.map((obj) => {
              const isSelected = selectedIds.has(obj.id);
              return (
                <button
                  key={obj.id}
                  id={`option-${obj.id}`}
                  className={`mg-option-tile mg-option-tile--image ${isSelected ? 'mg-option-tile--selected' : ''}`}
                  onClick={() => handleToggle(obj.id)}
                  aria-pressed={isSelected}
                  aria-label={obj.name}
                >
                  <img
                    className="mg-option-tile__img"
                    src={obj.image}
                    alt={obj.alt || obj.name}
                    loading="eager"
                  />
                  <span className="mg-option-tile__name">{obj.name}</span>
                  {isSelected && (
                    <span className="mg-option-tile__check" aria-hidden="true">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            id="btn-submit-answer"
            className="mg-btn mg-btn--primary mg-btn--submit"
            onClick={handleSubmit}
            disabled={selectedIds.size === 0}
            aria-disabled={selectedIds.size === 0}
          >
            {t('memoryGame.btn.check')}
          </button>

          <p className="mg-selected-count" aria-live="polite">
            {selectedIds.size === 0
              ? t('memoryGame.phase.intro.desc2')
              : t('game.score.correct')}
          </p>
        </main>
      )}

      {/* ── RESULT ────────────────────────────────────────────── */}
      {phase === 'result' && result && (
        <main className="mg-center">
          <div className="mg-card mg-card--result">
            <span className="mg-result-emoji" aria-hidden="true">
              {result.accuracy === 100 ? '🌟' : result.accuracy >= 75 ? '😊' : '💪'}
            </span>

            <h2 className="mg-result-praise">{t('memoryGame.complete.title')}</h2>

            <p className="mg-result-summary">
              {t('game.score.correct')}: <strong>{result.correct} / {result.total}</strong>
            </p>

            {/* 2×2 stats grid */}
            <div className="mg-result-stats">
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">🎯</span>
                <span className="mg-stat__value">{result.accuracy}%</span>
                <span className="mg-stat__label">{t('game.score.accuracy')}</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">⏱️</span>
                <span className="mg-stat__value">{result.responseTime}s</span>
                <span className="mg-stat__label">{t('caregiver.responseTime.label')}</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">🔁</span>
                <span className="mg-stat__value">{result.attempts}</span>
                <span className="mg-stat__label">{t('game.score.hints')}</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">📊</span>
                <span className="mg-stat__value">{getLevelLabel(currentDifficultyNum)}</span>
                <span className="mg-stat__label">{t('game.score.level')}</span>
              </div>
            </div>

            <p className="mg-next-msg" aria-live="polite">
              {getNextLevelMsg(currentDifficultyNum, result.nextDifficulty)}
            </p>

            <div className="mg-result-actions">
              <button
                id="btn-play-again"
                className="mg-btn mg-btn--secondary"
                onClick={handlePlayAgain}
              >
                {t('game.btn.playAgain')}
              </button>
              <button
                id="btn-continue"
                className="mg-btn mg-btn--primary"
                onClick={handleContinue}
              >
                {t('game.btn.backToGames')}
              </button>
            </div>
          </div>
        </main>
      )}

    </div>
  );
}

export default MemoryGame;
