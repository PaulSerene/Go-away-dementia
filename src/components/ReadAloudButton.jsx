/**
 * ReadAloudButton.jsx — Optional TTS trigger for Memora.
 *
 * Speaks provided text using the current language.
 * Handles speak/stop toggle. Hides itself when TTS is unavailable.
 *
 * Usage:
 *   <ReadAloudButton text="Listen to a short story and answer questions." />
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../locales/index.js';
import { speak, stopSpeaking, isTTSAvailable, isSpeaking } from '../utils/ttsService.js';
import './ReadAloudButton.css';

export default function ReadAloudButton({ text, className = '' }) {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(false);
  const available = isTTSAvailable(lang);

  // Stop speech when component unmounts or text/lang changes
  useEffect(() => {
    return () => {
      if (isSpeaking()) stopSpeaking();
    };
  }, [text, lang]);

  if (!available) return null;

  function handleClick() {
    if (active) {
      stopSpeaking();
      setActive(false);
    } else {
      speak(text, lang);
      setActive(true);
      // Reset button when speech ends (poll for speaking state)
      const poll = setInterval(() => {
        if (!isSpeaking()) {
          setActive(false);
          clearInterval(poll);
        }
      }, 300);
    }
  }

  return (
    <button
      className={`rab-btn ${active ? 'rab-btn--active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={active ? t('readAloud.btn.stop') : t('readAloud.btn.speak')}
      aria-pressed={active}
      type="button"
    >
      {active ? t('readAloud.btn.stop') : t('readAloud.btn.speak')}
    </button>
  );
}
