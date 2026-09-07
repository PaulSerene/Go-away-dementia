/**
 * src/utils/sttService.js — Speech-to-Text abstraction for Memora.
 *
 * Wraps browser SpeechRecognition / webkitSpeechRecognition.
 * Used by Aroha AI for voice input (Milestone 2).
 * This file establishes the API; integration comes in the next milestone.
 *
 * Never make STT mandatory — text input is always the fallback.
 * Microphone permission must never be requested without user intent.
 *
 * Usage:
 *   isSTTAvailable(lang)                    → boolean
 *   createRecognizer(lang, onResult, onError) → recognizer object with start()/stop()
 */

import { LOCALE_BCP47 } from '../locales/index.js';

/* ── FEATURE DETECTION ──────────────────────────────────────────── */
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
    : null;

export const STT_SUPPORTED = SpeechRecognition !== null;

/**
 * Languages with known reasonable browser STT support.
 * Others fall back to text input silently.
 */
const LIKELY_STT_SUPPORTED = new Set(['en', 'hi', 'bn', 'te', 'ne', 'as']);

/**
 * Check if STT is likely available for the given locale.
 * Combines browser capability check with known language support.
 *
 * @param {string} lang  Internal locale code
 * @returns {boolean}
 */
export function isSTTAvailable(lang = 'en') {
  return STT_SUPPORTED && LIKELY_STT_SUPPORTED.has(lang);
}

/**
 * Create a speech recognizer for the given locale.
 * Returns a controller object with start() and stop() methods.
 * Returns null if STT is not available.
 *
 * @param {string}   lang      Internal locale code
 * @param {function} onResult  Callback(transcript: string, isFinal: boolean)
 * @param {function} onError   Callback(errorCode: string)
 * @returns {{ start: function, stop: function } | null}
 */
export function createRecognizer(lang = 'en', onResult, onError) {
  if (!STT_SUPPORTED) {
    onError?.('not-supported');
    return null;
  }

  const bcp47 = LOCALE_BCP47[lang] || lang;
  const recognizer = new SpeechRecognition();

  recognizer.lang = bcp47;
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript.trim();
      const isFinal = result.isFinal;
      onResult?.(transcript, isFinal);
    }
  };

  recognizer.onerror = (event) => {
    const code = event.error;
    if (code === 'not-allowed') {
      console.warn('[sttService] Microphone permission denied.');
    } else if (code === 'no-speech') {
      // User didn't speak — not a crash-worthy error
    } else if (code === 'language-not-supported') {
      console.warn(`[sttService] Language not supported: ${bcp47}`);
    } else {
      console.warn('[sttService] STT error:', code);
    }
    onError?.(code);
  };

  recognizer.onnomatch = () => {
    onError?.('no-match');
  };

  return {
    start() {
      try {
        recognizer.start();
      } catch (e) {
        console.warn('[sttService] Could not start recognizer:', e.message);
        onError?.('start-failed');
      }
    },
    stop() {
      try {
        recognizer.stop();
      } catch (e) {
        // Ignore errors on stop — recognizer may already be stopped
      }
    },
    abort() {
      try {
        recognizer.abort();
      } catch (e) { /* ignore */ }
    },
  };
}
