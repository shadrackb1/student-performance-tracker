import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, editing: null });
  const [form, setForm] = useState({ admission_no: '', name: '', class_name: 'Form 1' });
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStudents(await api.students.list(className || null, query || null));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [className, query]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (modal.editing) setForm(modal.editing);
    else setForm({ admission_no: '', name: '', class_name: 'Form 1' });
  }, [modal]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (modal.editing) await api.students.update(modal.editing.id, form);
      else await api.students.create(form);
      setModal({ open: false, editing: null });
      load();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this student?')) return;
    await api.students.delete(id);
    load();
  }

  async function handleImport(e) {
    e.preventDefault();
    if (!importFile) return;
    setImporting(true);
    try {
      const res = await api.students.import(importFile);
      alert(`Imported: ${res.inserted}, Updated: ${res.updated}`);
      setImportFile(null);
      load();
    } catch (e) { alert(e.message); }
    finally { setImporting(false); }
  }

  const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={className} onChange={e => setClassName(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border border-slate-300 rounded-lg px-3 py-2 w-64" placeholder="Search name/admission…" value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>+ Add Student</button>
        </div>
      </div>

      <form onSubmit={handleImport} className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="btn btn-primary cursor-pointer">
            Import CSV/Excel <input type="file" accept=".csv,.xlsx" className="hidden" onChange={e => setImportFile(e.target.files[0])} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={!importFile || importing}>{importing ? 'Importing…' : 'Import'}</button>
          <span className="text-sm text-slate-500">Columns: admission_no, name, class_name</span>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b bg-slate-50">
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono">{s.admission_no}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{s.class_name}</span></td>
                    <td className="p-3">
                      <button className="text-blue-700 hover:underline mr-3" onClick={() => setModal({ open: true, editing: s })}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModal({ open: false })}>
          <form onSubmit={submit} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">{modal.editing ? 'Edit' : 'Add'} Student</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Admission No</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={form.admission_no} onChange={e => setForm(f => ({ ...f, admission_no: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2" value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" className="btn border border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setModal({ open: false })}>Cancel</button>
              <button type="submit" className="btn btn-primary">{modal.editing ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}