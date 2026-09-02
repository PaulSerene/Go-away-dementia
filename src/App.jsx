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
 *   'landing'            → Landing page (mode selector)
 *   'patient-home'       → Patient Home dashboard
 *   'patient-activity'   → "Remember the Objects" memory game (MemoryGame)
 *   'patient-activities' → My Progress screen (PatientProgress)
 *   'patient-memories'   → My Memories screen (PatientMemories)
 *   'patient-reminders'  → Reminders tab (placeholder)
 */

import { useState } from 'react';
import ModeCard from './components/ModeCard';
import PatientHome from './components/PatientHome';
import PatientPlaceholder from './components/PatientPlaceholder';
import MemoryGame from './components/MemoryGame';
import PatientProgress from './components/PatientProgress';
import PatientMemories from './components/PatientMemories';
import './App.css';
import './components/PatientHome.css';

/* ---- Small reusable Header component ---- */
function Header() {
  return (
    <header className="header">
      {/* Brand / logo area */}
      <span className="header__brand">
        <span className="header__brand-icon">🧠</span>
        Smriti
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
        <strong>Smriti</strong> · AI Cognitive &amp; Memory Companion ·
        Built for SIH 2026 Problem Statement SIH26003
      </p>
    </footer>
  );
}

/* ---- The main App component ---- */
function App() {
  /*
   * currentScreen stores which screen to show.
   * Starts as 'landing' — the mode-selection page.
   *
   * When navigate() is called (e.g. navigate('patient-home')),
   * React re-renders the page and shows the new screen.
   * This is called "client-side navigation without a router".
   */
  const [currentScreen, setCurrentScreen] = useState('landing');

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

  /* ── SCREEN ROUTER ────────────────────────────────────────
   *
   * We check currentScreen and return the matching component.
   * This replaces React Router for this stage of the project.
   *
   * React concept used: "conditional rendering" — returning
   * different JSX based on a state value.
   * ─────────────────────────────────────────────────────── */

  /* Patient Home */
  if (currentScreen === 'patient-home') {
    return <PatientHome navigate={navigate} />;
  }

  /* Today's Activity — "Remember the Objects" memory game */
  if (currentScreen === 'patient-activity') {
    return <MemoryGame navigate={navigate} />;
  }

  /* Activities tab — My Progress */
  if (currentScreen === 'patient-activities') {
    return <PatientProgress navigate={navigate} />;
  }

  /* Memories tab — My Memories */
  if (currentScreen === 'patient-memories') {
    return <PatientMemories navigate={navigate} />;
  }

  /* Reminders tab placeholder */
  if (currentScreen === 'patient-reminders') {
    return (
      <PatientPlaceholder
        title="Reminders"
        emoji="⏰"
        message="Medicine, water, walks — all your daily reminders in one place."
        navigate={navigate}
        activeTab="reminders"
      />
    );
  }

  /* ── LANDING PAGE (default) ───────────────────────────── */
  return (
    <div className="app">
      {/* Sticky header at the top */}
      <Header />

      {/* Main content area */}
      <main className="hero">

        {/* Small decorative tag */}
        <span className="hero__tag">🇮🇳 North Eastern India</span>

        {/* Main title */}
        <h1 className="hero__title">Smriti</h1>

        {/* Subtitle */}
        <p className="hero__subtitle">AI Cognitive &amp; Memory Companion</p>

        {/* Description */}
        <p className="hero__desc">
          Smriti supports elderly dementia patients with guided cognitive
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
                  alert('Caregiver Mode is coming soon!');
                }
              }}
            />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default App;
