/**
 * CaregiverDashboard.jsx - Caregiver Mode dashboard screen.
 *
 * PROTOTYPE NOTICE:
 *   "Mrs. Das" is a fictional demo patient.
 *   Statistics shown are game-performance observations - NOT a medical diagnosis.
 *
 * localStorage keys read (never written here):
 *   smriti_game_results       - array of completed game result objects
 *   smriti_current_difficulty - current difficulty level (1|2|3)
 *   smriti_memories           - array of patient memory objects
 *
 * Props:
 *   navigate - function from App to switch screens
 */

import { useState } from "react";
import {
  loadReminders,
  loadDailyCompletions,
  isReminderToday,
  isReminderDoneToday,
} from "../utils/reminderStorage";
import CulturalBackground from "./CulturalBackground";
import { useLanguage, LOCALE_BCP47 } from '../locales/index.js';
import { levelLabel } from '../utils/gameUtils.js';
import "./CaregiverDashboard.css";

/* ----------------------------------------------------------------
   DEMO PATIENT (fixed for this prototype)
---------------------------------------------------------------- */
const DEMO_PATIENT = { name: "Mrs. Das", age: 72 };

/* ----------------------------------------------------------------
   LOCALSTORAGE READERS
   All reads wrapped in try/catch - never crash on bad data.
---------------------------------------------------------------- */
function loadGameResults() {
  try {
    const raw = localStorage.getItem("smriti_game_results");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadDifficulty() {
  const saved = parseInt(localStorage.getItem("smriti_current_difficulty"), 10);
  if (isNaN(saved) || saved < 1 || saved > 3) return 1;
  return saved;
}

function loadMemories() {
  try {
    const raw = localStorage.getItem("smriti_memories");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// loadReminders and daily completion helpers are imported from reminderStorage

/* ----------------------------------------------------------------
   PURE CALCULATION HELPERS
---------------------------------------------------------------- */
function calcGamesCompleted(results) { return results.length; }

function calcAvgAccuracy(results) {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + (r.accuracy ?? 0), 0);
  return Math.round(total / results.length);
}

function formatDate(isoString, bcp47) {
  try {
    return new Date(isoString).toLocaleString(bcp47 || "en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return isoString ?? "-";
  }
}

function recentActivityLabel(results, bcp47, t) {
  if (results.length === 0) return t('caregiver.stats.noData');
  const latest = results[results.length - 1];
  if (!latest?.timestamp) return "-";
  try {
    const diffHours = (Date.now() - new Date(latest.timestamp)) / 3_600_000;
    const rtf = new Intl.RelativeTimeFormat(bcp47 || 'en-IN', { numeric: 'auto' });
    
    if (diffHours < 1) {
      // e.g. "this hour" or "0 hours ago"
      return rtf.format(0, 'hour');
    }
    if (diffHours < 24) {
      return rtf.format(-Math.round(diffHours), 'hour');
    }
    const days = Math.floor(diffHours / 24);
    if (days <= 7) {
      return rtf.format(-days, 'day');
    }
    return formatDate(latest.timestamp, bcp47);
  } catch { return "-"; }
}

/* ----------------------------------------------------------------
   ACTIVITY NOTES GENERATOR
   Rule-based observations from game data only.
   NEVER mentions dementia, cognitive decline, or medical status.
---------------------------------------------------------------- */
function generateActivityNotes(results, t) {
  if (results.length === 0) {
    return { message: t('progress.noActivity'), emoji: "🌱", tone: "neutral" };
  }
  const recent = [...results].reverse().slice(0, 5);
  const avg = Math.round(
    recent.reduce((sum, r) => sum + (r.accuracy ?? 0), 0) / recent.length
  );
  if (avg >= 80) return { message: t('game.feedback.correct'), emoji: "🌟", tone: "positive" };
  if (avg >= 50) return { message: t('game.feedback.tryAgain'), emoji: "🌱", tone: "neutral" };
  return { message: t('game.nextLevel.same'), emoji: "💪", tone: "encourage" };
}

/* ----------------------------------------------------------------
   SUB-COMPONENTS
---------------------------------------------------------------- */
function DashboardHeader({ navigate, t }) {
  return (
    <header className="cgd-header" aria-label={t('caregiver.title')}>
      {/* Back to Memora Home button */}
      <button
        className="cgd-header-back-btn"
        onClick={() => navigate('landing')}
        aria-label={t('caregiver.back')}
      >
        {t('caregiver.back')}
      </button>

      <div className="cgd-header__top">
        <div>
          <p className="cgd-header__title">{t('caregiver.title')}</p>
          <p className="cgd-header__subtitle">{t('caregiver.patient.sub', { name: DEMO_PATIENT.name })}</p>
        </div>
        <button
          id="cgd-btn-switch-patient"
          className="cgd-header__switch-btn"
          onClick={() => navigate("patient-home")}
          aria-label={t('caregiver.patientView.btn')}
        >
          👴 {t('caregiver.patientView.btn')}
        </button>
      </div>
      <div className="cgd-patient-info">
        <span className="cgd-patient-info__avatar" aria-hidden="true">👵</span>
        <div>
          <p className="cgd-patient-info__name">{DEMO_PATIENT.name}</p>
          <p className="cgd-patient-info__age">{t('caregiver.patient.age', { age: DEMO_PATIENT.age })}</p>
        </div>
        <span className="cgd-demo-badge">{t('caregiver.demoBadge')}</span>
      </div>
    </header>
  );
}

function StatCard({ id, icon, value, label, colorClass }) {
  return (
    <div id={id} className={"cgd-stat-card " + colorClass} role="region" aria-label={label}>
      <span className="cgd-stat-card__icon" aria-hidden="true">{icon}</span>
      <span className="cgd-stat-card__value">{value}</span>
      <span className="cgd-stat-card__label">{label}</span>
    </div>
  );
}

function OverviewSection({ results, currentLevel, t, bcp47 }) {
  return (
    <section className="cgd-section" aria-labelledby="cgd-overview-heading">
      <h2 id="cgd-overview-heading" className="cgd-section__heading">{t('caregiver.overview.heading')}</h2>
      <div className="cgd-stat-grid">
        <StatCard id="cgd-stat-games"    icon="🧠" value={calcGamesCompleted(results)}      label={t('caregiver.stats.totalGames')}    colorClass="cgd-stat-card--teal" />
        <StatCard id="cgd-stat-accuracy" icon="🎯" value={calcAvgAccuracy(results) + "%"}   label={t('caregiver.stats.avgAccuracy')}   colorClass="cgd-stat-card--warm" />
        <StatCard id="cgd-stat-level"    icon="📈" value={levelLabel(currentLevel, t)}           label={t('caregiver.stats.currentLevel')} colorClass="cgd-stat-card--rose" />
        <StatCard id="cgd-stat-recent"   icon="⏱️" value={recentActivityLabel(results, bcp47, t)}     label={t('caregiver.stats.lastActive')}    colorClass="cgd-stat-card--gold" />
      </div>
    </section>
  );
}

function ActivityCard({ game, index, t, bcp47 }) {
  const gameTypeLabel = game.gameType ? t(`progress.gameType.${game.gameType}`) : t('progress.gameType.memory-match');
  const displayTitle = gameTypeLabel !== `progress.gameType.${game.gameType}` ? gameTypeLabel : game.gameType;

  return (
    <li className="cgd-activity-card" aria-label={t('caregiver.recentActivity.heading') + ' ' + (index + 1)}>
      <div className="cgd-activity-card__title-row">
        <span className="cgd-activity-card__icon" aria-hidden="true">🧠</span>
        <span className="cgd-activity-card__title">{displayTitle}</span>
        <span className="cgd-activity-card__level">{levelLabel(game.difficulty ?? 1, t)}</span>
      </div>
      <div className="cgd-activity-card__stats">
        <span className="cgd-activity-stat"><span aria-hidden="true">🎯</span> {t('caregiver.accuracy.label')}: <strong>{game.accuracy ?? 0}%</strong></span>
        <span className="cgd-activity-stat"><span aria-hidden="true">✅</span> <strong>{game.correct ?? 0} / {game.total ?? 0}</strong> {t('game.score.correct')}</span>
        <span className="cgd-activity-stat"><span aria-hidden="true">⏱️</span> {t('caregiver.responseTime.label')}: <strong>{game.responseTime ?? "-"}s</strong></span>
      </div>
      <p className="cgd-activity-card__date">{game.timestamp ? formatDate(game.timestamp, bcp47) : "-"}</p>
    </li>
  );
}

function RecentActivitiesSection({ results, t, bcp47 }) {
  const recentGames = [...results].reverse().slice(0, 5);
  return (
    <section className="cgd-section" aria-labelledby="cgd-activities-heading">
      <h2 id="cgd-activities-heading" className="cgd-section__heading">{t('caregiver.recentActivity.heading')}</h2>
      {recentGames.length === 0 ? (
        <div className="cgd-empty-state">
          <span className="cgd-empty-state__emoji" aria-hidden="true">🌱</span>
          <p className="cgd-empty-state__msg">{t('caregiver.recentActivity.empty')}</p>
          <p className="cgd-empty-state__hint">{t('progress.noActivity.sub')}</p>
        </div>
      ) : (
        <ul className="cgd-activity-list" role="list">
          {recentGames.map((game, i) => (
            <ActivityCard key={game.timestamp ?? i} game={game} index={i} t={t} bcp47={bcp47} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ActivityTrendSection({ results, t }) {
  const recentGames = [...results].reverse().slice(0, 5);
  return (
    <section className="cgd-section" aria-labelledby="cgd-trend-heading">
      <h2 id="cgd-trend-heading" className="cgd-section__heading">{t('caregiver.trend.heading')}</h2>
      {recentGames.length === 0 ? (
        <p className="cgd-trend-empty">{t('caregiver.recentActivity.empty')}</p>
      ) : (
        <div className="cgd-trend-bars" role="list" aria-label="Accuracy trend bars">
          {recentGames.map((game, i) => {
            const accuracy = game.accuracy ?? 0;
            const label = t('caregiver.trend.game', { n: (recentGames.length - i) });
            return (
              <div key={game.timestamp ?? i} className="cgd-trend-row" role="listitem" aria-label={label + ": " + accuracy + "%"}>
                <span className="cgd-trend-label">{label}</span>
                <div className="cgd-trend-bar-track" aria-hidden="true">
                  <div className="cgd-trend-bar-fill" style={{ width: accuracy + "%" }} />
                </div>
                <span className="cgd-trend-pct">{accuracy}%</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MemorySection({ memories, navigate, t }) {
  const total = memories.length;
  const favourites = memories.filter((m) => m.favorite === true).length;
  return (
    <section className="cgd-section" aria-labelledby="cgd-memories-heading">
      <h2 id="cgd-memories-heading" className="cgd-section__heading">{t('caregiver.memories.heading')}</h2>
      <div className="cgd-memories-card">
        <div className="cgd-memories-stats">
          <div className="cgd-mem-stat">
            <span className="cgd-mem-stat__value">{total}</span>
            <span className="cgd-mem-stat__label">{t('caregiver.memories.heading').replace('❤️ ', '')}</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-mem-stat">
            <span className="cgd-mem-stat__value">❤️ {favourites}</span>
            <span className="cgd-mem-stat__label">{t('memories.favourite')}</span>
          </div>
        </div>
        <button id="cgd-btn-view-memories" className="cgd-btn cgd-btn--rose" onClick={() => navigate("caregiver-memories")}>
          📖&nbsp; {t('caregiver.memories.viewBtn')}
        </button>
      </div>
    </section>
  );
}

function RemindersSection({ reminders, dailyCompletions, navigate, t }) {
  // Correctly counts daily + specific reminders using shared helpers
  const todayPending = reminders.filter(
    (r) => isReminderToday(r) && !isReminderDoneToday(r, dailyCompletions)
  ).length;
  const totalPending = reminders.filter(
    (r) => !isReminderDoneToday(r, dailyCompletions)
  ).length;
  const completed = reminders.filter(
    (r) => isReminderDoneToday(r, dailyCompletions)
  ).length;

  return (
    <section className="cgd-section" aria-labelledby="cgd-reminders-heading">
      <h2 id="cgd-reminders-heading" className="cgd-section__heading">{t('caregiver.reminders.heading')}</h2>
      <div className="cgd-reminders-card">
        <div className="cgd-reminders-stats">
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">{todayPending}</span>
            <span className="cgd-rem-stat__label">{t('reminders.today')}</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">{totalPending}</span>
            <span className="cgd-rem-stat__label">{t('reminders.title')}</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">✅ {completed}</span>
            <span className="cgd-rem-stat__label">{t('reminders.done')}</span>
          </div>
        </div>
        <button
          id="cgd-btn-manage-reminders"
          className="cgd-btn cgd-btn--teal"
          onClick={() => navigate("caregiver-reminders")}
        >
          ⏰  {t('caregiver.reminders.manageBtn')}
        </button>
      </div>
    </section>
  );
}


function ActivityNotesSection({ results, t }) {
  const notes = generateActivityNotes(results, t);
  return (
    <section className="cgd-section" aria-labelledby="cgd-notes-heading">
      <h2 id="cgd-notes-heading" className="cgd-section__heading">{t('caregiver.notes.heading')}</h2>
      <div className={"cgd-notes-card cgd-notes-card--" + notes.tone}>
        <div className="cgd-notes-card__body">
          <span className="cgd-notes-card__emoji" aria-hidden="true">{notes.emoji}</span>
          <p className="cgd-notes-card__message">{notes.message}</p>
        </div>
        <p className="cgd-notes-disclaimer">
          {t('caregiver.disclaimer')}
        </p>
      </div>
    </section>
  );
}

function CaregiverNav({ navigate, t }) {
  return (
    <nav className="cgd-nav" aria-label="Caregiver navigation">
      <button id="cgd-nav-dashboard" className="cgd-nav__btn cgd-nav__btn--active" aria-current="page" aria-label={t('caregiver.nav.dashboard')}>
        <span className="cgd-nav__icon" aria-hidden="true">📊</span>
        <span className="cgd-nav__label">{t('caregiver.nav.dashboard')}</span>
      </button>
      <button id="cgd-nav-memories" className="cgd-nav__btn" aria-label={t('caregiver.nav.memories')} onClick={() => navigate("caregiver-memories")}>
        <span className="cgd-nav__icon" aria-hidden="true">❤️</span>
        <span className="cgd-nav__label">{t('caregiver.nav.memories')}</span>
      </button>
      <button id="cgd-nav-reminders" className="cgd-nav__btn" aria-label={t('caregiver.nav.reminders')} onClick={() => navigate("caregiver-reminders")}>
        <span className="cgd-nav__icon" aria-hidden="true">⏰</span>
        <span className="cgd-nav__label">{t('caregiver.nav.reminders')}</span>
      </button>
      <button id="cgd-nav-patient-mode" className="cgd-nav__btn" aria-label={t('caregiver.patientView.btn')} onClick={() => navigate("patient-home")}>
        <span className="cgd-nav__icon" aria-hidden="true">👴</span>
        <span className="cgd-nav__label">{t('caregiver.patientView.btn')}</span>
      </button>
    </nav>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT

   Data is read at render time (no useEffect) so every mount gives
   fresh localStorage values. refreshKey forces a re-render when
   the caregiver clicks "Refresh Data" mid-session.
---------------------------------------------------------------- */
function CaregiverDashboard({ navigate }) {
  const { t, lang } = useLanguage();
  const bcp47 = LOCALE_BCP47[lang] || 'en-IN';
  
  const [refreshKey, setRefreshKey] = useState(0);
  void refreshKey; // referenced so lint knows it is used

  const results          = loadGameResults();
  const currentLevel     = loadDifficulty();
  const memories         = loadMemories();
  const reminders        = loadReminders();
  const dailyCompletions = loadDailyCompletions();

  return (
    <CulturalBackground variant="home">
      <div className="cgd-screen cgd-screen--transparent">
        <DashboardHeader navigate={navigate} t={t} />

        <main className="cgd-content">

          <div className="cgd-demo-banner" role="note">
            <span aria-hidden="true">🔬</span>
            <span>
              {t('caregiver.prototype.banner', { name: DEMO_PATIENT.name })}
            </span>
          </div>

          <div className="cgd-refresh-row">
            <button
              id="cgd-btn-refresh"
              className="cgd-btn-refresh"
              onClick={() => setRefreshKey((k) => k + 1)}
              aria-label={t('caregiver.refreshData')}
            >
              {t('caregiver.refreshData')}
            </button>
          </div>

          <OverviewSection results={results} currentLevel={currentLevel} t={t} bcp47={bcp47} />
          <RecentActivitiesSection results={results} t={t} bcp47={bcp47} />
          <ActivityTrendSection results={results} t={t} />
          <MemorySection memories={memories} navigate={navigate} t={t} />
          <RemindersSection reminders={reminders} dailyCompletions={dailyCompletions} navigate={navigate} t={t} />
          <ActivityNotesSection results={results} t={t} />

        </main>

        <CaregiverNav navigate={navigate} t={t} />
      </div>
    </CulturalBackground>
  );
}

export default CaregiverDashboard;
