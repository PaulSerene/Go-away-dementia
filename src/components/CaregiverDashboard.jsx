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

function diffLabel(num) { return "Level " + num; }

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return isoString ?? "-";
  }
}

function recentActivityLabel(results) {
  if (results.length === 0) return "No activity yet";
  const latest = results[results.length - 1];
  if (!latest?.timestamp) return "Unknown";
  try {
    const diffHours = (Date.now() - new Date(latest.timestamp)) / 3_600_000;
    if (diffHours < 1)  return "Less than 1 hour ago";
    if (diffHours < 24) return Math.round(diffHours) + "h ago";
    const days = Math.floor(diffHours / 24);
    if (days === 1) return "Yesterday";
    if (days <= 7)  return days + " days ago";
    return formatDate(latest.timestamp);
  } catch { return "-"; }
}

/* ----------------------------------------------------------------
   ACTIVITY NOTES GENERATOR
   Rule-based observations from game data only.
   NEVER mentions dementia, cognitive decline, or medical status.
---------------------------------------------------------------- */
function generateActivityNotes(results) {
  if (results.length === 0) {
    return { message: "No activities have been completed yet.", emoji: "🌱", tone: "neutral" };
  }
  const recent = [...results].reverse().slice(0, 5);
  const avg = Math.round(
    recent.reduce((sum, r) => sum + (r.accuracy ?? 0), 0) / recent.length
  );
  if (avg >= 80) return { message: "Recent game performance has been strong.", emoji: "🌟", tone: "positive" };
  if (avg >= 50) return { message: "Recent activities show steady practice.", emoji: "🌱", tone: "neutral" };
  return { message: "Recent activities may benefit from continued gentle practice.", emoji: "💪", tone: "encourage" };
}

/* ----------------------------------------------------------------
   SUB-COMPONENTS
---------------------------------------------------------------- */
function DashboardHeader({ navigate }) {
  return (
    <header className="cgd-header" aria-label="Caregiver Dashboard header">
      {/* Back to Smriti Home button */}
      <button
        className="cgd-header-back-btn"
        onClick={() => navigate('landing')}
        aria-label="Return to Smriti Home"
      >
        ← Smriti Home
      </button>

      <div className="cgd-header__top">
        <div>
          <p className="cgd-header__title">Caregiver Dashboard</p>
          <p className="cgd-header__subtitle">Supporting {DEMO_PATIENT.name}</p>
        </div>
        <button
          id="cgd-btn-switch-patient"
          className="cgd-header__switch-btn"
          onClick={() => navigate("patient-home")}
          aria-label="Switch to Patient Mode"
        >
          👴 Patient View
        </button>
      </div>
      <div className="cgd-patient-info">
        <span className="cgd-patient-info__avatar" aria-hidden="true">👵</span>
        <div>
          <p className="cgd-patient-info__name">{DEMO_PATIENT.name}</p>
          <p className="cgd-patient-info__age">Age: {DEMO_PATIENT.age}</p>
        </div>
        <span className="cgd-demo-badge">Demo Patient</span>
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

function OverviewSection({ results, currentLevel }) {
  return (
    <section className="cgd-section" aria-labelledby="cgd-overview-heading">
      <h2 id="cgd-overview-heading" className="cgd-section__heading">Today&apos;s Overview</h2>
      <div className="cgd-stat-grid">
        <StatCard id="cgd-stat-games"    icon="🧠" value={calcGamesCompleted(results)}      label="Games Completed"    colorClass="cgd-stat-card--teal" />
        <StatCard id="cgd-stat-accuracy" icon="🎯" value={calcAvgAccuracy(results) + "%"}   label="Average Accuracy"   colorClass="cgd-stat-card--warm" />
        <StatCard id="cgd-stat-level"    icon="📈" value={diffLabel(currentLevel)}           label="Current Difficulty" colorClass="cgd-stat-card--rose" />
        <StatCard id="cgd-stat-recent"   icon="⏱️" value={recentActivityLabel(results)}     label="Recent Activity"    colorClass="cgd-stat-card--gold" />
      </div>
    </section>
  );
}

function ActivityCard({ game, index }) {
  return (
    <li className="cgd-activity-card" aria-label={"Activity " + (index + 1)}>
      <div className="cgd-activity-card__title-row">
        <span className="cgd-activity-card__icon" aria-hidden="true">🧠</span>
        <span className="cgd-activity-card__title">Remember the Objects</span>
        <span className="cgd-activity-card__level">{diffLabel(game.difficulty ?? 1)}</span>
      </div>
      <div className="cgd-activity-card__stats">
        <span className="cgd-activity-stat"><span aria-hidden="true">🎯</span> Accuracy: <strong>{game.accuracy ?? 0}%</strong></span>
        <span className="cgd-activity-stat"><span aria-hidden="true">✅</span> <strong>{game.correct ?? 0} / {game.total ?? 0}</strong> objects</span>
        <span className="cgd-activity-stat"><span aria-hidden="true">⏱️</span> Response time: <strong>{game.responseTime ?? "-"}s</strong></span>
      </div>
      <p className="cgd-activity-card__date">{game.timestamp ? formatDate(game.timestamp) : "-"}</p>
    </li>
  );
}

function RecentActivitiesSection({ results }) {
  const recentGames = [...results].reverse().slice(0, 5);
  return (
    <section className="cgd-section" aria-labelledby="cgd-activities-heading">
      <h2 id="cgd-activities-heading" className="cgd-section__heading">Recent Activities</h2>
      {recentGames.length === 0 ? (
        <div className="cgd-empty-state">
          <span className="cgd-empty-state__emoji" aria-hidden="true">🌱</span>
          <p className="cgd-empty-state__msg">No activities completed yet.</p>
          <p className="cgd-empty-state__hint">Activities will appear here after {DEMO_PATIENT.name} completes a game.</p>
        </div>
      ) : (
        <ul className="cgd-activity-list" role="list">
          {recentGames.map((game, i) => (
            <ActivityCard key={game.timestamp ?? i} game={game} index={i} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ActivityTrendSection({ results }) {
  const recentGames = [...results].reverse().slice(0, 5);
  return (
    <section className="cgd-section" aria-labelledby="cgd-trend-heading">
      <h2 id="cgd-trend-heading" className="cgd-section__heading">Recent Accuracy Trend</h2>
      {recentGames.length === 0 ? (
        <p className="cgd-trend-empty">No data yet - trend will appear after games are played.</p>
      ) : (
        <div className="cgd-trend-bars" role="list" aria-label="Accuracy trend bars">
          {recentGames.map((game, i) => {
            const accuracy = game.accuracy ?? 0;
            const label = "Game " + (recentGames.length - i);
            return (
              <div key={game.timestamp ?? i} className="cgd-trend-row" role="listitem" aria-label={label + ": " + accuracy + "% accuracy"}>
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

function MemorySection({ memories, navigate }) {
  const total = memories.length;
  const favourites = memories.filter((m) => m.favorite === true).length;
  return (
    <section className="cgd-section" aria-labelledby="cgd-memories-heading">
      <h2 id="cgd-memories-heading" className="cgd-section__heading">❤️ Memories</h2>
      <div className="cgd-memories-card">
        <div className="cgd-memories-stats">
          <div className="cgd-mem-stat">
            <span className="cgd-mem-stat__value">{total}</span>
            <span className="cgd-mem-stat__label">Total Memories</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-mem-stat">
            <span className="cgd-mem-stat__value">❤️ {favourites}</span>
            <span className="cgd-mem-stat__label">Favourites</span>
          </div>
        </div>
        <button id="cgd-btn-view-memories" className="cgd-btn cgd-btn--rose" onClick={() => navigate("caregiver-memories")}>
          📖&nbsp; View Memories
        </button>
      </div>
    </section>
  );
}

function RemindersSection({ reminders, dailyCompletions, navigate }) {
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
      <h2 id="cgd-reminders-heading" className="cgd-section__heading">⏰ Reminders</h2>
      <div className="cgd-reminders-card">
        <div className="cgd-reminders-stats">
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">{todayPending}</span>
            <span className="cgd-rem-stat__label">Today Pending</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">{totalPending}</span>
            <span className="cgd-rem-stat__label">Total Pending</span>
          </div>
          <div className="cgd-mem-divider" aria-hidden="true" />
          <div className="cgd-rem-stat">
            <span className="cgd-rem-stat__value">✅ {completed}</span>
            <span className="cgd-rem-stat__label">Done Today</span>
          </div>
        </div>
        <button
          id="cgd-btn-manage-reminders"
          className="cgd-btn cgd-btn--teal"
          onClick={() => navigate("caregiver-reminders")}
        >
          ⏰  Manage Reminders
        </button>
      </div>
    </section>
  );
}


function ActivityNotesSection({ results }) {
  const notes = generateActivityNotes(results);
  return (
    <section className="cgd-section" aria-labelledby="cgd-notes-heading">
      <h2 id="cgd-notes-heading" className="cgd-section__heading">Activity Notes</h2>
      <div className={"cgd-notes-card cgd-notes-card--" + notes.tone}>
        <div className="cgd-notes-card__body">
          <span className="cgd-notes-card__emoji" aria-hidden="true">{notes.emoji}</span>
          <p className="cgd-notes-card__message">{notes.message}</p>
        </div>
        <p className="cgd-notes-disclaimer">
          ℹ️ These observations are based on activity performance and are not a medical assessment.
        </p>
      </div>
    </section>
  );
}

function CaregiverNav({ navigate }) {
  return (
    <nav className="cgd-nav" aria-label="Caregiver navigation">
      <button id="cgd-nav-dashboard" className="cgd-nav__btn cgd-nav__btn--active" aria-current="page" aria-label="Dashboard">
        <span className="cgd-nav__icon" aria-hidden="true">📊</span>
        <span className="cgd-nav__label">Dashboard</span>
      </button>
      <button id="cgd-nav-memories" className="cgd-nav__btn" aria-label="Manage Memories" onClick={() => navigate("caregiver-memories")}>
        <span className="cgd-nav__icon" aria-hidden="true">❤️</span>
        <span className="cgd-nav__label">Memories</span>
      </button>
      <button id="cgd-nav-reminders" className="cgd-nav__btn" aria-label="Manage Reminders" onClick={() => navigate("caregiver-reminders")}>
        <span className="cgd-nav__icon" aria-hidden="true">⏰</span>
        <span className="cgd-nav__label">Reminders</span>
      </button>
      <button id="cgd-nav-patient-mode" className="cgd-nav__btn" aria-label="Switch to Patient Mode" onClick={() => navigate("patient-home")}>
        <span className="cgd-nav__icon" aria-hidden="true">👴</span>
        <span className="cgd-nav__label">Patient View</span>
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
  const [refreshKey, setRefreshKey] = useState(0);
  void refreshKey; // referenced so lint knows it is used

  const results          = loadGameResults();
  const currentLevel     = loadDifficulty();
  const memories         = loadMemories();
  const reminders        = loadReminders();
  const dailyCompletions = loadDailyCompletions();

  return (
    <div className="cgd-screen">
      <DashboardHeader navigate={navigate} />

      <main className="cgd-content">

        <div className="cgd-demo-banner" role="note">
          <span aria-hidden="true">🔬</span>
          <span>
            <strong>Prototype Demo</strong> — Mrs. Das is a fictional patient.
            Data shown reflects actual game sessions played on this device.
          </span>
        </div>

        <div className="cgd-refresh-row">
          <button
            id="cgd-btn-refresh"
            className="cgd-btn-refresh"
            onClick={() => setRefreshKey((k) => k + 1)}
            aria-label="Refresh dashboard data"
          >
            🔄 Refresh Data
          </button>
        </div>

        <OverviewSection results={results} currentLevel={currentLevel} />
        <RecentActivitiesSection results={results} />
        <ActivityTrendSection results={results} />
        <MemorySection memories={memories} navigate={navigate} />
        <RemindersSection reminders={reminders} dailyCompletions={dailyCompletions} navigate={navigate} />
        <ActivityNotesSection results={results} />

      </main>

      <CaregiverNav navigate={navigate} />
    </div>
  );
}

export default CaregiverDashboard;
