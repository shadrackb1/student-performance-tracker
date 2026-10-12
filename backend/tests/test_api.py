"""Tests for API endpoints."""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_meta():
    r = client.get("/api/meta")
    assert r.status_code == 200
    data = r.json()
    assert "scale" in data
    assert data["pass_grade"] == "C+"
    assert data["pass_mark"] == 55


def test_students_crud():
    # Create
    r = client.post("/api/students", json={"admission_no": "T999", "name": "Test User", "class_name": "Form 1"})
    assert r.status_code == 201
    student = r.json()
    sid = student["id"]
    assert student["admission_no"] == "T999"

    # List
    r = client.get("/api/students?class_name=Form 1")
    assert r.status_code == 200
    assert any(s["id"] == sid for s in r.json())

    # Update
    r = client.put(f"/api/students/{sid}", json={"admission_no": "T999", "name": "Updated", "class_name": "Form 1"})
    assert r.status_code == 200
    assert r.json()["name"] == "Updated"

    # Delete
    r = client.delete(f"/api/students/{sid}")
    assert r.status_code == 204
    r = client.get("/api/students?class_name=Form 1")
    assert not any(s["id"] == sid for s in r.json())


def test_subjects():
    r = client.get("/api/subjects")
    assert r.status_code == 200
    assert len(r.json()) >= 12


def test_marks_matrix_and_bulk():
    r = client.get("/api/marks/matrix?class_name=Form 1&term=Term 1&year=2025")
    assert r.status_code == 200
    data = r.json()
    assert "students" in data
    assert "subjects" in data
    assert "marks" in data
    if data["students"]:
        stu = data["students"][0]
        sub = data["subjects"][0]
        # Bulk save a mark
        r = client.post("/api/marks/bulk", json={
            "class_name": "Form 1", "term": "Term 3", "year": 2025,
            "entries": [{"student_id": stu["id"], "subject_id": sub["id"], "score": 88.5}]
        })
        assert r.status_code == 200
        assert r.json()["saved"] == 1


def test_dashboard():
    r = client.get("/api/dashboard?class_name=Form 1&term=Term 1&year=2025")
    assert r.status_code == 200
    d = r.json()
    assert "students" in d
    assert "average" in d
    assert "pass_rate" in d


def test_analytics():
    r = client.get("/api/analytics/subjects?class_name=Form 1&term=Term 1&year=2025")
    assert r.status_code == 200
    assert "subjects" in r.json()

    r = client.get("/api/analytics/rankings?class_name=Form 1&term=Term 1&year=2025")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

    r = client.get("/api/analytics/overview?class_name=Form 1&term=Term 1&year=2025")
    assert r.status_code == 200
    assert "average" in r.json()


def test_reports():
    # Find a student with marks
    r = client.get("/api/students?class_name=Form 1")
    assert r.status_code == 200
    students = r.json()
    if students:
        sid = students[0]["id"]
        # JSON report
        r = client.get(f"/api/reports/student/{sid}?term=Term 1&year=2025")
        if r.status_code == 200:
            rep = r.json()
            assert "subjects" in rep
            assert "average" in rep
            assert "mean_grade" in rep

            # PDF report
            r = client.get(f"/api/reports/student/{sid}/pdf?term=Term 1&year=2025")
            assert r.status_code == 200
            assert r.headers["content-type"] == "application/pdf"

        # Class ranking xlsx
        r = client.get("/api/reports/class-ranking.xlsx?class_name=Form 1&term=Term 1&year=2025")
        assert r.status_code == 200
        assert r.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        # Subject analysis xlsx
        r = client.get("/api/reports/subject-analysis.xlsx?term=Term 1&year=2025")
        assert r.status_code == 200
        assert r.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"