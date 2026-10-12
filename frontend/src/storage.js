// LocalStorage-backed data store that mirrors the API shape.
// Used as fallback when the backend is unavailable or data is ephemeral.

const KEYS = {
  students: 'chokur_students',
  subjects: 'chokur_subjects',
  marks: 'chokur_marks',
  meta: 'chokur_meta',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ---------- init / seed ----------
export function initStore() {
  if (!read(KEYS.subjects, null)) {
    write(KEYS.subjects, [
      { id: 1, name: 'English', code: '101', teacher: 'Mr. Otieno' },
      { id: 2, name: 'Kiswahili', code: '102', teacher: 'Mrs. Wanjiru' },
      { id: 3, name: 'Mathematics', code: '121', teacher: 'Mr. Kimani' },
      { id: 4, name: 'Biology', code: '231', teacher: 'Dr. Achieng' },
      { id: 5, name: 'Physics', code: '232', teacher: 'Mr. Mwangi' },
      { id: 6, name: 'Chemistry', code: '233', teacher: 'Ms. Njeri' },
      { id: 7, name: 'History & Government', code: '311', teacher: 'Mr. Ochieng' },
      { id: 8, name: 'Geography', code: '312', teacher: 'Mrs. Chebet' },
      { id: 9, name: 'CRE', code: '313', teacher: 'Fr. Kamau' },
      { id: 10, name: 'Agriculture', code: '443', teacher: 'Mr. Barasa' },
      { id: 11, name: 'Computer Studies', code: '451', teacher: 'Ms. Adhiambo' },
      { id: 12, name: 'Business Studies', code: '565', teacher: 'Mr. Kiptoo' },
    ]);
  }
  if (!read(KEYS.students, null)) write(KEYS.students, []);
  if (!read(KEYS.marks, null)) write(KEYS.marks, []);
}

// ---------- students ----------
export function getStudents(className, q) {
  let list = read(KEYS.students, []);
  if (className) list = list.filter(s => s.class_name === className);
  if (q) {
    const lq = q.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(lq) || s.admission_no.toLowerCase().includes(lq));
  }
  return list;
}

export function createStudent(data) {
  const list = read(KEYS.students, []);
  if (list.some(s => s.admission_no === data.admission_no)) throw new Error('Admission number already exists');
  const id = Math.max(0, ...list.map(s => s.id)) + 1;
  const student = { id, ...data, created_at: new Date().toISOString() };
  list.push(student);
  write(KEYS.students, list);
  return student;
}

export function updateStudent(id, data) {
  const list = read(KEYS.students, []);
  const idx = list.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Student not found');
  list[idx] = { ...list[idx], ...data };
  write(KEYS.students, list);
  return list[idx];
}

export function deleteStudent(id) {
  let list = read(KEYS.students, []);
  list = list.filter(s => s.id !== id);
  write(KEYS.students, list);
  // also remove marks for this student
  let marks = read(KEYS.marks, []);
  marks = marks.filter(m => m.student_id !== id);
  write(KEYS.marks, marks);
}

export function importStudents(records) {
  const list = read(KEYS.students, []);
  let inserted = 0, updated = 0;
  for (const r of records) {
    if (!r.admission_no || !r.name || !r.class_name) continue;
    const existing = list.find(s => s.admission_no === r.admission_no);
    if (existing) {
      existing.name = r.name;
      existing.class_name = r.class_name;
      updated++;
    } else {
      const id = Math.max(0, ...list.map(s => s.id)) + 1;
      list.push({ id, ...r, created_at: new Date().toISOString() });
      inserted++;
    }
  }
  write(KEYS.students, list);
  return { inserted, updated, total: records.length };
}

// ---------- subjects ----------
export function getSubjects() {
  return read(KEYS.subjects, []);
}

// ---------- marks ----------
export function getMarks(className, term, year) {
  let marks = read(KEYS.marks, []);
  const students = read(KEYS.students, []);
  const subjects = read(KEYS.subjects, []);

  let result = marks.map(m => {
    const stu = students.find(s => s.id === m.student_id);
    const sub = subjects.find(s => s.id === m.subject_id);
    if (!stu || !sub) return null;
    return {
      student_id: m.student_id,
      name: stu.name,
      admission_no: stu.admission_no,
      class_name: stu.class_name,
      subject: sub.name,
      code: sub.code,
      score: m.score,
    };
  }).filter(Boolean);

  if (className) result = result.filter(m => m.class_name === className);
  if (term) result = result.filter(m => m.term === term);
  if (year) result = result.filter(m => m.year === year);
  return result;
}

export function saveBulkMarks(class_name, term, year, entries) {
  const marks = read(KEYS.marks, []);
  for (const e of entries) {
    const idx = marks.findIndex(m =>
      m.student_id === e.student_id && m.subject_id === e.subject_id &&
      m.term === term && m.year === year);
    if (idx >= 0) marks[idx].score = e.score;
    else {
      const id = Math.max(0, ...marks.map(m => m.id)) + 1;
      marks.push({ id, ...e, term, year });
    }
  }
  write(KEYS.marks, marks);
  return entries.length;
}

export function getMarksMatrix(className, term, year) {
  const students = read(KEYS.students, []).filter(s => s.class_name === className);
  const subjects = read(KEYS.subjects, []);
  const marks = read(KEYS.marks, []);
  const grid = {};
  for (const m of marks) {
    if (m.term === term && m.year === year) {
      if (!grid[m.student_id]) grid[m.student_id] = {};
      grid[m.student_id][m.subject_id] = m.score;
    }
  }
  return {
    students: students.map(s => ({ id: s.id, admission_no: s.admission_no, name: s.name })),
    subjects,
    marks: grid,
  };
}

// ---------- KCSE grading (client-side) ----------
const BANDS = [[80,'A'],[75,'A-'],[70,'B+'],[65,'B'],[60,'B-'],[55,'C+'],[50,'C'],[45,'C-'],[40,'D+'],[35,'D'],[30,'D-']];
const POINTS = { 'A':12,'A-':11,'B+':10,'B':9,'B-':8,'C+':7,'C':6,'C-':5,'D+':4,'D':3,'D-':2,'E':1 };
const ORDER = ['A','A-','B+','B','B-','C+','C','C-','D+','D','D-','E'];

export function gradeFor(score) {
  if (score == null) return '-';
  for (const [lower, letter] of BANDS) if (score >= lower) return letter;
  return 'E';
}

export function pointsFor(score) { return POINTS[gradeFor(score)] || 1; }

// ---------- analytics (client-side) ----------
export function computeOverview(marks) {
  if (!marks.length) return { average:0, pass_rate:0, entries:0, strongest_subject:null, weakest_subject:null, grade_distribution:{}, top_performers:0, mean_grade:'-' };
  const scores = marks.map(m => m.score);
  const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
  const passRate = scores.filter(s => s >= 55).length / scores.length * 100;

  const bySubject = {};
  for (const m of marks) {
    if (!bySubject[m.subject]) bySubject[m.subject] = [];
    bySubject[m.subject].push(m.score);
  }
  const subjAvgs = Object.entries(bySubject).map(([name, ss]) => ({
    name, avg: ss.reduce((a,b)=>a+b,0)/ss.length
  })).sort((a,b) => b.avg - a.avg);

  const dist = {};
  for (const s of scores) { const g = gradeFor(s); dist[g] = (dist[g]||0)+1; }

  // top performers: student avg >= 80
  const byStudent = {};
  for (const m of marks) {
    if (!byStudent[m.student_id]) byStudent[m.student_id] = [];
    byStudent[m.student_id].push(m.score);
  }
  const topPerformers = Object.values(byStudent).filter(ss => {
    const a = ss.reduce((x,y)=>x+y,0)/ss.length;
    return a >= 80;
  }).length;

  return {
    average: Math.round(avg*10)/10,
    pass_rate: Math.round(passRate*10)/10,
    entries: marks.length,
    strongest_subject: subjAvgs[0] ? { name: subjAvgs[0].name, avg: Math.round(subjAvgs[0].avg*10)/10 } : null,
    weakest_subject: subjAvgs.length ? { name: subjAvgs[subjAvgs.length-1].name, avg: Math.round(subjAvgs[subjAvgs.length-1].avg*10)/10 } : null,
    grade_distribution: dist,
    top_performers: topPerformers,
    mean_grade: gradeFor(avg),
  };
}

export function computeSubjectSummary(marks) {
  const bySubject = {};
  for (const m of marks) {
    if (!bySubject[m.subject]) bySubject[m.subject] = { subject: m.subject, code: m.code, scores: [] };
    bySubject[m.subject].scores.push(m.score);
  }
  return Object.values(bySubject).map(s => {
    const avg = s.scores.reduce((a,b)=>a+b,0)/s.scores.length;
    return {
      subject: s.subject, code: s.code,
      avg: Math.round(avg*10)/10,
      highest: Math.max(...s.scores),
      lowest: Math.min(...s.scores),
      entries: s.scores.length,
      pass_rate: Math.round(s.scores.filter(x=>x>=55).length/s.scores.length*100*10)/10,
      grade: gradeFor(avg),
    };
  }).sort((a,b) => b.avg - a.avg);
}

export function computeRankings(marks) {
  const byStudent = {};
  for (const m of marks) {
    if (!byStudent[m.student_id]) byStudent[m.student_id] = { student_id: m.student_id, name: m.name, admission_no: m.admission_no, class_name: m.class_name, scores: [] };
    byStudent[m.student_id].scores.push(m.score);
  }
  const rows = Object.values(byStudent).map(s => {
    const avg = s.scores.reduce((a,b)=>a+b,0)/s.scores.length;
    const points = s.scores.map(pointsFor).sort((a,b)=>b-a).slice(0,7).reduce((a,b)=>a+b,0);
    return {
      student_id: s.student_id, name: s.name, admission_no: s.admission_no,
      class_name: s.class_name, average: Math.round(avg*10)/10,
      mean_grade: gradeFor(avg), total_points: points,
      subjects: s.scores.length,
      pass_rate: Math.round(s.scores.filter(x=>x>=55).length/s.scores.length*100*10)/10,
    };
  });
  rows.sort((a,b) => b.average - a.average);
  rows.forEach((r,i) => r.rank = i+1);
  return rows;
}

export function computeReportCard(studentId, marks) {
  const studentMarks = marks.filter(m => m.student_id === studentId);
  if (!studentMarks.length) return null;
  const subjects = studentMarks.map(m => ({
    subject: m.subject, code: m.code, score: m.score,
    grade: gradeFor(m.score), points: pointsFor(m.score),
  })).sort((a,b) => a.subject.localeCompare(b.subject));
  const scores = subjects.map(s => s.score);
  const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
  const points = scores.map(pointsFor).sort((a,b)=>b-a).slice(0,7).reduce((a,b)=>a+b,0);
  const allRankings = computeRankings(marks);
  const rank = allRankings.find(r => r.student_id === studentId)?.rank || 0;
  return {
    subjects,
    total_points: points,
    average: Math.round(avg*10)/10,
    mean_grade: gradeFor(avg),
    rank,
    class_size: allRankings.length,
    passed: avg >= 55,
  };
}