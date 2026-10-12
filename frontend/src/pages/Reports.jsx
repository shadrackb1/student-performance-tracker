import { useState, useEffect, useCallback } from 'react';
import { api, downloadBlob } from '../api';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState('Form 1');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(2025);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    if (className) {
      api.students.list(className).then(setStudents).catch(console.error);
    }
  }, [className]);

  async function loadReport() {
    if (!studentId) return;
    setLoading(true);
    try {
      setReport(await api.reports.studentJson(studentId, term, year));
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  async function downloadPdf() {
    if (!studentId) return;
    setDownloading('pdf');
    try {
      const blob = await api.reports.studentPdf(studentId, term, year);
      downloadBlob(blob, `report-${studentId}-${term}-${year}.pdf`);
    } catch (e) { alert(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadRanking() {
    setDownloading('rank');
    try {
      const blob = await api.reports.classRankingXlsx(className, term, year);
      downloadBlob(blob, `class-ranking-${className}-${term}-${year}.xlsx`);
    } catch (e) { alert(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadSubjectAnalysis() {
    setDownloading('subj');
    try {
      const blob = await api.reports.subjectAnalysisXlsx(term, year, className || null);
      downloadBlob(blob, `subject-analysis-${term}-${year}.xlsx`);
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
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={className} onChange={e => { setClassName(e.target.value); setStudentId(''); setReport(null); }}>
              {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={studentId} onChange={e => { setStudentId(e.target.value); setReport(null); }}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={term} onChange={e => setTerm(e.target.value)}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <button className="btn btn-primary w-full" onClick={loadReport} disabled={!studentId || loading}>
              {loading ? 'Loading…' : 'Generate Report'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Exports</h3>
          <div className="space-y-3">
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={className} onChange={e => setClassName(e.target.value)}>
              {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={term} onChange={e => setTerm(e.target.value)}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
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
            <button className="btn btn-primary" onClick={downloadPdf} disabled={downloading === 'pdf'}>
              {downloading === 'pdf' ? '⏳' : '📥'} Download PDF
            </button>
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
                      <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{s.grade}</span></td>
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
              <SummaryCard label="Status" value={report.passed ? 'PASS (C+ and above)' : 'BELOW C+'} color={report.passed ? 'green' : 'red'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color = 'blue' }) {
  return (
    <div className={`rounded-xl p-4 border ${color === 'green' ? 'bg-green-50 border-green-200' : color === 'red' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}