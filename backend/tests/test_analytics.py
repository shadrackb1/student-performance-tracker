"""Tests for analytics module using in-memory data."""

import pytest
import pandas as pd
from analytics import (
    subject_summary, rankings, class_overview,
    grade_distribution, student_report_rows,
    subject_analysis_frame, ranking_frame,
)


SAMPLE_MARKS = [
    {"student_id": 1, "name": "Alice", "admission_no": "F1001", "class_name": "Form 1",
     "subject": "Mathematics", "code": "121", "score": 85.0},
    {"student_id": 1, "name": "Alice", "admission_no": "F1001", "class_name": "Form 1",
     "subject": "English", "code": "101", "score": 78.0},
    {"student_id": 1, "name": "Alice", "admission_no": "F1001", "class_name": "Form 1",
     "subject": "Kiswahili", "code": "102", "score": 82.0},
    {"student_id": 2, "name": "Bob", "admission_no": "F1002", "class_name": "Form 1",
     "subject": "Mathematics", "code": "121", "score": 65.0},
    {"student_id": 2, "name": "Bob", "admission_no": "F1002", "class_name": "Form 1",
     "subject": "English", "code": "101", "score": 70.0},
    {"student_id": 2, "name": "Bob", "admission_no": "F1002", "class_name": "Form 1",
     "subject": "Kiswahili", "code": "102", "score": 68.0},
    {"student_id": 3, "name": "Carol", "admission_no": "F1003", "class_name": "Form 1",
     "subject": "Mathematics", "code": "121", "score": 92.0},
    {"student_id": 3, "name": "Carol", "admission_no": "F1003", "class_name": "Form 1",
     "subject": "English", "code": "101", "score": 88.0},
    {"student_id": 3, "name": "Carol", "admission_no": "F1003", "class_name": "Form 1",
     "subject": "Kiswahili", "code": "102", "score": 90.0},
]


def test_subject_summary():
    res = subject_summary(SAMPLE_MARKS)
    assert len(res) == 3
    # Sorted by avg desc
    # Math: (85+65+92)/3 = 80.67
    # English: (78+70+88)/3 = 78.67
    # Kiswahili: (82+68+90)/3 = 80.0
    assert res[0]["subject"] == "Mathematics"
    assert abs(res[0]["avg"] - 80.7) < 0.2
    assert "grade" in res[0]
    assert "pass_rate" in res[0]


def test_rankings():
    res = rankings(SAMPLE_MARKS)
    assert len(res) == 3
    # Carol: (92+88+90)/3 = 90, Alice: (85+78+82)/3 = 81.67, Bob: 67.67
    assert res[0]["name"] == "Carol"
    assert res[0]["rank"] == 1
    assert res[0]["average"] == 90.0
    assert res[1]["name"] == "Alice"
    assert res[2]["name"] == "Bob"
    # Check total_points (best 7, here 3 subjects)
    # Carol grades: A, A, A -> 12+12+12 = 36
    assert res[0]["total_points"] == 36
    assert "pass_rate" in res[0]


def test_class_overview():
    ov = class_overview(SAMPLE_MARKS)
    assert ov["entries"] == 9
    assert abs(ov["average"] - 79.8) < 0.5  # mean of all 9 scores
    assert "pass_rate" in ov
    assert "strongest_subject" in ov
    assert "weakest_subject" in ov
    assert "grade_distribution" in ov
    assert "top_performers" in ov
    assert "mean_grade" in ov


def test_grade_distribution():
    dist = grade_distribution(SAMPLE_MARKS)
    assert sum(dist.values()) == 9
    assert "A" in dist or "A-" in dist


def test_student_report_rows():
    rows = student_report_rows(SAMPLE_MARKS, 1)
    assert len(rows) == 3
    assert rows[0]["subject"] == "English"  # sorted by subject
    assert "grade" in rows[0]
    assert "points" in rows[0]


def test_subject_analysis_frame():
    df = subject_analysis_frame(SAMPLE_MARKS)
    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["Subject", "Code", "Average", "Grade", "Highest", "Lowest", "Entries", "Pass Rate %"]
    assert len(df) == 3


def test_ranking_frame():
    df = ranking_frame(SAMPLE_MARKS)
    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == ["Rank", "Admission No", "Name", "Class", "Average", "Mean Grade", "Points", "Subjects"]
    assert len(df) == 3
    assert df.iloc[0]["Rank"] == 1
    assert df.iloc[0]["Name"] == "Carol"


def test_empty_data():
    empty = []
    assert subject_summary(empty) == []
    assert rankings(empty) == []
    assert class_overview(empty)["entries"] == 0
    assert grade_distribution(empty) == {}
    assert student_report_rows(empty, 1) == []
    assert subject_analysis_frame(empty).empty
    assert ranking_frame(empty).empty