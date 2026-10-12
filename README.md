# Chokur System

MVP web application for tracking student performance, calculating grades, and generating automated reports.

## Overview

Full-stack web application built with **React + Vite + Tailwind CSS** (frontend) and **Python FastAPI + SQLite** (backend), featuring KCSE-style grading, performance analytics, and automated PDF/Excel report generation.

## Features

- **Student Management**: Register students, import from CSV/Excel, track admission numbers and class assignments (Form 1–4)
- **Marks Entry**: Grid-based marks entry per class/term; automatic grade calculation using KCSE grading scale
- **Performance Analytics**: Subject averages, class rankings, pass rates, strongest/weakest subjects, grade distributions
- **Automated Reporting**:
  - Individual student report cards (PDF via ReportLab)
  - Class ranking exports (Excel via openpyxl)
  - Subject analysis exports (Excel via openpyxl)
- **KCSE Grading**: 12-point scale (A=12 … E=1) with per-subject boundaries; aggregate points from best 7 subjects; pass mark C+ (55%)

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router 6
- **Backend**: FastAPI, Uvicorn, SQLite (stdlib), Pandas, ReportLab, openpyxl
- **Testing**: pytest (26 tests covering grading, analytics, API, reports)
- **Deployment**: Vercel (static frontend + serverless Python API)

## Project Structure

```
student-performance-tracker/
├── README.md
├── vercel.json
├── .gitignore
├── api/
│   └── index.py              # Vercel serverless entry (imports backend.main)
├── backend/
│   ├── main.py               # FastAPI app + startup (seed)
│   ├── api.py                # All /api/* routes
│   ├── db.py                 # SQLite connection + schema
│   ├── grading.py            # KCSE grading logic
│   ├── analytics.py          # Pandas-based analytics
│   ├── reports.py            # PDF (ReportLab) + Excel (openpyxl)
│   ├── schemas.py            # Pydantic models
│   ├── seed.py               # Demo data (12 subjects, 48 students, marks)
│   ├── requirements.txt
│   └── tests/
│       ├── test_grading.py
│       ├── test_analytics.py
│       ├── test_reports.py
│       └── test_api.py
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── api.js
    │   ├── components/Layout.jsx
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Dashboard.jsx
    │       ├── Students.jsx
    │       ├── Marks.jsx
    │       ├── Analytics.jsx
    │       └── Reports.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- SQLite (built-in)

### Backend

```bash
cd backend
pip install -r requirements.txt
# or: pip install --user -r requirements.txt
uvicorn main:app --reload --port 8000
```

Server runs at `http://localhost:8000`; API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server at `http://localhost:5173`; proxies `/api/*` to `http://localhost:8000`.

### Run Tests (Backend)

```bash
cd backend
python -m pytest tests/ -v
```

## Demo Data

On first startup, the backend seeds:
- 12 KCSE subjects (English, Kiswahili, Mathematics, Biology, Physics, Chemistry, History, Geography, CRE, Agriculture, Computer Studies, Business Studies)
- 48 students across Form 1–4 (12 per form)
- 2 terms of marks per student with realistic score distributions

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/meta` | Grading scale, terms, years, classes |
| GET/POST | `/api/students` | List/create students |
| PUT/DELETE | `/api/students/{id}` | Update/delete student |
| POST | `/api/students/import` | Import CSV/Excel |
| GET/POST | `/api/subjects` | List/create subjects |
| GET | `/api/marks/matrix` | Grid data for marks entry |
| POST | `/api/marks/bulk` | Bulk upsert marks |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/analytics/subjects` | Subject-level analytics |
| GET | `/api/analytics/rankings` | Class rankings |
| GET | `/api/analytics/overview` | Overview stats |
| GET | `/api/reports/student/{id}` | Student report (JSON) |
| GET | `/api/reports/student/{id}/pdf` | Student report card (PDF) |
| GET | `/api/reports/class-ranking.xlsx` | Class ranking (Excel) |
| GET | `/api/reports/subject-analysis.xlsx` | Subject analysis (Excel) |

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The `vercel.json` configures:
- Frontend static build from `frontend/` → `dist/`
- Python serverless function at `api/index.py` (imports `backend.main:app`)
- Routes `/api/*` to the Python function, everything else to the SPA

**Note**: SQLite on Vercel uses `/tmp/data.db` (ephemeral). For production, migrate to PostgreSQL (set `DATABASE_URL` env var and update `backend/db.py`).

## KCSE Grading Scale (General)

| Mark Range | Grade | Points |
|------------|-------|--------|
| 80–100 | A | 12 |
| 75–79 | A- | 11 |
| 70–74 | B+ | 10 |
| 65–69 | B | 9 |
| 60–64 | B- | 8 |
| 55–59 | C+ | 7 |
| 50–54 | C | 6 |
| 45–49 | C- | 5 |
| 40–44 | D+ | 4 |
| 35–39 | D | 3 |
| 30–34 | D- | 2 |
| 0–29 | E | 1 |

*Aggregate points = sum of points from best 7 subjects. Pass = C+ (55%) for university entry.*

## License

MIT