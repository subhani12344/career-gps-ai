# Career GPS AI — Navigate Your Tech Journey

Career GPS AI is a premium, full-stack, AI-powered career steering platform. It helps tech developers map their learning paths, analyze resume ATS compatibility, practice interactive mock interviews, and track job applications via a Kanban CRM, complete with gamified level/XP achievements.

---

## 🚀 Features Matrix

- **STEP 3 — Auth**: JWT authentication, custom registration/login schemas, simulated Google login.
- **STEP 4 & 5 — Profile & Dashboard**: Dynamic XP tracking, level badge milestones, active task checklists.
- **STEP 6 & 7 — Roadmap & Skill Intelligence**: Interactive month-by-month career roadmap node tree (complete/pending statuses) and critical skill gap analysis.
- **STEP 8 & 9 — Resources & Projects**: Pre-seeded learning paths and project recommendations mapped to goals.
- **STEP 10 — ATS Resume Analyzer**: Text/Markdown CV analyzer with scoring, missing keywords extractors, and formatting reviews.
- **STEP 11 & 12 — Job Board & Kanban CRM**: Interactive job boards where recommended openings can be tracked with click-to-move statuses (Applied, Interview, Selected, Rejected).
- **STEP 13 — AI Interview Coach**: Technical, HR, and coding questions generator with text-based inputs and AI feedback rating grades.
- **STEP 14 — AI Chatbot**: 24/7 overlay chat console answering career-related questions.
- **STEP 15, 16 & 17 — Gamification & Notifications**: Earn XP, unlock badges (Compass Finder, Profile Architect, etc.), and monitor in-app notifications.

---

## 📂 Project Architecture

```
career-gps-ai/
├── client/          # Vite + React + Tailwind CSS SPA Frontend
│   ├── src/App.jsx  # Main application view container and dual-mode routing
│   └── src/index.css# Core CSS variables, animations, and design tokens
├── server/          # Node.js + Express API Server
│   ├── server.js    # Entry point
│   ├── config/db.js # DB connector with automated local JSON-db fallback
│   ├── models/      # MongoDB Mongoose schemas
│   └── routes/api.js# Unified endpoint controllers (Auth, CRM, AI, Resume)
├── database/        # Pre-seeded database utilities and local database file
├── docs/            # Architecture blueprints & visual diagram workflows
├── mobile/          # Future mobile shell integration documents
└── deployment/      # Multi-container docker-compose setups
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Install Node.js & VS Code
- **VS Code**: Download and install [VS Code](https://code.visualstudio.com/). Open the folder `C:\Users\subha\.gemini\antigravity\scratch\career-gps-ai` as your active workspace.
- **Node.js**: Download and install [Node.js (LTS version)](https://nodejs.org/). This will register both `node` and `npm` commands globally on your system.

### 2. Configure Environment variables
Navigate to `server/` and configure your API options. A `.env` file has been pre-configured:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careergps
JWT_SECRET=career_gps_super_secret_jwt_key_12345
NODE_ENV=development

# Optional: Add your Gemini API key to enable live Google LLM responses.
# If left blank, the platform uses a highly detailed local simulation engine.
GEMINI_API_KEY=
```

### 3. Install Packages & Run Database Seeding
Open your command prompt or VS Code terminal, and run:
```bash
# 1. Install server dependencies
cd server
npm install

# 2. Seed default jobs and resources (MongoDB or Local JSON file)
npm run seed

# 3. Install client dependencies
cd ../client
npm install
```

### 4. Running the Platform
You can run the application in two modes:

#### Mode A: Standalone Client (Fastest)
Run the client without booting any database or server! The application automatically detects if the server is offline and switches to **Standalone LocalStorage Mode**. 
```bash
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. All registration, roadmaps, CRM, and chatbot systems will function instantly using pre-seeded mocks and save their status in your browser's local storage.

#### Mode B: Full-Stack Mode
Run both the API server and client concurrently:
```bash
# Terminal 1: Start the API backend
cd server
npm run dev

# Terminal 2: Start the frontend UI
cd client
npm run dev
```

---

## 🧪 API Verification via Postman
You can verify the API routing using [Postman](https://www.postman.com/):
1. **Health Check**: `GET http://localhost:5000/health` -> returns `{"status":"OK"}`.
2. **Register**: `POST http://localhost:5000/api/auth/register` with JSON body:
   ```json
   {
     "name": "Alex Mercer",
     "email": "alex@gmail.com",
     "password": "password123"
   }
   ```
3. **Login**: `POST http://localhost:5000/api/auth/login` -> returns your `token`.
4. **Dashboard Profile**: `GET http://localhost:5000/api/profile` (pass your token as a Bearer Header).
