import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializePlatform } from './utils/platform.js'

// Initialize platform-specific behavior (status bar, splash screen, etc.)
// Safe on web — all functions no-op outside Capacitor.
initializePlatform();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
