/**
 * src/utils/platform.js — Platform detection and native abstractions for Memora.
 *
 * Architecture:
 *   Components call helpers from this file.
 *   Capacitor-specific imports are isolated here.
 *   Components never import Capacitor directly.
 *
 * Exports:
 *   isNativeAndroid()     — true when running inside Capacitor Android
 *   isCapacitor()         — true when running inside any Capacitor shell
 *   getApiBaseUrl()       — environment-aware API base URL
 *   initializePlatform()  — call once on app startup
 */

/* ── DETECTION ──────────────────────────────────────────────────── */

/**
 * Returns true when running inside any Capacitor native shell.
 * Safe to call before Capacitor is initialized.
 * @returns {boolean}
 */
export function isCapacitor() {
  return typeof window !== 'undefined' && !!(window.Capacitor?.isNativePlatform?.());
}

/**
 * Returns true specifically when running as an Android native app.
 * @returns {boolean}
 */
export function isNativeAndroid() {
  return typeof window !== 'undefined' && window.Capacitor?.getPlatform?.() === 'android';
}

/**
 * Returns true when running in a standard browser (not Capacitor shell).
 * @returns {boolean}
 */
export function isWebBrowser() {
  return !isCapacitor();
}

/* ── API BASE URL ───────────────────────────────────────────────── */

/**
 * Returns the correct API base URL for the current environment.
 *
 * Priority:
 *   1. VITE_API_BASE_URL env var (set explicitly in .env or build config)
 *   2. Android emulator default: http://10.0.2.2:3001
 *   3. Web browser: '' (empty = relative path, routed via Vite proxy in dev)
 *
 * For physical Android device testing, set:
 *   VITE_API_BASE_URL=http://<YOUR-LAN-IP>:3001
 *
 * For deployed backend, set:
 *   VITE_API_BASE_URL=https://your-api.example.com
 *
 * @returns {string}
 */
export function getApiBaseUrl() {
  // Explicit override always wins
  const explicit = import.meta.env?.VITE_API_BASE_URL;
  if (explicit) return explicit;

  // Android emulator can reach the host PC at 10.0.2.2
  if (isNativeAndroid()) {
    return 'http://10.0.2.2:3001';
  }

  // Web browser: use relative paths (Vite proxy handles /api in dev)
  return '';
}

/* ── STATUS BAR ─────────────────────────────────────────────────── */

/**
 * Configure the Android status bar.
 * Safe to call on web (no-ops gracefully).
 */
export async function configureStatusBar() {
  if (!isNativeAndroid()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1a0a2e' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (e) {
    console.warn('[platform] StatusBar configuration failed:', e.message);
  }
}

/* ── SPLASH SCREEN ──────────────────────────────────────────────── */

/**
 * Hide the splash screen.
 * Call after the app has rendered its first meaningful frame.
 */
export async function hideSplashScreen() {
  if (!isCapacitor()) return;
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (e) {
    console.warn('[platform] SplashScreen.hide failed:', e.message);
  }
}

/* ── HAPTICS ────────────────────────────────────────────────────── */

/**
 * Light haptic feedback for positive game events.
 * Only runs on Android native. Silent no-op on web.
 *
 * @param {'success'|'warning'|'error'|'light'} style
 */
export async function hapticFeedback(style = 'light') {
  if (!isNativeAndroid()) return;
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');
    if (style === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (style === 'error') {
      await Haptics.notification({ type: NotificationType.Error });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (e) {
    // Haptics are optional — never block gameplay
    console.warn('[platform] Haptics failed:', e.message);
  }
}

/* ── PLATFORM INITIALIZATION ──────────────────────────────────────
 * Call once at app startup (from main.jsx or App.jsx).
 * ──────────────────────────────────────────────────────────────── */

/**
 * Initialize platform-specific behavior.
 * Safe to call in all environments — no-ops on web.
 */
export async function initializePlatform() {
  if (!isCapacitor()) return;

  // Configure status bar appearance
  await configureStatusBar();

  // Hide splash screen after a brief delay to allow React to render
  // SplashScreen auto-hides after launchShowDuration but we can also
  // hide it manually once the app is ready
  setTimeout(() => hideSplashScreen(), 500);
}
