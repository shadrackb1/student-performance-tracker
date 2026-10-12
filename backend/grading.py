"""KCSE (Kenya Certificate of Secondary Education) grading.

KNEC grades each subject on a 12-point scale, letters A (top) to E (bottom).
The bands below are the general subject scale (e.g. English, Biology, History);
the mean/aggregate grade uses the same letter scale applied to the average mark.
"""

from __future__ import annotations

PASS_GRADE = "C+"
PASS_MARK = 55.0
POINTS = {
    "A": 12, "A-": 11, "B+": 10, "B": 9, "B-": 8, "C+": 7,
    "C": 6, "C-": 5, "D+": 4, "D": 3, "D-": 2, "E": 1,
}
ORDER = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"]
BANDS = [
    (80.0, "A"),
    (75.0, "A-"),
    (70.0, "B+"),
    (65.0, "B"),
    (60.0, "B-"),
    (55.0, "C+"),
    (50.0, "C"),
    (45.0, "C-"),
    (40.0, "D+"),
    (35.0, "D"),
    (30.0, "D-"),
]
BEST_SUBJECTS = 7  # KCSE aggregate = points from the 7 best subjects


def grade_for(score: float) -> str:
    """Letter grade for a raw mark out of 100."""
    if score is None:
        return "-"
    for lower, letter in BANDS:
        if score >= lower:
            return letter
    return "E"


def points_for(score: float) -> int:
    """KCSE points (1-12) for a raw mark out of 100."""
    return POINTS[grade_for(score)]


def is_pass(score: float) -> bool:
    """A pass is C+ or better (university entry benchmark)."""
    return score is not None and score >= PASS_MARK


def mean_grade(average: float) -> str:
    """Mean grade for an average mark."""
    return grade_for(average)


def aggregate_points(scores: list[float]) -> int:
    """Aggregate points from the BEST_SUBJECTS subjects (KCSE rule)."""
    ranked = sorted((points_for(s) for s in scores if s is not None), reverse=True)
    return sum(ranked[:BEST_SUBJECTS])


def grade_distribution(scores: list[float]) -> dict[str, int]:
    dist = {g: 0 for g in ORDER}
    for s in scores:
        if s is not None:
            dist[grade_for(s)] += 1
    return dist
