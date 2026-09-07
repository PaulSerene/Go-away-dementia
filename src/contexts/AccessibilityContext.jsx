/**
 * src/contexts/AccessibilityContext.jsx
 *
 * React Context for accessibility preferences:
 *   { prefs, setPref, togglePref }
 *
 * prefs shape:
 *   { largeText: bool, highContrast: bool, reducedMotion: bool }
 *
 * Usage:
 *   const { prefs, togglePref } = useAccessibility();
 *   togglePref('largeText');
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadPrefs, savePrefs, applyPrefsToDOM } from '../utils/accessibilityPrefs.js';

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    const loaded = loadPrefs();
    applyPrefsToDOM(loaded);
    return loaded;
  });

  // Sync OS prefers-reduced-motion on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && !prefs.reducedMotion) {
      const next = { ...prefs, reducedMotion: true };
      setPrefs(next);
      savePrefs(next);
      applyPrefsToDOM(next);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPref = useCallback((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      applyPrefsToDOM(next);
      return next;
    });
  }, []);

  const togglePref = useCallback((key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePrefs(next);
      applyPrefsToDOM(next);
      return next;
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={{ prefs, setPref, togglePref }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    return {
      prefs: { largeText: false, highContrast: false, reducedMotion: false },
      setPref: () => {},
      togglePref: () => {},
    };
  }
  return ctx;
}
