/**
 * PatientPlaceholder.jsx — A shared placeholder screen used by
 * Activity, Activities, Memories, and Reminders sections.
 *
 * Props:
 *   title    — screen heading (e.g. "My Memories")
 *   emoji    — big icon shown at the top
 *   message  — short friendly description
 *   navigate — navigation function from App
 *   activeTab — which bottom-nav tab to highlight ("home"|"activities"|"memories"|"reminders")
 */
function PatientPlaceholder({ title, emoji, message, navigate, activeTab }) {
  return (
    <div className="ph-screen">

      {/* Back button at the very top */}
      <header className="ph-ph-header">
        <button
          className="ph-back-btn"
          onClick={() => navigate('patient-home')}
          aria-label="Go back to Home"
        >
          ← Back to Home
        </button>
        <p className="ph-ph-title">{emoji}&nbsp; {title}</p>
      </header>

      {/* Placeholder content */}
      <main className="ph-ph-body">
        <div className="ph-ph-card">
          <span className="ph-ph-big-emoji" aria-hidden="true">{emoji}</span>
          <h2 className="ph-ph-heading">{title}</h2>
          <p className="ph-ph-msg">{message}</p>
          <p className="ph-ph-coming">🚧 This section is coming soon!</p>
        </div>
      </main>

      {/* Bottom navigation — same as PatientHome */}
      <nav className="ph-nav" aria-label="Main navigation">
        <button
          id="nav-home-ph"
          className={`ph-nav__btn ${activeTab === 'home' ? 'ph-nav__btn--active' : ''}`}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          onClick={() => navigate('patient-home')}
        >
          <span className="ph-nav__icon" aria-hidden="true">🏠</span>
          <span className="ph-nav__label">Home</span>
        </button>

        <button
          id="nav-activities-ph"
          className={`ph-nav__btn ${activeTab === 'activities' ? 'ph-nav__btn--active' : ''}`}
          aria-current={activeTab === 'activities' ? 'page' : undefined}
          onClick={() => navigate('patient-activities')}
        >
          <span className="ph-nav__icon" aria-hidden="true">🧠</span>
          <span className="ph-nav__label">Activities</span>
        </button>

        <button
          id="nav-memories-ph"
          className={`ph-nav__btn ${activeTab === 'memories' ? 'ph-nav__btn--active' : ''}`}
          aria-current={activeTab === 'memories' ? 'page' : undefined}
          onClick={() => navigate('patient-memories')}
        >
          <span className="ph-nav__icon" aria-hidden="true">❤️</span>
          <span className="ph-nav__label">Memories</span>
        </button>

        <button
          id="nav-reminders-ph"
          className={`ph-nav__btn ${activeTab === 'reminders' ? 'ph-nav__btn--active' : ''}`}
          aria-current={activeTab === 'reminders' ? 'page' : undefined}
          onClick={() => navigate('patient-reminders')}
        >
          <span className="ph-nav__icon" aria-hidden="true">⏰</span>
          <span className="ph-nav__label">Reminders</span>
        </button>
      </nav>

    </div>
  );
}

export default PatientPlaceholder;
