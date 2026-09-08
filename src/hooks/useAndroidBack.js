/**
 * src/hooks/useAndroidBack.js — Android hardware back button handler.
 *
 * Usage in a component:
 *
 *   useAndroidBack(() => {
 *     // handle back press
 *     navigate('patient-home');
 *   });
 *
 * For games in progress:
 *
 *   useAndroidBack(() => {
 *     if (gameInProgress) {
 *       setShowExitConfirm(true);  // show confirmation dialog
 *     } else {
 *       navigate('games-hub');
 *     }
 *   });
 *
 * IMPORTANT:
 *   Only one listener should be active at a time.
 *   This hook registers and deregisters on mount/unmount.
 *   On web browser, back button does nothing (normal browser handles it).
 */

import { useEffect } from 'react';

/**
 * Register a handler for the Android hardware/gesture back button.
 * Automatically cleans up on component unmount.
 *
 * @param {() => void} handler  Function to call when back is pressed.
 * @param {any[]}      deps     React dependency array (re-registers if deps change).
 */
export function useAndroidBack(handler, deps = []) {
  useEffect(() => {
    // Only register on Capacitor Android to avoid interfering with browser back
    if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform?.()) {
      return;
    }

    let listener = null;

    // Dynamically import Capacitor App plugin to keep web bundle clean
    import('@capacitor/app').then(({ App }) => {
      App.addListener('backButton', ({ canGoBack }) => {
        handler({ canGoBack });
      }).then((l) => {
        listener = l;
      });
    }).catch((e) => {
      console.warn('[useAndroidBack] Capacitor App plugin unavailable:', e.message);
    });

    return () => {
      listener?.remove?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
