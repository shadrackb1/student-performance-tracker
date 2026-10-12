const API = '/api';

async function req(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${txt}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.blob();
}

export const api = {
  health: () => req('/health'),
  meta: () => req('/meta'),

  students: {
    list: (className, q) => req(`/students${new URLSearchParams({ class_name: className || '', q: q || '' }).toString()}`),
    create: (s) => req('/students', { method: 'POST', body: JSON.stringify(s) }),
    update: (id, s) => req(`/students/${id}`, { method: 'PUT', body: JSON.stringify(s) }),
    delete: (id) => req(`/students/${id}`, { method: 'DELETE' }),
    import: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return fetch(API + '/students/import', { method: 'POST', body: fd }).then(r => r.json());
    },
  },

  subjects: {
    list: () => req('/subjects'),
    create: (s) => req('/subjects', { method: 'POST', body: JSON.stringify(s) }),
  },

  marks: {
    matrix: (className, term, year) => req(`/marks/matrix?${new URLSearchParams({ class_name: className, term, year: String(year) })}`),
    bulk: (payload) => req('/marks/bulk', { method: 'POST', body: JSON.stringify(payload) }),
  },

  dashboard: (className, term, year) => req(`/dashboard?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`),

  analytics: {
    subjects: (className, term, year) => req(`/analytics/subjects?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`),
    rankings: (className, term, year) => req(`/analytics/rankings?${new URLSearchParams({ class_name: className, term: term || '', year: String(year || '') })}`),
    overview: (className, term, year) => req(`/analytics/overview?${new URLSearchParams({ class_name: className || '', term: term || '', year: String(year || '') })}`),
  },

  reports: {
    studentJson: (id, term, year) => req(`/reports/student/${id}?${new URLSearchParams({ term, year: String(year) })}`),
    studentPdf: (id, term, year) => fetch(`${API}/reports/student/${id}/pdf?${new URLSearchParams({ term, year: String(year) })}`).then(r => r.blob()),
    classRankingXlsx: (className, term, year) => fetch(`${API}/reports/class-ranking.xlsx?${new URLSearchParams({ class_name: className, term, year: String(year) })}`).then(r => r.blob()),
    subjectAnalysisXlsx: (term, year, className) => fetch(`${API}/reports/subject-analysis.xlsx?${new URLSearchParams({ term, year: String(year), class_name: className || '' })}`).then(r => r.blob()),
  },
};

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export { downloadBlob };