import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(2025);
  const [tab, setTab] = useState('overview');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [o, s, r] = await Promise.all([
        api.analytics.overview(className || null, term, year),
        api.analytics.subjects(className || null, term, year),
        className ? api.analytics.rankings(className, term, year) : Promise.resolve([]),
      ]);
      setOverview(o);
      setSubjects(s.subjects || []);
      setRankings(r);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [className, term, year]);

  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <select className="border border-slate-300 rounded-lg px-3 py-2" value={className} onChange={e => setClassName(e.target.value)}>
            <option value="">All Classes</option>
            {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {['overview', 'subjects', 'rankings'].map(t => (
          <button key={t}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === t ? 'bg-blue-700 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="p-8 text-center">Loading…</div> : (
        tab === 'overview' && overview && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Class Average" value={`${overview.average}%`} icon="📊" />
            <StatCard label="Pass Rate" value={`${overview.pass_rate}%`} icon="✅" />
            <StatCard label="Mean Grade" value={overview.mean_grade} icon="🎓" />
            <StatCard label="Top Performers" value={overview.top_performers} icon="🏆" />
            <StatCard label="Strongest Subject" value={overview.strongest_subject?.name || '—'} icon="💪" />
            <StatCard label="Weakest Subject" value={overview.weakest_subject?.name || '—'} icon="📉" />
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold mb-4">Grade Distribution</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(overview.grade_distribution || {}).map(([g, c]) => (
                  <div key={g} className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-mono bg-blue-100 text-blue-700">{g}</span>
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
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{s.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'rankings' && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {className ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b bg-slate-50">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Adm. No</th>
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
                      <td className="p-3 text-right font-bold">{r.average}%</td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{r.mean_grade}</span></td>
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

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-blue-100 text-xl">{icon}</div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}