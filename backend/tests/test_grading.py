"""Tests for KCSE grading functions."""

import pytest
from grading import (
    grade_for, points_for, is_pass, mean_grade,
    aggregate_points, grade_distribution, PASS_MARK, BEST_SUBJECTS,
)


def test_grade_bands():
    cases = [
        (95, "A"), (80, "A"), (80.1, "A"),
        (79.9, "A-"), (78, "A-"), (75, "A-"), (74.9, "B+"),
        (72, "B+"), (70, "B+"), (69.9, "B"),
        (67, "B"), (65, "B"), (64.9, "B-"),
        (62, "B-"), (60, "B-"), (59.9, "C+"),
        (57, "C+"), (55, "C+"), (54.9, "C"),
        (52, "C"), (50, "C"), (49.9, "C-"),
        (47, "C-"), (45, "C-"), (44.9, "D+"),
        (42, "D+"), (40, "D+"), (39.9, "D"),
        (37, "D"), (35, "D"), (34.9, "D-"),
        (32, "D-"), (30, "D-"), (29.9, "E"),
        (20, "E"), (0, "E"),
    ]
    for score, expected in cases:
        assert grade_for(score) == expected, f"{score} -> {grade_for(score)} != {expected}"


def test_points_for():
    assert points_for(90) == 12  # A
    assert points_for(77) == 11  # A-
    assert points_for(72) == 10  # B+
    assert points_for(67) == 9   # B
    assert points_for(62) == 8   # B-
    assert points_for(57) == 7   # C+
    assert points_for(52) == 6   # C
    assert points_for(47) == 5   # C-
    assert points_for(42) == 4   # D+
    assert points_for(37) == 3   # D
    assert points_for(32) == 2   # D-
    assert points_for(20) == 1   # E


def test_pass_threshold():
    assert is_pass(55) is True
    assert is_pass(54.9) is False
    assert is_pass(56) is True
    assert is_pass(80) is True
    assert is_pass(30) is False


def test_mean_grade():
    assert mean_grade(85) == "A"
    assert mean_grade(70) == "B+"
    assert mean_grade(55) == "C+"
    assert mean_grade(54) == "C"


def test_aggregate_points():
    scores = [90, 85, 80, 75, 70, 65, 60, 55, 50]  # 9 subjects
    # 90->A(12), 85->A(12), 80->A(12), 75->A-(11), 70->B+(10), 65->B(9), 60->B-(8), 55->C+(7), 50->C(6)
    # Best 7: 12+12+12+11+10+9+8 = 74
    assert aggregate_points(scores) == 74

    # Fewer than 7
    assert aggregate_points([90, 85, 80]) == 12 + 12 + 12  # 36

    # With None/empty
    assert aggregate_points([]) == 0


def test_grade_distribution():
    scores = [90, 85, 78, 72, 65, 55, 45, 35, 25]
    dist = grade_distribution(scores)
    # 90->A, 85->A, 78->A-, 72->B+, 65->B, 55->C+, 45->C-, 35->D, 25->E
    assert dist["A"] == 2
    assert dist["A-"] == 1
    assert dist["B+"] == 1
    assert dist["B"] == 1
    assert dist["C+"] == 1
    assert dist["C-"] == 1
    assert dist["D"] == 1
    assert dist["E"] == 1
    assert sum(dist.values()) == 9


def test_pass_mark_constant():
    assert PASS_MARK == 55.0
    assert BEST_SUBJECTS == 7