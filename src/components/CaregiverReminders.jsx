/**
 * CaregiverReminders.jsx — Caregiver Reminder Management screen.
 *
 * Caregivers can: view all reminders, add, edit, delete,
 * and toggle completion status.
 *
 * Supports two reminder types:
 *   "daily"    — repeats every day; completion tracked per-day in
 *                smriti_daily_completions (never permanently done)
 *   "specific" — has a fixed date; completion is permanent via reminder.completed
 *
 * All data lives in smriti_reminders (localStorage).
 * PatientReminders reads the same key — no duplication.
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import { useState, useEffect } from 'react';
import { reminders as remindersApi } from '../utils/api.js';
import { getOrCreatePatientId, getCachedPatientId } from '../utils/identity.js';
import { enqueue } from '../utils/syncQueue.js';
import {
  loadReminders,
  saveReminders,
  loadDailyCompletions,
  saveDailyCompletions,
  toggleDailyCompletion,
  generateReminderId,
  REMINDER_CATEGORIES,
  CATEGORY_EMOJI,
  todayStr,
  isReminderToday,
  isReminderDoneToday,
} from '../utils/reminderStorage';
import { useLanguage, LOCALE_BCP47 } from '../locales/index.js';
import './CaregiverReminders.css';

/* ----------------------------------------------------------------
   EMPTY FORM STATE
---------------------------------------------------------------- */
const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'daily',      // "daily" | "specific"
  date: '',
  time: '',
  category: 'Daily',
};

const DEMO_PATIENT = { name: "Mrs. Das" };

/* ----------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
function formatDisplayDate(dateStr, bcp47) {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(bcp47 || 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

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

/* ----------------------------------------------------------------
   ADD/EDIT FORM COMPONENT
---------------------------------------------------------------- */
function ReminderForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // When switching to daily, clear date
      if (field === 'type' && value === 'daily') {
        updated.date = '';
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())                       errs.title    = 'Please enter a reminder title.';
    if (form.type === 'specific' && !form.date)   errs.date     = 'Please select a date.';
    if (!form.time)                               errs.time     = 'Please select a time.';
    if (!form.category)                           errs.category = 'Please select a category.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  }

  const isDaily = form.type === 'daily';

  // Helper to translate categories
  const getCategoryLabel = (cat) => {
    const key = `caregiver.reminders.category.${cat.toLowerCase()}`;
    const trans = t(key);
    return trans !== key ? trans : cat;
  };

  return (
    <div className="cgrm-overlay" role="dialog" aria-modal="true" aria-label="Reminder form">
      <div className="cgrm-form-card">
        <h2 className="cgrm-form-title">{initial ? t('caregiverRem.form.save').replace('Save', 'Edit') : t('caregiverRem.add')}</h2>
        <form onSubmit={handleSubmit} noValidate>

          {/* Reminder type selector */}
          <div className="cgrm-field">
            <p className="cgrm-label">Reminder type <span className="cgrm-required" aria-hidden="true">*</span></p>
            <div className="cgrm-type-selector" role="group" aria-label="Reminder type">
              <label className={'cgrm-type-option' + (isDaily ? ' cgrm-type-option--selected' : '')}>
                <input
                  type="radio"
                  name="cgrm-type"
                  value="daily"
                  checked={isDaily}
                  onChange={() => handleChange('type', 'daily')}
                  className="cgrm-radio"
                />
                <span className="cgrm-type-option__icon">🔁</span>
                <span className="cgrm-type-option__text">{t('reminders.everyDay')}</span>
              </label>
              <label className={'cgrm-type-option' + (!isDaily ? ' cgrm-type-option--selected' : '')}>
                <input
                  type="radio"
                  name="cgrm-type"
                  value="specific"
                  checked={!isDaily}
                  onChange={() => handleChange('type', 'specific')}
                  className="cgrm-radio"
                />
                <span className="cgrm-type-option__icon">📅</span>
                <span className="cgrm-type-option__text">Specific date</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="cgrm-field">
            <label className="cgrm-label" htmlFor="cgrm-title">
              {t('caregiverRem.form.text')} <span className="cgrm-required" aria-hidden="true">*</span>
            </label>
            <input
              id="cgrm-title"
              className={'cgrm-input' + (errors.title ? ' cgrm-input--error' : '')}
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Take morning medicine"
              maxLength={80}
              autoFocus
            />
            {errors.title && <p className="cgrm-error">{errors.title}</p>}
          </div>

          {/* Description (optional) */}
          <div className="cgrm-field">
            <label className="cgrm-label" htmlFor="cgrm-desc">
              Description <span className="cgrm-optional">(optional)</span>
            </label>
            <textarea
              id="cgrm-desc"
              className="cgrm-input cgrm-textarea"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="..."
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Date (only for specific) + Time row */}
          <div className="cgrm-field-row">
            {!isDaily && (
              <div className="cgrm-field">
                <label className="cgrm-label" htmlFor="cgrm-date">
                  Date <span className="cgrm-required" aria-hidden="true">*</span>
                </label>
                <input
                  id="cgrm-date"
                  className={'cgrm-input' + (errors.date ? ' cgrm-input--error' : '')}
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && <p className="cgrm-error">{errors.date}</p>}
              </div>
            )}

            <div className="cgrm-field">
              <label className="cgrm-label" htmlFor="cgrm-time">
                {t('caregiverRem.form.time')} <span className="cgrm-required" aria-hidden="true">*</span>
              </label>
              <input
                id="cgrm-time"
                className={'cgrm-input' + (errors.time ? ' cgrm-input--error' : '')}
                type="time"
                value={form.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
              {errors.time && <p className="cgrm-error">{errors.time}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="cgrm-field">
            <label className="cgrm-label" htmlFor="cgrm-category">
              {t('caregiverRem.form.category')} <span className="cgrm-required" aria-hidden="true">*</span>
            </label>
            <select
              id="cgrm-category"
              className={'cgrm-input cgrm-select' + (errors.category ? ' cgrm-input--error' : '')}
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {REMINDER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_EMOJI[cat]} {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
            {errors.category && <p className="cgrm-error">{errors.category}</p>}
          </div>

          {/* Actions */}
          <div className="cgrm-form-actions">
            <button type="button" className="cgrm-btn cgrm-btn--secondary" onClick={onCancel}>
              {t('caregiverRem.form.cancel')}
            </button>
            <button type="submit" className="cgrm-btn cgrm-btn--primary">
              {initial ? t('caregiverRem.form.update') : t('caregiverRem.form.save')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   DELETE CONFIRMATION
---------------------------------------------------------------- */
function DeleteConfirm({ reminder, onConfirm, onCancel, t }) {
  return (
    <div className="cgrm-overlay" role="dialog" aria-modal="true" aria-label={t('caregiverRem.deleteConfirm.aria')}>
      <div className="cgrm-confirm-card">
        <p className="cgrm-confirm-emoji" aria-hidden="true">🗑️</p>
        <h2 className="cgrm-confirm-title">{t('caregiverRem.deleteConfirm.title')}</h2>
        <p className="cgrm-confirm-name">"{reminder.title}"</p>
        <p className="cgrm-confirm-msg">{t('confirm.irreversible')}</p>
        <div className="cgrm-form-actions">
          <button className="cgrm-btn cgrm-btn--secondary" onClick={onCancel}>{t('caregiverRem.form.cancel')}</button>
          <button className="cgrm-btn cgrm-btn--danger" onClick={onConfirm}>{t('caregiverRem.delete')}</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   REMINDER CARD (Caregiver view)
---------------------------------------------------------------- */
function ReminderCard({ reminder, isDoneToday, onEdit, onDelete, onToggleComplete, t, bcp47 }) {
  const emoji    = CATEGORY_EMOJI[reminder.category] ?? '📝';
  const isDaily  = reminder.type === 'daily';
  const isToday  = isReminderToday(reminder);

  const getCategoryLabel = (cat) => {
    const key = `caregiver.reminders.category.${cat.toLowerCase()}`;
    const trans = t(key);
    return trans !== key ? trans : cat;
  };

  return (
    <article
      className={
        'cgrm-card' +
        (isDoneToday ? ' cgrm-card--done' : '') +
        (isToday && !isDaily ? ' cgrm-card--today' : '') +
        (isDaily ? ' cgrm-card--daily' : '')
      }
      aria-label={'Reminder: ' + reminder.title}
    >
      <div className="cgrm-card__top">
        <div className="cgrm-card__meta">
          <span className="cgrm-card__category">
            <span aria-hidden="true">{emoji}</span> {getCategoryLabel(reminder.category)}
          </span>
          {isDaily   && <span className="cgrm-daily-badge">🔁 {t('reminders.everyDay')}</span>}
          {!isDaily && isToday && <span className="cgrm-today-badge">{t('reminders.today')}</span>}
          {isDoneToday && <span className="cgrm-done-badge">{t('reminders.done')}</span>}
        </div>

        <button
          className={'cgrm-complete-btn' + (isDoneToday ? ' cgrm-complete-btn--done' : '')}
          onClick={() => onToggleComplete(reminder)}
          aria-pressed={isDoneToday}
          aria-label={isDoneToday ? 'Mark as pending' : 'Mark as completed'}
        >
          {isDoneToday ? '✅' : '⭕'}
        </button>
      </div>

      <h3 className={'cgrm-card__title' + (isDoneToday ? ' cgrm-card__title--done' : '')}>
        {reminder.title}
      </h3>

      {reminder.description && (
        <p className="cgrm-card__desc">{reminder.description}</p>
      )}

      <div className="cgrm-card__datetime">
        {isDaily
          ? <span>⏰ {t('reminders.everyDay')} {t('caregiverRem.form.time').toLowerCase()} {formatDisplayTime(reminder.time, bcp47)}</span>
          : (
            <>
              <span>📅 {formatDisplayDate(reminder.date, bcp47)}</span>
              {reminder.time && <span>⏰ {formatDisplayTime(reminder.time, bcp47)}</span>}
            </>
          )
        }
      </div>

      {isDaily && isDoneToday && (
        <p className="cgrm-card__reset-note">{t('reminders.resetNote')}</p>
      )}

      <div className="cgrm-card__actions">
        <button
          className="cgrm-action-btn cgrm-action-btn--edit"
          onClick={() => onEdit(reminder)}
          aria-label={'Edit: ' + reminder.title}
        >
          ✏️ Edit
        </button>
        <button
          className="cgrm-action-btn cgrm-action-btn--delete"
          onClick={() => onDelete(reminder)}
          aria-label={'Delete: ' + reminder.title}
        >
          🗑️ {t('caregiverRem.delete')}
        </button>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------------- */
function CaregiverReminders({ navigate }) {
  const { t, lang } = useLanguage();
  const bcp47 = LOCALE_BCP47[lang] || 'en-IN';

  const [reminders, setReminders]               = useState(() => loadReminders());
  const [dailyCompletions, setDailyCompletions] = useState(() => loadDailyCompletions());
  const [showForm, setShowForm]                 = useState(false);
  const [editingReminder, setEditingReminder]   = useState(null);
  const [deletingReminder, setDeletingReminder] = useState(null);

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

      // Only build lookup from records that actually have a server id
      const localByDbId = Object.fromEntries(
        localRems
          .filter((r) => r._dbId)
          .map((r) => [r._dbId, r])
      );

      const fromDb = data.reminders.map((dbRem) => ({
        ...(localByDbId[dbRem.id] ?? {}),
        _dbId:       dbRem.id,
        id:          localByDbId[dbRem.id]?.id ?? generateReminderId(),
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

  /* ---- Sort: daily first, then specific by date, then by time ---- */
  const sorted = [...reminders].sort((a, b) => {
    // daily always floats to the top
    if (a.type !== b.type) return a.type === 'daily' ? -1 : 1;
    // for specifics: today first, then future
    if (a.date !== b.date) {
      const aToday = a.date === today ? 0 : a.date > today ? 1 : 2;
      const bToday = b.date === today ? 0 : b.date > today ? 1 : 2;
      if (aToday !== bToday) return aToday - bToday;
      return a.date.localeCompare(b.date);
    }
    return (a.time || '').localeCompare(b.time || '');
  });

  function persistReminders(updated) {
    setReminders(updated);
    saveReminders(updated);
  }

  /* ---- ADD ---- */
  function handleAddClick() {
    setEditingReminder(null);
    setShowForm(true);
  }

  /* ---- SAVE (add or edit) ---- */
  async function handleSave(formData) {
    const patientId = getCachedPatientId();

    if (editingReminder) {
      const updated = reminders.map((r) =>
        r.id === editingReminder.id
          ? {
              ...r,
              title:       formData.title.trim(),
              description: formData.description.trim(),
              type:        formData.type,
              date:        formData.type === 'daily' ? null : formData.date,
              time:        formData.time,
              category:    formData.category,
            }
          : r
      );
      persistReminders(updated);

      // Backend sync — enqueue on failure
      if (editingReminder._dbId) {
        const updatePayload = {
          title:       formData.title.trim(),
          description: formData.description.trim(),
          type:        formData.type,
          date_on:     formData.type === 'daily' ? null : formData.date,
          time_at:     formData.time || null,
          category:    formData.category,
        };
        const { error } = await remindersApi.update(editingReminder._dbId, updatePayload);
        if (error) {
          enqueue('update_reminder', { dbId: editingReminder._dbId, ...updatePayload });
        }
      }
    } else {
      const newRem = {
        id:          generateReminderId(),
        title:       formData.title.trim(),
        description: formData.description.trim(),
        type:        formData.type,
        date:        formData.type === 'daily' ? null : formData.date,
        time:        formData.time,
        category:    formData.category,
        completed:   false,
        createdAt:   new Date().toISOString(),
      };
      persistReminders([...reminders, newRem]);

      const createPayload = {
        patient_id:  patientId,
        title:       newRem.title,
        description: newRem.description,
        type:        newRem.type,
        date_on:     newRem.date || null,
        time_at:     newRem.time || null,
        category:    newRem.category,
      };

      if (patientId) {
        const { data, error } = await remindersApi.create(createPayload);
        if (error) {
          enqueue('create_reminder', createPayload, newRem.id);
        } else if (data?.reminder?.id) {
          setReminders((prev) => {
            const tagged = prev.map((r) =>
              r.id === newRem.id ? { ...r, _dbId: data.reminder.id } : r
            );
            saveReminders(tagged);
            return tagged;
          });
        }
      } else {
        enqueue('create_reminder', createPayload, newRem.id);
      }
    }
    setShowForm(false);
    setEditingReminder(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingReminder(null);
  }

  /* ---- EDIT ---- */
  function handleEdit(reminder) {
    setEditingReminder(reminder);
    setShowForm(true);
  }

  /* ---- DELETE ---- */
  function handleDeleteClick(reminder) {
    setDeletingReminder(reminder);
  }

  function handleDeleteConfirm() {
    const target = deletingReminder;
    persistReminders(reminders.filter((r) => r.id !== target.id));

    // Backend delete — enqueue on failure
    if (target._dbId) {
      remindersApi.remove(target._dbId).then(({ error }) => {
        if (error) {
          enqueue('delete_reminder', { dbId: target._dbId });
        }
      });
    }
    // If no _dbId, record was never synced — nothing to delete on server

    setDeletingReminder(null);
  }

  function handleDeleteCancel() {
    setDeletingReminder(null);
  }

  /* ---- TOGGLE COMPLETE ---- */
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
      // If no _dbId: reminder not yet synced to server. The completion is
      // stored locally in smriti_daily_completions. When the reminder
      // eventually syncs (create_reminder), the patient's local state
      // is the source of truth for daily completion — no server action needed.
    } else {
      persistReminders(reminders.map((r) =>
        r.id === reminder.id ? { ...r, completed: !r.completed } : r
      ));

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

  /* ---- Stats for header pills ---- */
  const todayCount     = reminders.filter((r) =>
    isReminderToday(r) && !isReminderDoneToday(r, dailyCompletions)
  ).length;
  const pendingCount   = reminders.filter((r) => !isReminderDoneToday(r, dailyCompletions)).length;
  const completedCount = reminders.filter((r) => isReminderDoneToday(r, dailyCompletions)).length;

  /* ---- Form initial values for edit ---- */
  const formInitial = editingReminder
    ? {
        title:       editingReminder.title,
        description: editingReminder.description ?? '',
        type:        editingReminder.type ?? 'specific',
        date:        editingReminder.date ?? '',
        time:        editingReminder.time,
        category:    editingReminder.category,
      }
    : null;

  return (
    <div className="cgrm-screen">

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="cgrm-header" aria-label={t('caregiverRem.heading')}>
        <button
          className="cgrm-header-back-btn"
          onClick={() => navigate('caregiver-dashboard')}
          aria-label={t('nav.back')}
        >
          {t('caregiver.nav.dashboard') ? `← ${t('caregiver.nav.dashboard')}` : `← Dashboard`}
        </button>
        <div className="cgrm-header__titles">
          <p className="cgrm-header__title">{t('caregiverRem.heading')} ⏰</p>
          <p className="cgrm-header__subtitle">
            {t('caregiverRem.sub', { name: DEMO_PATIENT.name })}
          </p>
        </div>
      </header>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <main className="cgrm-content">

        {/* Stats row */}
        <div className="cgrm-stats-row">
          <div className="cgrm-stat-pill cgrm-stat-pill--gold">
            <span className="cgrm-stat-pill__val">{todayCount}</span>
            <span className="cgrm-stat-pill__lbl">{t('reminders.today')}</span>
          </div>
          <div className="cgrm-stat-pill cgrm-stat-pill--teal">
            <span className="cgrm-stat-pill__val">{pendingCount}</span>
            <span className="cgrm-stat-pill__lbl">{t('reminders.title')}</span>
          </div>
          <div className="cgrm-stat-pill cgrm-stat-pill--green">
            <span className="cgrm-stat-pill__val">{completedCount}</span>
            <span className="cgrm-stat-pill__lbl">{t('reminders.done')}</span>
          </div>
        </div>

        {/* Top bar */}
        <div className="cgrm-top-bar">
          <p className="cgrm-count">
            {reminders.length > 0
              ? t('memories.count.many', { count: reminders.length })
              : t('caregiverRem.empty')}
          </p>
          <button
            id="cgrm-btn-add"
            className="cgrm-btn cgrm-btn--primary cgrm-btn--add"
            onClick={handleAddClick}
          >
            {t('caregiverRem.add')}
          </button>
        </div>

        {/* Empty state */}
        {reminders.length === 0 && (
          <div className="cgrm-empty">
            <span className="cgrm-empty__emoji" aria-hidden="true">⏰</span>
            <p className="cgrm-empty__msg">{t('caregiverRem.empty')}</p>
            <p className="cgrm-empty__hint">
              Add a reminder to help keep important things on track.
            </p>
            <button className="cgrm-btn cgrm-btn--primary" onClick={handleAddClick}>
              {t('caregiverRem.add')}
            </button>
          </div>
        )}

        {/* Reminder list */}
        {sorted.length > 0 && (
          <ul className="cgrm-list" role="list">
            {sorted.map((rem) => (
              <li key={rem.id} className="cgrm-list-item">
                <ReminderCard
                  reminder={rem}
                  isDoneToday={isReminderDoneToday(rem, dailyCompletions)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleComplete={handleToggleComplete}
                  t={t}
                  bcp47={bcp47}
                />
              </li>
            ))}
          </ul>
        )}

      </main>

      {/* ── OVERLAYS ────────────────────────────────────── */}
      {showForm && (
        <ReminderForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={handleCancel}
          t={t}
        />
      )}

      {deletingReminder && (
        <DeleteConfirm
          reminder={deletingReminder}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          t={t}
        />
      )}

    </div>
  );
}

export default CaregiverReminders;
