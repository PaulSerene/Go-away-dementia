/**
 * PatientProgress.jsx — "My Progress" screen.
 *
 * Shows a simple, positive summary of the patient's completed
 * memory-game activities. All data is read from localStorage
 * on every mount, so the screen always reflects the latest
 * completed games without requiring a page refresh.
 *
 * localStorage keys used (read-only — never written here):
 *   smriti_game_results      — array of completed game result objects
 *   smriti_current_difficulty — the current difficulty level (1|2|3)
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import './PatientProgress.css';
import CulturalBackground from './CulturalBackground';
import { useLanguage, LOCALE_BCP47 } from '../locales/index.js';
import { levelLabel } from '../utils/gameUtils.js';


/* ── LOCALSTORAGE READERS ────────────────────────────────────────
 *
 * These functions read localStorage safely.
 * If the data is missing or invalid JSON they return safe defaults
 * and never crash the application.
 * ─────────────────────────────────────────────────────────────── */

/**
 * Read all completed game results.
 * Returns an empty array if the key is missing or the JSON is corrupt.
 */
function loadResults() {
  try {
    const raw = localStorage.getItem('smriti_game_results');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Guard: must be a non-null array
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // JSON.parse threw — data is corrupt; fall back to empty array
    return [];
  }
}

/**
 * Read the current difficulty level.
 * Returns 1 if the key is missing or contains an out-of-range value.
 */
function loadDifficulty() {
  const saved = parseInt(localStorage.getItem('smriti_current_difficulty'), 10);
  if (isNaN(saved) || saved < 1 || saved > 3) return 1;
  return saved;
}

/* ── STATISTICS CALCULATORS ──────────────────────────────────────
 *
 * Pure functions that receive the results array and return numbers.
 * Keeping these separate from the JSX makes them easy to test or
 * modify later without touching the UI code.
 * ─────────────────────────────────────────────────────────────── */

/** Total number of completed games. */
function calcGamesPlayed(results) {
  return results.length;
}

/**
 * Average accuracy across all games, rounded to a whole number.
 * Returns 0 if there are no games.
 */
function calcAvgAccuracy(results) {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + (r.accuracy ?? 0), 0);
  return Math.round(total / results.length);
}

/**
 * The single highest accuracy score ever achieved.
 * Returns 0 if there are no games.
 */
function calcBestAccuracy(results) {
  if (results.length === 0) return 0;
  return Math.max(...results.map((r) => r.accuracy ?? 0));
}

/* ── BOTTOM NAVIGATION ───────────────────────────────────────────
 *
 * Identical nav bar to PatientHome and PatientPlaceholder,
 * with "activities" marked as the active tab.
 * ─────────────────────────────────────────────────────────────── */
function ProgressNav({ navigate }) {
  const { t } = useLanguage();
  return (
    <nav className="ph-nav" aria-label="Main navigation">
      <button
        id="prog-nav-home"
        className="ph-nav__btn"
        onClick={() => navigate('patient-home')}
        aria-label={t('memories.nav.home')}
      >
        <span className="ph-nav__icon" aria-hidden="true">🏠</span>
        <span className="ph-nav__label">{t('memories.nav.home')}</span>
      </button>

      <button
        id="prog-nav-activities"
        className="ph-nav__btn ph-nav__btn--active"
        aria-current="page"
        aria-label={t('memories.nav.games')}
        onClick={() => navigate('patient-activities')}
      >
        <span className="ph-nav__icon" aria-hidden="true">🧠</span>
        <span className="ph-nav__label">{t('memories.nav.games')}</span>
      </button>

      <button
        id="prog-nav-memories"
        className="ph-nav__btn"
        aria-label={t('memories.nav.memories')}
        onClick={() => navigate('patient-memories')}
      >
        <span className="ph-nav__icon" aria-hidden="true">❤️</span>
        <span className="ph-nav__label">{t('memories.nav.memories')}</span>
      </button>

      <button
        id="prog-nav-reminders"
        className="ph-nav__btn"
        aria-label={t('memories.nav.reminders')}
        onClick={() => navigate('patient-reminders')}
      >
        <span className="ph-nav__icon" aria-hidden="true">⏰</span>
        <span className="ph-nav__label">{t('memories.nav.reminders')}</span>
      </button>
    </nav>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────────
 *
 * Data is read directly in the component body (not inside useEffect)
 * so it is always fresh on every mount. Because the navigate()
 * function unmounts and remounts this component each time the
 * patient navigates to the Activities tab, the stats are always
 * up-to-date without any polling or refresh.
 * ─────────────────────────────────────────────────────────────── */
function PatientProgress({ navigate }) {
  const { t, lang } = useLanguage();

  /*
   * Read data at render time — no useState/useEffect needed here
   * because the values don't change while the screen is open.
   * Every new visit = fresh mount = fresh read from localStorage.
   */
  const results        = loadResults();
  const currentLevel   = loadDifficulty();

  // Derived statistics (pure calculations from the results array)
  const gamesPlayed    = calcGamesPlayed(results);
  const avgAccuracy    = calcAvgAccuracy(results);
  const bestAccuracy   = calcBestAccuracy(results);

  // Most recent 10 games, newest first
  const recentGames    = [...results].reverse().slice(0, 10);

  const hasGames       = gamesPlayed > 0;

  /**
   * Format an ISO timestamp using the active locale's BCP47 tag,
   * so dates render correctly in each language.
   */
  function formatDate(isoString) {
    try {
      const bcp47 = LOCALE_BCP47[lang] || 'en-IN';
      return new Date(isoString).toLocaleString(bcp47, {
        day:    'numeric',
        month:  'short',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString ?? '—';
    }
  }

  /**
   * Map a stored gameType string to a localised display label.
   * Falls back to the raw key if unrecognised.
   */
  function gameTypeLabel(gameType) {
    if (!gameType) return t('progress.gameType.memory-match');
    const key = `progress.gameType.${gameType}`;
    const translated = t(key);
    // If the key was not found, t() returns the key itself — fall back to English game name
    return translated !== key ? translated : gameType;
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <CulturalBackground variant="progress">
      <div className="ph-screen ph-screen--transparent">

        {/* ── PAGE HEADER ──────────────────────────────────── */}
        <header className="prog-header" aria-label={t('progress.title')}>
          <p className="prog-header__title">{t('progress.title')} 🌱</p>
          <p className="prog-header__sub">
            {t('progress.subheading')}
          </p>
        </header>

        {/* ── SCROLLABLE CONTENT ───────────────────────────── */}
        <main className="prog-content">

          {/* ── 4 SUMMARY CARDS ────────────────────────────── */}
          <section className="prog-summary-grid" aria-label={t('progress.heading')}>

            {/* Card 1 — Games Played */}
            <div className="prog-stat-card prog-stat-card--warm">
              <span className="prog-stat-card__icon" aria-hidden="true">🎮</span>
              <span className="prog-stat-card__value">{gamesPlayed}</span>
              <span className="prog-stat-card__label">{t('progress.totalGames')}</span>
            </div>

            {/* Card 2 — Average Accuracy */}
            <div className="prog-stat-card prog-stat-card--teal">
              <span className="prog-stat-card__icon" aria-hidden="true">🎯</span>
              <span className="prog-stat-card__value">{avgAccuracy}%</span>
              <span className="prog-stat-card__label">{t('progress.avgAccuracy')}</span>
            </div>

            {/* Card 3 — Current Level */}
            <div className="prog-stat-card prog-stat-card--rose">
              <span className="prog-stat-card__icon" aria-hidden="true">📊</span>
              <span className="prog-stat-card__value">{levelLabel(currentLevel, t)}</span>
              <span className="prog-stat-card__label">{t('progress.currentLevel')}</span>
            </div>

            {/* Card 4 — Best Accuracy */}
            <div className="prog-stat-card prog-stat-card--gold">
              <span className="prog-stat-card__icon" aria-hidden="true">🌟</span>
              <span className="prog-stat-card__value">{bestAccuracy}%</span>
              <span className="prog-stat-card__label">{t('progress.bestAccuracy')}</span>
            </div>

          </section>

          {/* ── RECENT ACTIVITY ─────────────────────────────── */}
          <section className="prog-recent" aria-label={t('progress.recentActivity')}>
            <h2 className="prog-section-heading">{t('progress.recentActivity')}</h2>

            {/* EMPTY STATE — no games played yet */}
            {!hasGames && (
              <div className="prog-empty">
                <span className="prog-empty__emoji" aria-hidden="true">🌱</span>
                <p className="prog-empty__msg">{t('progress.noActivity')}</p>
                <p className="prog-empty__hint">
                  {t('progress.noActivity.sub')}
                </p>
                <button
                  id="btn-progress-start-activity"
                  className="ph-btn ph-btn--warm prog-empty__btn"
                  onClick={() => navigate('patient-activity')}
                >
                  {t('progress.noActivity.btn')}
                </button>
              </div>
            )}

            {/* ACTIVITY LIST — most recent 10, newest first */}
            {hasGames && (
              <ul className="prog-list" role="list">
                {recentGames.map((game, index) => (
                  /*
                   * We use the index as a fallback key because older
                   * result objects may not have a unique id field.
                   * The timestamp is a better key when available.
                   */
                  <li
                    key={game.timestamp ?? index}
                    className="prog-list-item"
                  >
                    {/* Game title row */}
                    <div className="prog-item__title-row">
                      <span className="prog-item__icon" aria-hidden="true">🧠</span>
                      <span className="prog-item__title">{gameTypeLabel(game.gameType)}</span>
                      <span className="prog-item__level">
                        {levelLabel(game.difficulty ?? 1, t)}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="prog-item__stats">
                      <span className="prog-item__stat">
                        <span className="prog-item__stat-icon" aria-hidden="true">🎯</span>
                        <span><strong>{game.accuracy ?? 0}%</strong> {t('progress.accuracy', { value: '' }).replace('%', '').trim() || t('caregiver.accuracy.label')}</span>
                      </span>
                      <span className="prog-item__stat">
                        <span className="prog-item__stat-icon" aria-hidden="true">✅</span>
                        <span>
                          <strong>{game.correct ?? 0} / {game.total ?? 0}</strong> {t('game.score.correct')}
                        </span>
                      </span>
                    </div>

                    {/* Date */}
                    <p className="prog-item__date">
                      {game.timestamp ? formatDate(game.timestamp) : '—'}
                    </p>
                  </li>
                ))}
              </ul>
            )}

          </section>
        </main>

        {/* ── BOTTOM NAVIGATION ────────────────────────────── */}
        <ProgressNav navigate={navigate} />

      </div>
    </CulturalBackground>
  );
}

export default PatientProgress;
