import { useState, useEffect } from 'react';
import { api } from '../api';
import { downloadBlob } from '../api';

export default function Marks() {
  const [matrix, setMatrix] = useState({ students: [], subjects: [], marks: {} });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ class_name: 'Form 1', term: 'Term 1', year: 2025 });
  const [edited, setEdited] = useState({});

  useEffect(() => { load(); }, [filters.class_name, filters.term, filters.year]);

  async function load() {
    setLoading(true);
    try { setMatrix(await api.marks.matrix(filters.class_name, filters.term, filters.year)); }
    catch (e) { console.error(e); alert(e.message); }
    finally { setLoading(false); }
  }

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
      await api.marks.bulk({ class_name: filters.class_name, term: filters.term, year: filters.year, entries });
      setEdited({});
      load();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  }

  const score = (sid, subjId) => edited[`${sid}-${subjId}`] ?? matrix.marks[sid]?.[subjId] ?? '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Marks Entry</h1>
        <div className="flex items-center gap-4">
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.class_name} onChange={e => setFilters(f => ({ ...f, class_name: e.target.value }))}>
            {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.term} onChange={e => setFilters(f => ({ ...f, term: e.target.value }))}>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: parseInt(e.target.value) }))}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="btn btn-primary" onClick={saveAll} disabled={saving || !Object.keys(edited).length}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">Loading marks…</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b bg-slate-50 sticky top-0">
                  <th className="p-3 sticky left-0 bg-slate-50 z-10">Student</th>
                  <th className="p-3 sticky left-[160px] bg-slate-50 z-10">Adm. No</th>
                  {matrix.subjects.map(sub => (
                    <th key={sub.id} className="p-3 min-w-[80px] text-center">{sub.name}<br/><span className="text-xs text-slate-400">{sub.code}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.students.map(stu => (
                  <tr key={stu.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 sticky left-0 bg-white z-10 font-medium">{stu.name}</td>
                    <td className="p-3 sticky left-[160px] bg-white z-10 font-mono text-slate-500">{stu.admission_no}</td>
                    {matrix.subjects.map(sub => (
                      <td key={sub.id} className="p-2 text-center">
                        <input
                          type="number"
                          min="0" max="100" step="0.1"
                          className="w-full px-2 py-1 text-center border border-slate-300 rounded focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          value={score(stu.id, String(sub.id))}
                          onChange={e => handleChange(stu.id, String(sub.id), e.target.value)}
                        />
                      </td>
                    ))}
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