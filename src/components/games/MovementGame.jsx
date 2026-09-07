/**
 * MovementGame.jsx — "Movement with Aroha" gentle activity game.
 *
 * Displays a sequence of simple movements. User confirms completion with a button.
 * No camera required. Simulated pose detection via acknowledgment.
 *
 * WELLNESS NOTICE: Always displayed. Never presented as medical treatment.
 *
 * Levels:
 *   1 — 1 movement sequence
 *   2 — 2 movements in sequence
 *   3 — 3 movements in sequence
 *   4 — 4 movements in sequence
 */

import { useState, useRef } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './MovementGame.css';
import '../games/GameShared.css';


/* ── MOVEMENT DATABASE ────────────────────────────────────────── */
const MOVEMENTS = [
  { id: 'raise-right', emoji: '🙋‍♀️', label: 'Raise your right hand', instruction: 'Slowly raise your right hand up above your shoulder.' },
  { id: 'clap-twice',  emoji: '👏', label: 'Clap twice',             instruction: 'Gently clap your hands together two times.' },
  { id: 'raise-both',  emoji: '🙌', label: 'Raise both hands',       instruction: 'Slowly raise both hands above your head.' },
  { id: 'tap-knees',   emoji: '🦵', label: 'Tap your knees',         instruction: 'Gently tap both knees with your palms.' },
  { id: 'wave-hello',  emoji: '👋', label: 'Wave hello',             instruction: 'Give a friendly wave with your right hand.' },
  { id: 'nod-head',    emoji: '🫡', label: 'Nod your head',          instruction: 'Gently nod your head up and down twice.' },
  { id: 'touch-chin',  emoji: '🤔', label: 'Touch your chin',        instruction: 'Gently touch your chin with one finger.' },
  { id: 'circle-arms', emoji: '🔄', label: 'Circle your arms',       instruction: 'Make small, slow circles with your arms.' },
];

const LEVEL_CONFIG = {
  1: { count: 1, rounds: 3 },
  2: { count: 2, rounds: 3 },
  3: { count: 3, rounds: 4 },
  4: { count: 4, rounds: 4 },
};

const PHASE = { INTRO: 'intro', WATCH: 'watch', DO: 'do', FEEDBACK: 'feedback', COMPLETE: 'complete' };

export default function MovementGame({ navigate }) {
  const { t } = useLanguage();
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [phase, setPhase] = useState(PHASE.INTRO);
  const [sequence, setSequence]   = useState([]);
  const [currentStep, setCurrentStep] = useState(0);  // which step in the sequence we are showing
  const [round, setRound]   = useState(0);
  const [correct, setCorrect] = useState(0);
  const [nextRoundSeq, setNextRoundSeq] = useState(null);
  const startTimeRef = useRef(null);

  function startNewRound() {
    const seq = pickRandom(MOVEMENTS, config.count);
    setSequence(seq);
    setCurrentStep(0);
    setPhase(PHASE.WATCH);
    startTimeRef.current = Date.now();
  }

  function handleWatchNext() {
    if (currentStep + 1 < sequence.length) {
      setCurrentStep(s => s + 1);
    } else {
      setPhase(PHASE.DO);
      setCurrentStep(0);
    }
  }

  function handleDid() {
    if (currentStep + 1 < sequence.length) {
      setCurrentStep(s => s + 1);
    } else {
      // Round complete — user completed all movements
      setCorrect(c => c + 1);
      setPhase(PHASE.FEEDBACK);
    }
  }

  function handleSkip() {
    // Let the user skip a movement — not penalised harshly
    if (currentStep + 1 < sequence.length) {
      setCurrentStep(s => s + 1);
    } else {
      setPhase(PHASE.FEEDBACK);
    }
  }

  function handleNext() {
    const nextRound = round + 1;
    if (nextRound >= config.rounds) {
      finishGame();
    } else {
      setRound(nextRound);
      startNewRound();
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, config.rounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'movement',
      accuracy,
      correct,
      total: config.rounds,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: 0,
    });
    setPhase(PHASE.COMPLETE);
  }

  const finalAccuracy = calcAccuracy(correct, config.rounds);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ──────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🙌 Movement with Aroha</p>
            <p className="gs-header__sub">Gentle Activity</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🤸</span>
            <h1 className="gs-intro__title">Movement with Aroha</h1>
            <div className="gs-wellness-notice">
              🌿 Only do movements that feel comfortable for you. 
              You may always skip a step.
            </div>
            <p className="gs-intro__desc">
              Aroha will show you a sequence of simple, gentle movements.
              Watch carefully, then try each one at your own pace.
            </p>
            <p className="gs-intro__desc">
              <strong>{config.count} movement{config.count > 1 ? 's' : ''}</strong> per round &middot; <strong>{config.rounds} rounds</strong>
            </p>
            <button className="gs-btn gs-btn--primary" onClick={startNewRound}>
              ▶ Begin Activity
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ────────────────────────────────────────────────────
  if (phase === PHASE.COMPLETE) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info"><p className="gs-header__title">🙌 Movement</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">🌸</span>
            <h1 className="gs-complete__title">Wonderful!</h1>
            <p className="gs-complete__sub">You completed your movement activity, Mrs. Das.</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">Participation</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{config.rounds}</span>
                <span className="gs-score-card__label">Rounds</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setRound(0); setCorrect(0); setPhase(PHASE.INTRO); }}>
                🔄 Do Again
              </button>
              <button className="gs-btn gs-btn--outline gs-btn--full" onClick={() => navigate('games-hub')}>
                ← Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMovement = sequence[currentStep];

  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
        <div className="gs-header__info">
          <p className="gs-header__title">🙌 Movement with Aroha</p>
          <p className="gs-header__sub">Round {round + 1} of {config.rounds}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(round / config.rounds) * 100}%` }} />
        </div>

        <div className="gs-wellness-notice" style={{ marginBottom: 16 }}>
          🌿 Only move if it feels comfortable. You can always skip.
        </div>

        {/* WATCH phase — show movement to learn */}
        {phase === PHASE.WATCH && currentMovement && (
          <div className="mv-phase">
            <p className="gs-phase-label">👀 Watch the Movement</p>
            <div className="mv-card">
              <span className="mv-card__emoji">{currentMovement.emoji}</span>
              <p className="mv-card__label">{currentMovement.label}</p>
              <p className="mv-card__instruction">{currentMovement.instruction}</p>
            </div>
            <p className="mv-step-info">
              Movement {currentStep + 1} of {sequence.length}
            </p>
            <button className="gs-btn gs-btn--primary" onClick={handleWatchNext}>
              {currentStep + 1 < sequence.length ? 'Next Movement →' : "I'm Ready — Let's Try!"}
            </button>
          </div>
        )}

        {/* DO phase — patient performs each movement */}
        {phase === PHASE.DO && currentMovement && (
          <div className="mv-phase">
            <p className="gs-phase-label">🙌 Your Turn!</p>
            <div className="mv-card mv-card--active">
              <span className="mv-card__emoji">{currentMovement.emoji}</span>
              <p className="mv-card__label">{currentMovement.label}</p>
              <p className="mv-card__instruction">{currentMovement.instruction}</p>
            </div>
            <p className="mv-step-info">
              Step {currentStep + 1} of {sequence.length}
            </p>
            <div className="mv-actions">
              <button className="gs-btn gs-btn--primary" onClick={handleDid}>
                ✅ I Did It!
              </button>
              <button className="gs-btn gs-btn--outline gs-btn--sm" onClick={handleSkip}>
                Skip this one
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK phase */}
        {phase === PHASE.FEEDBACK && (
          <div className="mv-phase">
            <div className="gs-feedback gs-feedback--correct">
              🎉 Well done! You completed the sequence!
            </div>
            <div className="mv-sequence-review">
              <p className="gs-section-heading">Movements completed:</p>
              {sequence.map((m, i) => (
                <div key={i} className="mv-review-item">
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                  <span className="mv-check">✅</span>
                </div>
              ))}
            </div>
            <button className="gs-btn gs-btn--primary" onClick={handleNext}>
              {round + 1 >= config.rounds ? 'See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
