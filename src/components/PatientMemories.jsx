/**
 * PatientMemories.jsx — "My Memories" screen for Patient Mode.
 *
 * Allows the patient to browse and interact with a personal
 * reminiscence library. Memories are stored in localStorage
 * under the key "smriti_memories".
 *
 * This is NOT a medical feature. It is a simple, warm space
 * for the patient to revisit moments that matter to them.
 *
 * Capabilities:
 *   - Browse memories as large readable cards
 *   - Filter by category (All / Family / Places / Events / Special Moments)
 *   - Toggle ❤️ favorite on any memory (persisted to localStorage)
 *   - Empty state when no memories exist
 *   - Sample data auto-initialized only when key is absent
 *
 * Props:
 *   navigate — function from App to switch screens
 */

import { useState } from 'react';
import './PatientMemories.css';

/* ── CONSTANTS ───────────────────────────────────────────────── */

const STORAGE_KEY = 'smriti_memories';

/** All valid category values used throughout the feature. */
const CATEGORIES = ['All', 'Family', 'Places', 'Events', 'Special Moments'];

/**
 * Category emoji map — shown next to category labels on cards.
 * Gives each category an instant visual identity.
 */
const CATEGORY_EMOJI = {
  Family:          '👨‍👩‍👧',
  Places:          '🏡',
  Events:          '🎉',
  'Special Moments': '🌟',
};

/* ── SAMPLE MEMORIES ─────────────────────────────────────────────
 *
 * These are clearly fictional demo memories used only when
 * smriti_memories does not exist in localStorage yet.
 * They are NEVER written if real memories already exist.
 * ─────────────────────────────────────────────────────────────── */
const SAMPLE_MEMORIES = [
  {
    id:          'sample-1',
    title:       'Family Picnic',
    category:    'Family',
    description: 'A happy afternoon together in the park. Everyone was laughing and enjoying the sunshine.',
    date:        'June 2024',
    image:       null,
    favorite:    true,
    createdAt:   '2024-06-15T10:00:00.000Z',
  },
  {
    id:          'sample-2',
    title:       'Our Old Home',
    category:    'Places',
    description: 'A place filled with many wonderful memories — the garden, the kitchen, and long evenings on the porch.',
    date:        '2019',
    image:       null,
    favorite:    false,
    createdAt:   '2019-01-01T10:00:00.000Z',
  },
  {
    id:          'sample-3',
    title:       'Birthday Celebration',
    category:    'Events',
    description: 'A special birthday surrounded by family. There was cake, music, and plenty of laughter.',
    date:        'March 2023',
    image:       null,
    favorite:    false,
    createdAt:   '2023-03-10T10:00:00.000Z',
  },
  {
    id:          'sample-4',
    title:       'A Beautiful Evening',
    category:    'Special Moments',
    description: 'A peaceful evening spent with loved ones, watching the sunset and sharing stories.',
    date:        'December 2022',
    image:       null,
    favorite:    true,
    createdAt:   '2022-12-20T10:00:00.000Z',
  },
];

/* ── LOCALSTORAGE HELPERS ─────────────────────────────────────────
 *
 * All reads are wrapped in try/catch so corrupt JSON never crashes
 * the application. Invalid data silently falls back to safe defaults.
 * ─────────────────────────────────────────────────────────────── */

/**
 * Load memories from localStorage.
 * - If the key is missing → initialize with sample memories and return them.
 * - If JSON is corrupt   → return empty array (don't overwrite real data).
 * - If valid             → return the parsed array.
 *
 * The "initialize with samples" step only runs ONCE because after it
 * runs the key exists, so on the next mount it goes through the
 * "valid" branch instead.
 */
function loadMemories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      // Key doesn't exist — first time — seed with sample memories
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MEMORIES));
      return SAMPLE_MEMORIES;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // JSON.parse threw — data is corrupt — return empty array safely
    return [];
  }
}

/**
 * Persist the full updated memories array to localStorage.
 * Called whenever the patient toggles a favorite.
 */
function saveMemories(memories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
    console.warn('Smriti: could not save memories to localStorage.');
  }
}

/* ── SHARED BOTTOM NAVIGATION ────────────────────────────────────
 *
 * Identical nav pattern to PatientHome / PatientProgress,
 * with "memories" marked as the active tab.
 * ─────────────────────────────────────────────────────────────── */
function MemoriesNav({ navigate }) {
  return (
    <nav className="ph-nav" aria-label="Main navigation">
      <button
        id="mem-nav-home"
        className="ph-nav__btn"
        onClick={() => navigate('patient-home')}
        aria-label="Home"
      >
        <span className="ph-nav__icon" aria-hidden="true">🏠</span>
        <span className="ph-nav__label">Home</span>
      </button>

      <button
        id="mem-nav-activities"
        className="ph-nav__btn"
        onClick={() => navigate('patient-activities')}
        aria-label="Activities"
      >
        <span className="ph-nav__icon" aria-hidden="true">🧠</span>
        <span className="ph-nav__label">Activities</span>
      </button>

      <button
        id="mem-nav-memories"
        className="ph-nav__btn ph-nav__btn--active"
        aria-current="page"
        aria-label="Memories"
        onClick={() => navigate('patient-memories')}
      >
        <span className="ph-nav__icon" aria-hidden="true">❤️</span>
        <span className="ph-nav__label">Memories</span>
      </button>

      <button
        id="mem-nav-reminders"
        className="ph-nav__btn"
        onClick={() => navigate('patient-reminders')}
        aria-label="Reminders"
      >
        <span className="ph-nav__icon" aria-hidden="true">⏰</span>
        <span className="ph-nav__label">Reminders</span>
      </button>
    </nav>
  );
}

/* ── MEMORY CARD ──────────────────────────────────────────────────
 *
 * Renders a single memory as a large, readable card.
 * The ❤️ button calls onToggleFavorite with the memory's id.
 * ─────────────────────────────────────────────────────────────── */
function MemoryCard({ memory, onToggleFavorite }) {
  const categoryEmoji = CATEGORY_EMOJI[memory.category] ?? '📖';

  return (
    <article
      className="mem-card"
      aria-label={`Memory: ${memory.title}`}
    >
      {/* Optional image area — shows a warm placeholder when no image */}
      <div className="mem-card__image-area" aria-hidden="true">
        {memory.image ? (
          <img
            src={memory.image}
            alt={memory.title}
            className="mem-card__image"
          />
        ) : (
          <div className="mem-card__image-placeholder">
            <span className="mem-card__placeholder-icon">
              {categoryEmoji}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="mem-card__body">
        {/* Category label */}
        <span className="mem-card__category">
          <span aria-hidden="true">{categoryEmoji}</span> {memory.category}
        </span>

        {/* Memory title */}
        <h3 className="mem-card__title">{memory.title}</h3>

        {/* Description */}
        <p className="mem-card__desc">{memory.description}</p>

        {/* Footer row: date on the left, favorite button on the right */}
        <div className="mem-card__footer">
          {memory.date && (
            <span className="mem-card__date" aria-label={`Date: ${memory.date}`}>
              📅 {memory.date}
            </span>
          )}

          {/*
           * The favorite toggle button.
           * aria-pressed reflects the current favorite state for
           * screen readers — "true" = currently a favorite.
           */}
          <button
            className={`mem-fav-btn ${memory.favorite ? 'mem-fav-btn--active' : ''}`}
            onClick={() => onToggleFavorite(memory.id)}
            aria-pressed={memory.favorite}
            aria-label={memory.favorite ? 'Remove from favourites' : 'Add to favourites'}
            id={`fav-${memory.id}`}
          >
            {memory.favorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────*/
function PatientMemories({ navigate }) {

  /*
   * memories — the full list loaded from localStorage on mount.
   * React's useState holds it so that toggling a favorite
   * triggers a re-render immediately without a page refresh.
   *
   * We call loadMemories() as the initial value passed to useState.
   * This runs once when the component first mounts. Because navigate()
   * unmounts and remounts this component on every visit, the data
   * is always fresh when the screen opens.
   */
  const [memories, setMemories] = useState(() => loadMemories());

  /*
   * activeCategory — which filter pill is currently selected.
   * 'All' means show every memory regardless of category.
   */
  const [activeCategory, setActiveCategory] = useState('All');

  /* ── FILTERED MEMORIES ──────────────────────────────────────
   *
   * When activeCategory is 'All', every memory is shown.
   * Otherwise only memories matching the category are shown.
   *
   * This is pure filtering — the memories array in state is
   * never modified. We just choose which items to display.
   * ─────────────────────────────────────────────────────────── */
  const visibleMemories = activeCategory === 'All'
    ? memories
    : memories.filter((m) => m.category === activeCategory);

  /* ── FAVORITE TOGGLE ────────────────────────────────────────
   *
   * When the patient taps the ❤️ / 🤍 button on a card:
   * 1. Create a new array with the target memory's favorite
   *    field flipped (true → false or false → true).
   * 2. Update React state so the UI re-renders immediately.
   * 3. Persist the updated array to localStorage.
   *
   * We never mutate the existing array — we map() to produce
   * a brand-new array, which is the React immutability pattern.
   * ─────────────────────────────────────────────────────────── */
  function handleToggleFavorite(id) {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, favorite: !m.favorite } : m
    );
    setMemories(updated);    // update UI
    saveMemories(updated);   // persist to localStorage
  }

  /* ── RENDER ─────────────────────────────────────────────────*/
  const hasMemories = memories.length > 0;

  return (
    <div className="ph-screen">

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <header className="mem-header" aria-label="My Memories">
        <p className="mem-header__title">My Memories ❤️</p>
        <p className="mem-header__sub">
          Take a moment to revisit the memories that matter to you.
        </p>
      </header>

      <main className="mem-content">

        {/* ── EMPTY STATE ─────────────────────────────────── */}
        {!hasMemories && (
          <div className="mem-empty">
            <span className="mem-empty__emoji" aria-hidden="true">❤️</span>
            <h2 className="mem-empty__heading">My Memories ❤️</h2>
            <p className="mem-empty__msg">No memories have been added yet.</p>
            <p className="mem-empty__hint">
              Your special moments will appear here.
            </p>
          </div>
        )}

        {/* ── CATEGORY FILTERS ────────────────────────────── */}
        {hasMemories && (
          <>
            {/*
             * A horizontal scrollable row of filter pills.
             * role="group" with aria-label groups them semantically.
             * The active pill gets aria-pressed="true".
             */}
            <div
              className="mem-filters"
              role="group"
              aria-label="Filter memories by category"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`mem-filter-btn ${activeCategory === cat ? 'mem-filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {cat !== 'All' && (
                    <span aria-hidden="true">{CATEGORY_EMOJI[cat]}</span>
                  )}
                  {cat}
                </button>
              ))}
            </div>

            {/* Count of visible memories */}
            <p className="mem-count" aria-live="polite">
              {visibleMemories.length === 0
                ? 'No memories in this category.'
                : `${visibleMemories.length} memor${visibleMemories.length === 1 ? 'y' : 'ies'}`}
            </p>

            {/* ── MEMORY CARDS ──────────────────────────────── */}
            {visibleMemories.length > 0 && (
              <ul className="mem-list" role="list">
                {visibleMemories.map((memory) => (
                  <li key={memory.id} className="mem-list-item">
                    <MemoryCard
                      memory={memory}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* Empty filter state (category has no memories) */}
            {visibleMemories.length === 0 && (
              <div className="mem-empty-filter">
                <span aria-hidden="true">
                  {CATEGORY_EMOJI[activeCategory] ?? '📖'}
                </span>
                <p>No {activeCategory} memories yet.</p>
              </div>
            )}
          </>
        )}

      </main>

      {/* ── BOTTOM NAVIGATION ────────────────────────────── */}
      <MemoriesNav navigate={navigate} />

    </div>
  );
}

export default PatientMemories;
