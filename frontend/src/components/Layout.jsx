import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '👥' },
  { to: '/marks', label: 'Marks Entry', icon: '📝' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/reports', label: 'Reports', icon: '📄' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
          <span className="text-xl font-semibold text-blue-700">Chokur</span>
          <button className="lg:hidden p-2 rounded hover:bg-slate-100" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 bg-white border-b border-slate-200 lg:px-8">
          <button className="lg:hidden p-2 rounded hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="flex-1 lg:hidden" />
          <span className="text-sm text-slate-500">Term 1, 2025</span>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}