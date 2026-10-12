"""Tests for reports module."""

import pytest
from reports import report_card_pdf, class_ranking_xlsx, subject_analysis_xlsx


def test_report_card_pdf():
    report = {
        "student": {"name": "Test Student", "admission_no": "F1001", "class_name": "Form 1"},
        "term": "Term 1", "year": 2025,
        "subjects": [
            {"subject": "Mathematics", "code": "121", "score": 85.0, "grade": "A", "points": 12},
            {"subject": "English", "code": "101", "score": 78.0, "grade": "A-", "points": 11},
        ],
        "total_points": 23, "average": 81.5, "mean_grade": "A-",
        "rank": 1, "class_size": 30, "passed": True,
    }
    pdf = report_card_pdf(report)
    assert isinstance(pdf, bytes)
    assert len(pdf) > 100
    assert pdf[:4] == b'%PDF'


def test_class_ranking_xlsx():
    rows = [
        {"rank": 1, "admission_no": "F1001", "name": "Alice", "class_name": "Form 1",
         "average": 85.5, "mean_grade": "A", "total_points": 84, "subjects": 12, "pass_rate": 100.0},
        {"rank": 2, "admission_no": "F1002", "name": "Bob", "class_name": "Form 1",
         "average": 72.0, "mean_grade": "B+", "total_points": 70, "subjects": 12, "pass_rate": 91.7},
    ]
    data = class_ranking_xlsx(rows, "Form 1", "Term 1", 2025)
    assert isinstance(data, bytes)
    assert len(data) > 100
    # Excel files start with PK (zip)
    assert data[:2] == b'PK'


def test_subject_analysis_xlsx():
    import pandas as pd
    df = pd.DataFrame({
        "Subject": ["Mathematics", "English"],
        "Code": ["121", "101"],
        "Average": [80.5, 75.0],
        "Grade": ["A", "A-"],
        "Highest": [95, 88],
        "Lowest": [65, 62],
        "Entries": [30, 30],
        "Pass Rate %": [95.0, 90.0],
    })
    data = subject_analysis_xlsx(df, "Term 1", 2025)
    assert isinstance(data, bytes)
    assert len(data) > 100
    assert data[:2] == b'PK'