/**
 * LanguagePicker.jsx — 11-language selector for Memora.
 *
 * Accessible, elderly-friendly language picker.
 * Shows both English and native language names.
 * Large touch targets. Keyboard accessible.
 */

import { useState } from 'react';
import { LOCALE_META } from '../locales/index.js';
import { useLanguage } from '../locales/index.js';
import './LanguagePicker.css';

export default function LanguagePicker({ onClose }) {
  const { lang, setLang, t } = useLanguage();
  const [changing, setChanging] = useState(false);

  async function handleSelect(code) {
    if (code === lang) { onClose?.(); return; }
    setChanging(true);
    await setLang(code);
    setChanging(false);
    onClose?.();
  }

  return (
    <div
      className="lp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('lang.picker.heading')}
    >
      <div className="lp-panel">
        <div className="lp-header">
          <h2 className="lp-heading">{t('lang.picker.heading')}</h2>
          <button
            className="lp-close"
            onClick={onClose}
            aria-label={t('lang.picker.close')}
          >
            ✕
          </button>
        </div>

        <ul className="lp-list" role="listbox" aria-label={t('lang.picker.heading')}>
          {LOCALE_META.map((locale) => {
            const isSelected = locale.code === lang;
            return (
              <li key={locale.code} role="option" aria-selected={isSelected}>
                <button
                  className={`lp-item ${isSelected ? 'lp-item--selected' : ''}`}
                  onClick={() => handleSelect(locale.code)}
                  disabled={changing}
                  aria-label={`${locale.englishName} — ${locale.nativeName}`}
                >
                  <span className="lp-item__names">
                    <span className="lp-item__english">{locale.englishName}</span>
                    {locale.nativeName !== locale.englishName && (
                      <span className="lp-item__native">{locale.nativeName}</span>
                    )}
                  </span>
                  {isSelected && (
                    <span className="lp-item__check" aria-label={t('lang.picker.selected')}>✓</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="lp-note">
          More languages coming soon.
        </p>
      </div>
    </div>
  );
}
