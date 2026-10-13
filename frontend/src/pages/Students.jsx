import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const CLASSES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, editing: null });
  const [form, setForm] = useState({ admission_no: '', name: '', class_name: 'Form 1' });
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [formError, setFormError] = useState('');

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
    setFormError('');
  }, [modal]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (modal.editing) await api.students.update(modal.editing.id, form);
      else await api.students.create(form);
      setModal({ open: false, editing: null });
      load();
    } catch (e) { setFormError(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this student and all their marks? This cannot be undone.')) return;
    await api.students.delete(id);
    load();
  }

  async function handleImport(e) {
    e.preventDefault();
    if (!importFile) return;
    setImporting(true);
    try {
      const res = await api.students.import(importFile, 'Term 1', 2025);
      const parts = [];
      if (res.studentsInserted != null) {
        parts.push(`Students: ${res.studentsInserted} added, ${res.studentsUpdated} updated`);
        if (res.marksSaved) parts.push(`Marks: ${res.marksSaved} saved`);
      } else {
        parts.push(`Imported: ${res.inserted}, Updated: ${res.updated}`);
      }
      setFormError('');
      setImportFile(null);
      load();
      // Non-blocking result surfaced near the import bar
      setFormError(`✓ ${parts.join(' · ')}`);
    } catch (e) { setFormError(e.message); }
    finally { setImporting(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 text-primary">Students</h1>
          <p className="text-caption text-tertiary mt-1">{students.length} enrolled{className ? ` in ${className}` : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="input w-auto" value={className} onChange={e => setClassName(e.target.value)} aria-label="Filter by class">
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className="input w-56"
            placeholder="Search name or admission no…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search students"
          />
          <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>+ Add Student</button>
        </div>
      </div>

      {/* Import bar */}
      <form onSubmit={handleImport} className="card p-4 flex items-center gap-3 flex-wrap">
        <label className="btn btn-secondary cursor-pointer">
          Choose CSV/Excel
          <input type="file" accept=".csv,.xlsx" className="hidden" onChange={e => setImportFile(e.target.files[0])} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={!importFile || importing}>
          {importing ? <span className="loading-spinner-sm" /> : null}
          {importing ? 'Importing…' : 'Import'}
        </button>
        <span className="text-caption text-quaternary">Columns: admission_no, name, class_name</span>
        {importFile && <span className="badge">{importFile.name}</span>}
      </form>
      {formError && (
        <p className={`text-caption ${formError.startsWith('✓') ? 'text-success' : 'text-danger'}`} role="status">{formError}</p>
      )}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="loading-spinner-lg" role="status" aria-label="Loading" />
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p className="!text-primary font-medium">No students yet</p>
            <p>Add students manually or import a CSV to get started.</p>
            <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>+ Add Student</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="num !text-tertiary">{s.admission_no}</td>
                    <td className="!text-primary font-medium">{s.name}</td>
                    <td><span className="badge">{s.class_name}</span></td>
                    <td className="text-right">
                      <button className="text-accent hover:underline mr-4 text-body-sm" onClick={() => setModal({ open: true, editing: s })}>Edit</button>
                      <button className="text-danger hover:underline text-body-sm" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal({ open: false })}>
          <form
            onSubmit={submit}
            className="card w-full max-w-md shadow-dialog !bg-surface"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={modal.editing ? 'Edit student' : 'Add student'}
          >
            <div className="card-header flex items-center justify-between">
              <h3 className="text-h3 text-primary">{modal.editing ? 'Edit Student' : 'Add Student'}</h3>
              <button type="button" className="text-tertiary hover:text-primary p-1" onClick={() => setModal({ open: false })} aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="label" htmlFor="adm">Admission No</label>
                <input id="adm" className="input" value={form.admission_no} onChange={e => setForm(f => ({ ...f, admission_no: e.target.value }))} required />
              </div>
              <div>
                <label className="label" htmlFor="name">Full Name</label>
                <input id="name" className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label" htmlFor="cls">Class</label>
                <select id="cls" className="input" value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {formError && !formError.startsWith('✓') && <p className="text-caption text-danger">{formError}</p>}
            </div>
            <div className="px-6 py-4 border-t border-subtle flex justify-end gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => setModal({ open: false })}>Cancel</button>
              <button type="submit" className="btn btn-primary">{modal.editing ? 'Save Changes' : 'Create Student'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
