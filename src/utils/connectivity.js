/**
 * connectivity.js — Browser connectivity detection for Memora.
 *
 * Uses the browser's native online/offline events.
 * navigator.onLine reflects whether the device has any network interface;
 * it is NOT a guarantee that the Memora backend is reachable.  For this
 * SIH prototype that distinction is fine — API errors are the secondary
 * signal and result in items being enqueued for retry.
 *
 * Exports:
 *   isOnline()          — synchronous snapshot (usable outside React)
 *   useConnectivity()   — React hook, re-renders component on state change
 */

import { useState, useEffect } from 'react';

/**
 * Synchronously returns whether the browser currently reports online status.
 * Safe to call outside of React components.
 * @returns {boolean}
 */
export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * React hook — returns true while the browser believes it is online.
 * The component using this hook re-renders whenever connectivity changes.
 *
 * Usage:
 *   const online = useConnectivity();
 *   if (!online) { ... }
 *
 * @returns {boolean}
 */
export function useConnectivity() {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const goOnline  = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
