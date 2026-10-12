"""Demo data: KCSE subject list, Kenyan student names, seeded marks."""

from __future__ import annotations

import random
import sqlite3

SUBJECTS = [
    ("English", "101", "Mr. Otieno"),
    ("Kiswahili", "102", "Mrs. Wanjiru"),
    ("Mathematics", "121", "Mr. Kimani"),
    ("Biology", "231", "Dr. Achieng"),
    ("Physics", "232", "Mr. Mwangi"),
    ("Chemistry", "233", "Ms. Njeri"),
    ("History & Government", "311", "Mr. Ochieng"),
    ("Geography", "312", "Mrs. Chebet"),
    ("CRE", "313", "Fr. Kamau"),
    ("Agriculture", "443", "Mr. Barasa"),
    ("Computer Studies", "451", "Ms. Adhiambo"),
    ("Business Studies", "565", "Mr. Kiptoo"),
]

FIRST = ["Brian", "Cynthia", "Dennis", "Esther", "Felix", "Grace", "Hassan", "Irene",
         "John", "Kelvin", "Lilian", "Mercy", "Nicholas", "Olive", "Peter", "Quin",
         "Rachel", "Samuel", "Tabitha", "Victor", "Wycliffe", "Yvonne", "Zawadi",
         "Abel", "Brenda", "Collins", "Dorcas", "Emmanuel", "Faith", "George"]
LAST = ["Achieng", "Barasa", "Chebet", "Doe", "Ekesa", "Githinji", "Hassan", "Juma",
        "Kamau", "Kiptoo", "Lekokat", "Mwangi", "Njoroge", "Ochieng", "Omollo",
        "Wanjiru", "Wekesa", "Yego", "Zawadi", "Mutiso"]

CLASSES = ["Form 1", "Form 2", "Form 3", "Form 4"]
TERMS = ["Term 1", "Term 2", "Term 3"]
YEAR = 2025


def seed(conn: sqlite3.Connection, students_per_class: int = 12, random_seed: int = 42) -> dict:
    """Populate subjects/students/marks (idempotent). Returns counts."""
    rng = random.Random(random_seed)
    cur = conn.cursor()

    if cur.execute("SELECT COUNT(*) FROM subjects").fetchone()[0] == 0:
        conn.executemany(
            "INSERT INTO subjects (name, code, teacher) VALUES (?, ?, ?)", SUBJECTS)

    names_used = {(r[0], r[1]) for r in cur.execute("SELECT name, class_name FROM students")}
    for class_name in CLASSES:
        prefix = class_name.replace("Form ", "F")
        taken = {r[0] for r in cur.execute(
            "SELECT admission_no FROM students WHERE class_name = ?", (class_name,))}
        pool = [(f, l) for f in FIRST for l in LAST if (f, l) not in names_used]
        rng.shuffle(pool)
        for i in range(students_per_class):
            admission_no = f"{prefix}{i + 1:03d}"
            if admission_no in taken:
                continue
            name = f"{pool[i][0]} {pool[i][1]}"
            cur.execute(
                "INSERT INTO students (admission_no, name, class_name) VALUES (?, ?, ?)",
                (admission_no, name, class_name))
            names_used.add((name, class_name))

    subject_ids = cur.execute("SELECT id FROM subjects").fetchall()
    subject_ids = [r[0] for r in subject_ids]
    existing = cur.execute("SELECT COUNT(*) FROM marks").fetchone()[0]

    if existing == 0:
        students = cur.execute("SELECT id FROM students").fetchall()
        marks = []
        for (student_id,) in [tuple(r) for r in students]:
            # ability ~ N(62, 14) per student, jitter per subject/term
            ability = max(25, min(92, rng.gauss(62, 14)))
            for term in TERMS[:2]:
                for subject_id in subject_ids:
                    score = max(8, min(98, rng.gauss(ability, 8)))
                    marks.append((student_id, subject_id, round(score, 1), term, YEAR))
        cur.executemany(
            """INSERT OR IGNORE INTO marks (student_id, subject_id, score, term, year)
               VALUES (?, ?, ?, ?, ?)""", marks)

    conn.commit()
    return {
        "students": cur.execute("SELECT COUNT(*) FROM students").fetchone()[0],
        "subjects": cur.execute("SELECT COUNT(*) FROM subjects").fetchone()[0],
        "marks": cur.execute("SELECT COUNT(*) FROM marks").fetchone()[0],
    }
