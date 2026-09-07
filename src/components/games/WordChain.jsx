/**
 * WordChain.jsx — "Word Chain" cognitive game for Memora.
 *
 * Gameplay:
 *   Phase 1 (MEMORISE): A growing chain of connected words is displayed.
 *   Phase 2 (RECALL): The last word is hidden. Patient taps the correct word from options.
 *   This repeats, adding one word each round, until the round target is met.
 *
 * Levels:
 *   1 — chains of 2–3 words
 *   2 — chains of 3–4 words
 *   3 — chains of 4–5 words
 *   4 — chains of 5–6 words
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './WordChain.css';
import '../games/GameShared.css';


/* ── WORD DATASET ─────────────────────────────────────────────── */
const WORD_CHAINS = [
  ['river', 'water', 'fish', 'net', 'market', 'home'],
  ['tea', 'garden', 'leaf', 'rain', 'cloud', 'sky'],
  ['mother', 'kitchen', 'rice', 'fire', 'smoke', 'village'],
  ['school', 'book', 'learn', 'grow', 'tree', 'forest'],
  ['festival', 'music', 'dance', 'drum', 'bamboo', 'craft'],
  ['flower', 'honey', 'bee', 'hive', 'sweet', 'fruit'],
  ['mountain', 'mist', 'morning', 'dew', 'grass', 'path'],
  ['grandmother', 'story', 'lamp', 'night', 'stars', 'moon'],
];

const ALL_WORDS = [...new Set(WORD_CHAINS.flat())];

const LEVEL_CONFIG = {
  1: { chainLength: 2, rounds: 3, memoriseMs: 4000 },
  2: { chainLength: 3, rounds: 3, memoriseMs: 4000 },
  3: { chainLength: 4, rounds: 4, memoriseMs: 3500 },
  4: { chainLength: 5, rounds: 4, memoriseMs: 3000 },
};

function buildGame(level) {
  const config = LEVEL_CONFIG[level];
  // Pick a random base chain and truncate to chainLength
  const base = pickRandom(WORD_CHAINS, 1)[0];
  const chain = base.slice(0, config.chainLength);
  return { chain, config };
}

function buildOptions(correctWord, allWords, count = 4) {
  const wrong = shuffle(allWords.filter(w => w !== correctWord)).slice(0, count - 1);
  return shuffle([correctWord, ...wrong]);
}

/* ── PHASES ────────────────────────────────────────────────────── */
// intro → memorise → recall → feedback → [next round | complete]
const PHASE = { INTRO: 'intro', MEMORISE: 'memorise', RECALL: 'recall', FEEDBACK: 'feedback', COMPLETE: 'complete' };

export default function WordChain({ navigate }) {
  const { t } = useLanguage();
  const level = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const [phase, setPhase] = useState(PHASE.INTRO);
  const [chain, setChain]   = useState([]);
  const [round, setRound]   = useState(0);           // 0-indexed round number
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [feedback, setFeedback]   = useState(null);  // { correct: bool, message: string }
  const [hintUsed, setHintUsed]   = useState(false);
  const [totalHints, setTotalHints] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const totalRounds = config.rounds;

  // Build a full chain for the whole session, extending each round
  const [fullChain] = useState(() => {
    const base = pickRandom(WORD_CHAINS, 1)[0];
    // Ensure we have enough words
    let combined = [...base];
    while (combined.length < config.chainLength + config.rounds - 1) {
      const extra = pickRandom(ALL_WORDS, 1)[0];
      if (!combined.includes(extra)) combined.push(extra);
    }
    return combined;
  });

  const currentChainLength = Math.min(
    LEVEL_CONFIG[level].chainLength + round,
    fullChain.length
  );
  const currentChain = fullChain.slice(0, currentChainLength);

  function startMemorisePhase() {
    setPhase(PHASE.MEMORISE);
    setSelected(null);
    setFeedback(null);
    setHintUsed(false);
    let remaining = Math.ceil(config.memoriseMs / 1000);
    setCountdown(remaining);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        startRecallPhase();
      }
    }, 1000);
  }

  function startRecallPhase() {
    const correctWord = currentChain[currentChain.length - 1];
    const opts = buildOptions(correctWord, ALL_WORDS, 4);
    setOptions(opts);
    setPhase(PHASE.RECALL);
    startTimeRef.current = Date.now();
  }

  function handleAnswer(word) {
    if (selected) return;
    setSelected(word);
    const correctWord = currentChain[currentChain.length - 1];
    const isCorrect = word === correctWord;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setFeedback({ correct: true, message: '✅ Excellent! You remembered it!' });
    } else {
      setIncorrect(i => i + 1);
      setFeedback({ correct: false, message: `💪 The answer was "${correctWord}". Keep going!` });
    }
    setPhase(PHASE.FEEDBACK);
  }

  function handleNext() {
    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      finishGame();
    } else {
      setRound(nextRound);
      startMemorisePhase();
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, totalRounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'word-chain',
      accuracy,
      correct,
      total: totalRounds,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: totalHints,
    });
    setPhase(PHASE.COMPLETE);
  }

  function handleHint() {
    if (hintUsed) return;
    setHintUsed(true);
    setTotalHints(h => h + 1);
    // Show the second-to-last word as a hint
    const penultimate = currentChain[currentChain.length - 2] || currentChain[0];
    setFeedback({ correct: null, message: `💡 Hint: the word before it is "${penultimate}"` });
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const accuracy = calcAccuracy(correct, Math.max(round, 1));
  const nextLevel = calcNextDifficulty(level, calcAccuracy(correct, totalRounds));

  // ── RENDER ──────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🔤 Word Chain</p>
            <p className="gs-header__sub">Memory · Language</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🔤</span>
            <h1 className="gs-intro__title">Word Chain</h1>
            <p className="gs-intro__desc">
              A chain of connected words will appear on screen. 
              Remember the last word — then choose it from options!
            </p>
            <p className="gs-intro__desc">
              You will play <strong>{totalRounds} rounds</strong>. Each round, the chain grows by one word.
            </p>
            <div className="gs-intro__levels">
              {['Easy', 'Moderate', 'Challenging', 'Advanced'].map(l => (
                <span key={l} className="gs-intro__level-pill">{l}</span>
              ))}
            </div>
            <button className="gs-btn gs-btn--primary" onClick={startMemorisePhase}>
              ▶ Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === PHASE.COMPLETE) {
    const finalAccuracy = calcAccuracy(correct, totalRounds);
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info"><p className="gs-header__title">🔤 Word Chain</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">{finalAccuracy >= 80 ? '🌟' : finalAccuracy >= 50 ? '🌸' : '💪'}</span>
            <h1 className="gs-complete__title">Activity Complete!</h1>
            <p className="gs-complete__sub">Great effort, Mrs. Das.</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">Accuracy</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{totalRounds}</span>
                <span className="gs-score-card__label">Correct</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{levelLabel(level)}</span>
                <span className="gs-score-card__label">Level</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{totalHints}</span>
                <span className="gs-score-card__label">Hints Used</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setRound(0); setCorrect(0); setIncorrect(0); setTotalHints(0); setPhase(PHASE.INTRO); }}>
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
          <p className="gs-header__title">🔤 Word Chain</p>
          <p className="gs-header__sub">Round {round + 1} of {totalRounds}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level)}</span>
      </header>

      <div className="gs-content">
        {/* Progress */}
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${((round) / totalRounds) * 100}%` }} />
        </div>

        {/* MEMORISE phase */}
        {phase === PHASE.MEMORISE && (
          <div className="wc-memorise">
            <p className="gs-phase-label">📖 Memorise the Chain</p>
            {countdown !== null && (
              <div className={`gs-timer ${countdown <= 2 ? 'gs-timer--warning' : ''}`}>
                ⏱ {countdown}s
              </div>
            )}
            <div className="wc-chain">
              {currentChain.map((word, i) => (
                <div key={i} className="wc-chain__item">
                  <span className="wc-word">{word}</span>
                  {i < currentChain.length - 1 && <span className="wc-arrow">→</span>}
                </div>
              ))}
            </div>
            <p className="gs-instruction">
              Remember the <strong>last word</strong> in the chain. It will be hidden in the next step!
            </p>
          </div>
        )}

        {/* RECALL phase */}
        {phase === PHASE.RECALL && (
          <div className="wc-recall">
            <p className="gs-phase-label">🤔 What was the last word?</p>
            <div className="wc-chain wc-chain--hidden">
              {currentChain.slice(0, -1).map((word, i) => (
                <div key={i} className="wc-chain__item">
                  <span className="wc-word">{word}</span>
                  <span className="wc-arrow">→</span>
                </div>
              ))}
              <div className="wc-chain__item">
                <span className="wc-word wc-word--hidden">❓</span>
              </div>
            </div>

            {!hintUsed && (
              <button className="gs-hint-btn" onClick={handleHint}>💡 Show a Hint</button>
            )}
            {feedback && feedback.correct === null && (
              <div className="gs-feedback gs-feedback--neutral">{feedback.message}</div>
            )}

            <div className="gs-choices">
              {options.map((opt) => (
                <button
                  key={opt}
                  className="gs-choice-btn"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK phase */}
        {phase === PHASE.FEEDBACK && (
          <div className="wc-feedback-phase">
            <div className={`gs-feedback ${feedback?.correct ? 'gs-feedback--correct' : 'gs-feedback--incorrect'}`}>
              {feedback?.message}
            </div>
            <div className="wc-answer-reveal">
              <p className="gs-section-heading">The full chain was:</p>
              <div className="wc-chain">
                {currentChain.map((word, i) => (
                  <div key={i} className="wc-chain__item">
                    <span className={`wc-word ${i === currentChain.length - 1 ? 'wc-word--highlight' : ''}`}>
                      {word}
                    </span>
                    {i < currentChain.length - 1 && <span className="wc-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <button className="gs-btn gs-btn--primary" onClick={handleNext}>
              {round + 1 >= totalRounds ? 'See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
