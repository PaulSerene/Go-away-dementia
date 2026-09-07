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
 */

import { createContext, useContext, useState, useCallback } from 'react';
import React from 'react';


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

/* ── LAZY LOCALE LOADER ───────────────────────────────────────────
 * Locale dictionaries are loaded lazily so non-English locales do
 * not increase initial JS parse time. English is always pre-loaded.
 * ─────────────────────────────────────────────────────────────── */
const _cache = {};

async function loadLocale(code) {
  if (_cache[code]) return _cache[code];
  try {
    const mod = await import(`./${code}.js`);
    _cache[code] = mod.default || mod;
    return _cache[code];
  } catch {
    // Locale file not yet created — return empty so English fallback takes over.
    _cache[code] = {};
    return {};
  }
}

/* ── SYNC TRANSLATE ───────────────────────────────────────────────
 * Used inside components. Dictionaries must be pre-loaded by the
 * LanguageProvider before components render.
 * ─────────────────────────────────────────────────────────────── */
let _enDict = {};
let _activeDict = {};
let _activeLang = 'en';

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
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);
  const [ready, setReady] = useState(false);

  // Load English on mount (always needed for fallback)
  // Then load selected lang if different.
  useState(() => {
    const initialLang = getInitialLang();
    import('./en.js').then((mod) => {
      _enDict = mod.default || mod;
      _cache['en'] = _enDict;
      if (initialLang === 'en') {
        _activeDict = _enDict;
        _activeLang = 'en';
        setReady(true);
      } else {
        loadLocale(initialLang).then((dict) => {
          _activeDict = dict;
          _activeLang = initialLang;
          setReady(true);
        });
      }
    });
  });

  const setLang = useCallback(async (code) => {
    if (!LOCALE_CODES.includes(code)) return;
    if (code !== 'en') {
      const dict = await loadLocale(code);
      _activeDict = dict;
    } else {
      _activeDict = _enDict;
    }
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

  const value = { lang, setLang, t, ready, meta: LOCALE_META };

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
