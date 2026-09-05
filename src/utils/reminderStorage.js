/**
 * reminderStorage.js — Shared reminder localStorage helpers.
 *
 * Imported by CaregiverReminders.jsx, PatientReminders.jsx, PatientHome.jsx.
 * ONE storage key (smriti_reminders), ONE completions key (smriti_daily_completions).
 *
 * Reminder shape (v2):
 *   {
 *     id,
 *     title,
 *     description,
 *     type: "daily" | "specific",
 *     date: null | "YYYY-MM-DD",   // null for daily, date string for specific
 *     time,
 *     category,
 *     completed,                   // for "specific" reminders — permanent completion flag
 *     createdAt
 *   }
 *
 * Daily completion (per-day, never permanent):
 *   smriti_daily_completions: { "<reminderId>": ["YYYY-MM-DD", ...] }
 *
 * Backward compat: old reminders with no `type` field are treated as "specific".
 */

export const REMINDERS_KEY          = 'smriti_reminders';
export const DAILY_COMPLETIONS_KEY  = 'smriti_daily_completions';

export const REMINDER_CATEGORIES = ['Daily', 'Health', 'Appointments', 'Family', 'Other'];

export const CATEGORY_EMOJI = {
  Daily:        '📅',
  Health:       '💊',
  Appointments: '🏥',
  Family:       '👨‍👩‍👧',
  Other:        '📝',
};

/* ================================================================
   DATE HELPERS
   ================================================================ */

/**
 * Returns today's local date as 'YYYY-MM-DD'.
 * Uses local time — no UTC conversion bugs.
 */
export function todayStr() {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

/* ================================================================
   REMINDER STORAGE
   ================================================================ */

/**
 * Load reminders from localStorage.
 * - Key absent  → []   (no seeding — zero means zero)
 * - Corrupt     → []   (fail silently, never crash)
 * - Valid       → parsed array with missing `type` field normalised to "specific"
 */
export function loadReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Normalize old records: missing `type` → treat as "specific"
    return parsed.map((r) => ({
      ...r,
      type: r.type === 'daily' ? 'daily' : 'specific',
    }));
  } catch {
    return [];
  }
}

/**
 * Persist the full reminders array.
 * Fails silently on quota errors.
 */
export function saveReminders(reminders) {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch {
    console.warn('Smriti: could not save reminders to localStorage.');
  }
}

/** Generate a unique reminder ID. */
export function generateReminderId() {
  return 'rem-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
}

/* ================================================================
   DAILY COMPLETION TRACKING
   Per-day, per-reminder — daily reminders reset automatically each day.
   ================================================================ */

/**
 * Load the daily completions map.
 * Shape: { "<reminderId>": ["2026-09-05", "2026-09-06", ...] }
 */
export function loadDailyCompletions() {
  try {
    const raw = localStorage.getItem(DAILY_COMPLETIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Persist the daily completions map.
 */
export function saveDailyCompletions(completions) {
  try {
    localStorage.setItem(DAILY_COMPLETIONS_KEY, JSON.stringify(completions));
  } catch {
    console.warn('Smriti: could not save daily completions to localStorage.');
  }
}

/**
 * Check whether a daily reminder is completed for a specific date.
 * @param {object} completions - the completions map from loadDailyCompletions()
 * @param {string} reminderId
 * @param {string} dateStr - 'YYYY-MM-DD'
 */
export function isDailyCompletedOn(completions, reminderId, dateStr) {
  const dates = completions[reminderId];
  if (!Array.isArray(dates)) return false;
  return dates.includes(dateStr);
}

/**
 * Toggle daily completion for a reminder on a specific date.
 * Returns a new completions map (does not mutate input).
 */
export function toggleDailyCompletion(completions, reminderId, dateStr) {
  const dates = Array.isArray(completions[reminderId]) ? completions[reminderId] : [];
  const already = dates.includes(dateStr);
  const updated = already ? dates.filter((d) => d !== dateStr) : [...dates, dateStr];
  return { ...completions, [reminderId]: updated };
}

/* ================================================================
   FILTERING HELPERS (shared between Patient and Caregiver)
   ================================================================ */

/**
 * Returns true if a reminder qualifies as "today".
 * - daily reminders: always true
 * - specific reminders: only when their date === today
 */
export function isReminderToday(reminder) {
  if (reminder.type === 'daily') return true;
  return reminder.date === todayStr();
}

/**
 * Returns true if a specific-date reminder is in the future (not today, not past).
 */
export function isReminderUpcoming(reminder) {
  if (reminder.type === 'daily') return false; // daily reminders are always "today"
  return !!reminder.date && reminder.date > todayStr();
}

/**
 * Returns the effective completed state of a reminder for today.
 * - specific: use reminder.completed
 * - daily: check dailyCompletions for today
 */
export function isReminderDoneToday(reminder, dailyCompletions) {
  if (reminder.type === 'daily') {
    return isDailyCompletedOn(dailyCompletions, reminder.id, todayStr());
  }
  return !!reminder.completed;
}
