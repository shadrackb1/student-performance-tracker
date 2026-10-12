"""Performance analytics built on pandas."""

from __future__ import annotations

import pandas as pd

from grading import BEST_SUBJECTS, PASS_MARK, grade_for, is_pass, points_for


def _frame(marks: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(marks, columns=["student_id", "name", "admission_no",
                                      "class_name", "subject", "code", "score"])
    if df.empty:
        return df
    df["score"] = pd.to_numeric(df["score"], errors="coerce")
    df["grade"] = df["score"].apply(grade_for)
    df["points"] = df["score"].apply(points_for)
    df["passed"] = df["score"] >= PASS_MARK
    return df


def subject_summary(marks: list[dict]) -> list[dict]:
    """Average, high/low and pass rate per subject."""
    df = _frame(marks)
    if df.empty:
        return []
    out = (
        df.groupby(["subject", "code"])
        .agg(avg=("score", "mean"), highest=("score", "max"), lowest=("score", "min"),
             entries=("score", "count"), pass_rate=("passed", "mean"))
        .reset_index()
        .sort_values("avg", ascending=False)
    )
    out["avg"] = out["avg"].round(1)
    out["pass_rate"] = (out["pass_rate"] * 100).round(1)
    out["grade"] = out["avg"].apply(grade_for)
    return out.to_dict("records")


def rankings(marks: list[dict]) -> list[dict]:
    """Class ranking by average, with KCSE aggregate points (best 7 subjects)."""
    df = _frame(marks)
    if df.empty:
        return []
    grouped = df.groupby(["student_id", "name", "admission_no", "class_name"])
    rows = []
    for keys, grp in grouped:
        student_id, name, admission_no, class_name = keys
        scores = grp["score"].tolist()
        ranked_points = sorted((points_for(s) for s in scores), reverse=True)[:BEST_SUBJECTS]
        mean = float(pd.Series(scores).mean())
        rows.append({
            "student_id": int(student_id),
            "name": name,
            "admission_no": admission_no,
            "class_name": class_name,
            "average": round(mean, 1),
            "mean_grade": grade_for(mean),
            "total_points": int(sum(ranked_points)),
            "subjects": len(scores),
            "pass_rate": round(100 * sum(is_pass(s) for s in scores) / len(scores), 1),
        })
    rows.sort(key=lambda r: (-r["average"], -r["total_points"]))
    for i, r in enumerate(rows, start=1):
        r["rank"] = i
    return rows


def class_overview(marks: list[dict]) -> dict:
    """Dashboard/overview numbers: averages, pass rate, strongest/weakest subject."""
    df = _frame(marks)
    if df.empty:
        return {
            "average": 0, "pass_rate": 0, "entries": 0,
            "strongest_subject": None, "weakest_subject": None,
            "grade_distribution": {}, "top_performers": 0,
        }
    per_student = df.groupby("student_id")["score"].mean()
    by_subject = df.groupby("subject")["score"].mean().sort_values(ascending=False)
    return {
        "average": round(float(df["score"].mean()), 1),
        "pass_rate": round(float(df["passed"].mean()) * 100, 1),
        "entries": int(len(df)),
        "strongest_subject": {"name": by_subject.index[0], "avg": round(float(by_subject.iloc[0]), 1)},
        "weakest_subject": {"name": by_subject.index[-1], "avg": round(float(by_subject.iloc[-1]), 1)},
        "grade_distribution": df["grade"].value_counts().to_dict(),
        "top_performers": int((per_student >= 80).sum()),
        "mean_grade": grade_for(float(df["score"].mean())),
    }


def grade_distribution(marks: list[dict]) -> dict[str, int]:
    df = _frame(marks)
    if df.empty:
        return {}
    return df["grade"].value_counts().to_dict()


def student_report_rows(marks: list[dict], student_id: int) -> list[dict]:
    df = _frame(marks)
    if df.empty:
        return []
    sub = df[df["student_id"] == student_id]
    return sub.sort_values("subject")[
        ["subject", "code", "score", "grade", "points"]
    ].rename(columns={"subject": "subject"}).to_dict("records")


def subject_analysis_frame(marks: list[dict]) -> pd.DataFrame:
    """DataFrame used for the subject-analysis Excel export."""
    df = _frame(marks)
    if df.empty:
        return pd.DataFrame(columns=["Subject", "Code", "Average", "Grade",
                                     "Highest", "Lowest", "Entries", "Pass Rate %"])
    out = (
        df.groupby(["subject", "code"])
        .agg(Average=("score", "mean"), Highest=("score", "max"),
             Lowest=("score", "min"), Entries=("score", "count"),
             Pass=("passed", "mean"))
        .reset_index()
        .sort_values("Average", ascending=False)
    )
    out["Average"] = out["Average"].round(1)
    out["Grade"] = out["Average"].apply(grade_for)
    out["Pass Rate %"] = (out["Pass"] * 100).round(1)
    out = out.drop(columns=["Pass"]).rename(columns={"subject": "Subject", "code": "Code"})
    return out[["Subject", "Code", "Average", "Grade", "Highest", "Lowest",
                "Entries", "Pass Rate %"]]


def ranking_frame(marks: list[dict]) -> pd.DataFrame:
    rows = rankings(marks)
    df = pd.DataFrame(rows)
    if df.empty:
        return pd.DataFrame(columns=["Rank", "Admission No", "Name", "Class",
                                     "Average", "Mean Grade", "Points", "Subjects"])
    return df.rename(columns={
        "rank": "Rank", "admission_no": "Admission No", "name": "Name",
        "class_name": "Class", "average": "Average", "mean_grade": "Mean Grade",
        "total_points": "Points", "subjects": "Subjects",
    })[["Rank", "Admission No", "Name", "Class", "Average", "Mean Grade",
        "Points", "Subjects"]]
