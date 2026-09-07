/**
 * src/utils/accessibilityPrefs.js — Accessibility Preference System
 *
 * Manages three patient-facing accessibility preferences:
 *   1. largeText     — increases text size by one step
 *   2. highContrast  — stronger text/background contrast
 *   3. reducedMotion — reduces/removes animations
 *
 * Preferences are persisted in localStorage (key: memora_accessibility).
 * Applied via CSS classes on document.documentElement:
 *   .memora-large-text
 *   .memora-high-contrast
 *   .memora-reduced-motion
 *
 * Works fully offline.
 * Used by AccessibilityContext (src/contexts/AccessibilityContext.jsx).
 */

const LS_KEY = 'memora_accessibility';

export const DEFAULT_PREFS = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
};

/* ── LOAD ────────────────────────────────────────────────────────── */
export function loadPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw);
    // Merge against defaults so new preferences don't break old saves
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/* ── SAVE ────────────────────────────────────────────────────────── */
export function savePrefs(prefs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

/* ── APPLY CSS CLASSES ─────────────────────────────────────────── */
export function applyPrefsToDOM(prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.classList.toggle('memora-large-text',     !!prefs.largeText);
  root.classList.toggle('memora-high-contrast',  !!prefs.highContrast);
  root.classList.toggle('memora-reduced-motion', !!prefs.reducedMotion);

  // Also set data attributes for CSS custom property overrides
  root.setAttribute('data-large-text',     prefs.largeText     ? '1' : '0');
  root.setAttribute('data-high-contrast',  prefs.highContrast  ? '1' : '0');
  root.setAttribute('data-reduced-motion', prefs.reducedMotion ? '1' : '0');
}
