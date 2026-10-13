import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const CLASSES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
const TABS = ['overview', 'subjects', 'rankings'];

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

  const distMax = Math.max(1, ...Object.values(overview?.grade_distribution || {}));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 text-primary">Analytics</h1>
          <p className="text-caption text-tertiary mt-1">{term}, {year} — {className || 'All classes'}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select className="input w-auto" value={className} onChange={e => setClassName(e.target.value)} aria-label="Class">
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input w-auto" value={term} onChange={e => setTerm(e.target.value)} aria-label="Term">
            {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input w-auto" value={year} onChange={e => setYear(parseInt(e.target.value))} aria-label="Year">
            {[2025, 2024].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs — underline style, one accent */}
      <div className="flex gap-1 border-b border-standard" role="tablist">
        {TABS.map(t => (
          <button key={t}
            role="tab"
            aria-selected={tab === t}
            className={`px-4 py-2.5 text-body-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
              tab === t
                ? 'text-primary border-accent-interactive'
                : 'text-tertiary border-transparent hover:text-secondary'
            }`}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <span className="loading-spinner-lg" role="status" aria-label="Loading" />
        </div>
      ) : tab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Class Average" value={`${overview.average}%`} />
            <MetricCard label="Pass Rate" value={`${overview.pass_rate}%`} accent={overview.pass_rate >= 55 ? 'text-success' : 'text-warning'} />
            <MetricCard label="Mean Grade" value={overview.mean_grade} />
            <MetricCard label="Top Performers" value={overview.top_performers} />
            <MetricCard label="Strongest Subject" value={overview.strongest_subject?.name || '—'} sub={overview.strongest_subject ? `${overview.strongest_subject.avg}%` : null} />
            <MetricCard label="Weakest Subject" value={overview.weakest_subject?.name || '—'} sub={overview.weakest_subject ? `${overview.weakest_subject.avg}%` : null} />
          </div>

          <div className="card p-6">
            <h3 className="text-h3 text-primary mb-5">Grade Distribution</h3>
            <div className="space-y-2.5 max-w-xl">
              {Object.entries(overview.grade_distribution || {}).map(([grade, count]) => (
                <div key={grade} className="flex items-center gap-3">
                  <span className={`grade-badge grade-${grade.replace('+', 'plus').replace('-', 'minus')} w-10`}>{grade}</span>
                  <div className="flex-1 h-1.5 bg-hover rounded-pill overflow-hidden">
                    <div
                      className="h-full rounded-pill bg-accent-primary transition-all duration-300"
                      style={{ width: `${(count / distMax) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-caption text-tertiary">{count} {count === 1 ? 'student' : 'students'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'subjects' && !loading && (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th className="num">Avg</th>
                  <th className="num">Highest</th>
                  <th className="num">Lowest</th>
                  <th className="num">Entries</th>
                  <th className="num">Pass %</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.code}>
                    <td className="!text-primary font-medium">{s.subject}</td>
                    <td className="num !text-tertiary">{s.code}</td>
                    <td className="num !text-primary font-semibold">{s.avg}%</td>
                    <td className="num !text-success">{s.highest}</td>
                    <td className="num !text-warning">{s.lowest}</td>
                    <td className="num">{s.entries}</td>
                    <td className="num">{s.pass_rate}%</td>
                    <td><span className={`grade-badge grade-${s.grade.replace('+', 'plus').replace('-', 'minus')}`}>{s.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'rankings' && !loading && (
        <div className="table-container">
          {className ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Adm. No</th>
                    <th className="num">Avg</th>
                    <th>Grade</th>
                    <th className="num">Points</th>
                    <th className="num">Pass %</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map(r => (
                    <tr key={r.student_id}>
                      <td>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-circle text-caption font-semibold font-mono ${
                          r.rank === 1 ? 'bg-warning-bg text-warning' : r.rank <= 3 ? 'bg-accent-primary/20 text-accent-interactive' : 'text-tertiary'
                        }`}>
                          {r.rank}
                        </span>
                      </td>
                      <td className="!text-primary font-medium">{r.name}</td>
                      <td className="num !text-tertiary">{r.admission_no}</td>
                      <td className="num !text-primary font-semibold">{r.average}%</td>
                      <td><span className={`grade-badge grade-${r.mean_grade.replace('+', 'plus').replace('-', 'minus')}`}>{r.mean_grade}</span></td>
                      <td className="num">{r.total_points}</td>
                      <td className="num">{r.pass_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <p>Select a class to view rankings</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div className="card p-5">
      <p className="text-label text-tertiary uppercase tracking-wider">{label}</p>
      <p className={`text-heading-2 font-semibold mt-2 ${accent || 'text-primary'}`}>{value}</p>
      {sub && <p className="text-caption text-tertiary mt-0.5">{sub}</p>}
    </div>
  );
}
