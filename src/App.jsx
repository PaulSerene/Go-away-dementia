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
import './App.css';
import './components/PatientHome.css';

/* ── Offline banner ───────────────────────────────────────
 * Rendered above every screen when connectivity is lost.
 * Uses position:fixed so it floats above all existing layouts.
 * ─────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner" role="status" aria-live="polite">
      📵 Offline — changes are saved locally and will sync when you reconnect.
    </div>
  );
}

/* ---- Small reusable Header component ---- */
function Header() {
  return (
    <header className="header">
      {/* Brand / logo area */}
      <span className="header__brand">
        <span className="header__brand-icon">🧠</span>
        Memora
      </span>

      {/* Small badge on the right */}
      <span className="header__badge">SIH 2026 · NE India</span>
    </header>
  );
}

/* ---- Small reusable Footer component ---- */
function Footer() {
  return (
    <footer className="footer">
      <p>
        <strong>Memora</strong> · AI Cognitive &amp; Memory Companion ·
        Built for SIH 2026 Problem Statement SIH26003
      </p>
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

  /* Data for the two mode cards — stored as an array of objects */
  const modes = [
    {
      id: 'patient',
      icon: '👴',
      title: 'Patient Mode',
      desc: 'Cognitive activities, memory games, and daily reminders designed for elderly users.',
      theme: 'patient',
    },
    {
      id: 'caregiver',
      icon: '👨‍👩‍👧',
      title: 'Caregiver Mode',
      desc: 'Monitor progress, manage care plans, and stay connected with your loved one.',
      theme: 'caregiver',
    },
  ];

  /* Offline banner shown on ALL screens when connectivity is lost */
  const banner = !isOnline ? <OfflineBanner /> : null;

  /* Patient Home */
  if (currentScreen === 'patient-home') {
    return <>{banner}<PatientHome navigate={navigate} /></>;
  }

  /* Today's Activity — "Remember the Objects" memory game */
  if (currentScreen === 'patient-activity') {
    return <>{banner}<MemoryGame navigate={navigate} /></>;
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
    return <>{banner}<WordChain navigate={navigate} /></>;
  }

  if (currentScreen === 'game-movement') {
    return <>{banner}<MovementGame navigate={navigate} /></>;
  }

  if (currentScreen === 'game-story-recall') {
    return <>{banner}<StoryRecall navigate={navigate} /></>;
  }

  if (currentScreen === 'game-rearrange') {
    return <>{banner}<RearrangeGame navigate={navigate} /></>;
  }

  if (currentScreen === 'game-music-memory') {
    return <>{banner}<MusicMemory navigate={navigate} /></>;
  }

  if (currentScreen === 'game-remember-me') {
    return <>{banner}<RememberMe navigate={navigate} /></>;
  }

  if (currentScreen === 'game-path-tracer') {
    return <>{banner}<PathTracer navigate={navigate} /></>;
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
          <span className="hero__tag">🇮🇳 North Eastern India</span>

          {/* Main title */}
          <h1 className="hero__title">Memora</h1>

          {/* Subtitle */}
          <p className="hero__subtitle">AI Cognitive &amp; Memory Companion</p>

          {/* Description */}
          <p className="hero__desc">
            Memora supports elderly dementia patients with guided cognitive
            activities, personalised memory assistance, and real-time caregiver
            tools — all in one accessible, compassionate platform.
          </p>

          {/* Feature pills — quick visual summary of what Smriti offers */}
          <div className="feature-pills" aria-label="Key features">
            <span className="pill">🧩 Cognitive Activities</span>
            <span className="pill">🧠 Memory Assistance</span>
            <span className="pill">❤️ Caregiver Support</span>
            <span className="pill">🌿 NE Languages</span>
          </div>

          {/* Mode selection heading */}
          <h2 className="mode-heading">Choose Your Mode</h2>
          <p className="mode-subheading">
            Select the experience that matches your role
          </p>

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

export default App;
