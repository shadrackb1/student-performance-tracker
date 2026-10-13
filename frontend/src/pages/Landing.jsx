import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '👥',
    title: 'Student Management',
    desc: 'Register students, import from CSV/Excel, track admission numbers and class assignments (Form 1–4)',
  },
  {
    icon: '📝',
    title: 'Marks Entry',
    desc: 'Grid-based marks entry per class/term with automatic KCSE grade calculation',
  },
  {
    icon: '📈',
    title: 'Performance Analytics',
    desc: 'Subject averages, class rankings, pass rates, strongest/weakest subjects, grade distributions',
  },
  {
    icon: '📄',
    title: 'Automated Reporting',
    desc: 'Individual PDF report cards, Excel class rankings, subject analysis spreadsheets',
  },
]

const stats = [
  { value: '247', label: 'Students Tracked' },
  { value: '89.5%', label: 'Average Class Score' },
  { value: '12', label: 'KCSE Subjects' },
  { value: '4', label: 'Forms Supported' },
]

const techStack = [
  { icon: '⚡', title: 'FastAPI', desc: 'High-performance Python API' },
  { icon: '⚛️', title: 'React 18', desc: 'Modern frontend with Vite' },
  { icon: '🎨', title: 'Tailwind CSS', desc: 'Design system integration' },
  { icon: '🗄️', title: 'PostgreSQL', desc: 'Production-ready database' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-deep font-linear">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fillOpacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-accent-primary/10 text-accent-interactive text-sm font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-interactive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-interactive" />
              </span>
              Production Ready • KCSE Grading • Automated Reports
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-display-xl text-primary font-linear tracking-[-1.584px] mb-6"
            >
              Track. Analyze. Improve.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-body-lg text-tertiary mb-10 max-w-2xl mx-auto"
            >
              Student Performance Tracking and Automated Reporting Web Application.
              Built with FastAPI, React, and SQLite/PostgreSQL for schools and educators.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="btn btn-primary text-base px-8 py-3"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-base px-8 py-3"
              >
                View Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-panel border-y border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-h1 text-primary font-linear mb-4">
              Everything You Need to Track Performance
            </h2>
            <p className="text-body-lg text-tertiary max-w-2xl mx-auto">
              Comprehensive features for modern school management and performance tracking
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 hover:shadow-elevated transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-h3 text-primary mb-2 font-linear">{feature.title}</h3>
                <p className="text-body text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-accent-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-display text-white font-linear tracking-[-1.056px] mb-2">{stat.value}</div>
                <div className="text-body text-accent-interactive/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-h1 text-primary font-linear mb-4">Built for Production</h2>
            <p className="text-body-lg text-tertiary">Modern tech stack with enterprise-grade reliability</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className="text-h3 text-primary font-linear mb-1">{tech.title}</h3>
                <p className="text-body-sm text-tertiary">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-h1 text-white font-linear mb-4"
          >
            Ready to Transform Your School's Performance Tracking?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-accent-interactive/80 mb-8 max-w-2xl mx-auto"
          >
            Join educators who are already using Student Performance Tracker to save time,
            improve accuracy, and gain insights into student performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/login" className="btn bg-white text-accent-primary hover:bg-tertiary/10 text-base px-8 py-3">
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep border-t border-subtle py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-tertiary mb-2">Student Performance Tracker &copy; 2024</p>
          <p className="text-sm text-quaternary">Built with FastAPI, React, and SQLite/PostgreSQL</p>
        </div>
      </footer>
    </div>
  )
}