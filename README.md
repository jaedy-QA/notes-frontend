# Notes Frontend

React + Vite frontend for the Notes App.

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
