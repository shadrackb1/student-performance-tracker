import { useState, useEffect, useCallback } from 'react';
import { api, downloadBlob } from '../api';

const CLASSES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState('Form 1');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(2025);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (className) {
      api.students.list(className).then(setStudents).catch(console.error);
    }
  }, [className]);

  const loadReport = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    try {
      setReport(await api.reports.studentJson(studentId, term, year));
    } catch (e) { setError(e.message); setReport(null); }
    finally { setLoading(false); }
  }, [studentId, term, year]);

  async function downloadPdf() {
    if (!studentId) return;
    setDownloading('pdf');
    try {
      const blob = await api.reports.studentPdf(studentId, term, year);
      if (blob) downloadBlob(blob, `report-${studentId}-${term}-${year}.pdf`);
    } catch (e) { setError(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadRanking() {
    setDownloading('rank');
    try {
      const blob = await api.reports.classRankingXlsx(className, term, year);
      if (blob) downloadBlob(blob, `class-ranking-${className}-${term}-${year}.xlsx`);
    } catch (e) { setError(e.message); }
    finally { setDownloading(''); }
  }

  async function downloadSubjectAnalysis() {
    setDownloading('subj');
    try {
      const blob = await api.reports.subjectAnalysisXlsx(term, year, className || null);
      if (blob) downloadBlob(blob, `subject-analysis-${term}-${year}.xlsx`);
    } catch (e) { setError(e.message); }
    finally { setDownloading(''); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-primary">Reports</h1>
        <p className="text-caption text-tertiary mt-1">Generate report cards and export class data</p>
      </div>

      {error && <p className="text-caption text-danger" role="alert">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Individual report card */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-h3 text-primary">Individual Report Card</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="label" htmlFor="rep-class">Class</label>
              <select id="rep-class" className="input" value={className} onChange={e => { setClassName(e.target.value); setStudentId(''); setReport(null); }}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="rep-student">Student</label>
              <select id="rep-student" className="input" value={studentId} onChange={e => { setStudentId(e.target.value); setReport(null); }}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="rep-term">Term</label>
                <select id="rep-term" className="input" value={term} onChange={e => setTerm(e.target.value)}>
                  {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="rep-year">Year</label>
                <select id="rep-year" className="input" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                  {[2025, 2024].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary w-full" onClick={loadReport} disabled={!studentId || loading}>
              {loading ? <span className="loading-spinner-sm" /> : null}
              {loading ? 'Generating…' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Bulk exports */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-h3 text-primary">Bulk Exports</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="label" htmlFor="bulk-class">Class</label>
              <select id="bulk-class" className="input" value={className} onChange={e => setClassName(e.target.value)}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="bulk-term">Term</label>
                <select id="bulk-term" className="input" value={term} onChange={e => setTerm(e.target.value)}>
                  {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="bulk-year">Year</label>
                <select id="bulk-year" className="input" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                  {[2025, 2024].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-1">
              <button className="btn btn-secondary w-full" onClick={downloadRanking} disabled={downloading === 'rank'}>
                {downloading === 'rank' ? <span className="loading-spinner-sm" /> : <span aria-hidden>📥</span>}
                Class Ranking (Excel/CSV)
              </button>
              <button className="btn btn-secondary w-full" onClick={downloadSubjectAnalysis} disabled={downloading === 'subj'}>
                {downloading === 'subj' ? <span className="loading-spinner-sm" /> : <span aria-hidden>📥</span>}
                Subject Analysis (Excel/CSV)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report output */}
      {report && (
        <div className="card overflow-hidden">
          <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className={`grade-badge grade-${report.mean_grade.replace('+', 'plus').replace('-', 'minus')} !text-h2 !px-3 !py-1.5`}>
                {report.mean_grade}
              </span>
              <div>
                <h2 className="text-h2 text-primary">{report.student.name}</h2>
                <p className="text-caption text-tertiary mt-0.5">
                  {report.student.admission_no} · {report.student.class_name} · {report.term} {report.year}
                </p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={downloadPdf} disabled={downloading === 'pdf'}>
              {downloading === 'pdf' ? <span className="loading-spinner-sm" /> : <span aria-hidden>📥</span>}
              Download PDF
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="table-container !shadow-none">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Code</th>
                      <th className="num">Mark</th>
                      <th>Grade</th>
                      <th className="num">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.subjects.map(s => (
                      <tr key={s.subject}>
                        <td className="!text-primary">{s.subject}</td>
                        <td className="num !text-tertiary">{s.code}</td>
                        <td className="num !text-primary font-semibold">{s.score}</td>
                        <td><span className={`grade-badge grade-${s.grade.replace('+', 'plus').replace('-', 'minus')}`}>{s.grade}</span></td>
                        <td className="num">{s.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <SummaryCard label="Aggregate Points" value={report.total_points} />
              <SummaryCard label="Average" value={`${report.average}%`} />
              <SummaryCard label="Mean Grade" value={report.mean_grade} />
              <SummaryCard label="Class Rank" value={`${report.rank} / ${report.class_size}`} />
              <SummaryCard
                label="Status"
                value={report.passed ? 'PASS' : 'BELOW C+'}
                valueClass={report.passed ? 'text-success' : 'text-danger'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, valueClass = 'text-primary' }) {
  return (
    <div className="rounded-card p-4 bg-surface border border-standard">
      <p className="text-label text-tertiary uppercase tracking-wider">{label}</p>
      <p className={`text-heading-2 font-semibold mt-1.5 ${valueClass}`}>{value}</p>
    </div>
  );
}
