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

import { useState } from "react";
import "./CaregiverMemories.css";

/* ----------------------------------------------------------------
   CONSTANTS  (mirrors PatientMemories — no import to keep files
   self-contained and avoid circular-dependency risk)
---------------------------------------------------------------- */
const STORAGE_KEY = "smriti_memories";

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
function MemoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())       errs.title       = "Please enter a memory title.";
    if (!form.category)           errs.category    = "Please select a category.";
    if (!form.description.trim()) errs.description = "Please add a short description.";
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

  return (
    <div className="cgm-form-overlay" role="dialog" aria-modal="true" aria-label="Memory form">
      <div className="cgm-form-card">
        <h2 className="cgm-form-title">
          {initial ? "Edit Memory" : "Add Memory"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-title">
              Memory Title <span aria-hidden="true" className="cgm-required">*</span>
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
              Category <span aria-hidden="true" className="cgm-required">*</span>
            </label>
            <select
              id="cgm-category"
              className={"cgm-input cgm-select" + (errors.category ? " cgm-input--error" : "")}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_EMOJI[cat]} {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="cgm-error">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-description">
              Description <span aria-hidden="true" className="cgm-required">*</span>
            </label>
            <textarea
              id="cgm-description"
              className={"cgm-input cgm-textarea" + (errors.description ? " cgm-input--error" : "")}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe this special memory..."
              maxLength={400}
              rows={4}
            />
            {errors.description && <p className="cgm-error">{errors.description}</p>}
          </div>

          {/* Date (optional) */}
          <div className="cgm-field">
            <label className="cgm-label" htmlFor="cgm-date">
              Date <span className="cgm-optional">(optional)</span>
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
              Visual <span className="cgm-optional">(optional)</span>
            </p>
            <div className="cgm-emoji-grid" role="group" aria-label="Select a visual">
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
              Cancel
            </button>
            <button type="submit" className="cgm-btn cgm-btn--primary">
              {initial ? "Save Changes" : "Save Memory"}
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
function DeleteConfirm({ memory, onConfirm, onCancel }) {
  return (
    <div className="cgm-form-overlay" role="dialog" aria-modal="true" aria-label="Delete confirmation">
      <div className="cgm-confirm-card">
        <p className="cgm-confirm-emoji" aria-hidden="true">🗑️</p>
        <h2 className="cgm-confirm-title">Delete this memory?</h2>
        <p className="cgm-confirm-name">"{memory.title}"</p>
        <p className="cgm-confirm-msg">This cannot be undone.</p>
        <div className="cgm-form-actions">
          <button className="cgm-btn cgm-btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="cgm-btn cgm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   MEMORY CARD (caregiver view — denser than patient view)
---------------------------------------------------------------- */
function MemoryCard({ memory, onEdit, onDelete, onToggleFavorite }) {
  const emoji = CATEGORY_EMOJI[memory.category] ?? "📖";
  const visual = memory.image; // may be an emoji string or null

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
            <span aria-hidden="true">{emoji}</span> {memory.category}
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
            🗑️ Delete
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

  /* Load fresh from localStorage on every mount */
  const [memories, setMemories] = useState(() => loadMemories());

  /* UI state */
  const [showForm, setShowForm]       = useState(false);     // show add/edit form?
  const [editingMemory, setEditingMemory] = useState(null);  // memory being edited (null = add mode)
  const [deletingMemory, setDeletingMemory] = useState(null); // memory pending deletion

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
  function handleSave(formData) {
    if (editingMemory) {
      // EDIT — preserve id, createdAt, favorite
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
    setDeletingMemory(null);
  }

  function handleDeleteCancel() {
    setDeletingMemory(null);
  }

  /* ---- TOGGLE FAVOURITE ---- */
  function handleToggleFavorite(id) {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, favorite: !m.favorite } : m
    );
    persist(updated);
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
      <header className="cgm-header" aria-label="Manage Memories header">

        <button
          className="cgm-header-back-btn"
          onClick={() => navigate("caregiver-dashboard")}
          aria-label="Back to Dashboard"
        >
          ← Dashboard
        </button>

        <div className="cgm-header__titles">
          <p className="cgm-header__title">Manage Memories ❤️</p>
          <p className="cgm-header__subtitle">
            Add and manage special memories for Mrs. Das.
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="cgm-content">

        {/* Add Memory button — always visible at the top */}
        <div className="cgm-top-bar">
          <p className="cgm-count">
            {hasMemories
              ? memories.length + " memor" + (memories.length === 1 ? "y" : "ies")
              : "No memories yet"}
          </p>
          <button
            id="cgm-btn-add"
            className="cgm-btn cgm-btn--primary cgm-btn--add"
            onClick={handleAddClick}
            aria-label="Add a new memory"
          >
            + Add Memory
          </button>
        </div>

        {/* Empty state */}
        {!hasMemories && (
          <div className="cgm-empty">
            <span className="cgm-empty__emoji" aria-hidden="true">❤️</span>
            <p className="cgm-empty__msg">No memories yet.</p>
            <p className="cgm-empty__hint">
              Add a special memory to begin building Mrs. Das&apos;s memory collection.
            </p>
            <button
              id="cgm-btn-add-empty"
              className="cgm-btn cgm-btn--primary"
              onClick={handleAddClick}
            >
              + Add Memory
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
        />
      )}

      {deletingMemory && (
        <DeleteConfirm
          memory={deletingMemory}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

    </div>
  );
}

export default CaregiverMemories;
