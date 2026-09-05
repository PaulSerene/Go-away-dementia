/**
 * CaregiverReminders.jsx — Caregiver Reminder Management screen.
 *
 * Caregivers can: view all reminders, add, edit, delete,
 * and toggle completion status.
 *
 * All data lives in smriti_reminders (localStorage).
 * PatientReminders reads the same key — no duplication.
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import { useState } from 'react';
import {
  loadReminders,
  saveReminders,
  generateReminderId,
  REMINDER_CATEGORIES,
  CATEGORY_EMOJI,
  todayStr,
} from '../utils/reminderStorage';
import './CaregiverReminders.css';

/* ----------------------------------------------------------------
   EMPTY FORM STATE
---------------------------------------------------------------- */
const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  category: 'Daily',
};

/* ----------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
function isToday(dateStr) {
  return dateStr === todayStr();
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    // dateStr is YYYY-MM-DD
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/* ----------------------------------------------------------------
   ADD/EDIT FORM COMPONENT
---------------------------------------------------------------- */
function ReminderForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())    errs.title    = 'Please enter a reminder title.';
    if (!form.date)            errs.date     = 'Please select a date.';
    if (!form.time)            errs.time     = 'Please select a time.';
    if (!form.category)        errs.category = 'Please select a category.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  }

  return (
    <div className="cgrm-overlay" role="dialog" aria-modal="true" aria-label="Reminder form">
      <div className="cgrm-form-card">
        <h2 className="cgrm-form-title">{initial ? 'Edit Reminder' : 'Add Reminder'}</h2>
        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="cgrm-field">
            <label className="cgrm-label" htmlFor="cgrm-title">
              Title <span className="cgrm-required" aria-hidden="true">*</span>
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
              placeholder="Any extra details..."
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Date + Time row */}
          <div className="cgrm-field-row">
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

            <div className="cgrm-field">
              <label className="cgrm-label" htmlFor="cgrm-time">
                Time <span className="cgrm-required" aria-hidden="true">*</span>
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
              Category <span className="cgrm-required" aria-hidden="true">*</span>
            </label>
            <select
              id="cgrm-category"
              className={'cgrm-input cgrm-select' + (errors.category ? ' cgrm-input--error' : '')}
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {REMINDER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_EMOJI[cat]} {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="cgrm-error">{errors.category}</p>}
          </div>

          {/* Actions */}
          <div className="cgrm-form-actions">
            <button type="button" className="cgrm-btn cgrm-btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="cgrm-btn cgrm-btn--primary">
              {initial ? 'Save Changes' : 'Save Reminder'}
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
function DeleteConfirm({ reminder, onConfirm, onCancel }) {
  return (
    <div className="cgrm-overlay" role="dialog" aria-modal="true" aria-label="Delete confirmation">
      <div className="cgrm-confirm-card">
        <p className="cgrm-confirm-emoji" aria-hidden="true">🗑️</p>
        <h2 className="cgrm-confirm-title">Delete this reminder?</h2>
        <p className="cgrm-confirm-name">"{reminder.title}"</p>
        <p className="cgrm-confirm-msg">This cannot be undone.</p>
        <div className="cgrm-form-actions">
          <button className="cgrm-btn cgrm-btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="cgrm-btn cgrm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   REMINDER CARD (Caregiver view)
---------------------------------------------------------------- */
function ReminderCard({ reminder, onEdit, onDelete, onToggleComplete }) {
  const emoji = CATEGORY_EMOJI[reminder.category] ?? '📝';
  const today = isToday(reminder.date);

  return (
    <article
      className={'cgrm-card' + (reminder.completed ? ' cgrm-card--done' : '') + (today ? ' cgrm-card--today' : '')}
      aria-label={'Reminder: ' + reminder.title}
    >
      <div className="cgrm-card__top">
        <div className="cgrm-card__meta">
          <span className="cgrm-card__category">
            <span aria-hidden="true">{emoji}</span> {reminder.category}
          </span>
          {today && <span className="cgrm-today-badge">Today</span>}
          {reminder.completed && <span className="cgrm-done-badge">✅ Done</span>}
        </div>

        <button
          className={'cgrm-complete-btn' + (reminder.completed ? ' cgrm-complete-btn--done' : '')}
          onClick={() => onToggleComplete(reminder.id)}
          aria-pressed={reminder.completed}
          aria-label={reminder.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {reminder.completed ? '✅' : '⭕'}
        </button>
      </div>

      <h3 className={'cgrm-card__title' + (reminder.completed ? ' cgrm-card__title--done' : '')}>
        {reminder.title}
      </h3>

      {reminder.description && (
        <p className="cgrm-card__desc">{reminder.description}</p>
      )}

      <div className="cgrm-card__datetime">
        <span>📅 {formatDisplayDate(reminder.date)}</span>
        {reminder.time && <span>⏰ {reminder.time}</span>}
      </div>

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
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------------- */
function CaregiverReminders({ navigate }) {
  const [reminders, setReminders]         = useState(() => loadReminders());
  const [showForm, setShowForm]           = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [deletingReminder, setDeletingReminder] = useState(null);

  /* ---- sort: today first, then by date, then by time ---- */
  const sorted = [...reminders].sort((a, b) => {
    const today = todayStr();
    const aToday = a.date === today ? 0 : 1;
    const bToday = b.date === today ? 0 : 1;
    if (aToday !== bToday) return aToday - bToday;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time || '').localeCompare(b.time || '');
  });

  function persist(updated) {
    setReminders(updated);
    saveReminders(updated);
  }

  /* ---- ADD ---- */
  function handleAddClick() {
    setEditingReminder(null);
    setShowForm(true);
  }

  /* ---- SAVE (add or edit) ---- */
  function handleSave(formData) {
    if (editingReminder) {
      const updated = reminders.map((r) =>
        r.id === editingReminder.id
          ? {
              ...r,
              title:       formData.title.trim(),
              description: formData.description.trim(),
              date:        formData.date,
              time:        formData.time,
              category:    formData.category,
            }
          : r
      );
      persist(updated);
    } else {
      const newRem = {
        id:          generateReminderId(),
        title:       formData.title.trim(),
        description: formData.description.trim(),
        date:        formData.date,
        time:        formData.time,
        category:    formData.category,
        completed:   false,
        createdAt:   new Date().toISOString(),
      };
      persist([...reminders, newRem]);
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
    persist(reminders.filter((r) => r.id !== deletingReminder.id));
    setDeletingReminder(null);
  }

  function handleDeleteCancel() {
    setDeletingReminder(null);
  }

  /* ---- TOGGLE COMPLETE ---- */
  function handleToggleComplete(id) {
    persist(reminders.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  }

  /* ---- formInitial for edit mode ---- */
  const formInitial = editingReminder
    ? {
        title:       editingReminder.title,
        description: editingReminder.description ?? '',
        date:        editingReminder.date,
        time:        editingReminder.time,
        category:    editingReminder.category,
      }
    : null;

  const todayCount    = reminders.filter((r) => !r.completed && isToday(r.date)).length;
  const pendingCount  = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  return (
    <div className="cgrm-screen">

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="cgrm-header" aria-label="Manage Reminders header">
        <button
          className="cgrm-header-back-btn"
          onClick={() => navigate('caregiver-dashboard')}
          aria-label="Back to Dashboard"
        >
          ← Dashboard
        </button>
        <div className="cgrm-header__titles">
          <p className="cgrm-header__title">Reminders ⏰</p>
          <p className="cgrm-header__subtitle">
            Keep track of important things for Mrs. Das.
          </p>
        </div>
      </header>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <main className="cgrm-content">

        {/* Stats row */}
        <div className="cgrm-stats-row">
          <div className="cgrm-stat-pill cgrm-stat-pill--gold">
            <span className="cgrm-stat-pill__val">{todayCount}</span>
            <span className="cgrm-stat-pill__lbl">Today Pending</span>
          </div>
          <div className="cgrm-stat-pill cgrm-stat-pill--teal">
            <span className="cgrm-stat-pill__val">{pendingCount}</span>
            <span className="cgrm-stat-pill__lbl">Total Pending</span>
          </div>
          <div className="cgrm-stat-pill cgrm-stat-pill--green">
            <span className="cgrm-stat-pill__val">{completedCount}</span>
            <span className="cgrm-stat-pill__lbl">Completed</span>
          </div>
        </div>

        {/* Top bar */}
        <div className="cgrm-top-bar">
          <p className="cgrm-count">
            {reminders.length > 0
              ? reminders.length + ' reminder' + (reminders.length === 1 ? '' : 's')
              : 'No reminders yet'}
          </p>
          <button
            id="cgrm-btn-add"
            className="cgrm-btn cgrm-btn--primary cgrm-btn--add"
            onClick={handleAddClick}
          >
            + Add Reminder
          </button>
        </div>

        {/* Empty state */}
        {reminders.length === 0 && (
          <div className="cgrm-empty">
            <span className="cgrm-empty__emoji" aria-hidden="true">⏰</span>
            <p className="cgrm-empty__msg">No reminders yet.</p>
            <p className="cgrm-empty__hint">
              Add a reminder to help keep important things on track.
            </p>
            <button className="cgrm-btn cgrm-btn--primary" onClick={handleAddClick}>
              + Add Reminder
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
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleComplete={handleToggleComplete}
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
        />
      )}

      {deletingReminder && (
        <DeleteConfirm
          reminder={deletingReminder}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

    </div>
  );
}

export default CaregiverReminders;
