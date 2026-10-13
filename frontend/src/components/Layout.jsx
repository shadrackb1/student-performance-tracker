import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import OnboardingTrigger from '../components/onboarding/OnboardingTrigger'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '👥' },
  { to: '/marks', label: 'Marks Entry', icon: '📝' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/reports', label: 'Reports', icon: '📄' },
  { to: '/design-system', label: 'Design System', icon: '🎨' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-deep font-linear">
      {/* Onboarding Trigger */}
      <OnboardingTrigger />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/85 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-panel border-r border-standard transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-primary rounded-comfortable flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">SPT</span>
              </div>
              <span className="font-semibold text-primary">Student Tracker</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden text-tertiary hover:text-primary hover:bg-hover p-1 rounded-comfortable"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-subtle">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-accent-primary/10 rounded-circle flex items-center justify-center">
                <span className="text-accent-interactive font-medium text-sm">
                  {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{user?.full_name || user?.email}</p>
                <p className="text-xs text-tertiary capitalize">{user?.role}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="text-tertiary hover:text-primary hover:bg-hover p-1 rounded-comfortable"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-panel border-b border-subtle">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden text-tertiary hover:text-primary p-1 rounded-comfortable"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-body font-semibold text-primary">Student Performance Tracker</h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}