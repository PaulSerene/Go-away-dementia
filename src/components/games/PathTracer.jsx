/**
 * PathTracer.jsx — "PathTracer" route memory game for Memora.
 *
 * Gameplay:
 *   Phase 1 (MEMORISE): A fictional route with landmarks is shown.
 *   Phase 2 (RECALL): Landmarks are shown shuffled. Patient taps them in correct order.
 *
 * Uses fictional local place names — NEVER requests real home addresses.
 *
 * Levels:
 *   1 — 2-stop route
 *   2 — 3-stop route
 *   3 — 4-stop route + slightly less time
 *   4 — 5-stop route with minimal visual cues
 */

import { useState, useEffect, useRef } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './PathTracer.css';
import '../games/GameShared.css';


/* ── ROUTE LANDMARK POOL ─────────────────────────────────────── */
const LANDMARK_POOL = [
  { id: 'home',      emoji: '🏠', name: 'Home',           type: 'start' },
  { id: 'gate',      emoji: '🚪', name: 'Front Gate',     type: 'point' },
  { id: 'tea-shop',  emoji: '🍵', name: 'Tea Shop',       type: 'point' },
  { id: 'big-tree',  emoji: '🌳', name: 'Big Banyan Tree',type: 'point' },
  { id: 'pond',      emoji: '💧', name: 'Village Pond',   type: 'point' },
  { id: 'post-off',  emoji: '📮', name: 'Post Office',    type: 'point' },
  { id: 'market',    emoji: '🏪', name: 'Weekly Market',  type: 'point' },
  { id: 'school',    emoji: '🏫', name: 'School',         type: 'point' },
  { id: 'temple',    emoji: '🛕', name: 'Temple',         type: 'point' },
  { id: 'bridge',    emoji: '🌉', name: 'Old Bridge',     type: 'point' },
  { id: 'grocery',   emoji: '🛒', name: 'Grocery Store',  type: 'end' },
  { id: 'clinic',    emoji: '🏥', name: 'Clinic',         type: 'end' },
  { id: 'bus-stop',  emoji: '🚌', name: 'Bus Stop',       type: 'end' },
];

const LEVEL_CONFIG = {
  1: { stops: 2, memoriseMs: 6000, rounds: 3 },
  2: { stops: 3, memoriseMs: 6000, rounds: 3 },
  3: { stops: 4, memoriseMs: 5000, rounds: 4 },
  4: { stops: 5, memoriseMs: 4000, rounds: 4 },
};

function buildRoute(stopCount) {
  // Always start with Home, end with a destination, fill middle with points
  const start = LANDMARK_POOL.find(l => l.id === 'home');
  const ends   = LANDMARK_POOL.filter(l => l.type === 'end');
  const points = LANDMARK_POOL.filter(l => l.type === 'point');
  const middle = pickRandom(points, stopCount - 2);
  const end    = pickRandom(ends, 1)[0];
  return [start, ...middle, end];
}

const PHASE = { INTRO: 'intro', MEMORISE: 'memorise', RECALL: 'recall', COMPLETE: 'complete' };

export default function PathTracer({ navigate }) {
  const { t } = useLanguage();
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [phase, setPhase]         = useState(PHASE.INTRO);
  const [route, setRoute]         = useState([]);      // correct order
  const [shuffled, setShuffled]   = useState([]);      // shuffled for recall
  const [selected, setSelected]   = useState([]);      // user's tap sequence (ids)
  const [countdown, setCountdown] = useState(null);
  const [round, setRound]         = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [feedback, setFeedback]   = useState(null);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef(null);

  function startRound() {
    const r = buildRoute(config.stops);
    setRoute(r);
    setShuffled(shuffle(r));
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
        setCountdown(null);
        setPhase(PHASE.RECALL);
      }
    }, 1000);
  }

  function handleTap(landmark) {
    if (showResult) return;
    const isAlreadySel = selected.find(s => s.id === landmark.id);
    if (isAlreadySel) {
      // Allow deselect of the last tapped item only
      if (selected[selected.length - 1].id === landmark.id) {
        setSelected(s => s.slice(0, -1));
      }
      return;
    }
    const newSelected = [...selected, landmark];
    setSelected(newSelected);

    if (newSelected.length === route.length) {
      evaluateAnswer(newSelected);
    }
  }

  function evaluateAnswer(sel) {
    let hits = 0;
    sel.forEach((lm, i) => {
      if (lm.id === route[i].id) hits++;
    });
    const isCorrect = hits === route.length;
    if (isCorrect) setCorrect(c => c + 1);
    setFeedback({
      correct: isCorrect,
      hits,
      total: route.length,
      message: isCorrect
        ? '🗺️ Perfect route! You remembered the way!'
        : `💪 You got ${hits} of ${route.length} stops right. The correct route is shown below.`,
    });
    setShowResult(true);
  }

  function handleNext() {
    const nextRound = round + 1;
    if (nextRound >= config.rounds) {
      finishGame();
    } else {
      setRound(nextRound);
      startRound();
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, config.rounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'path-tracer',
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

  useEffect(() => () => clearInterval(timerRef.current), []);

  const finalAccuracy = calcAccuracy(correct, config.rounds);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ─────────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🗺️ PathTracer</p>
            <p className="gs-header__sub">Attention · Spatial Memory</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🗺️</span>
            <h1 className="gs-intro__title">PathTracer</h1>
            <p className="gs-intro__desc">
              A fictional route through a village will be shown. 
              Memorise the <strong>order of landmarks</strong>!
              Then they will be shuffled — tap them back in the correct route order.
            </p>
            <p className="gs-intro__desc">
              <strong>{config.stops} stops</strong> on the route · <strong>{config.rounds} rounds</strong>
            </p>
            <div className="pt-example">
              <span>🏠</span><span className="pt-arrow">→</span>
              <span>🍵</span><span className="pt-arrow">→</span>
              <span>🛒</span>
            </div>
            <button className="gs-btn gs-btn--primary" onClick={() => { setRound(0); setCorrect(0); startRound(); }}>
              🗺️ Start Tracing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ────────────────────────────────────────────────────────
  if (phase === PHASE.COMPLETE) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info"><p className="gs-header__title">🗺️ PathTracer</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">{finalAccuracy >= 80 ? '🗺️' : '💪'}</span>
            <h1 className="gs-complete__title">Activity Complete!</h1>
            <p className="gs-complete__sub">You know your village well, Mrs. Das!</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">Accuracy</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{config.rounds}</span>
                <span className="gs-score-card__label">Perfect Routes</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{config.stops}</span>
                <span className="gs-score-card__label">Stops</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{levelLabel(level)}</span>
                <span className="gs-score-card__label">Level</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setRound(0); setCorrect(0); setPhase(PHASE.INTRO); }}>
                🔄 Play Again
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

  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
        <div className="gs-header__info">
          <p className="gs-header__title">🗺️ PathTracer</p>
          <p className="gs-header__sub">Round {round + 1} of {config.rounds}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(round / config.rounds) * 100}%` }} />
        </div>

        {/* MEMORISE phase */}
        {phase === PHASE.MEMORISE && (
          <div className="pt-memorise">
            <p className="gs-phase-label">🧭 Memorise the Route</p>
            {countdown !== null && (
              <div className={`gs-timer ${countdown <= 2 ? 'gs-timer--warning' : ''}`}>
                ⏱ {countdown}s remaining
              </div>
            )}
            <p className="pt-instruction">Remember the order of these landmarks from top to bottom:</p>
            <div className="pt-route">
              {route.map((lm, i) => (
                <div key={lm.id} className="pt-route-row">
                  <div className={`pt-landmark pt-landmark--memorise ${i === 0 ? 'pt-landmark--start' : i === route.length - 1 ? 'pt-landmark--end' : ''}`}>
                    <span className="pt-landmark__num">{i + 1}</span>
                    <span className="pt-landmark__emoji">{lm.emoji}</span>
                    <span className="pt-landmark__name">{lm.name}</span>
                  </div>
                  {i < route.length - 1 && (
                    <div className="pt-connector">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECALL phase */}
        {phase === PHASE.RECALL && (
          <div className="pt-recall">
            <p className="gs-phase-label">🤔 Tap in the Correct Route Order</p>
            <p className="pt-instruction">
              Tap landmarks in order: 1st stop first, then 2nd, 3rd...
              {selected.length > 0 && ` (${selected.length}/${route.length} placed)`}
            </p>

            {/* Current sequence */}
            <div className="pt-current-seq">
              {route.map((_, i) => {
                const sel = selected[i];
                return (
                  <div key={i} className={`pt-seq-slot ${sel ? 'pt-seq-slot--filled' : ''}`}>
                    {sel ? (
                      <>
                        <span className="pt-landmark__emoji" style={{ fontSize: '1.4rem' }}>{sel.emoji}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-secondary)' }}>{i + 1}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '1rem', color: '#ccc', fontWeight: 700 }}>{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Landmark buttons */}
            <div className="pt-landmark-grid">
              {shuffled.map(lm => {
                const selIdx = selected.findIndex(s => s.id === lm.id);
                const isSel = selIdx !== -1;
                return (
                  <button
                    key={lm.id}
                    className={`pt-landmark-btn ${isSel ? 'pt-landmark-btn--selected' : ''}`}
                    onClick={() => handleTap(lm)}
                    disabled={showResult}
                    aria-label={lm.name}
                  >
                    {isSel && <span className="pt-landmark-btn__num">{selIdx + 1}</span>}
                    <span className="pt-landmark__emoji">{lm.emoji}</span>
                    <span className="pt-landmark__name">{lm.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {showResult && feedback && (
              <div className="pt-result">
                <div className={`gs-feedback ${feedback.correct ? 'gs-feedback--correct' : 'gs-feedback--incorrect'}`}>
                  {feedback.message}
                </div>
                {!feedback.correct && (
                  <div className="pt-correct-route">
                    <p className="gs-section-heading">The correct route was:</p>
                    <div className="pt-route pt-route--compact">
                      {route.map((lm, i) => (
                        <div key={lm.id} className="pt-route-row">
                          <div className="pt-landmark pt-landmark--answer">
                            <span className="pt-landmark__num">{i + 1}</span>
                            <span className="pt-landmark__emoji">{lm.emoji}</span>
                            <span className="pt-landmark__name">{lm.name}</span>
                          </div>
                          {i < route.length - 1 && <div className="pt-connector">↓</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button className="gs-btn gs-btn--primary" onClick={handleNext}>
                  {round + 1 >= config.rounds ? 'See Results' : 'Next Round →'}
                </button>
              </div>
            )}

            {!showResult && selected.length > 0 && (
              <button className="gs-btn gs-btn--outline gs-btn--sm" onClick={() => setSelected([])}>
                🔄 Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
