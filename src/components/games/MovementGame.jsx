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
// Labels and instructions are keys to be passed to t()
const MOVEMENTS = [
  { id: 'raise-right', emoji: '🙋‍♀️' },
  { id: 'clap-twice',  emoji: '👏' },
  { id: 'raise-both',  emoji: '🙌' },
  { id: 'tap-knees',   emoji: '🦵' },
  { id: 'wave-hello',  emoji: '👋' },
  { id: 'nod-head',    emoji: '🫡' },
  { id: 'touch-chin',  emoji: '🤔' },
  { id: 'circle-arms', emoji: '🔄' },
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
  const startTimeRef = useRef(null);

  const DEMO_NAME = "Mrs. Das"; // Using demo name as used across the prototype

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
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🙌 {t('movement.title')}</p>
            <p className="gs-header__sub">{t('movement.sub')}</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🤸</span>
            <h1 className="gs-intro__title">{t('movement.intro.title')}</h1>
            <div className="gs-wellness-notice">
              🌿 {t('movement.intro.notice')}
            </div>
            <p className="gs-intro__desc">{t('movement.intro.desc1')}</p>
            <p className="gs-intro__desc">{t('movement.intro.desc2')}</p>
            <p className="gs-intro__desc">
              {t('movement.intro.rounds', {
                count: config.count,
                plural: config.count > 1 ? 's' : '',
                rounds: config.rounds
              })}
            </p>
            <button className="gs-btn gs-btn--primary" onClick={startNewRound}>
              {t('movement.intro.begin')}
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
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info"><p className="gs-header__title">🙌 {t('movement.title')}</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">🌸</span>
            <h1 className="gs-complete__title">{t('game.complete.wonderful')}</h1>
            <p className="gs-complete__sub">{t('movement.complete.sub', { name: DEMO_NAME })}</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">{t('movement.complete.participation')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{config.rounds}</span>
                <span className="gs-score-card__label">{t('movement.complete.total')}</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel, t)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setRound(0); setCorrect(0); setPhase(PHASE.INTRO); }}>
                {t('movement.complete.again')}
              </button>
              <button className="gs-btn gs-btn--outline gs-btn--full" onClick={() => navigate('games-hub')}>
                {t('game.btn.backToGames')}
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
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
        <div className="gs-header__info">
          <p className="gs-header__title">🙌 {t('movement.title')}</p>
          <p className="gs-header__sub">{t('game.round', { n: round + 1, total: config.rounds })}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(round / config.rounds) * 100}%` }} />
        </div>

        <div className="gs-wellness-notice" style={{ marginBottom: 16 }}>
          🌿 {t('movement.wellness.notice')}
        </div>

        {/* WATCH phase — show movement to learn */}
        {phase === PHASE.WATCH && currentMovement && (
          <div className="mv-phase">
            <p className="gs-phase-label">👀 {t('movement.phase.watch')}</p>
            <div className="mv-card">
              <span className="mv-card__emoji">{currentMovement.emoji}</span>
              <p className="mv-card__label">{t(`movement.id.${currentMovement.id}`)}</p>
              <p className="mv-card__instruction">{t(`movement.instructions.${currentMovement.id}`)}</p>
            </div>
            <p className="mv-step-info">
              {t('movement.step.of', { n: currentStep + 1, total: sequence.length })}
            </p>
            <button className="gs-btn gs-btn--primary" onClick={handleWatchNext}>
              {currentStep + 1 < sequence.length ? t('movement.btn.nextMovement') : t('movement.btn.ready')}
            </button>
          </div>
        )}

        {/* DO phase — patient performs each movement */}
        {phase === PHASE.DO && currentMovement && (
          <div className="mv-phase">
            <p className="gs-phase-label">🙌 {t('movement.phase.do')}</p>
            <div className="mv-card mv-card--active">
              <span className="mv-card__emoji">{currentMovement.emoji}</span>
              <p className="mv-card__label">{t(`movement.id.${currentMovement.id}`)}</p>
              <p className="mv-card__instruction">{t(`movement.instructions.${currentMovement.id}`)}</p>
            </div>
            <p className="mv-step-info">
              {t('movement.step.of', { n: currentStep + 1, total: sequence.length }).replace('Movement', 'Step')}
            </p>
            <div className="mv-actions">
              <button className="gs-btn gs-btn--primary" onClick={handleDid}>
                {t('movement.btn.done')}
              </button>
              <button className="gs-btn gs-btn--outline gs-btn--sm" onClick={handleSkip}>
                {t('movement.btn.skip')}
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK phase */}
        {phase === PHASE.FEEDBACK && (
          <div className="mv-phase">
            <div className="gs-feedback gs-feedback--correct">
              🎉 {t('movement.feedback.great')}
            </div>
            <div className="mv-sequence-review">
              <p className="gs-section-heading">{t('movement.feedback.completed')}</p>
              {sequence.map((m, i) => (
                <div key={i} className="mv-review-item">
                  <span>{m.emoji}</span>
                  <span>{t(`movement.id.${m.id}`)}</span>
                  <span className="mv-check">✅</span>
                </div>
              ))}
            </div>
            <button className="gs-btn gs-btn--primary" onClick={handleNext}>
              {round + 1 >= config.rounds ? t('game.btn.seeResults') : t('game.btn.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
