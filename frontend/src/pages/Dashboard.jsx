import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const CLASSES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

function Select({ value, onChange, children, ...props }) {
  return (
    <select className="input w-auto" value={value} onChange={onChange} {...props}>
      {children}
    </select>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(2025);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.dashboard(className || null, term, year));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [className, term, year]);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading-spinner-lg" role="status" aria-label="Loading" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="empty-state card">
        <div className="empty-icon">⚠️</div>
        <p>Failed to load dashboard. Check your connection and try again.</p>
        <button className="btn btn-primary" onClick={load}>Retry</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: data.students, icon: '👥' },
    { label: 'Subjects', value: data.subjects, icon: '📚' },
    { label: 'Classes', value: data.classes, icon: '🏫' },
    { label: 'Mark Entries', value: data.entries, icon: '📝' },
  ];

  const distMax = Math.max(1, ...Object.values(data.grade_distribution || {}));

  return (
    <div className="space-y-7">
      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 text-primary">Dashboard</h1>
          <p className="text-caption text-tertiary mt-1">{term}, {year} — {className || 'All classes'}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={className} onChange={e => setClassName(e.target.value)} aria-label="Class">
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={term} onChange={e => setTerm(e.target.value)} aria-label="Term">
            {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={year} onChange={e => setYear(parseInt(e.target.value))} aria-label="Year">
            {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      {/* Key metrics — value is the hero, label de-emphasized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-label text-tertiary uppercase tracking-wider">{s.label}</p>
            <p className="text-display text-primary mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mean grade strip — the single most important metric gets emphasis */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <span className={`grade-badge grade-${data.mean_grade === '-' ? 'E' : data.mean_grade.replace('+', 'plus').replace('-', 'minus')} !text-h1 !px-3 !py-2`}>
            {data.mean_grade}
          </span>
          <div>
            <p className="text-body text-primary font-medium">Mean Grade</p>
            <p className="text-caption text-tertiary">{data.average}% average · {data.pass_rate}% pass rate</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-micro text-tertiary uppercase tracking-wider">Strongest</p>
            <p className="text-body text-primary font-medium mt-1">{data.strongest_subject?.name || '—'}</p>
            <p className="text-caption text-success">{data.strongest_subject ? `${data.strongest_subject.avg}%` : ''}</p>
          </div>
          <div>
            <p className="text-micro text-tertiary uppercase tracking-wider">Weakest</p>
            <p className="text-body text-primary font-medium mt-1">{data.weakest_subject?.name || '—'}</p>
            <p className="text-caption text-warning">{data.weakest_subject ? `${data.weakest_subject.avg}%` : ''}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grade distribution — grayscale bars, count on the right */}
        <div className="card p-6">
          <h3 className="text-h3 text-primary mb-5">Grade Distribution</h3>
          <div className="space-y-2.5">
            {Object.entries(data.grade_distribution || {}).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-3">
                <span className={`grade-badge grade-${grade.replace('+', 'plus').replace('-', 'minus')} w-10`}>{grade}</span>
                <div className="flex-1 h-1.5 bg-hover rounded-pill overflow-hidden">
                  <div
                    className="h-full rounded-pill bg-accent-primary transition-all duration-300"
                    style={{ width: `${(count / distMax) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-caption text-tertiary font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top performers table */}
        <div className="card overflow-hidden">
          <div className="card-header">
            <h3 className="text-h3 text-primary">Top Performers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th className="num">Average</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {(data.top_performers_list || []).map((s, i) => (
                  <tr key={s.student_id}>
                    <td className="num !text-tertiary">{i + 1}</td>
                    <td className="!text-primary font-medium">{s.name}</td>
                    <td className="!text-tertiary">{s.class_name}</td>
                    <td className="num !text-primary font-semibold">{s.average}%</td>
                    <td><span className={`grade-badge grade-${s.mean_grade.replace('+', 'plus').replace('-', 'minus')}`}>{s.mean_grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
