# Doorna iPhone V1

Doorna is a UI-less, gesture-first iPhone app MVP featuring photoreal glass aesthetics and AI-driven navigation.

## Architecture

- **Frontend**: React, Tailwind CSS, Framer Motion (ESM via CDN, no build step required for dev).
- **Backend**: Node.js (Express) with Google Gemini 2.5 Flash.
- **AI**: Uses `@google/genai` to route natural language to app "Frames" (Calendar, Finance, Notes, etc.).

## Setup

### Frontend
1. Open `index.html` in a browser or use a simple static server.
2. Ensure you have a `.env.local` or environment variables set if connecting to a live backend.

### Backend (Server)
1. Navigate to `/server`.
2. Run `npm install`.
3. Set `GEMINI_API_KEY` in your environment.
4. Run `npm start`.

## Deployment
The `server` folder contains a `Dockerfile` ready for Google Cloud Run deployment.

### Troubleshooting: Cannot Commit to GitHub?
If you see errors about file size or "node_modules", it means dependencies were accidentally tracked. Run this in your terminal to fix it:

```bash
# 1. Unstage everything
git reset

# 2. Remove node_modules from git cache (keep files on disk)
git rm -r --cached node_modules
git rm -r --cached server/node_modules

# 3. Re-add files (ignoring node_modules based on .gitignore)
git add .

# 4. Commit
git commit -m "Fix: Ignore node_modules and update config"
```