import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="text-2xl font-semibold text-primary">Student Performance Tracker</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-slate-600 hover:text-primary">Features</Link>
            <Link to="#dashboard" className="text-slate-600 hover:text-primary">Dashboard</Link>
            <Link to="#reports" className="text-slate-600 hover:text-primary">Reports</Link>
            <Link to="/dashboard" className="btn btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-primary-light via-white to-white">
        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Track. Analyze. <span className="text-primary">Improve.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Student Performance Tracking and Automated Reporting Web Application
            </p>
            <Link to="/dashboard" className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-hover transition-colors">
              Launch Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👥', title: 'Student Management', desc: 'Register students, import from Excel, track admission numbers and class assignments.' },
              { icon: '📝', title: 'Marks Entry', desc: 'Enter marks for subjects; automatic grade calculation using KCSE scale.' },
              { icon: '📈', title: 'Performance Analytics', desc: 'Compare subject averages, identify weakest subjects, calculate pass rates.' },
              { icon: '📄', title: 'Automated Reporting', desc: 'Generate individual report cards, class rankings, subject analysis as PDF/Excel.' },
            ].map(f => (
              <div key={f.title} className="card p-6 hover:shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300 border border-slate-200 rounded-xl">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-medium mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Dashboard Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: '247', icon: '👥' },
              { label: 'Class Average', value: '89.5%', icon: '📊' },
              { label: 'Subjects', value: '12', icon: '📚' },
              { label: 'Top Performers', value: '4', icon: '🏆' },
            ].map(s => (
              <div key={s.label} className="stat-panel p-6 bg-white rounded-xl border border-slate-200 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-slate-600 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>Student Performance Tracker &copy; 2024</p>
          <p className="text-slate-400">Built with React, FastAPI, and SQLite</p>
        </div>
      </footer>

      <style jsx>{`
        .card { @apply bg-white rounded-xl border border-slate-200; }
        .stat-panel { @apply bg-white rounded-xl border border-slate-200; }
        .btn { @apply inline-block px-6 py-3 rounded-lg font-medium transition-colors; }
        .btn-primary { @apply bg-primary text-white hover:bg-primary-hover; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}