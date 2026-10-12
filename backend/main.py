"""FastAPI application entry point."""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import router
from db import init_db
from seed import seed

app = FastAPI(title="Student Performance Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def startup() -> None:
    conn = init_db()
    try:
        seed(conn)
    finally:
        conn.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
