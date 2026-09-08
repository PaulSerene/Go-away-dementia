# MEMORA — AI Cognitive & Memory Companion

> **Smart India Hackathon 2026 · Problem Statement SIH26003 · Northeast India**

MEMORA is a culturally sensitive **cognitive-wellness and memory-support application** designed for elderly users and people experiencing memory difficulties, with a particular focus on the communities, languages, and cultural context of Northeast India.

It combines cognitive games, memory assistance, reminders, caregiver tools, accessibility features, cultural content, and an offline-first architecture into one simple experience.

---

## ⚠️ Disclaimer

MEMORA is a **cognitive-wellness and memory-practice tool**. It is **not** a medical diagnostic, treatment, or cure system and does not replace professional medical advice or care.

---

## 🌟 Overview

MEMORA is a full-stack web application with Capacitor-based Android packaging.

The application is designed around a few core principles:

- 🧠 Cognitive wellness through engaging memory activities
- ❤️ Simple, respectful UX for elderly users
- 👨‍👩‍👧 Caregiver-assisted memory and reminder management
- 🌏 Cultural relevance, especially for Northeast India
- 🌐 Multilingual and accessibility-aware interaction
- 📴 Offline-first use with synchronization when connectivity returns

---

## 🎯 Problem

Many existing cognitive and memory-support applications can be difficult to use in the context MEMORA targets.

The project focuses on challenges such as:

- Language and accessibility barriers
- Limited digital familiarity among some elderly users
- The need for caregivers to help manage memories and reminders
- Lack of culturally relevant content
- Unreliable internet connectivity in some environments
- Separating cognitive-wellness activities from medical diagnosis or treatment

---

## 💡 Solution

MEMORA brings several support functions together in one application:

- Interactive cognitive-wellness games
- A personal memory album
- Daily and date-specific reminders
- Caregiver dashboard and management tools
- Multilingual localization infrastructure
- Accessibility controls and read-aloud support
- Northeast India-inspired cultural content
- Offline-first local data handling with queued synchronization

---

# ✨ Key Features

## 👴 Patient Experience

- Personalized home screen with time-based greetings
- Cognitive games with adaptive difficulty
- Progress tracking
- Memory Album with caregiver-curated memories
- Daily and date-specific reminders
- Language selection
- Accessibility settings
- Read-aloud support where available
- Offline status indication

## 👨‍👩‍👧 Caregiver Experience

- Caregiver dashboard
- Activity and accuracy summaries
- Memory management
  - Add
  - Edit
  - Delete
  - Favourite
- Reminder management
  - Daily reminders
  - Date-specific reminders
  - Categories and times
- Patient View shortcut

---

# 🎮 Cognitive Games

MEMORA currently includes **8 cognitive-wellness games**:

| Game | Activity |
|---|---|
| **Memory Match** | Visual memory using cultural images |
| **Word Chain** | Sequential/verbal memory activity |
| **Story Time** | Story comprehension and recall |
| **RememberMe** | Recognition and recall using cultural imagery |
| **Remember the Room** | Spatial and sequential memory |
| **PathTracer** | Route and sequential spatial memory |
| **Music Memory** | Music-related recognition and categorization |
| **Movement with Aroha** | Guided movement/wellness activity |

The games use difficulty levels where supported by the current implementation. Adaptive behavior is based on gameplay performance rather than presenting the system as a medical assessment.

---

# ♿ Accessibility

MEMORA includes an accessibility layer designed to make the interface easier to use:

- **Large Text**
- **High Contrast**
- **Reduced Motion**
- **Read Aloud / TTS**
- Accessibility preferences persisted locally
- Touch-friendly interface
- Language-aware speech settings where browser support is available

### Speech-to-Text

A speech-recognition service abstraction is present, but STT is **not currently connected to the application's main UI flow**.

### Browser Compatibility

Voice capabilities depend on the browser/device's Web Speech API support. MEMORA therefore treats voice functionality as a progressive enhancement rather than a requirement for using the application.

---

# 🌏 Cultural Adaptation

Cultural relevance is an important part of MEMORA's design.

The application includes bundled Northeast India-inspired visual content across categories such as:

- Nature
- Wildlife
- Food
- Crafts
- Textiles
- People
- Places

Cultural imagery is used within games and selected interface backgrounds.

The project intentionally avoids assigning unsupported tribal, ethnic, or regional identities to individual assets.

Some game content also uses Northeast India-inspired contexts such as tea gardens, festivals, village environments, and familiar natural settings.

---

# 🌐 Language Support

MEMORA has a localization architecture covering **11 target languages**:

| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `as` | Assamese | Bengali |
| `bn` | Bengali | Bengali |
| `mni` | Manipuri / Meitei | Meetei Mayek |
| `lus` | Mizo | Latin |
| `kha` | Khasi | Latin |
| `grt` | Garo | Latin |
| `brx` | Bodo | Devanagari |
| `ne` | Nepali | Devanagari |
| `hi` | Hindi | Devanagari |
| `te` | Telugu | Telugu |

### Important

The project has localization infrastructure and locale files for all 11 languages, but **translation completeness and quality vary by language**.

English is the authoritative source language. Non-English translations should be considered best-effort until reviewed by native speakers.

When a translation is unavailable, MEMORA falls back safely rather than displaying an undefined value.

Translations are statically bundled so the localization system can operate without requiring a translation API at runtime.

---

# 🔊 Voice Features

## Text-to-Speech

MEMORA uses the browser's Web Speech API for text-to-speech.

The `ReadAloudButton`:

- Provides read-aloud functionality where TTS is available
- Uses a slower speech rate appropriate for the target audience
- Passes the selected language's BCP-47 language tag to the speech engine
- Hides itself when speech synthesis is unavailable

## Speech-to-Text

A reusable STT service abstraction exists but is not yet connected to the main application UI.

## BHASHINI

**BHASHINI is not currently integrated.**

It is considered a future enhancement for stronger regional-language speech and translation capabilities.

---

# 📴 Offline-First Architecture

MEMORA follows an **offline-first** approach.

Core application functionality does not require a continuous internet connection.

### How it works

1. User actions are stored locally first.
2. If the backend cannot be reached, failed mutations are placed in a synchronization queue.
3. The queue retains pending operations locally.
4. When connectivity returns, queued operations are replayed against the backend.
5. Server-generated IDs are reconciled with local records after successful creation.
6. Queue processing includes retry handling and concurrency protection.

This allows the core experience to remain usable offline while still supporting backend synchronization when connectivity is available.

### Important limitation

Cloud/backend synchronization itself requires network connectivity. Offline mode should therefore be understood as **offline-first**, not as permanent cloud access without an internet connection.

---

# 🏗️ Architecture

```text
                    MEMORA
                       │
                       ▼
              React + Vite Frontend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Localization   Accessibility   Offline Layer
        │              │              │
        └──────────────┼──────────────┘
                       │
                  API Client
                       │
                  /api/*
                       ▼
             Express.js Backend
                  (Node.js)
                       │
                  node-postgres
                       │
                       ▼
                  PostgreSQL
```

The project also contains a **Capacitor Android wrapper** for packaging the web application as an Android application.

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Styling | Vanilla CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Database Client | node-postgres (`pg`) |
| Mobile Packaging | Capacitor |
| Speech | Browser Web Speech API |
| Localization | Custom lightweight localization system |

---

# 📁 Project Structure

```text
Memora/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── PatientHome.jsx
│   │   ├── PatientProgress.jsx
│   │   ├── PatientMemories.jsx
│   │   ├── PatientReminders.jsx
│   │   ├── CaregiverDashboard.jsx
│   │   ├── CaregiverMemories.jsx
│   │   ├── CaregiverReminders.jsx
│   │   ├── AccessibilityPanel.jsx
│   │   ├── LanguagePicker.jsx
│   │   ├── ReadAloudButton.jsx
│   │   ├── CulturalBackground.jsx
│   │   ├── MemoryGame.jsx
│   │   └── games/
│   │       ├── GamesHub.jsx
│   │       ├── WordChain.jsx
│   │       ├── StoryRecall.jsx
│   │       ├── RememberMe.jsx
│   │       ├── RearrangeGame.jsx
│   │       ├── MusicMemory.jsx
│   │       ├── MovementGame.jsx
│   │       └── PathTracer.jsx
│   ├── contexts/
│   ├── hooks/
│   ├── locales/
│   ├── utils/
│   └── assets/
│       └── culture/
│
├── server/
│   └── src/
│       ├── index.js
│       ├── db/
│       │   ├── pool.js
│       │   ├── migrate.js
│       │   └── schema.sql
│       └── routes/
│           ├── health.js
│           ├── users.js
│           ├── memories.js
│           ├── reminders.js
│           └── gameResults.js
│
├── scripts/
├── android/
├── capacitor.config.json
├── vite.config.js
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Recommended requirements:

- Node.js
- npm
- PostgreSQL for backend/database functionality

The frontend can still run without the backend for offline/local functionality.

## 1. Install frontend dependencies

From the project root:

```bash
npm install
```

## 2. Install backend dependencies

```bash
cd server
npm install
```

## 3. Configure the backend

Create:

```text
server/.env
```

Configure the PostgreSQL connection and backend settings according to your local environment.

Example:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/memora
PORT=3001
NODE_ENV=development
```

**Never commit real credentials or secrets.**

## 4. Run the database migration

From `server/`:

```bash
npm run db:migrate
```

## 5. Start the backend

```bash
npm run dev
```

The backend runs on port `3001`.

## 6. Start the frontend

Open another terminal at the project root:

```bash
npm run dev
```

The Vite development server normally runs on port `5173`.

The frontend proxies `/api/*` requests to the backend.

---

# 🧪 Testing & Validation

The project includes backend integration and synchronization tests.

Depending on the current repository scripts, useful validation commands include:

```bash
npm run build
```

Backend tests can be run using the project's existing test scripts.

A production build should be run before important releases or demonstrations.

---

# 📱 Android / Capacitor

MEMORA contains a Capacitor Android project.

Capacitor provides a bridge for packaging the web application as an Android application while keeping the existing React frontend.

Typical commands include:

```bash
npm run android:sync
npm run android:open
npm run android:run
```

Android development/testing requires an appropriate Android development environment, including Android Studio and the Android SDK.

The Android wrapper should currently be considered a **development/package target rather than a published production Android application**.

---

# 🗄️ Database

MEMORA's backend uses PostgreSQL.

The main tables include:

| Table | Purpose |
|---|---|
| `users` | Patients and caregivers |
| `memories` | Patient memory records |
| `game_results` | Completed game sessions and performance data |
| `reminders` | Daily/date-specific reminders |
| `daily_reminder_completions` | Per-day completion records for recurring reminders |

The database is accessed through `node-postgres`.

---

# 🔌 API

The Express backend currently exposes routes for:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Server health |
| `GET` | `/api/health/db` | Database connectivity |
| `GET` | `/api/users` | Retrieve users |
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/memories` | Retrieve memories |
| `POST` | `/api/memories` | Create a memory |
| `PUT` | `/api/memories/:id` | Update a memory |
| `DELETE` | `/api/memories/:id` | Delete a memory |
| `GET` | `/api/reminders` | Retrieve reminders |
| `POST` | `/api/reminders` | Create a reminder |
| `PUT` | `/api/reminders/:id` | Update a reminder |
| `DELETE` | `/api/reminders/:id` | Delete a reminder |
| `GET` | `/api/game-results` | Retrieve game results |
| `POST` | `/api/game-results` | Save a game result |

---

# 🗺️ Future Work

The following are planned or incomplete areas rather than fully implemented production features:

- 🤖 Full conversational **Aroha AI companion**
- 🗣️ Connecting STT to application UI
- 🇮🇳 BHASHINI integration for regional-language voice capabilities
- 📝 Native-speaker review and validation of translations
- 📷 Camera/image upload for memory creation
- 📱 Further Android/mobile testing and deployment
- 📦 Production Play Store release pipeline
- ⚡ Further performance optimization/code splitting
- 🧪 Expanded automated test coverage
- 🌐 Further localization/content expansion

---

# 🔒 Privacy & Data

MEMORA is designed with a privacy-conscious architecture.

- Local data is stored on the user's device for offline operation.
- Backend synchronization occurs through the application's API when connectivity is available.
- Environment secrets are kept outside source control.
- The application does not require a translation API at runtime for its bundled localization system.

MEMORA should not be treated as a substitute for professional medical record or clinical-data systems.

---

# 🤝 Contributing

For development work:

1. Create a feature branch.
2. Make focused changes.
3. Test the application.
4. Run a production build where appropriate.
5. Review your changes with Git.
6. Commit with a clear message.
7. Push the branch and merge after review.

---

# 🏆 Smart India Hackathon

MEMORA is being developed for **Smart India Hackathon 2026** under:

**Problem Statement:** SIH26003

The project focuses on building a culturally sensitive, accessible cognitive-wellness and memory-support experience for elderly users and people experiencing memory difficulties, with particular attention to Northeast India.

---

# 👥 Team InnoMinds

### 🇮🇳 Smart India Hackathon

|  # | Team Member   |
| -: | ------------- |
|  1 | **Jay**       |
|  2 | **Nikshith**  |
|  3 | **Sharth**    |
|  4 | **Nikhilesh** |
|  5 | **Thanvi**    |
|  6 | **Kasturi**   |

MEMORA is developed as a collaborative Smart India Hackathon project.
