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

function PatientHome({ navigate }) {
  /* Load real reminders from shared storage */
  const allReminders    = loadReminders();
  const dailyCompletions = loadDailyCompletions();

  /* Only show today's pending reminders in the summary card */
  const todayPendingReminders = allReminders
    .filter((r) => isReminderToday(r) && !isReminderDoneToday(r, dailyCompletions))
    .slice(0, 3); // cap at 3 for the summary preview

  const todayTotalCount = allReminders.filter((r) => isReminderToday(r)).length;

  return (
    <div className="ph-screen">

      {/* ── GREETING HEADER ──────────────────────────────── */}
      <header className="ph-greeting" aria-label="Greeting">
        {/* Back to Smriti Home button */}
        <button
          className="ph-header-back-btn"
          onClick={() => navigate('landing')}
          aria-label="Return to Smriti Home"
        >
          ← Smriti Home
        </button>

        <p className="ph-greeting__name">Good Morning, Mrs. Das ❤️</p>
        <p className="ph-greeting__sub">Let's make today a good day.</p>
      </header>

      {/* ── MAIN CARD AREA ───────────────────────────────── */}
      <main className="ph-content">

        {/* CARD 1 — TODAY'S ACTIVITY */}
        <article className="ph-card ph-card--activity">
          <div className="ph-card__header">
            <span className="ph-card__emoji" aria-hidden="true">🧠</span>
            <span className="ph-card__tag">TODAY'S ACTIVITY</span>
          </div>
          <h2 className="ph-card__title">Remember the Objects</h2>
          <p className="ph-card__desc">A short memory activity for today.</p>
          <button
            id="btn-start-activity"
            className="ph-btn ph-btn--warm"
            onClick={() => navigate('patient-activity')}
          >
            ▶&nbsp; Start Activity
          </button>
        </article>

        {/* CARD 2 — MY MEMORIES */}
        <article className="ph-card ph-card--memories">
          <div className="ph-card__header">
            <span className="ph-card__emoji" aria-hidden="true">❤️</span>
            <span className="ph-card__tag">MY MEMORIES</span>
          </div>
          <h2 className="ph-card__title">My Memories</h2>
          <p className="ph-card__desc">
            People, places and moments that matter.
          </p>
          <button
            id="btn-open-memories"
            className="ph-btn ph-btn--rose"
            onClick={() => navigate('patient-memories')}
          >
            📖&nbsp; Open Memories
          </button>
        </article>

        {/* CARD 3 — TODAY'S REMINDERS (real data from smriti_reminders) */}
        <article className="ph-card ph-card--reminders">
          <div className="ph-card__header">
            <span className="ph-card__emoji" aria-hidden="true">⏰</span>
            <span className="ph-card__tag">TODAY'S REMINDERS</span>
          </div>
          <h2 className="ph-card__title">Today's Reminders</h2>

          {todayTotalCount === 0 ? (
            /* No reminders at all today */
            <p className="ph-reminder-empty">No reminders for today.</p>
          ) : todayPendingReminders.length === 0 ? (
            /* All done! */
            <p className="ph-reminder-empty">✅ All done for today!</p>
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
            ⏰&nbsp; See All Reminders
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
  );
}

export default PatientHome;
