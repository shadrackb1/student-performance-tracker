import { useState, useEffect } from 'react';
import { api } from '../api';
import { downloadBlob } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ class_name: '', term: 'Term 1', year: 2025 });

  useEffect(() => {
    load();
  }, [filters]);

  async function load() {
    setLoading(true);
    try {
      const d = await api.dashboard(filters.class_name || null, filters.term, filters.year);
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex h-64 items-center justify-center">Loading…</div>;
  if (!data) return <div className="text-red-600">Failed to load dashboard</div>;

  const stats = [
    { label: 'Total Students', value: data.students, icon: '👥', color: 'primary' },
    { label: 'Subjects', value: data.subjects, icon: '📚', color: 'success' },
    { label: 'Classes', value: data.classes, icon: '🏫', color: 'warning' },
    { label: 'Entries', value: data.entries, icon: '📝', color: 'danger' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.class_name} onChange={e => setFilters(f => ({ ...f, class_name: e.target.value }))}>
            <option value="">All Classes</option>
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
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-${s.color}-100 text-${s.color}-600 text-2xl`}>{s.icon}</div>
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Class Average</span><span className="font-bold">{data.average}%</span></div>
            <div className="flex justify-between"><span>Pass Rate</span><span className="font-bold">{data.pass_rate}%</span></div>
            <div className="flex justify-between"><span>Mean Grade</span><span className="font-bold">{data.mean_grade}</span></div>
            <div className="flex justify-between"><span>Top Performers (80%+)</span><span className="font-bold">{data.top_performers}</span></div>
            <div className="flex justify-between"><span>Strongest Subject</span><span className="font-bold">{data.strongest_subject?.name || '—'}</span></div>
            <div className="flex justify-between"><span>Weakest Subject</span><span className="font-bold">{data.weakest_subject?.name || '—'}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
          <div className="space-y-2">
            {Object.entries(data.grade_distribution || {}).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-3">
                <span className="w-12 font-mono text-sm">{grade}</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(count / (data.entries || 1)) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-2">Rank</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Adm. No</th>
                <th className="pb-2">Class</th>
                <th className="pb-2">Average</th>
                <th className="pb-2">Grade</th>
                <th className="pb-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {(data.top_performers_list || []).map((s, i) => (
                <tr key={s.student_id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 font-bold">{i + 1}</td>
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.admission_no}</td>
                  <td className="py-2">{s.class_name}</td>
                  <td className="py-2">{s.average}%</td>
                  <td className="py-2"><span className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary">{s.mean_grade}</span></td>
                  <td className="py-2">{s.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}