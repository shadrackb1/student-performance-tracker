import { useState, useEffect } from 'react';
import { api, downloadBlob } from '../api';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ class_name: 'Form 1', term: 'Term 1', year: 2025, student_id: '' });
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState('');

  useEffect(() => loadMeta(), []);

  async function loadMeta() {
    try {
      const [st, cls] = await Promise.all([
        api.students.list('Form 1'),
        api.dashboard(null, 'Term 1', 2025).then(d => Array.from(new Set(Object.values(d.top_performers_list || []).map(s => s.class_name)))).catch(() => ['Form 1', 'Form 2', 'Form 3', 'Form 4']),
      ]);
      setStudents(st);
      setClasses(['Form 1', 'Form 2', 'Form 3', 'Form 4']);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    if (filters.class_name) {
      api.students.list(filters.class_name).then(setStudents).catch(console.error);
    }
  }, [filters.class_name]);

  async function loadReport() {
    if (!filters.student_id) return;
    setLoading(true);
    try {
      const r = await api.reports.studentJson(filters.student_id, filters.term, filters.year);
      setReport(r);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  async function downloadPdf() {
    if (!filters.student_id) return;
    setDownloading('pdf');
    try {
      const blob = await api.reports.studentPdf(filters.student_id, filters.term, filters.year);
      downloadBlob(blob, `report-${filters.student_id}-${filters.term}-${filters.year}.pdf`);
    } catch (e) { alert(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadRanking() {
    setDownloading('rank');
    try {
      const blob = await api.reports.classRankingXlsx(filters.class_name, filters.term, filters.year);
      downloadBlob(blob, `class-ranking-${filters.class_name}-${filters.term}-${filters.year}.xlsx`);
    } catch (e) { alert(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadSubjectAnalysis() {
    setDownloading('subj');
    try {
      const blob = await api.reports.subjectAnalysisXlsx(filters.term, filters.year, filters.class_name || null);
      downloadBlob(blob, `subject-analysis-${filters.term}-${filters.year}.xlsx`);
    } catch (e) { alert(e.message); }
    finally { setDownloading(''); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Individual Report Card</h3>
          <div className="space-y-4">
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={filters.class_name} onChange={e => setFilters(f => ({ ...f, class_name: e.target.value, student_id: '' }))}>
              {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={filters.student_id} onChange={e => setFilters(f => ({ ...f, student_id: e.target.value }))}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.term} onChange={e => setFilters(f => ({ ...f, term: e.target.value }))}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: parseInt(e.target.value) }))}>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <button className="btn btn-primary w-full" onClick={loadReport} disabled={!filters.student_id || loading}>
              {loading ? 'Loading…' : 'Generate Report'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Exports</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.class_name} onChange={e => setFilters(f => ({ ...f, class_name: e.target.value }))}>
                {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.term} onChange={e => setFilters(f => ({ ...f, term: e.target.value }))}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: parseInt(e.target.value) }))}>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="btn border border-slate-300 text-slate-700 hover:bg-slate-50" onClick={downloadRanking} disabled={downloading === 'rank'}>
                {downloading === 'rank' ? '⏳' : '📥'} Class Ranking (XLSX)
              </button>
              <button className="btn border border-slate-300 text-slate-700 hover:bg-slate-50" onClick={downloadSubjectAnalysis} disabled={downloading === 'subj'}>
                {downloading === 'subj' ? '⏳' : '📥'} Subject Analysis (XLSX)
              </button>
            </div>
          </div>
        </div>
      </div>

      {report && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{report.student.name}</h2>
              <p className="text-slate-600">{report.student.admission_no} • {report.student.class_name} • {report.term} {report.year}</p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={downloadPdf} disabled={downloading === 'pdf'}>
                {downloading === 'pdf' ? '⏳' : '📥'} Download PDF
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b bg-slate-50">
                    <th className="p-3">Subject</th>
                    <th className="p-3">Code</th>
                    <th className="p-3 text-right">Mark</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {report.subjects.map(s => (
                    <tr key={s.subject} className="border-b border-slate-100">
                      <td className="p-3">{s.subject}</td>
                      <td className="p-3 font-mono text-slate-500">{s.code}</td>
                      <td className="p-3 text-right font-bold">{s.score}</td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary">{s.grade}</span></td>
                      <td className="p-3 text-right">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <SummaryCard label="Aggregate Points" value={report.total_points} />
              <SummaryCard label="Average" value={`${report.average}%`} />
              <SummaryCard label="Mean Grade" value={report.mean_grade} />
              <SummaryCard label="Class Rank" value={`${report.rank} / ${report.class_size}`} />
              <SummaryCard label="Status" value={report.passed ? 'PASS (C+ and above)' : 'BELOW C+'} color={report.passed ? 'success' : 'danger'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color = 'primary' }) {
  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}