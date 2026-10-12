import { useState, useEffect } from 'react';
import { api } from '../api';
import { downloadBlob } from '../api';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ class_name: '', term: 'Term 1', year: 2025 });
  const [tab, setTab] = useState('overview');

  useEffect(() => { loadAll(); }, [filters]);

  async function loadAll() {
    setLoading(true);
    try {
      const [o, s, r] = await Promise.all([
        api.analytics.overview(filters.class_name || null, filters.term, filters.year),
        api.analytics.subjects(filters.class_name || null, filters.term, filters.year),
        filters.class_name ? api.analytics.rankings(filters.class_name, filters.term, filters.year) : [],
      ]);
      setOverview(o);
      setSubjects(s.subjects || []);
      setRankings(r);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center gap-4">
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={filters.class_name} onChange={e => setFilters(f => ({ ...f, class_name: e.target.value }))}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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
      </div>

      <div className="flex gap-2 border-b border-slate-200" role="tablist">
        {['overview', 'subjects', 'rankings'].map(t => (
          <button key={t} role="tab" aria-selected={tab === t}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="p-8 text-center">Loading…</div> : (
        tab === 'overview' && overview && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Class Average" value={`${overview.average}%`} icon="📊" color="primary" />
            <StatCard label="Pass Rate" value={`${overview.pass_rate}%`} icon="✅" color="success" />
            <StatCard label="Mean Grade" value={overview.mean_grade} icon="🎓" color="warning" />
            <StatCard label="Top Performers" value={overview.top_performers} icon="🏆" color="danger" />
            <StatCard label="Strongest Subject" value={overview.strongest_subject?.name || '—'} icon="💪" color="primary" />
            <StatCard label="Weakest Subject" value={overview.weakest_subject?.name || '—'} icon="📉" color="danger" />
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-4">Grade Distribution</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(overview.grade_distribution || {}).map(([g, c]) => (
                  <div key={g} className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-mono bg-primary-light text-primary">{g}</span>
                    <span>{c} students</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {tab === 'subjects' && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b bg-slate-50">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Code</th>
                  <th className="p-3 text-right">Avg</th>
                  <th className="p-3 text-right">Highest</th>
                  <th className="p-3 text-right">Lowest</th>
                  <th className="p-3 text-right">Entries</th>
                  <th className="p-3 text-right">Pass %</th>
                  <th className="p-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.code} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium">{s.subject}</td>
                    <td className="p-3 font-mono text-slate-500">{s.code}</td>
                    <td className="p-3 text-right font-bold">{s.avg}%</td>
                    <td className="p-3 text-right">{s.highest}</td>
                    <td className="p-3 text-right">{s.lowest}</td>
                    <td className="p-3 text-right">{s.entries}</td>
                    <td className="p-3 text-right">{s.pass_rate}%</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary">{s.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'rankings' && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filters.class_name ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b bg-slate-50">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Adm. No</th>
                    <th className="p-3">Class</th>
                    <th className="p-3 text-right">Avg</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3 text-right">Points</th>
                    <th className="p-3 text-right">Pass %</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map(r => (
                    <tr key={r.student_id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-bold">{r.rank}</td>
                      <td className="p-3">{r.name}</td>
                      <td className="p-3 font-mono">{r.admission_no}</td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary">{r.class_name}</span></td>
                      <td className="p-3 text-right font-bold">{r.average}%</td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary">{r.mean_grade}</span></td>
                      <td className="p-3 text-right">{r.total_points}</td>
                      <td className="p-3 text-right">{r.pass_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Select a class to view rankings</div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl bg-${color}-100 text-${color}-600 text-xl`}>{icon}</div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}