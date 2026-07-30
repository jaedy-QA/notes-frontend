# Notes Frontend

React + Vite frontend for the Notes App.

## How to run locally

Important: for the full app, start it from the parent `my-notes-app` folder with `npm run dev`. Running this frontend alone from this folder will not start the backend services automatically.

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app at `http://localhost:5173`.

This frontend depends on both the auth service and the notes API being running.

## What it provides

- Registration and login flows
- Notes dashboard with search and filtering
- Create, edit, archive, restore, and delete note actions

## Prerequisites

- Node.js 18+
- npm
- Auth service running on `http://localhost:3001`
- Notes API running on `http://localhost:3002`

## Install

```bash
cd notes-frontend
npm install
```

## Run locally

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## Notes

- The app proxies `/api/auth` and `/api/notes` to the backend services during development.
- If the backend services are not running, login and notes requests will fail.
- If you change backend ports, update the proxy config in `vite.config.ts`.
