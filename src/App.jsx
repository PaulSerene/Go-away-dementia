/*
 * App.jsx — the root component of the Smriti app.
 *
 * In React, a "component" is a JavaScript function that returns
 * HTML-like code (called JSX). React builds the whole UI by
 * composing these components together like Lego blocks.
 *
 * This file manages app-level navigation using a simple
 * "currentScreen" state string. No external router is needed
 * for this stage — React's useState is enough.
 *
 * Screens:
 *   'landing'             → Landing page (mode selector)
 *   'patient-home'        → Patient Home dashboard
 *   'patient-activity'    → "Remember the Objects" memory game (MemoryGame)
 *   'patient-activities'  → My Progress screen (PatientProgress)
 *   'patient-memories'    → My Memories screen (PatientMemories)
 *   'patient-reminders'   → Patient Reminders screen
 *   'caregiver-dashboard' → Caregiver Dashboard
 *   'caregiver-memories'  → Caregiver Memory Management
 *   'caregiver-reminders' → Caregiver Reminder Management
 */

import { useState, useEffect, useRef } from 'react';
import ModeCard from './components/ModeCard';
import PatientHome from './components/PatientHome';
import PatientPlaceholder from './components/PatientPlaceholder';
import MemoryGame from './components/MemoryGame';
import PatientProgress from './components/PatientProgress';
import PatientMemories from './components/PatientMemories';
import CaregiverDashboard from './components/CaregiverDashboard';
import CaregiverMemories from './components/CaregiverMemories';
import CaregiverReminders from './components/CaregiverReminders';
import PatientReminders from './components/PatientReminders';
import CulturalBackground from './components/CulturalBackground';
import GamesHub from './components/games/GamesHub';
import WordChain from './components/games/WordChain';
import MovementGame from './components/games/MovementGame';
import StoryRecall from './components/games/StoryRecall';
import RearrangeGame from './components/games/RearrangeGame';
import MusicMemory from './components/games/MusicMemory';
import RememberMe from './components/games/RememberMe';
import PathTracer from './components/games/PathTracer';
import { getOrCreatePatientId, getOrCreateCaregiverId, getCachedPatientId } from './utils/identity.js';
import { useConnectivity } from './utils/connectivity.js';
import { processQueue } from './utils/syncQueue.js';
import { LanguageProvider, useLanguage } from './locales/index.js';
import { AccessibilityProvider } from './contexts/AccessibilityContext.jsx';
import AccessibilityPanel from './components/AccessibilityPanel.jsx';
import { useAndroidBack } from './hooks/useAndroidBack.js';
import './App.css';
import './components/PatientHome.css';

/* ── Offline banner ───────────────────────────────────────
 * Rendered above every screen when connectivity is lost.
 * Uses position:fixed so it floats above all existing layouts.
 * ─────────────────────────────────────────────────────── */
function OfflineBanner() {
  const { t } = useLanguage();
  return (
    <div className="offline-banner" role="status" aria-live="polite">
      {t('offline.banner')}
    </div>
  );
}

/* ---- Small reusable Header component ---- */
function Header() {
  const { t } = useLanguage();
  const [showA11y, setShowA11y] = useState(false);
  return (
    <>
      <header className="header">
        {/* Brand / logo area */}
        <span className="header__brand">
          <span className="header__brand-icon">🧠</span>
          {t('app.name')}
        </span>

        <div className="header__right">
          {/* Accessibility / Language button */}
          <button
            className="header__a11y-btn"
            onClick={() => setShowA11y(true)}
            aria-label={t('a11y.settings.btn')}
            title={t('a11y.settings.btn')}
          >
            ⚙
          </button>
          {/* Small badge */}
          <span className="header__badge">{t('app.badge')}</span>
        </div>
      </header>

      {showA11y && <AccessibilityPanel onClose={() => setShowA11y(false)} />}
    </>
  );
}

/* ---- Small reusable Footer component ---- */
function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <p>{t('footer.text')}</p>
    </footer>
  );
}

/* ---- The main App component ---- */
function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  /* Connectivity state — re-renders this component when it changes */
  const isOnline = useConnectivity();

  /* Track previous online state so we only process the queue on TRANSITION */
  const prevOnlineRef = useRef(isOnline);

  /*
   * Seed demo user IDs in the DB on app first load.
   * Runs once ([] dependency). If the backend is down, it fails
   * silently — all components fall back to localStorage.
   */
  useEffect(() => {
    getOrCreatePatientId();
    getOrCreateCaregiverId();
  }, []);

  /*
   * Process the offline sync queue whenever we come online.
   * Also runs on mount (isOnline may already be true — handle items
   * queued in a previous offline session that survived page refresh).
   */
  useEffect(() => {
    if (isOnline) {
      const patientId = getCachedPatientId();
      if (patientId) {
        processQueue(patientId).catch(() => {});
      }
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);


  /*
   * navigate is a helper function we pass down as a prop.
   * Any child component can call navigate('screen-name')
   * to switch screens — without needing access to useState directly.
   */
  const navigate = (screen) => setCurrentScreen(screen);

  const { t } = useLanguage();

  // ── ANDROID BACK BUTTON ─────────────────────────────────────────
  // Map each screen to where Android back should go.
  // Game screens during active play show a confirmation dialog instead.
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Screens that are "game" screens — back shows confirmation
  const GAME_SCREENS = [
    'patient-activity', 'game-word-chain', 'game-movement',
    'game-story-recall', 'game-rearrange', 'game-music-memory',
    'game-remember-me', 'game-path-tracer',
  ];

  // Back navigation map: screen → previous screen
  const BACK_MAP = {
    'patient-home':         'landing',
    'games-hub':            'patient-home',
    'patient-activity':     'games-hub',
    'game-word-chain':      'games-hub',
    'game-movement':        'games-hub',
    'game-story-recall':    'games-hub',
    'game-rearrange':       'games-hub',
    'game-music-memory':    'games-hub',
    'game-remember-me':     'games-hub',
    'game-path-tracer':     'games-hub',
    'patient-activities':   'patient-home',
    'patient-memories':     'patient-home',
    'patient-reminders':    'patient-home',
    'caregiver-dashboard':  'landing',
    'caregiver-memories':   'caregiver-dashboard',
    'caregiver-reminders':  'caregiver-dashboard',
  };

  useAndroidBack(() => {
    // Close exit confirmation dialog first if open
    if (showExitConfirm) {
      setShowExitConfirm(false);
      return;
    }
    // Game screens: show confirmation before leaving
    if (GAME_SCREENS.includes(currentScreen)) {
      setShowExitConfirm(true);
      return;
    }
    const prev = BACK_MAP[currentScreen];
    if (prev) {
      navigate(prev);
    } else if (currentScreen === 'landing') {
      // On landing page: allow Android to exit the app
      // (Capacitor handles this by default when no listener consumes the event)
    }
  }, [currentScreen, showExitConfirm]);
  /* Data for the two mode cards — stored as an array of objects */
  const modes = [
    {
      id: 'patient',
      icon: '👴',
      title: t('landing.patient.title'),
      desc: t('landing.patient.desc'),
      theme: 'patient',
    },
    {
      id: 'caregiver',
      icon: '👨‍👩‍👧',
      title: t('landing.caregiver.title'),
      desc: t('landing.caregiver.desc'),
      theme: 'caregiver',
    },
  ];

  /* Offline banner shown on ALL screens when connectivity is lost */
  const banner = !isOnline ? <OfflineBanner /> : null;

  /* ── ANDROID GAME EXIT CONFIRMATION DIALOG ─────────────────────
   * Overlays on top of whatever game is currently showing.
   * Only appears when Android back is pressed during an active game.
   * ─────────────────────────────────────────────────────────────── */
  const exitConfirmDialog = showExitConfirm ? (
    <div className="android-exit-overlay" role="dialog" aria-modal="true" aria-label={t('game.exit.stay')}>
      <div className="android-exit-dialog">
        <p className="android-exit-dialog__msg">
          {t('game.exit.confirm')}
        </p>
        <div className="android-exit-dialog__actions">
          <button
            className="android-exit-dialog__btn android-exit-dialog__btn--stay"
            onClick={() => setShowExitConfirm(false)}
          >
            {t('game.exit.stay')}
          </button>
          <button
            className="android-exit-dialog__btn android-exit-dialog__btn--leave"
            onClick={() => {
              setShowExitConfirm(false);
              navigate('games-hub');
            }}
          >
            {t('game.exit.leave')}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  /* Patient Home */
  if (currentScreen === 'patient-home') {
    return <>{banner}<PatientHome navigate={navigate} /></>;
  }

  /* Today's Activity — "Remember the Objects" memory game */
  if (currentScreen === 'patient-activity') {
    return <>{banner}{exitConfirmDialog}<MemoryGame navigate={navigate} /></>;
  }

  /* Activities tab — My Progress */
  if (currentScreen === 'patient-activities') {
    return <>{banner}<PatientProgress navigate={navigate} /></>;
  }

  /* Memories tab — My Memories */
  if (currentScreen === 'patient-memories') {
    return <>{banner}<PatientMemories navigate={navigate} /></>;
  }

  /* Caregiver Dashboard */
  if (currentScreen === 'caregiver-dashboard') {
    return <>{banner}<CaregiverDashboard navigate={navigate} /></>;
  }

  /* Caregiver Memory Management */
  if (currentScreen === 'caregiver-memories') {
    return <>{banner}<CaregiverMemories navigate={navigate} /></>;
  }

  /* Patient Reminders */
  if (currentScreen === 'patient-reminders') {
    return <>{banner}<PatientReminders navigate={navigate} /></>;
  }

  /* Caregiver Reminder Management */
  if (currentScreen === 'caregiver-reminders') {
    return <>{banner}<CaregiverReminders navigate={navigate} /></>;
  }

  /* ── COGNITIVE GAMES HUB ──────────────────────────────── */
  if (currentScreen === 'games-hub') {
    return <>{banner}<GamesHub navigate={navigate} /></>;
  }

  /* ── INDIVIDUAL GAMES ────────────────────────────────── */
  if (currentScreen === 'game-word-chain') {
    return <>{banner}{exitConfirmDialog}<WordChain navigate={navigate} /></>;
  }

  if (currentScreen === 'game-movement') {
    return <>{banner}{exitConfirmDialog}<MovementGame navigate={navigate} /></>;
  }

  if (currentScreen === 'game-story-recall') {
    return <>{banner}{exitConfirmDialog}<StoryRecall navigate={navigate} /></>;
  }

  if (currentScreen === 'game-rearrange') {
    return <>{banner}{exitConfirmDialog}<RearrangeGame navigate={navigate} /></>;
  }

  if (currentScreen === 'game-music-memory') {
    return <>{banner}{exitConfirmDialog}<MusicMemory navigate={navigate} /></>;
  }

  if (currentScreen === 'game-remember-me') {
    return <>{banner}{exitConfirmDialog}<RememberMe navigate={navigate} /></>;
  }

  if (currentScreen === 'game-path-tracer') {
    return <>{banner}{exitConfirmDialog}<PathTracer navigate={navigate} /></>;
  }

  /* ── LANDING PAGE (default) ───────────────────────────── */
  return (
    <CulturalBackground variant="landing">
      <div className="app app--transparent">
        {/* Sticky header at the top */}
        <Header />

        {/* Main content area */}
        <main className="hero">

          {/* Small decorative tag */}
          <span className="hero__tag">🇮🇳 {t('app.badge')}</span>

          {/* Main title */}
          <h1 className="hero__title">{t('app.name')}</h1>

          {/* Subtitle */}
          <p className="hero__subtitle">{t('app.tagline')}</p>

          {/* Description */}
          <p className="hero__desc">
            {t('landing.subheading')}
          </p>

          {/* Safety / Wellness disclaimer */}
          <p className="hero__disclaimer">{t('landing.disclaimer')}</p>

          {/* Feature pills */}
          <div className="feature-pills" aria-label="Key features">
            <span className="pill">🧩 {t('hub.cat.memory')}</span>
            <span className="pill">🧠 {t('hub.title')}</span>
            <span className="pill">❤️ {t('landing.caregiver.title')}</span>
            <span className="pill">🌿 {t('lang.picker.heading')}</span>
          </div>

          {/* Mode selection heading */}
          <h2 className="mode-heading">{t('landing.select')}</h2>

          {/*
           * Mode cards grid.
           * We use .map() to loop over the modes array and render
           * one <ModeCard /> per mode — cleaner than writing two
           * separate card blocks by hand.
           */}
          <div className="mode-cards">
            {modes.map((mode) => (
              <ModeCard
                key={mode.id}
                icon={mode.icon}
                title={mode.title}
                desc={mode.desc}
                theme={mode.theme}
                /*
                 * When Patient Mode is clicked → go to patient-home.
                 * Caregiver Mode is not built yet so we fall back to a
                 * simple alert (will be replaced in a future session).
                 */
                onClick={() => {
                  if (mode.id === 'patient') {
                    navigate('patient-home');
                  } else {
                    navigate('caregiver-dashboard');
                  }
                }}
              />
            ))}
          </div>

        </main>

        <Footer />
      </div>
    </CulturalBackground>
  );
}

/* ── ROOT EXPORT: wrapped in both providers ─────────────────────── */
function Root() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default Root;
