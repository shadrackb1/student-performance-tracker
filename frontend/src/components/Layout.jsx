import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import OnboardingTrigger from './onboarding/OnboardingTrigger'

/* Consistent 20px stroke icons — same stroke width, aligned to text */
const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
  </svg>
)

const navItems = [
  { to: '/dashboard', label: 'Dashboard', d: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/students', label: 'Students', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { to: '/marks', label: 'Marks Entry', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { to: '/analytics', label: 'Analytics', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/reports', label: 'Reports', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { to: '/design-system', label: 'Design System', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-deep font-linear">
      <OnboardingTrigger />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 150 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-panel border-r border-standard transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-subtle">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-accent-primary rounded-standard flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold text-caption">CS</span>
              </div>
              <span className="font-semibold text-primary text-body-sm truncate">Chokur System</span>
            </NavLink>
            <button
              className="lg:hidden text-tertiary hover:text-primary hover:bg-hover p-1.5 rounded-standard transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <Icon d="M6 18L18 6M6 6l12 12" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="px-3 mb-2 text-micro font-medium text-quaternary uppercase tracking-wider">Workspace</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon d={item.d} className="w-[18px] h-[18px] shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="p-3 border-t border-subtle">
            <div className="flex items-center gap-3 px-2 py-2 rounded-comfortable">
              <div className="w-8 h-8 bg-accent-primary/15 rounded-circle flex items-center justify-center shrink-0 ring-1 ring-standard">
                <span className="text-accent-interactive font-semibold text-caption">
                  {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-medium text-primary truncate">{user?.full_name || user?.email}</p>
                <p className="text-micro text-tertiary capitalize">{user?.role || 'teacher'}</p>
              </div>
              <button
                onClick={logout}
                className="text-tertiary hover:text-danger hover:bg-danger-bg p-1.5 rounded-standard transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-deep/80 backdrop-blur-md border-b border-subtle">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden text-tertiary hover:text-primary hover:bg-hover p-1.5 rounded-standard transition-colors -ml-1.5"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon d="M4 6h16M4 12h16M4 18h16" />
            </button>
            <div className="hidden lg:block">
              <p className="text-caption text-quaternary">
                KCSE Performance Tracking · <span className="text-tertiary">Term System · 12-Point Scale</span>
              </p>
            </div>
          </div>
        </header>

        {/* Page content — constrained width for readability */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
