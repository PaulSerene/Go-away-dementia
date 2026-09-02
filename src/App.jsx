/*
 * App.jsx — the root component of the Smriti app.
 *
 * In React, a "component" is a JavaScript function that returns
 * HTML-like code (called JSX). React builds the whole UI by
 * composing these components together like Lego blocks.
 *
 * This file assembles:
 *   <Header />    — sticky top bar with the brand name
 *   <Hero />      — main intro section
 *   <ModeCard />  — two clickable mode-selection cards
 *   <Footer />    — bottom bar
 */

import { useState } from 'react';   // useState lets us track things that change
import ModeCard from './components/ModeCard';
import './App.css';

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
   * useState is a React "hook" that lets us store data that can change.
   * Here we store whichever mode the user clicked.
   *
   *   selectedMode = the current value (starts as null = nothing selected)
   *   setSelectedMode = a function that updates selectedMode
   *
   * When setSelectedMode is called, React automatically re-renders
   * the page to show the new state.
   */
  const [selectedMode, setSelectedMode] = useState(null);

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
         * We use JavaScript's .map() to loop over the modes array
         * and render one <ModeCard /> for each mode.
         * This is cleaner than writing two separate card blocks by hand.
         */}
        <div className="mode-cards">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}           /* React needs a unique key for each list item */
              icon={mode.icon}
              title={mode.title}
              desc={mode.desc}
              theme={mode.theme}
              onClick={() => setSelectedMode(mode)} /* store the clicked mode */
            />
          ))}
        </div>

        {/*
         * Selection banner — only shown after a card is clicked.
         * The && operator means: "only render this if selectedMode is not null".
         */}
        {selectedMode && (
          <div
            className={`selected-banner selected-banner--${selectedMode.theme}`}
            role="status"          /* tells screen readers this is a status message */
            aria-live="polite"     /* screen reader reads this when it appears      */
          >
            <span aria-hidden="true">{selectedMode.icon}</span>
            <span>
              <strong>{selectedMode.title}</strong> selected — dashboard coming soon!
            </span>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

