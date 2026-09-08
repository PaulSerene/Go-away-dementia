/**
 * MusicMemory.jsx — "Music Memory" cultural music identification game for Memora.
 *
 * No copyrighted audio is used.
 * The game uses category identification, simulated audio descriptions,
 * and multiple-choice questions about music styles.
 *
 * "Audio" is represented visually — a music style is described and the patient
 * identifies it, simulating a listening experience. This is fully offline.
 *
 * Levels:
 *   1 — identify the category of a described music style
 *   2 — identify from description + one extra clue
 *   3 — identify category AND specific feature
 *   4 — identify from partial/minimal description
 */

import { useState } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './MusicMemory.css';
import '../games/GameShared.css';

/* ── MUSIC DATABASE ───────────────────────────────────────────── */
// Content stays in English by default, but UI is translated.
const MUSIC_ITEMS = [
  {
    id: 'bihu',
    category: 'Assamese Folk',
    emoji: '🥁',
    fullDesc: 'This music is lively and joyful. It features a distinctive drum called the dhol, a long buffalo-horn instrument called the pepa, and a bamboo flute. It is traditionally played during harvest and spring celebrations in Assam.',
    shortDesc: 'Lively, features dhol drum and pepa horn. Spring harvest music from Assam.',
    minimalDesc: 'Features a dhol drum and bamboo flute.',
    extra: 'It is sung and danced during the Bihu festival.',
    feature: 'Dhol drum and Pepa horn',
    options: ['Assamese Folk', 'Bengali Devotional', 'Manipuri Classical', 'Hindi Film'],
  },
  {
    id: 'rabindra',
    category: 'Bengali Classical',
    emoji: '🎵',
    fullDesc: 'This is a sophisticated and lyrical style of music known for its poetic depth, gentle melodies, and emotional richness. It originated from a great poet-composer and is sung with careful attention to each word\'s meaning.',
    shortDesc: 'Lyrical, poetic, gentle melodies with deep meaning. Beloved across generations.',
    minimalDesc: 'Known for poetic depth and gentle melody.',
    extra: 'It blends classical Indian music with western harmony.',
    feature: 'Poetic depth and lyrical melodies',
    options: ['Bengali Classical', 'Assamese Folk', 'Bodo Folk', 'Mizo Choir'],
  },
  {
    id: 'manipuri',
    category: 'Manipuri Classical',
    emoji: '💃',
    fullDesc: 'This music accompanies a classical dance tradition from Manipur. It is devotional in nature, often telling stories of divine love. The rhythm is set by a pung (barrel drum) and supported by small cymbals. The movements and music together create a meditative, graceful flow.',
    shortDesc: 'Devotional, accompanies classical dance. Features pung drum and small cymbals.',
    minimalDesc: 'Uses a pung drum and small cymbals for devotional dance.',
    extra: 'Often tells stories of divine love through dance.',
    feature: 'Pung drum and devotional themes',
    options: ['Manipuri Classical', 'Hindi Film', 'Assamese Folk', 'Nepali Folk'],
  },
  {
    id: 'mizo-choir',
    category: 'Mizo Choir',
    emoji: '🎶',
    fullDesc: 'This music is known for its beautiful choral harmony. Multiple voices sing together in close harmony, often in a church setting. The tradition blends western choral techniques with local Mizo language songs. It is uplifting and very community-oriented.',
    shortDesc: 'Beautiful choral harmony, multiple voices, uplifting community music from Mizoram.',
    minimalDesc: 'Multiple voices singing in close harmony.',
    extra: 'Blends western harmony with local Mizo songs.',
    feature: 'Close vocal harmony',
    options: ['Mizo Choir', 'Bengali Classical', 'Nepali Folk', 'Bodo Folk'],
  },
  {
    id: 'bodo-folk',
    category: 'Bodo Folk',
    emoji: '🪈',
    fullDesc: 'This traditional folk music comes from the Bodo community of Assam. It often features bamboo instruments, rhythmic drumming, and songs celebrating nature, seasons, and community life. The melodies are earthy and deeply connected to agricultural rhythms.',
    shortDesc: 'Earthy, seasonal folk music featuring bamboo instruments. Celebrates nature and community.',
    minimalDesc: 'Features bamboo instruments and earthy rhythms.',
    extra: 'Connected to agricultural seasons and community celebrations.',
    feature: 'Bamboo instruments and nature themes',
    options: ['Bodo Folk', 'Assamese Folk', 'Mizo Choir', 'Manipuri Classical'],
  },
  {
    id: 'nepali-folk',
    category: 'Nepali Folk',
    emoji: '🏔️',
    fullDesc: 'This mountain folk music often features the madal hand drum and sarangi (a small bowed instrument). Songs may describe daily life in the hills, love stories, and festivals. The melodies have a distinctive mountain quality — open, expansive, and heartfelt.',
    shortDesc: 'Mountain folk music with madal drum and sarangi. Heartfelt melodies about hill life.',
    minimalDesc: 'Features a madal drum and sarangi instrument.',
    extra: 'Describes hill life, love stories, and festivals.',
    feature: 'Madal drum and sarangi',
    options: ['Nepali Folk', 'Bodo Folk', 'Bengali Classical', 'Assamese Folk'],
  },
];

const LEVEL_CONFIG = {
  1: { rounds: 3, descKey: 'fullDesc',     showExtra: true  },
  2: { rounds: 4, descKey: 'shortDesc',    showExtra: false },
  3: { rounds: 4, descKey: 'shortDesc',    showExtra: false, askFeature: true },
  4: { rounds: 5, descKey: 'minimalDesc',  showExtra: false },
};

const PHASE = { INTRO: 'intro', QUESTION: 'question', FEEDBACK: 'feedback', COMPLETE: 'complete' };

export default function MusicMemory({ navigate }) {
  const { t } = useLanguage();
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [items] = useState(() => {
    const pool = shuffle(MUSIC_ITEMS);
    // Repeat pool if rounds > pool length
    const result = [];
    for (let i = 0; i < config.rounds; i++) result.push(pool[i % pool.length]);
    return result;
  });

  const [phase, setPhase]     = useState(PHASE.INTRO);
  const [qIndex, setQIndex]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalHints, setTotalHints] = useState(0);
  const [hintShown, setHintShown]   = useState(false);
  const [playing, setPlaying]       = useState(false); // simulate "playing" audio

  const currentItem = items[qIndex];
  const DEMO_NAME = "Mrs. Das";

  function handleSimulatePlay() {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 2000); // simulate 2s "audio playback"
  }

  function handleAnswer(opt) {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === currentItem.category;
    if (isCorrect) setCorrect(c => c + 1);
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? t('game.feedback.correct')
        : t('game.feedback.tryAgain').replace('Keep going.', `It was ${t(currentItem.category, currentItem.category)}. ${currentItem.extra || 'Keep practising!'}`)
    });
    setPhase(PHASE.FEEDBACK);
  }

  function handleHint() {
    if (hintShown) return;
    setHintShown(true);
    setTotalHints(h => h + 1);
    setFeedback({ correct: null, message: `💡 ${t('game.hint.btn').replace('Show a Hint', 'Hint')}: ${currentItem.extra || currentItem.feature}` });
  }

  function handleNext() {
    const nextIdx = qIndex + 1;
    if (nextIdx >= config.rounds) {
      finishGame();
    } else {
      setQIndex(nextIdx);
      setSelected(null);
      setFeedback(null);
      setHintShown(false);
      setPlaying(false);
      setPhase(PHASE.QUESTION);
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, config.rounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'music-memory',
      accuracy,
      correct,
      total: config.rounds,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: totalHints,
    });
    setPhase(PHASE.COMPLETE);
  }

  const finalAccuracy = calcAccuracy(correct, config.rounds);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info">
            <p className="gs-header__title">🎶 {t('musicMemory.title')}</p>
            <p className="gs-header__sub">{t('musicMemory.sub') || 'Cultural Music · Identification'}</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">🎵</span>
            <h1 className="gs-intro__title">{t('musicMemory.intro.title')}</h1>
            <p className="gs-intro__desc">
              {t('musicMemory.intro.desc1')}
            </p>
            <p className="gs-intro__desc">
              {t('musicMemory.intro.desc2')}
            </p>
            <p className="gs-intro__desc">
              <strong>{config.rounds} {t('game.round', { n: 1, total: 1 }).split(' ')[0] + 's'}</strong> · No audio equipment needed.
            </p>
            <div className="mm-categories">
              {['Assamese Folk', 'Bengali Classical', 'Manipuri', 'Mizo Choir', 'Bodo Folk', 'Nepali Folk'].map(c => (
                <span key={c} className="mm-cat-pill">{t(c, c)}</span>
              ))}
            </div>
            <button className="gs-btn gs-btn--primary" onClick={() => setPhase(PHASE.QUESTION)}>
              {t('musicMemory.intro.begin')}
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
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
          <div className="gs-header__info"><p className="gs-header__title">🎶 {t('musicMemory.title')}</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">{finalAccuracy >= 80 ? '🎵' : '🎶'}</span>
            <h1 className="gs-complete__title">{t('musicMemory.complete.bravo')}</h1>
            <p className="gs-complete__sub">{t('musicMemory.complete.sub', { name: DEMO_NAME })}</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">{t('game.score.accuracy')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{config.rounds}</span>
                <span className="gs-score-card__label">{t('game.score.correct')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{totalHints}</span>
                <span className="gs-score-card__label">{t('game.score.hints')}</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{levelLabel(level, t)}</span>
                <span className="gs-score-card__label">{t('game.score.level')}</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel, t)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setQIndex(0); setCorrect(0); setSelected(null); setFeedback(null); setHintShown(false); setTotalHints(0); setPhase(PHASE.INTRO); }}>
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

  // ── QUESTION / FEEDBACK ────────────────────────────────────────────
  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>{t('nav.games')}</button>
        <div className="gs-header__info">
          <p className="gs-header__title">🎶 {t('musicMemory.title')}</p>
          <p className="gs-header__sub">{t('musicMemory.round.of', { n: qIndex + 1, total: config.rounds })}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level, t)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(qIndex / config.rounds) * 100}%` }} />
        </div>

        <div className="mm-question">
          <p className="gs-phase-label">🎵 {t('musicMemory.phase.question')}</p>

          {/* Simulated audio player */}
          <div className="mm-player">
            <span className="mm-player__emoji">{currentItem.emoji}</span>
            <div className="mm-player__body">
              <p className="mm-player__label">{t('musicMemory.player.label')}</p>
              {playing ? (
                <div className="mm-player__wave">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              ) : (
                <p className="mm-player__desc">{currentItem[config.descKey]}</p>
              )}
            </div>
            <button className="mm-play-btn" onClick={handleSimulatePlay} aria-label="Listen again">
              {playing ? '⏸' : '▶'}
            </button>
          </div>

          {config.showExtra && (
            <div className="gs-instruction">
              <strong>{t('musicMemory.additional.detail')}</strong> {currentItem.extra}
            </div>
          )}

          {!hintShown && phase === PHASE.QUESTION && (
            <button className="gs-hint-btn" onClick={handleHint}>{t('game.hint.btn')}</button>
          )}
          {feedback && feedback.correct === null && (
            <div className="gs-feedback gs-feedback--neutral">{feedback.message}</div>
          )}

          <div className="gs-choices">
            {currentItem.options.map((opt) => {
              let cls = 'gs-choice-btn';
              if (phase === PHASE.FEEDBACK) {
                if (opt === currentItem.category) cls += ' gs-choice-btn--correct';
                else if (opt === selected)          cls += ' gs-choice-btn--wrong';
              } else if (opt === selected) {
                cls += ' gs-choice-btn--selected';
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={phase === PHASE.FEEDBACK}
                >
                  {t(opt, opt)}
                </button>
              );
            })}
          </div>

          {phase === PHASE.FEEDBACK && feedback?.correct !== null && (
            <>
              <div className={`gs-feedback ${feedback.correct ? 'gs-feedback--correct' : 'gs-feedback--incorrect'}`}>
                {feedback.message}
              </div>
              <button className="gs-btn gs-btn--primary" onClick={handleNext}>
                {qIndex + 1 >= config.rounds ? t('game.btn.seeResults') : t('game.btn.next')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
