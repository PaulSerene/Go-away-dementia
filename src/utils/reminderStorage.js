/**
 * reminderStorage.js — Shared reminder localStorage helpers.
 *
 * Imported by both CaregiverReminders.jsx and PatientReminders.jsx.
 * One storage key, one dataset — both views stay in sync.
 *
 * localStorage key: smriti_reminders
 * Each reminder: { id, title, description, date, time, category, completed, createdAt }
 */

export const REMINDERS_KEY = 'smriti_reminders';

export const REMINDER_CATEGORIES = ['Daily', 'Health', 'Appointments', 'Family', 'Other'];

export const CATEGORY_EMOJI = {
  Daily:        '📅',
  Health:       '💊',
  Appointments: '🏥',
  Family:       '👨‍👩‍👧',
  Other:        '📝',
};

/**
 * Load reminders from localStorage.
 * - Key absent  → return []   (no sample seeding for reminders)
 * - Corrupt     → return []   (fail silently)
 * - Valid       → return parsed array
 */
export function loadReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist the full updated reminders array.
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

/**
 * Returns today's date as 'YYYY-MM-DD' string in local time.
 * Used to identify "today's reminders".
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
