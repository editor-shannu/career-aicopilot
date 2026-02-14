# Project Rules & Maintenance

## README Maintenance
- **Rule**: Whenever the project structure, key features, or deployment configuration is updated, check if this `README.md` needs to be updated to reflect the changes.
- **Rule**: Keep a log of major versions or milestones here if necessary.

## Project Structure
- `index.html`: Main entry point with Tailwind theme configuration and Firebase SDKs.
- `app.js`: Main React application logic with Auth State and Firestore persistence.
- `components/`: UI components (Header, Dashboard, LoginScreen, etc.).
- `utils/`: Helper functions.
  - `firebase.js`: Firebase configuration and helpers (Login, Logout, DB).
  - `careerAgent.js`: Logic for AI simulation.

## Key Features
- **Google Sign-In**: Users must log in to access the dashboard.
- **Persistence**: User career data (roadmap, stats, profile) is saved to Firestore under the `users/{uid}` collection.
- **Career Co-Pilot**: AI agent simulation for analyzing profiles and generating roadmaps.

## Current Status
- Integrated Firebase Auth and Firestore.
- Data persists across sessions.