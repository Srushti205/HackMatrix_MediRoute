# 🩺 MediRoute — Setup Guide

> **Stack:** React 18 + Tailwind CSS v3 · Node.js + Express · MongoDB Atlas (Mongoose)

---

## Project Structure

```
MediRoute/
├── SETUP.md
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js            # Setup verification dashboard
│   │   └── index.css         # Tailwind directives + global styles
│   ├── tailwind.config.js    # Tailwind v3 — content paths + brand tokens
│   ├── postcss.config.js
│   └── .env                  # REACT_APP_API_URL
│
└── backend/                  # Express + Mongoose API
    ├── index.js              # Server entry point
    ├── src/
    │   ├── config/db.js      # MongoDB connection
    │   ├── routes/health.routes.js
    │   ├── controllers/      # (empty — add feature controllers here)
    │   ├── models/           # (empty — add Mongoose models here)
    │   ├── middleware/       # (empty — add auth middleware here)
    │   └── utils/
    ├── scripts/
    │   └── verify-setup.js   # One-shot verifier
    └── .env                  # Secrets — never commit!
```

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB Atlas account | — |

---

## Step 1 — MongoDB Atlas IP Whitelist (REQUIRED)

Atlas blocks unknown IPs by default.

1. Go to https://cloud.mongodb.com → Security → Network Access
2. Click **+ Add IP Address**
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development
4. Confirm and wait ~30 seconds

---

## Step 2 — Install & Verify (copy-paste commands)

See the "Quick Commands" section below.

---

## Environment Variables

### backend/.env

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Express port (default `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token lifetime e.g. `7d` |
| `CLIENT_URL` | Allowed CORS origin |

### frontend/.env

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend base URL |

---

## Available Scripts

### backend/

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run verify` | Run setup verification script |

### frontend/

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server with hot reload |
| `npm run build` | Build for production |

---

## Tailwind CSS Design Tokens

```
bg-primary-{50..950}   Blue brand
bg-accent-{500|600}    Green accent
bg-danger-{500|600}    Red for errors
.glass                 Glassmorphism card
.gradient-text         Blue to green gradient text
```
