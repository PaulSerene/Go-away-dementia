/**
 * PatientHome.jsx — The main screen for Patient Mode.
 *
 * Designed for elderly users with possible cognitive difficulties.
 * Design principles:
 *   - Very large text (minimum 1.1rem everywhere)
 *   - Large touch targets (buttons min 64px tall)
 *   - High contrast, warm colours
 *   - Simple, uncluttered layout with plain language
 *   - No tiny buttons, no complex menus
 *
 * Props:
 *   navigate — function passed from App to switch the current screen
 *
 * IMPORTANT: The reminders card reads from smriti_reminders (shared with
 * CaregiverReminders). No hardcoded/sample reminder data is used.
 */
import {
  loadReminders,
  loadDailyCompletions,
  isReminderToday,
  isReminderDoneToday,
  CATEGORY_EMOJI,
} from '../utils/reminderStorage';
import CulturalBackground from './CulturalBackground';
import { useLanguage } from '../locales/index.js';


function PatientHome({ navigate }) {
  const { t } = useLanguage();
  /* Load real reminders from shared storage */
  const allReminders    = loadReminders();
  const dailyCompletions = loadDailyCompletions();

  /* Only show today's pending reminders in the summary card */
  const todayPendingReminders = allReminders
    .filter((r) => isReminderToday(r) && !isReminderDoneToday(r, dailyCompletions))
    .slice(0, 3); // cap at 3 for the summary preview

  const todayTotalCount = allReminders.filter((r) => isReminderToday(r)).length;

  /* Time-of-day greeting */
  const hour = new Date().getHours();
  const timeKey = hour < 12 ? 'home.greeting.morning' : hour < 17 ? 'home.greeting.afternoon' : 'home.greeting.evening';
  const greeting = t('home.greeting', { timeOfDay: t(timeKey), name: 'Mrs. Das' });

  return (
    <CulturalBackground variant="home">
      <div className="ph-screen ph-screen--transparent">

        {/* ── GREETING HEADER ──────────────────────── */}
        <header className="ph-greeting" aria-label="Greeting">
          {/* Back to Memora Home button */}
          <button
            className="ph-header-back-btn"
            onClick={() => navigate('landing')}
            aria-label={t('nav.home')}
          >
            {t('nav.home')}
          </button>

          <p className="ph-greeting__name">{greeting}</p>
          <p className="ph-greeting__sub">{t('home.sub')}</p>
        </header>

        {/* ── MAIN CARD AREA ───────────────────────────────── */}
        <main className="ph-content">

          {/* CARD 1 — TODAY'S ACTIVITY */}
          <article className="ph-card ph-card--activity">
            <div className="ph-card__header">
              <span className="ph-card__emoji" aria-hidden="true">🧠</span>
              <span className="ph-card__tag">{t('home.todayActivity.tag')}</span>
            </div>
            <h2 className="ph-card__title">{t('home.todayActivity.title')}</h2>
            <p className="ph-card__desc">{t('home.todayActivity.desc')}</p>
            <button
              id="btn-start-activity"
              className="ph-btn ph-btn--warm"
              onClick={() => navigate('patient-activity')}
            >
              {t('home.todayActivity.btn')}
            </button>
          </article>

          {/* CARD 1b — ALL ACTIVITIES (Games Hub) */}
          <article className="ph-card ph-card--games">
            <div className="ph-card__header">
              <span className="ph-card__emoji" aria-hidden="true">🎮</span>
              <span className="ph-card__tag">{t('home.allActivities.tag')}</span>
            </div>
            <h2 className="ph-card__title">{t('home.allActivities.title')}</h2>
            <p className="ph-card__desc">{t('home.allActivities.desc')}</p>
            <button
              id="btn-all-activities"
              className="ph-btn ph-btn--games"
              onClick={() => navigate('games-hub')}
            >
              {t('home.allActivities.btn')}
            </button>
          </article>

          {/* CARD 2 — MY MEMORIES */}
          <article className="ph-card ph-card--memories">
            <div className="ph-card__header">
              <span className="ph-card__emoji" aria-hidden="true">❤️</span>
              <span className="ph-card__tag">{t('home.memories.tag')}</span>
            </div>
            <h2 className="ph-card__title">{t('home.memories.title')}</h2>
            <p className="ph-card__desc">{t('home.memories.desc')}</p>
            <button
              id="btn-open-memories"
              className="ph-btn ph-btn--rose"
              onClick={() => navigate('patient-memories')}
            >
              {t('home.memories.btn')}
            </button>
          </article>

          {/* CARD 3 — TODAY'S REMINDERS (real data from smriti_reminders) */}
          <article className="ph-card ph-card--reminders">
            <div className="ph-card__header">
              <span className="ph-card__emoji" aria-hidden="true">⏰</span>
              <span className="ph-card__tag">{t('home.reminders.tag')}</span>
            </div>
            <h2 className="ph-card__title">{t('home.reminders.title')}</h2>

            {todayTotalCount === 0 ? (
              /* No reminders at all today */
              <p className="ph-reminder-empty">{t('home.reminders.none')}</p>
            ) : todayPendingReminders.length === 0 ? (
              /* All done! */
              <p className="ph-reminder-empty">✅ {t('home.reminders.done')}</p>
            ) : (
              /* Show up to 3 pending reminders as a preview */
              <ul className="ph-reminder-list" role="list">
                {todayPendingReminders.map((r) => (
                  <li key={r.id} className="ph-reminder-item">
                    <span className="ph-reminder-item__icon" aria-hidden="true">
                      {CATEGORY_EMOJI[r.category] ?? '📝'}
                    </span>
                    <span className="ph-reminder-item__label">{r.title}</span>
                    {r.time && (
                      <span className="ph-reminder-item__time">{r.time}</span>
                    )}
                  </li>
                ))}
                {todayTotalCount > 3 && (
                  <li className="ph-reminder-item ph-reminder-item--more">
                    +{todayTotalCount - 3} more
                  </li>
                )}
              </ul>
            )}

            <button
              id="btn-view-reminders"
              className="ph-btn ph-btn--teal"
              onClick={() => navigate('patient-reminders')}
            >
              {t('home.reminders.btn')}
            </button>
          </article>

        </main>

        {/* ── BOTTOM NAVIGATION ────────────────────────────── */}
        <nav className="ph-nav" aria-label="Main navigation">
          <button
            id="nav-home"
            className="ph-nav__btn ph-nav__btn--active"
            aria-current="page"
            aria-label="Home"
            onClick={() => navigate('patient-home')}
          >
            <span className="ph-nav__icon" aria-hidden="true">🏠</span>
            <span className="ph-nav__label">Home</span>
          </button>

          <button
            id="nav-activities"
            className="ph-nav__btn"
            aria-label="Activities"
            onClick={() => navigate('patient-activities')}
          >
            <span className="ph-nav__icon" aria-hidden="true">🧠</span>
            <span className="ph-nav__label">Activities</span>
          </button>

          <button
            id="nav-memories"
            className="ph-nav__btn"
            aria-label="Memories"
            onClick={() => navigate('patient-memories')}
          >
            <span className="ph-nav__icon" aria-hidden="true">❤️</span>
            <span className="ph-nav__label">Memories</span>
          </button>

          <button
            id="nav-reminders"
            className="ph-nav__btn"
            aria-label="Reminders"
            onClick={() => navigate('patient-reminders')}
          >
            <span className="ph-nav__icon" aria-hidden="true">⏰</span>
            <span className="ph-nav__label">Reminders</span>
          </button>
        </nav>

      </div>
    </CulturalBackground>
  );
}

export default PatientHome;
