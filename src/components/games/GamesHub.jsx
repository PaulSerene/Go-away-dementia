/**
 * GamesHub.jsx — Game selection screen for Patient Mode.
 *
 * Organizes all 7 cognitive games into 4 categories:
 *   🧠 Memory | 👀 Attention | 🤸 Movement | 🎵 Music
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import './GamesHub.css';
import CulturalBackground from '../CulturalBackground';
import { useLanguage } from '../../locales/index.js';


const GAME_CATEGORIES = [
  {
    id: 'memory',
    emoji: '🧠',
    label: 'Memory Games',
    color: 'warm',
    games: [
      {
        id: 'game-word-chain',
        icon: '🔤',
        name: 'Word Chain',
        tagline: 'Remember and extend a chain of connected words.',
        duration: '5–8 min',
        level: 'All Levels',
      },
      {
        id: 'game-story-recall',
        icon: '📖',
        name: 'Story Time',
        tagline: 'Listen to a short story and answer simple questions.',
        duration: '5–10 min',
        level: 'All Levels',
      },
      {
        id: 'game-remember-me',
        icon: '❤️',
        name: 'RememberMe',
        tagline: 'Revisit familiar memories and match them with details.',
        duration: '4–7 min',
        level: 'All Levels',
      },
    ],
  },
  {
    id: 'attention',
    emoji: '👀',
    label: 'Attention & Spatial',
    color: 'teal',
    games: [
      {
        id: 'game-rearrange',
        icon: '🪑',
        name: 'Remember the Room',
        tagline: 'Memorise object positions, then put them back.',
        duration: '5–8 min',
        level: 'All Levels',
      },
      {
        id: 'game-path-tracer',
        icon: '🗺️',
        name: 'Path Tracer',
        tagline: 'Remember a simple route through familiar landmarks.',
        duration: '5–8 min',
        level: 'All Levels',
      },
    ],
  },
  {
    id: 'movement',
    emoji: '🤸',
    label: 'Gentle Movement',
    color: 'rose',
    games: [
      {
        id: 'game-movement',
        icon: '🙌',
        name: 'Movement with Aroha',
        tagline: 'Follow a gentle sequence of simple movements.',
        duration: '3–6 min',
        level: 'All Levels',
      },
    ],
  },
  {
    id: 'music',
    emoji: '🎵',
    label: 'Music & Rhythm',
    color: 'gold',
    games: [
      {
        id: 'game-music-memory',
        icon: '🎶',
        name: 'Music Memory',
        tagline: 'Identify music styles and remember melody details.',
        duration: '5–8 min',
        level: 'All Levels',
      },
    ],
  },
];

function GameCard({ game, navigate, t }) {
  return (
    <button
      className="ghub-game-card"
      onClick={() => navigate(game.id)}
      aria-label={`${t('hub.start')} ${game.name}`}
      id={`game-card-${game.id}`}
    >
      <span className="ghub-game-card__icon" aria-hidden="true">{game.icon}</span>
      <div className="ghub-game-card__info">
        <p className="ghub-game-card__name">{game.name}</p>
        <p className="ghub-game-card__tagline">{game.tagline}</p>
        <div className="ghub-game-card__meta">
          <span className="ghub-meta-pill">⏱ {game.duration}</span>
          <span className="ghub-meta-pill">📊 {game.level}</span>
        </div>
      </div>
      <span className="ghub-game-card__arrow" aria-hidden="true">›</span>
    </button>
  );
}


function GamesHub({ navigate }) {
  const { t } = useLanguage();

  /* Build category/game data using t() for labels */
  const GAME_CATEGORIES_L = [
    {
      id: 'memory', emoji: '🧠', label: t('hub.cat.memory'), color: 'warm',
      games: [
        { id: 'game-word-chain',   icon: '🔤', name: t('game.wordChain.name'),   tagline: t('game.wordChain.tagline'),   duration: '5–8 min', level: 'All Levels' },
        { id: 'game-story-recall', icon: '📖', name: t('game.storyRecall.name'), tagline: t('game.storyRecall.tagline'), duration: '5–10 min', level: 'All Levels' },
        { id: 'game-remember-me',  icon: '❤️', name: t('game.rememberMe.name'),  tagline: t('game.rememberMe.tagline'),  duration: '4–7 min', level: 'All Levels' },
      ],
    },
    {
      id: 'attention', emoji: '👀', label: t('hub.cat.attention'), color: 'teal',
      games: [
        { id: 'game-rearrange',    icon: '🪑', name: t('game.rearrange.name'),   tagline: t('game.rearrange.tagline'),   duration: '5–8 min', level: 'All Levels' },
        { id: 'game-path-tracer',  icon: '🗺️', name: t('game.pathTracer.name'),  tagline: t('game.pathTracer.tagline'),  duration: '5–8 min', level: 'All Levels' },
      ],
    },
    {
      id: 'movement', emoji: '🤸', label: t('hub.cat.movement'), color: 'rose',
      games: [
        { id: 'game-movement',     icon: '🙌', name: t('game.movement.name'),    tagline: t('game.movement.tagline'),    duration: '3–6 min', level: 'All Levels' },
      ],
    },
    {
      id: 'music', emoji: '🎵', label: t('hub.cat.music'), color: 'gold',
      games: [
        { id: 'game-music-memory', icon: '🎶', name: t('game.musicMemory.name'), tagline: t('game.musicMemory.tagline'), duration: '5–8 min', level: 'All Levels' },
      ],
    },
  ];

  return (
    <CulturalBackground variant="home">
      <div className="ghub-screen ph-screen--transparent">

        {/* ── HEADER ────────────────────────────────────────── */}
        <header className="ghub-header">
          <button
            className="gs-back-btn"
            onClick={() => navigate('patient-home')}
            aria-label={t('nav.patientHome')}
          >
            {t('nav.patientHome')}
          </button>
          <div className="ghub-header__info">
            <p className="ghub-header__title">🎮 {t('hub.heading')}</p>
            <p className="ghub-header__sub">{t('hub.sub')}</p>
          </div>
        </header>

        {/* ── CONTENT ───────────────────────────────────────── */}
        <main className="ghub-content">

          <div className="ghub-welcome">
            <p className="ghub-welcome__text">
              All activities are designed to be gentle, fun, and encouraging.
              Take your time — there is no rush. 🌱
            </p>
          </div>

          {GAME_CATEGORIES_L.map((cat) => (
            <section key={cat.id} className={`ghub-category ghub-category--${cat.color}`}>
              <h2 className="ghub-category__heading">
                <span aria-hidden="true">{cat.emoji}</span> {cat.label}
              </h2>
              <div className="ghub-game-list">
                {cat.games.map((game) => (
                  <GameCard key={game.id} game={game} navigate={navigate} t={t} />
                ))}
              </div>
            </section>
          ))}

          {/* Also show existing Memory Game */}
          <section className="ghub-category ghub-category--warm">
            <h2 className="ghub-category__heading">
              <span aria-hidden="true">🖼️</span> {t('game.memoryMatch.name')}
            </h2>
            <div className="ghub-game-list">
              <button
                className="ghub-game-card"
                onClick={() => navigate('patient-activity')}
                aria-label="Play Remember the Objects"
                id="game-card-memory-match"
              >
                <span className="ghub-game-card__icon" aria-hidden="true">🎴</span>
                <div className="ghub-game-card__info">
                  <p className="ghub-game-card__name">Remember the Objects</p>
                  <p className="ghub-game-card__tagline">Memorise cultural images then identify them. The original Memora memory game.</p>
                  <div className="ghub-game-card__meta">
                    <span className="ghub-meta-pill">⏱ 3–5 min</span>
                    <span className="ghub-meta-pill">📊 Adaptive</span>
                  </div>
                </div>
                <span className="ghub-game-card__arrow" aria-hidden="true">›</span>
              </button>
            </div>
          </section>

        </main>

        {/* ── BOTTOM NAV ────────────────────────────────────── */}
        <nav className="ph-nav" aria-label="Main navigation">
          <button className="ph-nav__btn" onClick={() => navigate('patient-home')} aria-label="Home">
            <span className="ph-nav__icon" aria-hidden="true">🏠</span>
            <span className="ph-nav__label">Home</span>
          </button>
          <button className="ph-nav__btn ph-nav__btn--active" aria-current="page" aria-label="Activities">
            <span className="ph-nav__icon" aria-hidden="true">🧠</span>
            <span className="ph-nav__label">Activities</span>
          </button>
          <button className="ph-nav__btn" onClick={() => navigate('patient-memories')} aria-label="Memories">
            <span className="ph-nav__icon" aria-hidden="true">❤️</span>
            <span className="ph-nav__label">Memories</span>
          </button>
          <button className="ph-nav__btn" onClick={() => navigate('patient-reminders')} aria-label="Reminders">
            <span className="ph-nav__icon" aria-hidden="true">⏰</span>
            <span className="ph-nav__label">Reminders</span>
          </button>
        </nav>

      </div>
    </CulturalBackground>
  );
}

export default GamesHub;
