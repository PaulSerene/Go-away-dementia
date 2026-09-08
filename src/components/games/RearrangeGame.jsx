/**
 * RearrangeGame.jsx — "Remember the Room" spatial memory game for Memora.
 *
 * Gameplay:
 *   Phase 1 (MEMORISE): Shows objects in a grid layout with positions labeled.
 *   Phase 2 (REARRANGE): Objects are shuffled. Patient taps objects in original order (1→2→3...).
 *
 * Uses familiar everyday objects. Tap to select in correct sequence.
 *
 * Levels:
 *   1 — 3 objects, 6s memorise time
 *   2 — 5 objects, 5s memorise time
 *   3 — 7 objects, 5s memorise time
 *   4 — 8 objects, 4s memorise time
 */

import { useState, useEffect, useRef } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './RearrangeGame.css';
import '../games/GameShared.css';

/* ── OBJECT POOL ─────────────────────────────────────────────── */
const ROOM_OBJECTS = [
  { id: 'chair',   emoji: '🪑' },
  { id: 'book',    emoji: '📚' },
  { id: 'cup',     emoji: '☕' },
  { id: 'flower',  emoji: '🌸' },
  { id: 'clock',   emoji: '🕐' },
  { id: 'bag',     emoji: '👜' },
  { id: 'lamp',    emoji: '🪔' },
  { id: 'basket',  emoji: '🧺' },
  { id: 'umbrella',emoji: '☂️' },
  { id: 'pot',     emoji: '🪴' },
];

const LEVEL_CONFIG = {
  1: { count: 3, memoriseMs: 6000 },
  2: { count: 5, memoriseMs: 5000 },
  3: { count: 7, memoriseMs: 5000 },
  4: { count: 8, memoriseMs: 4000 },
};

const PHASE = { INTRO: 'intro', MEMORISE: 'memorise', RECALL: 'recall', COMPLETE: 'complete' };

export default function RearrangeGame({ navigate }) {
  const { t } = useLanguage();
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [phase, setPhase]             = useState(PHASE.INTRO);
  const [original, setOriginal]       = useState([]);   // correct ordered list
  const [shuffled, setShuffled]       = useState([]);   // shuffled for recall
  const [selected, setSelected]       = useState([]);   // user's tap sequence (indices into shuffled)
  const [countdown, setCountdown]     = useState(null);
  const [round, setRound]             = useState(0);
  const [correct, setCorrect]         = useState(0);
  const [totalRounds]                 = useState(3);
  const [feedback, setFeedback]       = useState(null);
  const [showResult, setShowResult]   = useState(false);
  const timerRef = useRef(null);

  const DEMO_NAME = "Mrs. Das"; // For demo

  function startGame() {
    const picks = pickRandom(ROOM_OBJECTS, config.count);
    setOriginal(picks);
    setShuffled(shuffle(picks));
    setSelected([]);
    setFeedback(null);
    setShowResult(false);
    setPhase(PHASE.MEMORISE);

    let remaining = Math.ceil(config.memoriseMs / 1000);
    setCountdown(remaining);
    timerRef.current = setInterval(() => {
      remaining--;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setPhase(PHASE.RECALL);
        setCountdown(null);
      }
    }, 1000);
  }

  function handleObjectTap(shuffledIndex) {
    if (showResult) return;
    const alreadySelected = selected.includes(shuffledIndex);
    if (alreadySelected) {
      // Deselect last if user taps last selected
      if (selected[selected.length - 1] === shuffledIndex) {
        setSelected(s => s.slice(0, -1));
      }
      return;
    }
    const newSelected = [...selected, shuffledIndex];
    setSelected(newSelected);

    // Check if complete
    if (newSelected.length === original.length) {
      evaluateAnswer(newSelected);
    }
  }

  function evaluateAnswer(sel) {
    // Build the sequence of object ids the user tapped
    const userSequence = sel.map(i => shuffled[i].id);
    const correctSequence = original.map(o => o.id);
    // Count how many positions match
    let hits = 0;
    userSequence.forEach((id, i) => {
      if (id === correctSequence[i]) hits++;
    });
    const isCorrect = hits === original.length;
    const accuracy = calcAccuracy(hits, original.length);
    if (isCorrect) setCorrect(c => c + 1);
    setFeedback({
      correct: isCorrect,
      hits,
      total: original.length,
      message: isCorrect
        ? t('rearrange.feedback.perfect')
        : t('rearrange.feedback.partial', { hits, total: original.length }),
    });
    setShowResult(true);
  }

  function handleNext() {
    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      finishGame();
    } else {
      setRound(nextRound);
      startGame();
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, totalRounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'rearrange',
      accuracy,
      correct,
      total: totalRounds,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: 0,
    });
    setPhase(PHASE.COMPLETE);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const finalAccuracy = calcAccuracy(correct, totalRounds);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🪑 {t('rearrange.title')}</p>
            <p className="gs-header__sub">{t('rearrange.sub')}</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🪑</span>
            <h1 className="gs-intro__title">{t('rearrange.intro.title')}</h1>
            <p className="gs-intro__desc">
              {t('rearrange.intro.desc1')}
            </p>
            <p className="gs-intro__desc">
              {t('rearrange.intro.desc2', {
                count: config.count,
                plural: config.count > 1 ? 's' : '',
                rounds: totalRounds
              })}
            </p>
            <button className="gs-btn gs-btn--primary" onClick={() => { setRound(0); setCorrect(0); startGame(); }}>
              {t('game.btn.startGame')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──────────────────────────────────────────────────────
  if (phase === PHASE.COMPLETE) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info"><p className="gs-header__title">🪑 {t('rearrange.title')}</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">{finalAccuracy >= 80 ? '🌟' : '💪'}</span>
            <h1 className="gs-complete__title">{t('game.complete.title')}</h1>
            <p className="gs-complete__sub">{t('game.complete.wonderful', { name: DEMO_NAME })}</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">{t('game.score.accuracy')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{totalRounds}</span>
                <span className="gs-score-card__label">{t('rearrange.complete.perfectRounds')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{config.count}</span>
                <span className="gs-score-card__label">{t('rearrange.complete.objects')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{levelLabel(level, t)}</span>
                <span className="gs-score-card__label">{t('game.score.level')}</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel, t)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setRound(0); setCorrect(0); setPhase(PHASE.INTRO); }}>
                {t('game.btn.playAgain')}
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

  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
        <div className="gs-header__info">
          <p className="gs-header__title">🪑 {t('rearrange.title')}</p>
          <p className="gs-header__sub">{t('game.round', { n: round + 1, total: totalRounds })}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(round / totalRounds) * 100}%` }} />
        </div>

        {/* MEMORISE phase */}
        {phase === PHASE.MEMORISE && (
          <div className="rg-memorise">
            <p className="gs-phase-label">👀 {t('rearrange.phase.memorize')}</p>
            {countdown !== null && (
              <div className={`gs-timer ${countdown <= 2 ? 'gs-timer--warning' : ''}`}>
                ⏱ {t('rearrange.timer.remaining', { s: countdown })}
              </div>
            )}
            <p className="rg-instruction">{t('rearrange.instruction.memorize')}</p>
            <div className="rg-grid">
              {original.map((obj, i) => (
                <div key={obj.id} className="rg-object rg-object--memorise">
                  <span className="rg-object__num">{i + 1}</span>
                  <span className="rg-object__emoji">{obj.emoji}</span>
                  <span className="rg-object__name">{t(`rearrange.obj.${obj.id}`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECALL phase */}
        {phase === PHASE.RECALL && (
          <div className="rg-recall">
            <p className="gs-phase-label">🤔 {t('rearrange.phase.recall')}</p>
            <p className="rg-instruction">
              {t('rearrange.instruction.recall')}
              {selected.length > 0 && ` ${t('rearrange.recall.placed', { n: selected.length, total: original.length })}`}
            </p>

            {/* Show user's current sequence so far */}
            <div className="rg-sequence">
              {original.map((_, i) => {
                const selIdx = selected[i];
                const obj = selIdx !== undefined ? shuffled[selIdx] : null;
                return (
                  <div key={i} className={`rg-slot ${obj ? 'rg-slot--filled' : 'rg-slot--empty'}`}>
                    {obj ? (
                      <>
                        <span className="rg-object__emoji">{obj.emoji}</span>
                        <span className="rg-slot__num">{i + 1}</span>
                      </>
                    ) : (
                      <span className="rg-slot__placeholder">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rg-grid">
              {shuffled.map((obj, i) => {
                const isSelected = selected.includes(i);
                const selOrder = selected.indexOf(i);
                return (
                  <button
                    key={obj.id}
                    className={`rg-object rg-object--btn ${isSelected ? 'rg-object--selected' : ''}`}
                    onClick={() => handleObjectTap(i)}
                    disabled={showResult}
                    aria-label={`${t(`rearrange.obj.${obj.id}`)}${isSelected ? ` (placed ${selOrder + 1})` : ''}`}
                  >
                    {isSelected && <span className="rg-object__num rg-object__num--sel">{selOrder + 1}</span>}
                    <span className="rg-object__emoji">{obj.emoji}</span>
                    <span className="rg-object__name">{t(`rearrange.obj.${obj.id}`)}</span>
                  </button>
                );
              })}
            </div>

            {/* Show result after all tapped */}
            {showResult && feedback && (
              <>
                <div className={`gs-feedback ${feedback.correct ? 'gs-feedback--correct' : 'gs-feedback--incorrect'}`}>
                  {feedback.message}
                </div>
                {!feedback.correct && (
                  <div className="rg-correct-order">
                    <p className="gs-section-heading">{t('rearrange.feedback.correctOrder')}</p>
                    <div className="rg-grid">
                      {original.map((obj, i) => (
                        <div key={obj.id} className="rg-object rg-object--correct">
                          <span className="rg-object__num">{i + 1}</span>
                          <span className="rg-object__emoji">{obj.emoji}</span>
                          <span className="rg-object__name">{t(`rearrange.obj.${obj.id}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button className="gs-btn gs-btn--primary" onClick={handleNext}>
                  {round + 1 >= totalRounds ? t('game.btn.seeResults') : t('game.btn.next')}
                </button>
              </>
            )}

            {!showResult && selected.length > 0 && (
              <button className="gs-btn gs-btn--outline gs-btn--sm" onClick={() => setSelected([])}>
                {t('rearrange.btn.reset')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
