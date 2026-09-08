/**
 * src/locales/index.js — Memora Localization Foundation
 *
 * Provides:
 *   - LanguageContext + LanguageProvider
 *   - useLanguage() hook  →  { lang, setLang, t }
 *   - translate(lang, key, vars) — fallback-safe
 *   - LOCALE_META — 11-language registry
 *   - LOCALE_BCP47 — browser language tag map
 *
 * Fallback chain:  selected lang → English → raw key
 * Never returns undefined / null / crashes.
 *
 * Language is persisted to localStorage: memora_lang
 * document.documentElement.lang is updated on every language change.
 *
 * ARCHITECTURE: All locale files are imported statically at the top of
 * this module. This eliminates the Vite dynamic-import analysis warning
 * and guarantees all 11 locale bundles are included in the production build
 * for full offline availability. The trade-off is a slightly larger initial
 * bundle, which is acceptable for this offline-first PWA.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import React from 'react';

/* ── STATIC LOCALE IMPORTS ────────────────────────────────────────
 * Import every locale file explicitly. Vite can statically analyse
 * these and include them in the production bundle without warnings.
 * NOTE: 'as' is a JS reserved word, so we alias it as as_.
 * ─────────────────────────────────────────────────────────────── */
import en   from './en.js';
import as_  from './as.js';
import bn   from './bn.js';
import mni  from './mni.js';
import lus  from './lus.js';
import kha  from './kha.js';
import grt  from './grt.js';
import brx  from './brx.js';
import ne   from './ne.js';
import hi   from './hi.js';
import te   from './te.js';

/** Static registry: maps locale code → dictionary object. */
const LOCALE_REGISTRY = {
  en,
  as:  as_,
  bn,
  mni,
  lus,
  kha,
  grt,
  brx,
  ne,
  hi,
  te,
};

/* ── 11-LANGUAGE REGISTRY ─────────────────────────────────────────
 * Single source of truth for all language metadata.
 * Do NOT scatter this across components.
 * ─────────────────────────────────────────────────────────────── */
export const LOCALE_META = [
  { code: 'en',  englishName: 'English',           nativeName: 'English',      script: 'Latin',       dir: 'ltr' },
  { code: 'as',  englishName: 'Assamese',          nativeName: 'অসমীয়া',     script: 'Bengali',     dir: 'ltr' },
  { code: 'bn',  englishName: 'Bengali',           nativeName: 'বাংলা',        script: 'Bengali',     dir: 'ltr' },
  { code: 'mni', englishName: 'Manipuri / Meitei', nativeName: 'মৈতৈলোন্',   script: 'MeeteiMayek', dir: 'ltr' },
  { code: 'lus', englishName: 'Mizo',              nativeName: 'Mizo tawng',   script: 'Latin',       dir: 'ltr' },
  { code: 'kha', englishName: 'Khasi',             nativeName: 'Khasi',        script: 'Latin',       dir: 'ltr' },
  { code: 'grt', englishName: 'Garo',              nativeName: 'Garo',         script: 'Latin',       dir: 'ltr' },
  { code: 'brx', englishName: 'Bodo',              nativeName: "बर'",          script: 'Devanagari',  dir: 'ltr' },
  { code: 'ne',  englishName: 'Nepali',            nativeName: 'नेपाली',       script: 'Devanagari',  dir: 'ltr' },
  { code: 'hi',  englishName: 'Hindi',             nativeName: 'हिंदी',        script: 'Devanagari',  dir: 'ltr' },
  { code: 'te',  englishName: 'Telugu',            nativeName: 'తెలుగు',       script: 'Telugu',      dir: 'ltr' },
];

export const LOCALE_CODES = LOCALE_META.map((l) => l.code);

/** Map from internal code → BCP-47 browser language tag for Web Speech API. */
export const LOCALE_BCP47 = {
  en:  'en-IN',
  as:  'as-IN',
  bn:  'bn-IN',
  mni: 'mni-IN',
  lus: 'lus',
  kha: 'kha',
  grt: 'grt',
  brx: 'brx-IN',
  ne:  'ne-NP',
  hi:  'hi-IN',
  te:  'te-IN',
};

/* ── MODULE-LEVEL DICT STATE ──────────────────────────────────────
 * These module-level variables hold the currently active dictionary
 * and English fallback. They are set synchronously — no async needed
 * since all locales are statically bundled.
 * ─────────────────────────────────────────────────────────────── */
let _enDict     = en;              // English is always available
let _activeDict = en;              // Default to English until provider initialises
let _activeLang = 'en';

/* ── SYNC TRANSLATE ───────────────────────────────────────────────
 * Used inside components. All dictionaries are pre-loaded at module
 * parse time — no async required.
 * ─────────────────────────────────────────────────────────────── */

/**
 * translate(key, vars?)
 * Synchronous. Fallback chain: activeLang → English → key itself.
 *
 * @param {string} key   Dot-notated key, e.g. 'home.greeting'
 * @param {object} vars  Interpolation map, e.g. { name: 'Mrs. Das', n: 2 }
 * @returns {string}
 */
export function translate(key, vars = {}) {
  let str = _activeDict[key] ?? _enDict[key] ?? key;
  // Simple {placeholder} interpolation
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? ''));
  });
  return str;
}

/* ── REACT CONTEXT ────────────────────────────────────────────── */
const LanguageContext = createContext(null);

const LS_KEY = 'memora_lang';

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && LOCALE_CODES.includes(saved)) return saved;
  } catch { /* ignore */ }
  return 'en';
}

/**
 * LanguageProvider — wrap your entire App with this.
 * Uses createElement instead of JSX so this file stays .js (no Vite config change needed).
 *
 * Language switching is now fully synchronous — no loading states, no flicker.
 * All 11 locale dictionaries are available immediately from the static bundle.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    // Initialise synchronously — no async needed
    const initialLang = getInitialLang();
    const dict = LOCALE_REGISTRY[initialLang] || en;
    _activeDict = dict;
    _activeLang = initialLang;
    // Set document lang/dir on initial mount
    if (typeof document !== 'undefined') {
      document.documentElement.lang = LOCALE_BCP47[initialLang] || initialLang;
      const meta = LOCALE_META.find(m => m.code === initialLang);
      document.documentElement.dir  = meta?.dir || 'ltr';
    }
    return initialLang;
  });

  const setLang = useCallback((code) => {
    if (!LOCALE_CODES.includes(code)) return;
    const dict = LOCALE_REGISTRY[code] || en;
    _activeDict = dict;
    _activeLang = code;
    try { localStorage.setItem(LS_KEY, code); } catch { /* ignore */ }
    if (typeof document !== 'undefined') {
      const meta = LOCALE_META.find(m => m.code === code);
      document.documentElement.lang = LOCALE_BCP47[code] || code;
      document.documentElement.dir  = meta?.dir || 'ltr';
    }
    setLangState(code);
  }, []);

  const t = useCallback((key, vars) => translate(key, vars), [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ready is always true since everything is synchronously loaded
  const value = { lang, setLang, t, ready: true, meta: LOCALE_META };

  return React.createElement(LanguageContext.Provider, { value }, children);
}

/**
 * useLanguage() — access localization from any component.
 *
 * const { lang, setLang, t } = useLanguage();
 * t('home.greeting', { name: 'Mrs. Das' })
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Graceful fallback if used outside provider (should not happen)
    return {
      lang: 'en',
      setLang: () => {},
      t: translate,
      ready: true,
      meta: LOCALE_META,
    };
  }
  return ctx;
}
