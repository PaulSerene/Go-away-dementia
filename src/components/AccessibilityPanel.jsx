/**
 * AccessibilityPanel.jsx — Accessibility Settings UI for Memora.
 *
 * Elderly-friendly panel controlling:
 *   - Text size (Normal / Large)
 *   - High contrast mode
 *   - Reduced motion
 *
 * Large touch targets, visible labels, keyboard accessible.
 * Also contains the Language button trigger (opens LanguagePicker).
 */

import { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';
import { useLanguage } from '../locales/index.js';
import LanguagePicker from './LanguagePicker.jsx';
import './AccessibilityPanel.css';

export default function AccessibilityPanel({ onClose }) {
  const { prefs, togglePref } = useAccessibility();
  const { t, lang, meta } = useLanguage();
  const [showLang, setShowLang] = useState(false);

  const currentMeta = meta.find((m) => m.code === lang);

  return (
    <>
      <div
        className="a11y-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t('a11y.settings.heading')}
      >
        <div className="a11y-panel">
          <div className="a11y-header">
            <h2 className="a11y-heading">{t('a11y.settings.heading')}</h2>
            <button
              className="a11y-close"
              onClick={onClose}
              aria-label={t('a11y.settings.close')}
            >
              ✕
            </button>
          </div>

          {/* ── LANGUAGE ─────────────────────────────── */}
          <div className="a11y-row">
            <span className="a11y-row__label">🌐 {t('lang.picker.heading')}</span>
            <button
              className="a11y-pill-btn"
              onClick={() => setShowLang(true)}
              aria-label={t('lang.picker.label', { lang: currentMeta?.englishName || lang })}
            >
              {currentMeta?.englishName || lang}
              {currentMeta?.nativeName && currentMeta.nativeName !== currentMeta.englishName && (
                <span className="a11y-pill-btn__native"> — {currentMeta.nativeName}</span>
              )}
            </button>
          </div>

          {/* ── TEXT SIZE ─────────────────────────────── */}
          <div className="a11y-row">
            <span className="a11y-row__label">🔤 {t('a11y.text.label')}</span>
            <div className="a11y-toggle-group" role="radiogroup" aria-label={t('a11y.text.label')}>
              <button
                className={`a11y-toggle ${!prefs.largeText ? 'a11y-toggle--on' : ''}`}
                role="radio"
                aria-checked={!prefs.largeText}
                onClick={() => prefs.largeText && togglePref('largeText')}
              >
                {t('a11y.text.normal')}
              </button>
              <button
                className={`a11y-toggle ${prefs.largeText ? 'a11y-toggle--on' : ''}`}
                role="radio"
                aria-checked={!!prefs.largeText}
                onClick={() => !prefs.largeText && togglePref('largeText')}
              >
                {t('a11y.text.large')}
              </button>
            </div>
          </div>

          {/* ── HIGH CONTRAST ─────────────────────────── */}
          <div className="a11y-row">
            <span className="a11y-row__label">🌗 {t('a11y.contrast.label')}</span>
            <button
              className={`a11y-switch ${prefs.highContrast ? 'a11y-switch--on' : ''}`}
              role="switch"
              aria-checked={!!prefs.highContrast}
              onClick={() => togglePref('highContrast')}
              aria-label={t('a11y.contrast.label')}
            >
              <span className="a11y-switch__knob" />
              <span className="a11y-switch__label">
                {prefs.highContrast ? t('a11y.contrast.on') : t('a11y.contrast.off')}
              </span>
            </button>
          </div>

          {/* ── REDUCED MOTION ────────────────────────── */}
          <div className="a11y-row">
            <span className="a11y-row__label">✨ {t('a11y.motion.label')}</span>
            <button
              className={`a11y-switch ${prefs.reducedMotion ? 'a11y-switch--on' : ''}`}
              role="switch"
              aria-checked={!!prefs.reducedMotion}
              onClick={() => togglePref('reducedMotion')}
              aria-label={t('a11y.motion.label')}
            >
              <span className="a11y-switch__knob" />
              <span className="a11y-switch__label">
                {prefs.reducedMotion ? t('a11y.motion.on') : t('a11y.motion.off')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showLang && (
        <LanguagePicker onClose={() => setShowLang(false)} />
      )}
    </>
  );
}
