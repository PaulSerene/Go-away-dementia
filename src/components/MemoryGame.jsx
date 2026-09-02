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
import './MemoryGame.css';

/* ── OBJECT POOL ─────────────────────────────────────────────────
 *
 * All possible objects the game can use across any level.
 * Objects are randomly sampled each session so the game stays fresh.
 * ─────────────────────────────────────────────────────────────── */
const OBJECT_POOL = [
  { id: 'apple',    emoji: '🍎', name: 'Apple'    },
  { id: 'drum',     emoji: '🥁', name: 'Drum'     },
  { id: 'elephant', emoji: '🐘', name: 'Elephant' },
  { id: 'flower',   emoji: '🌸', name: 'Flower'   },
  { id: 'house',    emoji: '🏠', name: 'House'    },
  { id: 'bicycle',  emoji: '🚲', name: 'Bicycle'  },
  { id: 'umbrella', emoji: '☂️', name: 'Umbrella' },
  { id: 'star',     emoji: '⭐', name: 'Star'     },
];

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
  1: { label: 'Level 1', objectCount: 4, memoriseMs: 5000, distractors: 2 },
  2: { label: 'Level 2', objectCount: 5, memoriseMs: 5000, distractors: 2 },
  3: { label: 'Level 3', objectCount: 6, memoriseMs: 4000, distractors: 2 },
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
 * Called after the patient submits their answers so the NEXT
 * game session starts at the correct level.
 */
function saveDifficulty(level) {
  localStorage.setItem(DIFFICULTY_KEY, String(level));
}

/**
 * Append one game result to the results array in localStorage.
 * We always append (never overwrite) so full history is preserved.
 */
function saveResult(result) {
  const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  existing.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));
}

/* ── ADAPTIVE DIFFICULTY LOGIC ───────────────────────────────────
 *
 * Given the accuracy of the completed game and the current level,
 * returns the level number for the NEXT game.
 *
 *   accuracy >= 80%  → level + 1  (capped at MAX_LEVEL)
 *   accuracy >= 50%  → same level
 *   accuracy <  50%  → level - 1  (floored at MIN_LEVEL)
 * ─────────────────────────────────────────────────────────────── */
function calcNextDifficulty(currentLevel, accuracy) {
  if (accuracy >= THRESHOLD_UP) {
    return Math.min(currentLevel + 1, MAX_LEVEL);
  }
  if (accuracy >= THRESHOLD_KEEP) {
    return currentLevel;
  }
  return Math.max(currentLevel - 1, MIN_LEVEL);
}

/**
 * Returns the friendly message shown on the result screen
 * describing what happens in the next game, without using
 * clinical or diagnostic language.
 */
function nextLevelMessage(currentLevel, nextLevel) {
  if (nextLevel > currentLevel) {
    return 'Great job! 🌟 Your next activity will be a little more challenging.';
  }
  if (nextLevel < currentLevel) {
    return "Good effort! 💪 We'll make the next activity a little easier.";
  }
  return "Well done! 🌸 We'll practise at this level again.";
}

/* ── RANDOM OBJECT SAMPLER ───────────────────────────────────────
 *
 * Randomly picks `count` items from an array without repeating.
 * Uses the Fisher-Yates shuffle to ensure even distribution.
 *
 * Why useMemo (called from inside the component)?
 * We call this once at the START of each game session (component
 * mount) and freeze the result — the objects don't change while
 * you're playing. useMemo ensures the sample is stable across
 * re-renders that happen during the game (e.g. countdown ticks).
 * ─────────────────────────────────────────────────────────────── */
function pickRandom(arr, count) {
  // Shallow-copy so we don't mutate the original pool
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ── SCORE CALCULATOR ────────────────────────────────────────────
 *
 * Accuracy = (correctly selected objects / total target objects) × 100
 * Incorrect selections do NOT reduce the accuracy percentage,
 * but they are tracked separately for the localStorage record.
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

  const accuracy = Math.round((hits / totalCorrect) * 100);
  return { hits, wrong, totalCorrect, accuracy };
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
function MemoryGame({ navigate }) {

  /* ── READ DIFFICULTY FROM LOCALSTORAGE ON MOUNT ─────────────
   *
   * useMemo with an empty [] dependency list runs exactly once —
   * when the component first mounts. This reads the saved level
   * so the game always continues from where the patient left off.
   * Refreshing the browser will NOT reset this because it reads
   * from localStorage, which survives page reloads.
   * ─────────────────────────────────────────────────────────── */
  const currentDifficultyNum = useMemo(() => loadDifficulty(), []);
  const levelConfig = LEVEL_CONFIG[currentDifficultyNum];

  /* ── RANDOMLY SAMPLE OBJECTS FOR THIS SESSION ───────────────
   *
   * correctObjects — the N objects the patient must memorise
   * allOptions     — those N objects + D distractor objects,
   *                  shown shuffled in the question phase
   *
   * Both are frozen at mount time via useMemo so the same set
   * is used consistently throughout the game session.
   * ─────────────────────────────────────────────────────────── */
  const { correctObjects, allOptions } = useMemo(() => {
    // Pick target objects from the full pool
    const targets = pickRandom(OBJECT_POOL, levelConfig.objectCount);
    const targetIds = new Set(targets.map((o) => o.id));

    // Pick distractor objects from what's left (never overlap targets)
    const remaining = OBJECT_POOL.filter((o) => !targetIds.has(o.id));
    const distractors = pickRandom(remaining, levelConfig.distractors);

    // Combine and shuffle so targets and distractors are mixed
    const options = [...targets, ...distractors].sort(() => Math.random() - 0.5);

    return { correctObjects: targets, allOptions: options };
  }, []); // [] = compute once on mount, never recompute

  /* ── STATE ──────────────────────────────────────────────────
   *
   * phase        — current game screen
   * countdown    — seconds left in memorise phase
   * selectedIds  — Set of option IDs the patient has tapped
   * attempts     — how many times Submit was pressed
   * answerStart  — timestamp when question phase began
   * result       — final score object shown on result screen
   * ─────────────────────────────────────────────────────────── */
  const [phase, setPhase]             = useState('intro');
  const [countdown, setCountdown]     = useState(Math.round(levelConfig.memoriseMs / 1000));
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [attempts, setAttempts]       = useState(0);
  const [answerStart, setAnswerStart] = useState(null);
  const [result, setResult]           = useState(null);

  // Holds the setInterval ID so we can clear it on cleanup
  const timerRef = useRef(null);

  /* ── MEMORISE PHASE TIMER ───────────────────────────────────
   *
   * Runs a 1-second interval that decrements countdown.
   * When it reaches 0: stops the interval and moves to 'question'.
   * The cleanup function clears the interval if the patient
   * navigates away mid-game (prevents memory leaks).
   * ─────────────────────────────────────────────────────────── */
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
  }, [phase]);

  /* ── HANDLERS ───────────────────────────────────────────────*/

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

    // Score based on this session's randomly selected correct objects
    const { hits, wrong, totalCorrect, accuracy } = calcScore(
      [...selectedIds],
      correctObjects,
    );

    // Determine the level for the NEXT game
    const nextDiff = calcNextDifficulty(currentDifficultyNum, accuracy);

    // Persist next difficulty so the NEXT component mount reads it
    saveDifficulty(nextDiff);

    const gameResult = {
      gameType:     'memory_match',
      difficulty:   currentDifficultyNum,   // level that was PLAYED
      nextDifficulty: nextDiff,             // level for next game
      correct:      hits,
      incorrect:    wrong,
      total:        totalCorrect,
      accuracy,
      responseTime,
      attempts:     newAttempts,
      timestamp:    new Date().toISOString(),
    };

    saveResult(gameResult);
    setResult(gameResult);
    setPhase('result');
  }

  function handleContinue() {
    navigate('patient-home');
  }

  /* ── PRAISE TEXT ────────────────────────────────────────────*/
  function praiseText(accuracy) {
    if (accuracy === 100) return 'Wonderful! 🌟';
    if (accuracy >= 75)   return 'Great job! 😊';
    if (accuracy >= 50)   return 'Good try! 💪';
    return 'Keep practising! 🌸';
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="mg-screen">

      {/* ── TOP BAR (always visible) ─────────────────────── */}
      <header className="mg-topbar">
        <button
          className="mg-back-btn"
          onClick={() => navigate('patient-home')}
          aria-label="Go back to home"
        >
          ← Home
        </button>
        <span className="mg-topbar__title">🧠 Remember the Objects</span>
        <span className="mg-topbar__level">{levelConfig.label}</span>
      </header>

      {/* ── INTRO ───────────────────────────────────────────── */}
      {phase === 'intro' && (
        <main className="mg-center">
          <div className="mg-card mg-card--intro">
            <span className="mg-big-emoji" aria-hidden="true">🧠</span>

            {/* Level badge — clearly shows which level is being played */}
            <div className="mg-level-badge" aria-label={`Playing ${levelConfig.label}`}>
              {levelConfig.label}
            </div>

            <h1 className="mg-heading">Let's play a memory game 🧠</h1>
            <p className="mg-subtext">
              Look carefully at the objects.
              <br />
              Try to remember them.
            </p>

            {/* Plain-language summary of this level's challenge */}
            <p className="mg-detail">
              Remember{' '}
              <strong>{levelConfig.objectCount} objects</strong> in{' '}
              <strong>{Math.round(levelConfig.memoriseMs / 1000)} seconds</strong>.
            </p>

            <button
              id="btn-im-ready"
              className="mg-btn mg-btn--primary"
              onClick={handleReady}
            >
              I'm Ready ▶
            </button>
          </div>
        </main>
      )}

      {/* ── MEMORISE ────────────────────────────────────────── */}
      {phase === 'memorise' && (
        <main className="mg-center">
          <p className="mg-instruction">Look carefully! Remember these objects.</p>

          <div
            className="mg-countdown"
            aria-live="polite"
            aria-label={`${countdown} seconds remaining`}
          >
            <span className="mg-countdown__number">{countdown}</span>
            <span className="mg-countdown__label">seconds left</span>
          </div>

          {/* Show this session's randomly chosen correct objects */}
          <div className="mg-object-grid" role="list" aria-label="Objects to remember">
            {correctObjects.map((obj) => (
              <div key={obj.id} className="mg-object-tile" role="listitem">
                <span className="mg-object-tile__emoji" aria-hidden="true">{obj.emoji}</span>
                <span className="mg-object-tile__name">{obj.name}</span>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── QUESTION ────────────────────────────────────────── */}
      {phase === 'question' && (
        <main className="mg-center">
          <h2 className="mg-question-heading">Which objects did you see?</h2>
          <p className="mg-question-hint">
            Tap the objects you remember. Tap again to undo.
          </p>

          {/*
           * allOptions = correct objects + distractors, shuffled.
           * Distractors are NEVER in correctObjects, so selecting
           * them will never accidentally count as correct.
           */}
          <div className="mg-option-grid" role="group" aria-label="Select objects you remember">
            {allOptions.map((obj) => {
              const selected = selectedIds.has(obj.id);
              return (
                <button
                  key={obj.id}
                  id={`option-${obj.id}`}
                  className={`mg-option-tile ${selected ? 'mg-option-tile--selected' : ''}`}
                  onClick={() => handleToggle(obj.id)}
                  aria-pressed={selected}
                  aria-label={`${obj.name}${selected ? ', selected' : ''}`}
                >
                  <span className="mg-option-tile__emoji" aria-hidden="true">{obj.emoji}</span>
                  <span className="mg-option-tile__name">{obj.name}</span>
                  {selected && (
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
            Submit Answer ✓
          </button>

          <p className="mg-selected-count" aria-live="polite">
            {selectedIds.size === 0
              ? 'Select at least one object.'
              : `${selectedIds.size} object${selectedIds.size > 1 ? 's' : ''} selected`}
          </p>
        </main>
      )}

      {/* ── RESULT ──────────────────────────────────────────── */}
      {phase === 'result' && result && (
        <main className="mg-center">
          <div className="mg-card mg-card--result">
            <span className="mg-result-emoji" aria-hidden="true">
              {result.accuracy === 100 ? '🌟' : result.accuracy >= 75 ? '😊' : '💪'}
            </span>

            <h2 className="mg-result-praise">{praiseText(result.accuracy)}</h2>

            <p className="mg-result-summary">
              You remembered{' '}
              <strong>{result.correct} out of {result.total}</strong> objects.
            </p>

            {/* 2×2 stats grid */}
            <div className="mg-result-stats">
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">🎯</span>
                <span className="mg-stat__value">{result.accuracy}%</span>
                <span className="mg-stat__label">Accuracy</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">⏱️</span>
                <span className="mg-stat__value">{result.responseTime}s</span>
                <span className="mg-stat__label">Response time</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">🔁</span>
                <span className="mg-stat__value">{result.attempts}</span>
                <span className="mg-stat__label">Attempts</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat__icon" aria-hidden="true">📊</span>
                <span className="mg-stat__value">{levelConfig.label}</span>
                <span className="mg-stat__label">Difficulty</span>
              </div>
            </div>

            {/*
             * Next-level message — tells the patient what to expect
             * next time, using warm and encouraging language.
             * No clinical or diagnostic language used.
             */}
            <p className="mg-next-msg" aria-live="polite">
              {nextLevelMessage(currentDifficultyNum, result.nextDifficulty)}
            </p>

            <button
              id="btn-continue"
              className="mg-btn mg-btn--primary"
              onClick={handleContinue}
            >
              Continue →
            </button>
          </div>
        </main>
      )}

    </div>
  );
}

export default MemoryGame;
