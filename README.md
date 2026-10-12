# Student Performance Tracker

MVP web application for tracking student performance, calculating grades, and generating automated reports.

## Overview

Web application built with Python (FastAPI), React, and SQLite for student performance tracking and automated reporting.

## Features

- **Student Management**: Register students, import from Excel, track admission numbers and class assignments
- **Marks Entry**: Enter marks for subjects; automatic grade calculation using KCSE-style grading scale
- **Performance Analytics**: Compare subject averages, identify strongest/weakest subjects, calculate pass rates
- **Automated Reporting**: Generate individual report cards, class rankings, subject analysis as PDF/Excel reports

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: SQLite (with optional PostgreSQL migration)
- **Data Analysis**: Pandas
- **Report Generation**: ReportLab and openpyxl
- **Deployment**: Vercel

## Getting Started

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pandas reportlab openpyxl

# Run backend
uvicorn main:app --reload

# Deploy
vercel --prod
```
