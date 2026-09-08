/**
 * CaregiverMemories.jsx - Caregiver Memory Management screen.
 *
 * Allows the caregiver to view, add, edit, favourite/unfavourite,
 * and delete memories stored in smriti_memories.
 *
 * This is the SAME data that PatientMemories reads.
 * No second storage key is ever created here.
 *
 * Memory structure (identical to PatientMemories):
 *   { id, title, category, description, date, image, favorite, createdAt }
 *
 * Props:
 *   navigate - function from App to switch screens
 */

import { useState, useEffect } from "react";
import { memories as memoriesApi } from '../utils/api.js';
import { getOrCreatePatientId, getCachedPatientId } from '../utils/identity.js';
import { enqueue } from '../utils/syncQueue.js';
import { useLanguage } from '../locales/index.js';
import "./CaregiverMemories.css";

/* ----------------------------------------------------------------
   CONSTANTS  (mirrors PatientMemories — no import to keep files
   self-contained and avoid circular-dependency risk)
---------------------------------------------------------------- */
const STORAGE_KEY = "smriti_memories";

// We keep the internal category names in English so logic/DB matches,
// but we will translate them for display.
const CATEGORIES = ["Family", "Places", "Events", "Special Moments"];

const CATEGORY_EMOJI = {
  Family:           "👨‍👩‍👧",
  Places:           "🏡",
  Events:           "🎉",
  "Special Moments":"🌟",
};

/** Predefined visual emoji palette for new/edited memories. */
const VISUAL_EMOJIS = ["👨‍👩‍👧", "🏠", "🎉", "🌅", "❤️", "🌳", "🎂", "📸"];

/** Sample data used as a fallback ONLY when localStorage key is absent.
 *  Mirrors PatientMemories so both screens see the same initial data. */
const SAMPLE_MEMORIES = [
  {
    id: "sample-1",
    title: "Family Picnic",
    category: "Family",
    description: "A happy afternoon together in the park. Everyone was laughing and enjoying the sunshine.",
    date: "June 2024",
    image: null,
    favorite: true,
    createdAt: "2024-06-15T10:00:00.000Z",
  },
  {
    id: "sample-2",
    title: "Our Old Home",
    category: "Places",
    description: "A place filled with many wonderful memories — the garden, the kitchen, and long evenings on the porch.",
    date: "2019",
    image: null,
    favorite: false,
    createdAt: "2019-01-01T10:00:00.000Z",
  },
  {
    id: "sample-3",
    title: "Birthday Celebration",
    category: "Events",
    description: "A special birthday surrounded by family. There was cake, music, and plenty of laughter.",
    date: "March 2023",
    image: null,
    favorite: false,
    createdAt: "2023-03-10T10:00:00.000Z",
  },
  {
    id: "sample-4",
    title: "A Beautiful Evening",
    category: "Special Moments",
    description: "A peaceful evening spent with loved ones, watching the sunset and sharing stories.",
    date: "December 2022",
    image: null,
    favorite: true,
    createdAt: "2022-12-20T10:00:00.000Z",
  },
];

const DEMO_PATIENT = { name: "Mrs. Das", age: 72 };

/* ----------------------------------------------------------------
   LOCALSTORAGE HELPERS
   All wrapped in try/catch — never crash on bad data.
   Uses the same smriti_memories key as PatientMemories.
---------------------------------------------------------------- */

/**
 * Load memories.
 * - Key absent  → seed with sample memories (same behaviour as PatientMemories)
 * - Corrupt     → return empty array without overwriting
 * - Valid       → return parsed array
 */
function loadMemories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MEMORIES));
      return SAMPLE_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the full memories array. Fails silently on quota errors. */
function saveMemories(memories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {
    console.warn("Smriti: could not save memories to localStorage.");
  }
}

/** Generate a unique ID string. */
function generateId() {
  return "cgm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

/* ----------------------------------------------------------------
   EMPTY FORM STATE
---------------------------------------------------------------- */
const EMPTY_FORM = {
  title: "",
  category: "Family",
  description: "",
  date: "",
  image: null,
};

/* ----------------------------------------------------------------
   FORM COMPONENT
   Used for both Add and Edit. Pre-filled when editing.
---------------------------------------------------------------- */
function MemoryForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())       errs.title       = t('caregiverMem.form.err.title');
    if (!form.category)           errs.category    = t('caregiverMem.form.err.category');
    if (!form.description.trim()) errs.description = t('caregiverMem.form.err.desc');
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(form);
  }

  // category translation helper for form
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'Family': return t('memories.categories.family');
      case 'Places': return t('memories.categories.places');
      case 'Events': return t('memories.categories.events');
      case 'Special Moments': return t('memories.categories.specialMoments');
      default: return cat;
    }
  };

  return (
    <div className="cgm-form-overlay" role="dialog" aria-modal="true" aria-label={initial ? t('caregiverMem.form.update') : t('caregiverMem.add')}>
      <div className="cgm-form-card">
        <h2 className="cgm-form-title">
          {initial ? t('caregiverMem.form.update') : t('caregiverMem.add')}
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-title">
              {t('caregiverMem.form.title')} <span aria-hidden="true" className="cgm-required">*</span>
            </label>
            <input
              id="cgm-title"
              className={"cgm-input" + (errors.title ? " cgm-input--error" : "")}
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Family Picnic"
              maxLength={80}
              autoFocus
            />
            {errors.title && <p className="cgm-error">{errors.title}</p>}
          </div>

          {/* Category */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-category">
              {t('caregiverMem.form.category')} <span aria-hidden="true" className="cgm-required">*</span>
            </label>
            <select
              id="cgm-category"
              className={"cgm-input cgm-select" + (errors.category ? " cgm-input--error" : "")}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_EMOJI[cat]} {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
            {errors.category && <p className="cgm-error">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-description">
              {t('caregiverMem.form.desc')} <span aria-hidden="true" className="cgm-required">*</span>
            </label>
            <textarea
              id="cgm-description"
              className={"cgm-input cgm-textarea" + (errors.description ? " cgm-input--error" : "")}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="..."
              maxLength={400}
              rows={4}
            />
            {errors.description && <p className="cgm-error">{errors.description}</p>}
          </div>

          {/* Date (optional) */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-date">
              {t('caregiverMem.form.date')} <span className="cgm-optional">(optional)</span>
            </label>
            <input
              id="cgm-date"
              className="cgm-input"
              type="text"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              placeholder="e.g. June 2024"
              maxLength={40}
            />
          </div>

          {/* Visual / Emoji */}
          <div className="cgm-field">
            <p className="cgm-label">
              Visual <span className="cgm-optional">({t('caregiverMem.form.date').replace('Date','').trim() || 'optional'})</span>
            </p>
            <div className="cgm-emoji-grid" role="group" aria-label={t('caregiverMem.form.title')}>
              {VISUAL_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={"cgm-emoji-btn" + (form.image === emoji ? " cgm-emoji-btn--selected" : "")}
                  onClick={() => handleChange("image", form.image === emoji ? null : emoji)}
                  aria-label={"Visual: " + emoji}
                  aria-pressed={form.image === emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="cgm-form-actions">
            <button type="button" className="cgm-btn cgm-btn--secondary" onClick={onCancel}>
              {t('caregiverMem.form.cancel')}
            </button>
            <button type="submit" className="cgm-btn cgm-btn--primary">
              {initial ? t('caregiverMem.form.update') : t('caregiverMem.form.save')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   DELETE CONFIRMATION DIALOG
---------------------------------------------------------------- */
function DeleteConfirm({ memory, onConfirm, onCancel, t }) {
  return (
    <div className="cgm-form-overlay" role="dialog" aria-modal="true" aria-label={t('caregiverMem.deleteConfirm.aria')}>
      <div className="cgm-confirm-card">
        <p className="cgm-confirm-emoji" aria-hidden="true">🗑️</p>
        <h2 className="cgm-confirm-title">{t('caregiverMem.deleteConfirm.title')}</h2>
        <p className="cgm-confirm-name">"{memory.title}"</p>
        <p className="cgm-confirm-msg">{t('confirm.irreversible')}</p>
        <div className="cgm-form-actions">
          <button className="cgm-btn cgm-btn--secondary" onClick={onCancel}>{t('caregiverMem.form.cancel')}</button>
          <button className="cgm-btn cgm-btn--danger" onClick={onConfirm}>{t('caregiverMem.delete')}</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   MEMORY CARD (caregiver view — denser than patient view)
---------------------------------------------------------------- */
function MemoryCard({ memory, onEdit, onDelete, onToggleFavorite, t }) {
  const emoji = CATEGORY_EMOJI[memory.category] ?? "📖";
  const visual = memory.image; // may be an emoji string or null

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'Family': return t('memories.categories.family');
      case 'Places': return t('memories.categories.places');
      case 'Events': return t('memories.categories.events');
      case 'Special Moments': return t('memories.categories.specialMoments');
      default: return cat;
    }
  };

  return (
    <article className="cgm-card" aria-label={"Memory: " + memory.title}>

      {/* Visual strip */}
      {visual && (
        <div className="cgm-card__visual" aria-hidden="true">{visual}</div>
      )}

      <div className="cgm-card__body">
        {/* Header row */}
        <div className="cgm-card__header-row">
          <span className="cgm-card__category">
            <span aria-hidden="true">{emoji}</span> {getCategoryLabel(memory.category)}
          </span>
          <button
            className={"cgm-fav-btn" + (memory.favorite ? " cgm-fav-btn--active" : "")}
            onClick={() => onToggleFavorite(memory.id)}
            aria-pressed={memory.favorite}
            aria-label={memory.favorite ? "Remove from favourites" : "Add to favourites"}
          >
            {memory.favorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Title */}
        <h3 className="cgm-card__title">{memory.title}</h3>

        {/* Description */}
        <p className="cgm-card__desc">{memory.description}</p>

        {/* Date */}
        {memory.date && (
          <p className="cgm-card__date">📅 {memory.date}</p>
        )}

        {/* Action buttons */}
        <div className="cgm-card__actions">
          <button
            className="cgm-action-btn cgm-action-btn--edit"
            onClick={() => onEdit(memory)}
            aria-label={"Edit memory: " + memory.title}
          >
            ✏️ Edit
          </button>
          <button
            className="cgm-action-btn cgm-action-btn--delete"
            onClick={() => onDelete(memory)}
            aria-label={"Delete memory: " + memory.title}
          >
            🗑️ {t('caregiverMem.delete')}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------------- */
function CaregiverMemories({ navigate }) {
  const { t } = useLanguage();

  /* Load fresh from localStorage on every mount */
  const [memories, setMemories] = useState(() => loadMemories());

  /* UI state */
  const [showForm, setShowForm]       = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [deletingMemory, setDeletingMemory] = useState(null);

  /* ---- BACKEND SYNC ON MOUNT ---- */
  useEffect(() => {
    let cancelled = false;

    async function syncFromBackend() {
      // Ensure demo patient exists in the DB
      const patientId = await getOrCreatePatientId();
      if (!patientId || cancelled) return;

      const { data, error } = await memoriesApi.list(patientId);
      if (error || !data?.memories || cancelled) return;

      const localMems = loadMemories();

      // Build a lookup of local records that have a server id.
      // IMPORTANT: only include records that actually have _dbId set —
      // records without _dbId were created offline and must be preserved.
      const localByDbId = Object.fromEntries(
        localMems
          .filter((m) => m._dbId)
          .map((m) => [m._dbId, m])
      );

      // Map DB records to local shape (DB is authoritative for its fields)
      const fromDb = data.memories.map((dbMem) => ({
        // Preserve local fields that the DB doesn't store (date, emoji image)
        ...(localByDbId[dbMem.id] ?? {}),
        // Always use fresh DB fields for authoritative data
        _dbId:       dbMem.id,
        title:       dbMem.title,
        category:    dbMem.category,
        description: dbMem.description,
        favorite:    dbMem.is_favorite,
        media_url:   dbMem.media_url,
        createdAt:   dbMem.created_at,
        // Keep image from local record (emoji visual not stored in DB)
        image: localByDbId[dbMem.id]?.image ?? dbMem.media_url ?? null,
        // Keep date from local record (free-text date not stored in DB)
        date:  localByDbId[dbMem.id]?.date ?? '',
      }));

      // Preserve local-only records (offline-created, not yet synced to DB).
      // These have no _dbId and must NOT be wiped by the backend response.
      const localOnly = localMems.filter((m) => !m._dbId);

      const merged = [...fromDb, ...localOnly];

      if (!cancelled) {
        setMemories(merged);
        saveMemories(merged);
      }
    }

    syncFromBackend();
    return () => { cancelled = true; };
  }, []);

  /* ---- HELPERS ---- */
  function persist(updated) {
    setMemories(updated);
    saveMemories(updated);
  }

  /* ---- ADD ---- */
  function handleAddClick() {
    setEditingMemory(null);
    setShowForm(true);
  }

  /* ---- SAVE (Add or Edit) ---- */
  async function handleSave(formData) {
    const patientId = getCachedPatientId();

    if (editingMemory) {
      // EDIT — persist local changes immediately
      const updated = memories.map((m) =>
        m.id === editingMemory.id
          ? {
              ...m,
              title:       formData.title.trim(),
              category:    formData.category,
              description: formData.description.trim(),
              date:        formData.date.trim(),
              image:       formData.image,
            }
          : m
      );
      persist(updated);

      if (editingMemory._dbId) {
        // Record exists on the server — update it
        const updatePayload = {
          title:       formData.title.trim(),
          category:    formData.category,
          description: formData.description.trim(),
          is_favorite: editingMemory.favorite,
          media_url:   formData.image ?? null,
        };
        const { error } = await memoriesApi.update(editingMemory._dbId, updatePayload);
        if (error) {
          enqueue('update_memory', { dbId: editingMemory._dbId, ...updatePayload });
        }
      } else {
        // Was a local-only record (offline-created) — try to create on server now
        const createPayload = {
          patient_id:  patientId,
          title:       formData.title.trim(),
          category:    formData.category,
          description: formData.description.trim(),
          is_favorite: editingMemory.favorite,
          media_url:   formData.image ?? null,
        };
        if (patientId) {
          const { data, error } = await memoriesApi.create(createPayload);
          if (error) {
            enqueue('create_memory', createPayload, editingMemory.id);
          } else if (data?.memory?.id) {
            // Tag the now-synced memory with its server id.
            // Use `updated` (the already-edited array) so we don't revert edits.
            const tagged = updated.map((m) =>
              m.id === editingMemory.id ? { ...m, _dbId: data.memory.id } : m
            );
            persist(tagged);
          }
        } else {
          // No patient identity yet — queue for when identity is established
          enqueue('create_memory', createPayload, editingMemory.id);
        }
      }
    } else {
      // ADD — brand new memory
      const newMemory = {
        id:          generateId(),
        title:       formData.title.trim(),
        category:    formData.category,
        description: formData.description.trim(),
        date:        formData.date.trim(),
        image:       formData.image,
        favorite:    false,
        createdAt:   new Date().toISOString(),
      };
      persist([...memories, newMemory]);

      const createPayload = {
        patient_id:  patientId,
        title:       newMemory.title,
        category:    newMemory.category,
        description: newMemory.description,
        is_favorite: false,
        media_url:   newMemory.image ?? null,
      };

      if (patientId) {
        const { data, error } = await memoriesApi.create(createPayload);
        if (error) {
          enqueue('create_memory', createPayload, newMemory.id);
        } else if (data?.memory?.id) {
          // Tag with server id
          setMemories((prev) => {
            const tagged = prev.map((m) =>
              m.id === newMemory.id ? { ...m, _dbId: data.memory.id } : m
            );
            saveMemories(tagged);
            return tagged;
          });
        }
      } else {
        enqueue('create_memory', createPayload, newMemory.id);
      }
    }
    setShowForm(false);
    setEditingMemory(null);
  }

  /* ---- CANCEL FORM ---- */
  function handleCancel() {
    setShowForm(false);
    setEditingMemory(null);
  }

  /* ---- EDIT ---- */
  function handleEdit(memory) {
    setEditingMemory(memory);
    setShowForm(true);
  }

  /* ---- DELETE (confirm first) ---- */
  function handleDeleteClick(memory) {
    setDeletingMemory(memory);
  }

  function handleDeleteConfirm() {
    const updated = memories.filter((m) => m.id !== deletingMemory.id);
    persist(updated);

    // Backend delete — enqueue on failure so it syncs when reconnected
    if (deletingMemory._dbId) {
      memoriesApi.remove(deletingMemory._dbId).then(({ error }) => {
        if (error) {
          enqueue('delete_memory', { dbId: deletingMemory._dbId });
        }
      });
    }
    // If no _dbId, record was never synced — nothing to delete on server

    setDeletingMemory(null);
  }

  function handleDeleteCancel() {
    setDeletingMemory(null);
  }

  /* ---- TOGGLE FAVOURITE ---- */
  function handleToggleFavorite(id) {
    const target = memories.find((m) => m.id === id);
    const updated = memories.map((m) =>
      m.id === id ? { ...m, favorite: !m.favorite } : m
    );
    persist(updated);

    // Backend sync — enqueue on failure
    if (target?._dbId) {
      memoriesApi.update(target._dbId, { is_favorite: !target.favorite }).then(({ error }) => {
        if (error) {
          enqueue('update_memory', { dbId: target._dbId, is_favorite: !target.favorite });
        }
      });
    }
  }

  /* ---- RENDER ---- */
  const hasMemories = memories.length > 0;

  /* Build initial form values when editing */
  const formInitial = editingMemory
    ? {
        title:       editingMemory.title,
        category:    editingMemory.category,
        description: editingMemory.description,
        date:        editingMemory.date ?? "",
        image:       editingMemory.image ?? null,
      }
    : null;

  return (
    <div className="cgm-screen">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="cgm-header" aria-label={t('caregiverMem.heading')}>

        <button
          className="cgm-header-back-btn"
          onClick={() => navigate("caregiver-dashboard")}
          aria-label={t('nav.back')}
        >
          {t('caregiver.nav.dashboard') ? `← ${t('caregiver.nav.dashboard')}` : `← Dashboard`}
        </button>

        <div className="cgm-header__titles">
          <p className="cgm-header__title">{t('caregiverMem.heading')} ❤️</p>
          <p className="cgm-header__subtitle">
            {t('caregiverMem.sub', { name: DEMO_PATIENT.name })}
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="cgm-content">

        {/* Add Memory button — always visible at the top */}
        <div className="cgm-top-bar">
          <p className="cgm-count">
            {hasMemories
              ? memories.length === 1 
                  ? t('memories.count.one') 
                  : t('memories.count.many', { count: memories.length })
              : t('caregiverMem.empty')}
          </p>
          <button
            id="cgm-btn-add"
            className="cgm-btn cgm-btn--primary cgm-btn--add"
            onClick={handleAddClick}
            aria-label={t('caregiverMem.add')}
          >
            {t('caregiverMem.add')}
          </button>
        </div>

        {/* Empty state */}
        {!hasMemories && (
          <div className="cgm-empty">
            <span className="cgm-empty__emoji" aria-hidden="true">❤️</span>
            <p className="cgm-empty__msg">{t('caregiverMem.empty')}</p>
            <p className="cgm-empty__hint">
              {t('caregiverMem.empty.sub', { name: DEMO_PATIENT.name })}
            </p>
            <button
              id="cgm-btn-add-empty"
              className="cgm-btn cgm-btn--primary"
              onClick={handleAddClick}
            >
              {t('caregiverMem.add')}
            </button>
          </div>
        )}

        {/* Memory cards */}
        {hasMemories && (
          <ul className="cgm-list" role="list">
            {memories.map((memory) => (
              <li key={memory.id} className="cgm-list-item">
                <MemoryCard
                  memory={memory}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleFavorite={handleToggleFavorite}
                  t={t}
                />
              </li>
            ))}
          </ul>
        )}

      </main>

      {/* ── OVERLAYS ────────────────────────────────────── */}
      {showForm && (
        <MemoryForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={handleCancel}
          t={t}
        />
      )}

      {deletingMemory && (
        <DeleteConfirm
          memory={deletingMemory}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          t={t}
        />
      )}

    </div>
  );
}

export default CaregiverMemories;
