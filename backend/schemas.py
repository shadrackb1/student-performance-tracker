"""Pydantic request/response models."""

from __future__ import annotations

from pydantic import BaseModel, Field


class StudentIn(BaseModel):
    admission_no: str = Field(min_length=1)
    name: str = Field(min_length=1)
    class_name: str = Field(min_length=1)


class Student(StudentIn):
    id: int
    created_at: str | None = None


class SubjectIn(BaseModel):
    name: str = Field(min_length=1)
    code: str = Field(min_length=1)
    teacher: str = ""


class Subject(SubjectIn):
    id: int


class MarkIn(BaseModel):
    student_id: int
    subject_id: int
    score: float = Field(ge=0, le=100)
    term: str = "Term 1"
    year: int = 2025


class MarksBulkIn(BaseModel):
    class_name: str
    term: str = "Term 1"
    year: int = 2025
    entries: list[MarkIn]


class ReportCardSubject(BaseModel):
    subject: str
    code: str
    score: float
    grade: str
    points: int


class ReportCard(BaseModel):
    student: Student
    term: str
    year: int
    subjects: list[ReportCardSubject]
    total_points: int
    average: float
    mean_grade: str
    rank: int
    class_size: int
    passed: bool
