/**
 * src/utils/ttsService.js — Text-to-Speech abstraction for Memora.
 *
 * Wraps the browser Web Speech API (SpeechSynthesis).
 * Graceful fallback when not supported.
 *
 * Aroha will import speak() and isTTSAvailable() from here.
 * Never make TTS mandatory — the app must work without it.
 *
 * Usage:
 *   speak(text, lang)      — read text aloud
 *   stopSpeaking()         — cancel current speech
 *   isTTSAvailable(lang)   — boolean, detect support
 *   getAvailableVoices(lang) — array of matching Voice objects
 */

import { LOCALE_BCP47 } from '../locales/index.js';

/* ── FEATURE DETECTION ──────────────────────────────────────────── */
export const TTS_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Check if TTS is available for a given locale code.
 * Considers browser support AND presence of a matching voice.
 *
 * @param {string} lang  Internal locale code, e.g. 'en', 'hi', 'mni'
 * @returns {boolean}
 */
export function isTTSAvailable(lang = 'en') {
  if (!TTS_SUPPORTED) return false;
  const bcp47 = LOCALE_BCP47[lang] || lang;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Voices may not be loaded yet — for 'en' assume available; others uncertain
    return lang === 'en';
  }
  return voices.some((v) => v.lang.startsWith(bcp47.split('-')[0]));
}

/**
 * Get all voices matching the given locale code.
 *
 * @param {string} lang  Internal locale code
 * @returns {SpeechSynthesisVoice[]}
 */
export function getAvailableVoices(lang = 'en') {
  if (!TTS_SUPPORTED) return [];
  const bcp47 = LOCALE_BCP47[lang] || lang;
  const langRoot = bcp47.split('-')[0];
  return window.speechSynthesis.getVoices().filter((v) =>
    v.lang.startsWith(langRoot)
  );
}

/* ── INTERNAL STATE ─────────────────────────────────────────────── */
let _currentUtterance = null;

/**
 * Speak text in the given locale.
 *
 * @param {string} text   Text to speak
 * @param {string} lang   Internal locale code (default 'en')
 * @param {object} opts   Optional override { rate, pitch, volume }
 */
export function speak(text, lang = 'en', opts = {}) {
  if (!TTS_SUPPORTED || !text) return;

  // Cancel any current speech first to avoid overlap
  stopSpeaking();

  const bcp47 = LOCALE_BCP47[lang] || lang;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = bcp47;
  utterance.rate = opts.rate ?? 0.9;     // slightly slower for elderly users
  utterance.pitch = opts.pitch ?? 1.0;
  utterance.volume = opts.volume ?? 1.0;

  // Try to find a matching voice
  const voices = getAvailableVoices(lang);
  if (voices.length > 0) utterance.voice = voices[0];

  utterance.onerror = (e) => {
    if (e.error !== 'interrupted') {
      console.warn('[ttsService] SpeechSynthesis error:', e.error);
    }
  };

  _currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any currently playing speech immediately.
 */
export function stopSpeaking() {
  if (!TTS_SUPPORTED) return;
  try {
    window.speechSynthesis.cancel();
    _currentUtterance = null;
  } catch (e) {
    console.warn('[ttsService] Could not stop speech:', e);
  }
}

/**
 * Returns true if speech is currently in progress.
 * @returns {boolean}
 */
export function isSpeaking() {
  if (!TTS_SUPPORTED) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Preload voices (call early, e.g. on first user interaction).
 * Browser voice list is async in some environments.
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function preloadVoices() {
  return new Promise((resolve) => {
    if (!TTS_SUPPORTED) { resolve([]); return; }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(window.speechSynthesis.getVoices());
    }, { once: true });
  });
}
