# Smriti SIH 2026 Prototype — Project Context

This document provides context for the AI assistant continuing work on the Smriti project.

## 📌 Project Overview
**Smriti** is an AI Cognitive & Memory Companion designed for elderly dementia patients. It is being built as a prototype for the SIH 2026 hackathon.
- **Tech Stack:** React (Vite), JavaScript, Vanilla CSS.
- **Constraints:** This is a **frontend-only prototype**. There is no backend, no database, no authentication, and no external AI APIs currently integrated. All data is persisted locally.

## 🏗️ Architecture & State Management
- **Routing:** We do not use React Router. App navigation is managed via a simple `currentScreen` state in `App.jsx`, passing a `navigate` function down to child components.
- **Storage:** All data is stored in `localStorage`. 
  - `smriti_memories`: Array of memory objects (shared by patient and caregiver views).
  - `smriti_reminders`: Array of reminder objects (shared by patient and caregiver views).
  - `smriti_game_results`: Array of completed memory game results.
  - `smriti_current_difficulty`: Current difficulty level of the memory game (1, 2, or 3).
- **Styling:** Vanilla CSS with strict class prefixes per component (e.g., `.ph-` for PatientHome, `.cgd-` for CaregiverDashboard, `.cgrm-` for CaregiverReminders) to avoid collisions. Elderly-friendly design principles apply (large text, high contrast, warm colours, large touch targets).

## 🗂️ Key Features & Components
1. **Landing Page (`App.jsx`):** Allows selecting between Patient Mode and Caregiver Mode.
2. **Patient Mode:**
   - `PatientHome.jsx`: Main dashboard.
   - `MemoryGame.jsx`: Interactive cognitive activity ("Remember the Objects").
   - `PatientMemories.jsx`: View stored memories.
   - `PatientProgress.jsx`: View game statistics.
   - `PatientReminders.jsx`: View today's and upcoming reminders, and mark them as done.
3. **Caregiver Mode:**
   - `CaregiverDashboard.jsx`: Overview of patient statistics, recent activities, and shortcuts.
   - `CaregiverMemories.jsx`: Full CRUD management for memories.
   - `CaregiverReminders.jsx`: Full CRUD management for reminders.

## 🕒 Recent Milestones Completed
- **Memories Feature:** Implemented shared memory storage between Caregiver (can add/edit/delete) and Patient (can view).
- **Reminders Feature:** Implemented shared reminder storage. Caregiver can manage reminders. Patient can view them and mark them as completed. Status syncs seamlessly between both views via `localStorage`.
- **Navigation Cleanup:** Streamlined the Caregiver navigation by removing redundant buttons and ensuring smooth flow between modes.

## ⚠️ Important Rules for AI
- **Do not introduce a backend, cloud database, or authentication.**
- **Reuse existing `localStorage` keys.** Do not create duplicate datasets.
- **Fail gracefully.** Wrap `localStorage` reads/writes in `try/catch` blocks. The app must never crash due to corrupted or missing local data.
- **Maintain design consistency.** Use existing CSS variables and patterns.
- If asked to change the AI assistant's persona name in the future, the preferred name is **"Memora"** (though the app itself remains "Smriti").
