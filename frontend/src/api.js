import * as store from './storage';

const API = '/api';
let apiAvailable = true;

async function req(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.blob();
}

// Try API; on failure set apiAvailable=false and use localStorage
async function tryApi(path, opts, fallback) {
  if (!apiAvailable) return fallback();
  try {
    return await req(path, opts);
  } catch (e) {
    apiAvailable = false;
    return fallback();
  }
}

// Initialize localStorage store on load
store.initStore();

export const api = {
  health: () => tryApi('/health', {}, () => ({ status: 'local' })),
  meta: () => ({
    scale: [{grade:'A',points:12},{grade:'A-',points:11},{grade:'B+',points:10},{grade:'B',points:9},{grade:'B-',points:8},{grade:'C+',points:7},{grade:'C',points:6},{grade:'C-',points:5},{grade:'D+',points:4},{grade:'D',points:3},{grade:'D-',points:2},{grade:'E',points:1}],
    pass_grade: 'C+', pass_mark: 55,
    terms: ['Term 1','Term 2','Term 3'],
    years: [2023,2024,2025],
    classes: ['Form 1','Form 2','Form 3','Form 4'],
  }),

  students: {
    list: (className, q) => tryApi(
      `/students${new URLSearchParams({ class_name: className || '', q: q || '' })}`,
      {},
      () => store.getStudents(className || null, q || null)
    ),
    create: (s) => tryApi(
      '/students',
      { method: 'POST', body: JSON.stringify(s) },
      () => store.createStudent(s)
    ),
    update: (id, s) => tryApi(
      `/students/${id}`,
      { method: 'PUT', body: JSON.stringify(s) },
      () => store.updateStudent(id, s)
    ),
    delete: (id) => tryApi(
      `/students/${id}`,
      { method: 'DELETE' },
      () => { store.deleteStudent(id); return {}; }
    ),
    import: (file) => {
      // Always read file client-side for localStorage path
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target.result;
            const lines = text.split('\n').filter(l => l.trim());
            const header = lines[0].toLowerCase();
            const records = lines.slice(1).map(line => {
              const cols = line.split(',').map(c => c.trim());
              return { admission_no: cols[0], name: cols[1], class_name: cols[2] };
            }).filter(r => r.admission_no && r.name);
            // Try API first, fall back to local
            if (apiAvailable) {
              try {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch(API + '/students/import', { method: 'POST', body: fd });
                if (res.ok) { resolve(await res.json()); return; }
              } catch {}
              apiAvailable = false;
            }
            resolve(store.importStudents(records));
          } catch (e) { reject(e); }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
  },

  subjects: {
    list: () => tryApi('/subjects', {}, () => store.getSubjects()),
  },

  marks: {
    matrix: (className, term, year) => tryApi(
      `/marks/matrix?${new URLSearchParams({ class_name: className, term, year: String(year) })}`,
      {},
      () => store.getMarksMatrix(className, term, year)
    ),
    bulk: (payload) => tryApi(
      '/marks/bulk',
      { method: 'POST', body: JSON.stringify(payload) },
      () => { store.saveBulkMarks(payload.class_name, payload.term, payload.year, payload.entries); return { saved: payload.entries.length }; }
    ),
  },

  dashboard: (className, term, year) => tryApi(
    `/dashboard?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`,
    {},
    () => {
      const marks = store.getMarks(className || null, term || null, year || null);
      const overview = store.computeOverview(marks);
      const students = store.getStudents(null, null);
      const subjects = store.getSubjects();
      const classes = [...new Set(students.map(s => s.class_name))];
      const rankings = store.computeRankings(marks);
      return { ...overview, students: students.length, subjects: subjects.length, classes: classes.length, top_performers_list: rankings.slice(0,5) };
    }
  ),

  analytics: {
    subjects: (className, term, year) => tryApi(
      `/analytics/subjects?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`,
      {},
      () => {
        const marks = store.getMarks(className || null, term || null, year || null);
        const subjects = store.computeSubjectSummary(marks);
        return { subjects, strongest: subjects[0] || null, weakest: subjects[subjects.length-1] || null };
      }
    ),
    rankings: (className, term, year) => tryApi(
      `/analytics/rankings?${new URLSearchParams({ class_name: className, term: term || '', year: String(year || '') })}`,
      {},
      () => {
        const marks = store.getMarks(className, term || null, year || null);
        return store.computeRankings(marks);
      }
    ),
    overview: (className, term, year) => tryApi(
      `/analytics/overview?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`,
      {},
      () => {
        const marks = store.getMarks(className || null, term || null, year || null);
        return store.computeOverview(marks);
      }
    ),
  },

  reports: {
    studentJson: (id, term, year) => tryApi(
      `/reports/student/${id}?${new URLSearchParams({ term, year: String(year) })}`,
      {},
      () => {
        const students = store.getStudents(null, null);
        const student = students.find(s => s.id === parseInt(id));
        if (!student) throw new Error('Student not found');
        const marks = store.getMarks(null, term, year);
        const report = store.computeReportCard(parseInt(id), marks);
        if (!report) throw new Error('No marks for this student');
        return { student, term, year, ...report };
      }
    ),
    studentPdf: (id, term, year) => tryApi(
      `/reports/student/${id}/pdf?${new URLSearchParams({ term, year: String(year) })}`,
      {},
      () => { throw new Error('PDF export requires the backend server'); }
    ),
    classRankingXlsx: (className, term, year) => tryApi(
      `/reports/class-ranking.xlsx?${new URLSearchParams({ class_name: className, term, year: String(year) })}`,
      {},
      () => { throw new Error('Excel export requires the backend server'); }
    ),
    subjectAnalysisXlsx: (term, year, className) => tryApi(
      `/reports/subject-analysis.xlsx?${new URLSearchParams({ term, year: String(year), class_name: className || '' })}`,
      {},
      () => { throw new Error('Excel export requires the backend server'); }
    ),
  },
};

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function isApiAvailable() { return apiAvailable; }