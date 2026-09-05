/**
 * PatientReminders.jsx — "Today's Reminders" screen for Patient Mode.
 *
 * Designed for elderly users — large text, large touch targets,
 * clear completed/pending state, warm colours.
 *
 * Reads from smriti_reminders — the SAME key as CaregiverReminders.
 * Patient can mark reminders complete; caregivers see the update.
 *
 * Daily reminders:
 *   - Always appear in Today section.
 *   - Completion is per-day via smriti_daily_completions.
 *   - Tomorrow they are pending again — the reminder itself is NOT modified.
 *
 * Specific reminders:
 *   - Appear only when date === today (upcoming shown in a Coming Up section).
 *   - Completion is permanent (reminder.completed flag).
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import { useState } from 'react';
import {
  loadReminders,
  saveReminders,
  loadDailyCompletions,
  saveDailyCompletions,
  toggleDailyCompletion,
  isReminderToday,
  isReminderUpcoming,
  isReminderDoneToday,
  CATEGORY_EMOJI,
  todayStr,
} from '../utils/reminderStorage';
import './PatientReminders.css';

/* ----------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
function formatDisplayTime(timeStr) {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [y, mo, d] = dateStr.split('-').map(Number);
    const date = new Date(y, mo - 1, d);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

/* ----------------------------------------------------------------
   REMINDER CARD (elderly-friendly — large touch target)
---------------------------------------------------------------- */
function PatientReminderCard({ reminder, isDone, onToggleComplete }) {
  const emoji = CATEGORY_EMOJI[reminder.category] ?? '📝';
  const isDaily = reminder.type === 'daily';

  return (
    <article
      className={'prm-card' + (isDone ? ' prm-card--done' : '')}
      aria-label={'Reminder: ' + reminder.title}
    >
      {/* Category badge + Daily badge */}
      <div className="prm-card__top">
        <span className="prm-card__emoji" aria-hidden="true">{emoji}</span>
        <span className="prm-card__category">{reminder.category}</span>
        {isDaily && <span className="prm-daily-badge">Every Day</span>}
        {isDone && <span className="prm-done-badge">✅ Done</span>}
      </div>

      {/* Title */}
      <h3 className={'prm-card__title' + (isDone ? ' prm-card__title--done' : '')}>
        {reminder.title}
      </h3>

      {/* Description */}
      {reminder.description && (
        <p className="prm-card__desc">{reminder.description}</p>
      )}

      {/* Time */}
      {reminder.time && (
        <p className="prm-card__time">⏰ {formatDisplayTime(reminder.time)}</p>
      )}

      {/* Daily: note it resets tomorrow */}
      {isDaily && isDone && (
        <p className="prm-card__reset-note">This reminder will appear again tomorrow.</p>
      )}

      {/* Complete button — large touch target */}
      <button
        className={'prm-complete-btn' + (isDone ? ' prm-complete-btn--done' : '')}
        onClick={() => onToggleComplete(reminder)}
        aria-pressed={isDone}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        {isDone ? '✅  Done — Tap to undo' : '⭕  Mark as Done'}
      </button>
    </article>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------------- */
function PatientReminders({ navigate }) {
  const [reminders, setReminders]             = useState(() => loadReminders());
  const [dailyCompletions, setDailyCompletions] = useState(() => loadDailyCompletions());

  const today = todayStr();

  /* ---- Toggle completion ---- */
  function handleToggleComplete(reminder) {
    if (reminder.type === 'daily') {
      /* Daily: toggle in the per-day completions map — reminder object unchanged */
      const updated = toggleDailyCompletion(dailyCompletions, reminder.id, today);
      setDailyCompletions(updated);
      saveDailyCompletions(updated);
    } else {
      /* Specific: flip reminder.completed permanently */
      const updated = reminders.map((r) =>
        r.id === reminder.id ? { ...r, completed: !r.completed } : r
      );
      setReminders(updated);
      saveReminders(updated);
    }
  }

  /* ---- Split reminders into sections ---- */
  const todayReminders    = reminders.filter((r) => isReminderToday(r));
  const upcomingReminders = reminders.filter((r) => isReminderUpcoming(r));
  // Past specific reminders: date < today && not daily — we simply don't show them

  /* Sort each group: pending first (within today), then by time */
  const sortGroup = (arr) =>
    [...arr].sort((a, b) => {
      const aDone = isReminderDoneToday(a, dailyCompletions);
      const bDone = isReminderDoneToday(b, dailyCompletions);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (a.time || '').localeCompare(b.time || '');
    });

  const todaySorted    = sortGroup(todayReminders);
  const upcomingSorted = [...upcomingReminders].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time || '').localeCompare(b.time || '');
  });

  const hasAny = reminders.length > 0;

  return (
    <div className="prm-screen">

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="prm-header" aria-label="Reminders header">
        <h1 className="prm-header__title">Today's Reminders ⏰</h1>
        <p className="prm-header__sub">Here are the things to remember today.</p>
      </header>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <main className="prm-content">

        {/* Empty state — no reminders at all */}
        {!hasAny && (
          <div className="prm-empty">
            <span className="prm-empty__emoji" aria-hidden="true">🌱</span>
            <p className="prm-empty__msg">No reminders for now 🌱</p>
            <p className="prm-empty__hint">You're all caught up.</p>
          </div>
        )}

        {/* Empty state — reminders exist but none for today */}
        {hasAny && todayReminders.length === 0 && (
          <div className="prm-empty">
            <span className="prm-empty__emoji" aria-hidden="true">☀️</span>
            <p className="prm-empty__msg">Nothing scheduled for today.</p>
            <p className="prm-empty__hint">Check back tomorrow for upcoming reminders.</p>
          </div>
        )}

        {/* Today's reminders */}
        {todaySorted.length > 0 && (
          <section aria-labelledby="prm-today-heading">
            <h2 id="prm-today-heading" className="prm-section-heading">📅 Today</h2>
            <ul className="prm-list" role="list">
              {todaySorted.map((rem) => (
                <li key={rem.id}>
                  <PatientReminderCard
                    reminder={rem}
                    isDone={isReminderDoneToday(rem, dailyCompletions)}
                    onToggleComplete={handleToggleComplete}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Upcoming specific-date reminders */}
        {upcomingSorted.length > 0 && (
          <section aria-labelledby="prm-upcoming-heading">
            <h2 id="prm-upcoming-heading" className="prm-section-heading">🔜 Coming Up</h2>
            <ul className="prm-list" role="list">
              {upcomingSorted.map((rem) => (
                <li key={rem.id}>
                  <article
                    className={'prm-card prm-card--upcoming' + (rem.completed ? ' prm-card--done' : '')}
                    aria-label={'Upcoming reminder: ' + rem.title}
                  >
                    <div className="prm-card__top">
                      <span className="prm-card__emoji" aria-hidden="true">
                        {CATEGORY_EMOJI[rem.category] ?? '📝'}
                      </span>
                      <span className="prm-card__category">{rem.category}</span>
                    </div>
                    <h3 className={'prm-card__title' + (rem.completed ? ' prm-card__title--done' : '')}>
                      {rem.title}
                    </h3>
                    <p className="prm-card__time">
                      📅 {formatDisplayDate(rem.date)}{rem.time ? '  ⏰ ' + formatDisplayTime(rem.time) : ''}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>

      {/* ── BOTTOM NAVIGATION ───────────────────────────── */}
      <nav className="ph-nav" aria-label="Main navigation">
        <button
          className="ph-nav__btn"
          aria-label="Home"
          onClick={() => navigate('patient-home')}
        >
          <span className="ph-nav__icon" aria-hidden="true">🏠</span>
          <span className="ph-nav__label">Home</span>
        </button>

        <button
          className="ph-nav__btn"
          aria-label="Activities"
          onClick={() => navigate('patient-activities')}
        >
          <span className="ph-nav__icon" aria-hidden="true">🧠</span>
          <span className="ph-nav__label">Activities</span>
        </button>

        <button
          className="ph-nav__btn"
          aria-label="Memories"
          onClick={() => navigate('patient-memories')}
        >
          <span className="ph-nav__icon" aria-hidden="true">❤️</span>
          <span className="ph-nav__label">Memories</span>
        </button>

        <button
          id="prm-nav-reminders"
          className="ph-nav__btn ph-nav__btn--active"
          aria-current="page"
          aria-label="Reminders"
        >
          <span className="ph-nav__icon" aria-hidden="true">⏰</span>
          <span className="ph-nav__label">Reminders</span>
        </button>
      </nav>

    </div>
  );
}

export default PatientReminders;
