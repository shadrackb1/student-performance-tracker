import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { gradeFor } from '../storage';

const CLASSES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export default function Marks() {
  const [matrix, setMatrix] = useState({ students: [], subjects: [], marks: {} });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [className, setClassName] = useState('Form 1');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(2025);
  const [edited, setEdited] = useState({});
  const [saved, setSaved] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setMatrix(await api.marks.matrix(className, term, year)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [className, term, year]);

  useEffect(() => { load(); }, [load]);

  function handleChange(studentId, subjectId, value) {
    const num = value === '' ? null : parseFloat(value);
    if (num !== null && (isNaN(num) || num < 0 || num > 100)) return;
    setEdited(prev => ({ ...prev, [`${studentId}-${subjectId}`]: num }));
  }

  async function saveAll() {
    const entries = Object.entries(edited).map(([key, score]) => {
      const [student_id, subject_id] = key.split('-').map(Number);
      return { student_id, subject_id, score };
    });
    if (!entries.length) return;
    setSaving(true);
    try {
      await api.marks.bulk({ class_name: className, term, year, entries });
      setEdited({});
      setSaved(`✓ ${entries.length} marks saved`);
      setTimeout(() => setSaved(''), 3000);
      load();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  }

  const getScore = (sid, subjId) => edited[`${sid}-${subjId}`] ?? matrix.marks[sid]?.[subjId] ?? '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 text-primary">Marks Entry</h1>
          <p className="text-caption text-tertiary mt-1">{className} · {term}, {year} · scores 0–100, graded automatically</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="input w-auto" value={className} onChange={e => setClassName(e.target.value)} aria-label="Class">
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input w-auto" value={term} onChange={e => setTerm(e.target.value)} aria-label="Term">
            {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input w-auto" value={year} onChange={e => setYear(parseInt(e.target.value))} aria-label="Year">
            {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-primary" onClick={saveAll} disabled={saving || !Object.keys(edited).length}>
            {saving ? <span className="loading-spinner-sm" /> : null}
            {saving ? 'Saving…' : `Save ${Object.keys(edited).length || ''}`}
          </button>
        </div>
      </div>

      {saved && <p className="text-caption text-success" role="status">{saved}</p>}

      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <span className="loading-spinner-lg" role="status" aria-label="Loading" />
        </div>
      ) : matrix.students.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📝</div>
          <p className="!text-primary font-medium">No students in {className}</p>
          <p>Add students first, then enter their marks here.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-panel">Student</th>
                  <th>Adm. No</th>
                  {matrix.subjects.map(sub => (
                    <th key={sub.id} className="min-w-[84px] text-center">
                      {sub.name}
                      <span className="block text-tiny text-quaternary font-mono normal-case tracking-normal">{sub.code}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.students.map(stu => (
                  <tr key={stu.id}>
                    <td className="sticky left-0 z-10 bg-panel !text-primary font-medium">{stu.name}</td>
                    <td className="num !text-tertiary">{stu.admission_no}</td>
                    {matrix.subjects.map(sub => {
                      const score = getScore(stu.id, String(sub.id));
                      const isEdited = edited[`${stu.id}-${sub.id}`] !== undefined;
                      return (
                        <td key={sub.id} className="p-1.5 text-center">
                          <input
                            type="number" min="0" max="100" step="0.1"
                            className={`w-16 px-1.5 py-1 text-center bg-surface text-primary text-body-sm rounded-standard border transition-colors duration-150 focus:outline-none ${
                              isEdited ? 'border-accent-interactive' : 'border-standard hover:border-strong'
                            } focus:border-accent-interactive`}
                            style={{ boxShadow: isEdited ? '0 0 0 2px rgba(113, 112, 255, 0.15)' : undefined }}
                            value={score}
                            onChange={e => handleChange(stu.id, String(sub.id), e.target.value)}
                            aria-label={`${stu.name} — ${sub.name}`}
                          />
                          {score !== '' && score != null && (
                            <span className={`block text-tiny mt-0.5 font-mono ${isEdited ? 'text-accent-interactive' : 'text-quaternary'}`}>
                              {gradeFor(parseFloat(score))}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
