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

import { useState, useEffect } from 'react';
import { reminders as remindersApi } from '../utils/api.js';
import { getCachedPatientId, getOrCreatePatientId } from '../utils/identity.js';
import { enqueue } from '../utils/syncQueue.js';
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
import CulturalBackground from './CulturalBackground';
import { useLanguage, LOCALE_BCP47 } from '../locales/index.js';
import './PatientReminders.css';


/* ----------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
function formatDisplayTime(timeStr, bcp47) {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toLocaleTimeString(bcp47 || 'en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

function formatDisplayDate(dateStr, bcp47) {
  if (!dateStr) return '';
  try {
    const [y, mo, d] = dateStr.split('-').map(Number);
    const date = new Date(y, mo - 1, d);
    return date.toLocaleDateString(bcp47 || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

/* ----------------------------------------------------------------
   REMINDER CARD (elderly-friendly — large touch target)
---------------------------------------------------------------- */
function PatientReminderCard({ reminder, isDone, onToggleComplete, t, bcp47 }) {
  const emoji = CATEGORY_EMOJI[reminder.category] ?? '📝';
  const isDaily = reminder.type === 'daily';

  // Category uses dynamic mapping if available, falling back to English key
  const categoryLabel = t(`caregiver.reminders.category.${reminder.category?.toLowerCase()}`);
  const displayCategory = categoryLabel !== `caregiver.reminders.category.${reminder.category?.toLowerCase()}` 
                          ? categoryLabel : reminder.category;

  return (
    <article
      className={'prm-card' + (isDone ? ' prm-card--done' : '')}
      aria-label={`${t('reminders.heading')}: ${reminder.title}`}
    >
      {/* Category badge + Daily badge */}
      <div className="prm-card__top">
        <span className="prm-card__emoji" aria-hidden="true">{emoji}</span>
        <span className="prm-card__category">{displayCategory}</span>
        {isDaily && <span className="prm-daily-badge">{t('reminders.everyDay')}</span>}
        {isDone && <span className="prm-done-badge">{t('reminders.done')}</span>}
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
        <p className="prm-card__time">⏰ {formatDisplayTime(reminder.time, bcp47)}</p>
      )}

      {/* Daily: note it resets tomorrow */}
      {isDaily && isDone && (
        <p className="prm-card__reset-note">{t('reminders.resetNote')}</p>
      )}

      {/* Complete button — large touch target */}
      <button
        className={'prm-complete-btn' + (isDone ? ' prm-complete-btn--done' : '')}
        onClick={() => onToggleComplete(reminder)}
        aria-pressed={isDone}
        aria-label={isDone ? t('reminders.doneUndo') : t('reminders.markDone')}
      >
        {isDone ? t('reminders.doneUndo') : `⭕ ${t('reminders.markDone').replace('✓ ', '')}`}
      </button>
    </article>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------------- */
function PatientReminders({ navigate }) {
  const { t, lang } = useLanguage();
  const bcp47 = LOCALE_BCP47[lang] || 'en-IN';
  
  const [reminders, setReminders]             = useState(() => loadReminders());
  const [dailyCompletions, setDailyCompletions] = useState(() => loadDailyCompletions());

  const today = todayStr();

  /* ---- BACKEND SYNC ON MOUNT ---- */
  useEffect(() => {
    let cancelled = false;

    async function syncFromBackend() {
      const patientId = await getOrCreatePatientId();
      if (!patientId || cancelled) return;

      const { data, error } = await remindersApi.list(patientId);
      if (error || !data?.reminders || cancelled) return;

      const localRems = loadReminders();

      // Only build lookup from records that have a server id
      const localByDbId = Object.fromEntries(
        localRems
          .filter((r) => r._dbId)
          .map((r) => [r._dbId, r])
      );

      const fromDb = data.reminders.map((dbRem) => ({
        ...(localByDbId[dbRem.id] ?? {}),
        _dbId:       dbRem.id,
        id:          localByDbId[dbRem.id]?.id ?? String(dbRem.id),
        title:       dbRem.title,
        description: dbRem.description ?? '',
        type:        dbRem.type,
        date:        dbRem.date_on ?? null,
        time:        dbRem.time_at ?? '',
        category:    dbRem.category ?? 'Daily',
        completed:   dbRem.completed,
        createdAt:   dbRem.created_at,
      }));

      // Preserve offline-created reminders that haven't synced yet
      const localOnly = localRems.filter((r) => !r._dbId);
      const merged = [...fromDb, ...localOnly];

      if (!cancelled) {
        setReminders(merged);
        saveReminders(merged);
      }
    }

    syncFromBackend();
    return () => { cancelled = true; };
  }, []);

  /* ---- Toggle completion ---- */
  function handleToggleComplete(reminder) {
    const patientId = getCachedPatientId();

    if (reminder.type === 'daily') {
      const wasDone = dailyCompletions[reminder.id]?.includes(today);
      const updated = toggleDailyCompletion(dailyCompletions, reminder.id, today);
      setDailyCompletions(updated);
      saveDailyCompletions(updated);

      // Backend sync — enqueue on failure
      if (patientId && reminder._dbId) {
        if (!wasDone) {
          remindersApi.complete(reminder._dbId, patientId, today).then(({ error }) => {
            if (error) enqueue('complete_reminder',   { dbId: reminder._dbId, patientId, dateOn: today });
          });
        } else {
          remindersApi.uncomplete(reminder._dbId, patientId, today).then(({ error }) => {
            if (error) enqueue('uncomplete_reminder', { dbId: reminder._dbId, patientId, dateOn: today });
          });
        }
      }
    } else {
      const updated = reminders.map((r) =>
        r.id === reminder.id ? { ...r, completed: !r.completed } : r
      );
      setReminders(updated);
      saveReminders(updated);

      // Backend sync — enqueue on failure
      if (patientId && reminder._dbId) {
        remindersApi.update(reminder._dbId, { completed: !reminder.completed }).then(({ error }) => {
          if (error) {
            enqueue('update_reminder', { dbId: reminder._dbId, completed: !reminder.completed });
          }
        });
      }
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
    <CulturalBackground variant="home">
      <div className="prm-screen prm-screen--transparent">

        {/* ── HEADER ──────────────────────────────────────── */}
        <header className="prm-header" aria-label={t('reminders.heading')}>
          <h1 className="prm-header__title">{t('reminders.title')} ⏰</h1>
          <p className="prm-header__sub">{t('reminders.empty.sub')}</p>
        </header>

        {/* ── CONTENT ─────────────────────────────────────── */}
        <main className="prm-content">

          {/* Empty state — no reminders at all */}
          {!hasAny && (
            <div className="prm-empty">
              <span className="prm-empty__emoji" aria-hidden="true">🌱</span>
              <p className="prm-empty__msg">{t('reminders.empty')} 🌱</p>
              <p className="prm-empty__hint">{t('reminders.allCaughtUp')}</p>
            </div>
          )}

          {/* Empty state — reminders exist but none for today */}
          {hasAny && todayReminders.length === 0 && (
            <div className="prm-empty">
              <span className="prm-empty__emoji" aria-hidden="true">☀️</span>
              <p className="prm-empty__msg">{t('reminders.noneToday')}</p>
              <p className="prm-empty__hint">{t('reminders.allCaughtUp')}</p>
            </div>
          )}

          {/* Today's reminders */}
          {todaySorted.length > 0 && (
            <section aria-labelledby="prm-today-heading">
              <h2 id="prm-today-heading" className="prm-section-heading">📅 {t('reminders.today')}</h2>
              <ul className="prm-list" role="list">
                {todaySorted.map((rem) => (
                  <li key={rem.id}>
                    <PatientReminderCard
                      reminder={rem}
                      isDone={isReminderDoneToday(rem, dailyCompletions)}
                      onToggleComplete={handleToggleComplete}
                      t={t}
                      bcp47={bcp47}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Upcoming specific-date reminders */}
          {upcomingSorted.length > 0 && (
            <section aria-labelledby="prm-upcoming-heading">
              <h2 id="prm-upcoming-heading" className="prm-section-heading">🔜 {t('reminders.comingUp')}</h2>
              <ul className="prm-list" role="list">
                {upcomingSorted.map((rem) => {
                  const categoryLabel = t(`caregiver.reminders.category.${rem.category?.toLowerCase()}`);
                  const displayCategory = categoryLabel !== `caregiver.reminders.category.${rem.category?.toLowerCase()}` 
                                          ? categoryLabel : rem.category;
                  return (
                    <li key={rem.id}>
                      <article
                        className={'prm-card prm-card--upcoming' + (rem.completed ? ' prm-card--done' : '')}
                        aria-label={`${t('reminders.comingUp')}: ${rem.title}`}
                      >
                        <div className="prm-card__top">
                          <span className="prm-card__emoji" aria-hidden="true">
                            {CATEGORY_EMOJI[rem.category] ?? '📝'}
                          </span>
                          <span className="prm-card__category">{displayCategory}</span>
                        </div>
                        <h3 className={'prm-card__title' + (rem.completed ? ' prm-card__title--done' : '')}>
                          {rem.title}
                        </h3>
                        <p className="prm-card__time">
                          📅 {formatDisplayDate(rem.date, bcp47)}{rem.time ? '  ⏰ ' + formatDisplayTime(rem.time, bcp47) : ''}
                        </p>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

        </main>

        {/* ── BOTTOM NAVIGATION ───────────────────────────── */}
        <nav className="ph-nav" aria-label="Main navigation">
          <button
            className="ph-nav__btn"
            aria-label={t('reminders.nav.home')}
            onClick={() => navigate('patient-home')}
          >
            <span className="ph-nav__icon" aria-hidden="true">🏠</span>
            <span className="ph-nav__label">{t('reminders.nav.home')}</span>
          </button>

          <button
            className="ph-nav__btn"
            aria-label={t('reminders.nav.games')}
            onClick={() => navigate('patient-activities')}
          >
            <span className="ph-nav__icon" aria-hidden="true">🧠</span>
            <span className="ph-nav__label">{t('reminders.nav.games')}</span>
          </button>

          <button
            className="ph-nav__btn"
            aria-label={t('reminders.nav.memories')}
            onClick={() => navigate('patient-memories')}
          >
            <span className="ph-nav__icon" aria-hidden="true">❤️</span>
            <span className="ph-nav__label">{t('reminders.nav.memories')}</span>
          </button>

          <button
            id="prm-nav-reminders"
            className="ph-nav__btn ph-nav__btn--active"
            aria-current="page"
            aria-label={t('reminders.nav.reminders')}
          >
            <span className="ph-nav__icon" aria-hidden="true">⏰</span>
            <span className="ph-nav__label">{t('reminders.nav.reminders')}</span>
          </button>
        </nav>

      </div>
    </CulturalBackground>
  );
}

export default PatientReminders;
