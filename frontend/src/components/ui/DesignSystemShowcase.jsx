import React from 'react'
import { motion } from 'framer-motion'

const GRADE_COLORS = {
  A: '#16a34a', 'A-': '#22c55e',
  'B+': '#3b82f6', B: '#0ea5e9', 'B-': '#38bdf8',
  'C+': '#f59e0b', C: '#fbbf24', 'C-': '#fcd34d',
  'D+': '#9ca3af', D: '#6b7280', 'D-': '#4b5563',
  E: '#ef4444',
}

export default function DesignSystemShowcase() {
  return (
    <div className="p-8 space-y-12 font-linear bg-deep min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center py-12 border-b border-subtle">
          <h1 className="text-display font-linear text-primary mb-4">
            Design System
          </h1>
          <p className="text-body-lg text-tertiary max-w-2xl mx-auto">
            Student Performance Tracker — Built on Linear, Vercel & Stripe design principles
          </p>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Deep BG', value: '#08090a', role: 'Marketing', token: '--color-bg-deep' },
              { name: 'Panel', value: '#0f1011', role: 'Sidebar', token: '--color-bg-panel' },
              { name: 'Surface', value: '#191a1b', role: 'Cards', token: '--color-bg-surface' },
              { name: 'Hover', value: '#28282c', role: 'Interactive', token: '--color-bg-hover' },
              { name: 'Primary Text', value: '#f7f8f8', role: 'Headings', token: '--color-text-primary' },
              { name: 'Secondary', value: '#d0d6e0', role: 'Body', token: '--color-text-secondary' },
              { name: 'Tertiary', value: '#8a8f98', role: 'Muted', token: '--color-text-tertiary' },
              { name: 'Quaternary', value: '#62666d', role: 'Disabled', token: '--color-text-quaternary' },
              { name: 'Brand Indigo', value: '#5e6ad2', role: 'Primary CTA', token: '--color-accent-primary' },
              { name: 'Accent Violet', value: '#7170ff', role: 'Interactive', token: '--color-accent-interactive' },
              { name: 'Success', value: '#10b981', role: 'Active', token: '--color-success' },
              { name: 'Border Subtle', value: 'rgba(255,255,255,0.05)', role: 'Default', token: '--color-border-subtle' },
              { name: 'Border Standard', value: 'rgba(255,255,255,0.08)', role: 'Cards', token: '--color-border-standard' },
              { name: 'Border Strong', value: '#23252a', role: 'Separators', token: '--color-border-strong' },
              { name: 'Stripe Purple', value: '#533afd', role: 'Brand CTA', token: '--color-brand-purple' },
              { name: 'Stripe Navy', value: '#061b31', role: 'Headings (alt)', token: '--color-brand-navy' },
            ].map((color, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4">
                <div 
                  className="w-full h-16 rounded-comfortable mb-3 border border-standard"
                  style={{ backgroundColor: color.value }}
                />
                <div className="text-caption text-primary font-mono">{color.name}</div>
                <div className="text-micro text-tertiary font-mono">{color.value}</div>
                <div className="text-tiny text-quaternary font-mono">{color.token}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Typography Scale (Inter Variable, cv01+ss03)</h2>
          <div className="space-y-4">
            {[
              { label: 'Display XL — 72px/1.00, w510, -1.584px', className: 'text-display' },
              { label: 'Display LG — 64px/1.00, w510, -1.408px', className: 'text-display' },
              { label: 'Display — 48px/1.00, w510, -1.056px', className: 'text-display' },
              { label: 'Heading 1 — 32px/1.13, w400, -0.704px', className: 'text-h1' },
              { label: 'Heading 2 — 24px/1.33, w400, -0.288px', className: 'text-h2' },
              { label: 'Heading 3 — 20px/1.33, w590, -0.24px', className: 'text-h3' },
              { label: 'Body Large — 18px/1.60, w400, -0.165px', className: 'text-body-lg' },
              { label: 'Body — 16px/1.50, w400, normal', className: 'text-body' },
              { label: 'Body Small — 15px/1.60, w400, -0.165px', className: 'text-body-sm' },
              { label: 'Caption LG — 14px/1.50, w510, -0.182px', className: 'text-caption-lg' },
              { label: 'Caption — 13px/1.50, w400, -0.13px', className: 'text-caption' },
              { label: 'Label — 12px/1.40, w400', className: 'text-label' },
              { label: 'Micro — 11px/1.40, w510', className: 'text-micro' },
              { label: 'Tiny — 10px/1.50, w400, -0.15px', className: 'text-tiny' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-6 border-standard">
                <p className={`text-primary ${item.className} mb-2 font-linear`}>
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
                <p className="text-caption text-tertiary">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Font Weights */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Font Weights (Linear: 400/510/590)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { weight: 400, label: 'Regular (400) — Reading text' },
              { weight: 510, label: 'Medium (510) — Linear signature, UI emphasis' },
              { weight: 590, label: 'Semibold (590) — Strong emphasis, announce' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6 border-standard">
                <p className="text-body-lg text-primary font-linear" style={{ fontWeight: item.weight }}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-caption text-tertiary mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Button Variants</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 items-center">
            <button className="btn btn-primary">Primary (Stripe Purple)</button>
            <button className="btn btn-secondary">Secondary (Ghost)</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-primary btn-sm">Small</button>
            <button className="btn btn-primary btn-lg">Large</button>
            <button className="btn btn-primary" disabled>Disabled</button>
          </motion.div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Form Inputs</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="teacher@school.edu" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Class Selection</label>
              <select className="input">
                <option value="">Select a class</option>
                <option value="form1">Form 1</option>
                <option value="form2">Form 2</option>
                <option value="form3">Form 3</option>
                <option value="form4">Form 4</option>
              </select>
            </div>
            <div>
              <label className="label">Disabled Input</label>
              <input type="text" className="input" value="Not editable" disabled />
            </div>
            <div>
              <label className="label">With Error State</label>
              <input type="text" className="input" style={{ borderColor: 'var(--color-danger)' }} placeholder="Error state" />
              <p className="text-caption text-danger mt-1">This field is required</p>
            </div>
            <div>
              <label className="label">Success State</label>
              <input type="text" className="input" style={{ borderColor: 'var(--color-success)' }} value="Valid input" readOnly />
            </div>
          </motion.div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Card Components</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-h3 text-primary">Standard Card</h3>
              </div>
              <div className="card-body">
                <p className="text-body text-secondary mb-4">
                  Cards use semi-transparent backgrounds with subtle borders and multi-layer shadows.
                </p>
                <div className="flex gap-3">
                  <span className="badge badge-success">Active</span>
                  <span className="badge badge-neutral">Pending</span>
                </div>
              </div>
            </div>
            <div className="card" style={{ boxShadow: 'var(--shadow-elevated)' }}>
              <div className="card-header">
                <h3 className="text-h3 text-primary">Elevated Card</h3>
              </div>
              <div className="card-body">
                <p className="text-body text-secondary mb-4">
                  Elevated cards use stronger shadows for dropdowns and popovers.
                </p>
                <div className="flex gap-3">
                  <span className="badge badge-warning">Warning</span>
                  <span className="badge badge-subtle">Subtle</span>
                </div>
              </div>
            </div>
            <div className="card" style={{ boxShadow: 'var(--shadow-brand)' }}>
              <div className="card-header">
                <h3 className="text-h3 text-primary">Brand Shadow</h3>
              </div>
              <div className="card-body">
                <p className="text-body text-secondary mb-4">
                  Stripe-style blue-tinted shadows for featured elements.
                </p>
                <div className="flex gap-3">
                  <span className="badge badge-danger">Danger</span>
                  <span className="badge badge-A">A</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Grade Badges (KCSE) */}
        <section>
          <h2 className="text-h3 text-primary mb-6">KCSE Grade Badges</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
            {[
              { grade: 'A', class: 'grade-A' },
              { grade: 'A-', class: 'grade-Aminus' },
              { grade: 'B+', class: 'grade-Bplus' },
              { grade: 'B', class: 'grade-B' },
              { grade: 'B-', class: 'grade-Bminus' },
              { grade: 'C+', class: 'grade-Cplus' },
              { grade: 'C', class: 'grade-C' },
              { grade: 'C-', class: 'grade-Cminus' },
              { grade: 'D+', class: 'grade-Dplus' },
              { grade: 'D', class: 'grade-D' },
              { grade: 'D-', class: 'grade-Dminus' },
              { grade: 'E', class: 'grade-E' },
            ].map((g, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className={`grade-badge ${g.class}`}>{g.grade}</motion.span>
            ))}
          </motion.div>
          <p className="text-caption text-tertiary mt-4">
            Monospace font, tight radius (4px), KCSE 12-point scale colors
          </p>
        </section>

        {/* Tables */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Data Table</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Adm. No.</th>
                  <th>Class</th>
                  <th>Mathematics</th>
                  <th>English</th>
                  <th>Kiswahili</th>
                  <th>Biology</th>
                  <th>Physics</th>
                  <th>Aggregate</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Kamau', adm: 'ADM001', class: 'Form 4A', math: 87, eng: 78, kisw: 82, bio: 75, phy: 80, agg: 68, rank: 1 },
                  { name: 'Mary Wanjiku', adm: 'ADM002', class: 'Form 4A', math: 82, eng: 85, kisw: 79, bio: 72, phy: 78, agg: 65, rank: 2 },
                  { name: 'Peter Otieno', adm: 'ADM003', class: 'Form 4A', math: 76, eng: 71, kisw: 74, bio: 69, phy: 72, agg: 58, rank: 3 },
                  { name: 'Grace Akinyi', adm: 'ADM004', class: 'Form 4A', math: 69, eng: 73, kisw: 70, bio: 65, phy: 68, agg: 52, rank: 4 },
                  { name: 'James Mwangi', adm: 'ADM005', class: 'Form 4A', math: 58, eng: 62, kisw: 55, bio: 48, phy: 52, agg: 41, rank: 5 },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium">{row.name}</td>
                    <td className="text-sm font-mono text-tertiary">{row.adm}</td>
                    <td>{row.class}</td>
                    <td className="text-center font-medium">{row.math}</td>
                    <td className="text-center font-medium">{row.eng}</td>
                    <td className="text-center font-medium">{row.kisw}</td>
                    <td className="text-center font-medium">{row.bio}</td>
                    <td className="text-center font-medium">{row.phy}</td>
                    <td className="text-center font-semibold text-primary">{row.agg}</td>
                    <td className="text-center">
                      <span className={`grade-badge ${row.rank <= 3 ? 'grade-A' : 'grade-Cplus'}`}>{row.rank}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Shadows */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Shadow System (Vercel-style)</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Ring (Border)', shadow: 'var(--shadow-ring)', desc: 'Zero-offset border replacement' },
              { name: 'Subtle', shadow: 'var(--shadow-subtle)', desc: 'Minimal lift, toolbar buttons' },
              { name: 'Card', shadow: 'var(--shadow-card)', desc: 'Standard cards, containers' },
              { name: 'Elevated', shadow: 'var(--shadow-elevated)', desc: 'Dropdowns, popovers' },
              { name: 'Dialog', shadow: 'var(--shadow-dialog)', desc: 'Modals, command palette' },
              { name: 'Focus', shadow: 'var(--shadow-focus)', desc: 'Keyboard accessibility' },
              { name: 'Brand (Stripe)', shadow: 'var(--shadow-brand)', desc: 'Featured cards, hero elements' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-8 text-center" style={{ boxShadow: item.shadow, minHeight: '120px' }}>
                <div className="text-h3 text-primary mb-2 font-mono">{item.name}</div>
                <div className="text-caption text-tertiary">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Spacing Scale (8px base)</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 items-end">
            {[
              { token: '--space-1', value: '1px' },
              { token: '--space-2', value: '4px' },
              { token: '--space-3', value: '7px' },
              { token: '--space-4', value: '8px' },
              { token: '--space-5', value: '11px' },
              { token: '--space-6', value: '12px' },
              { token: '--space-7', value: '16px' },
              { token: '--space-8', value: '19px' },
              { token: '--space-9', value: '20px' },
              { token: '--space-10', value: '22px' },
              { token: '--space-11', value: '24px' },
              { token: '--space-12', value: '28px' },
              { token: '--space-13', value: '32px' },
              { token: '--space-15', value: '48px' },
              { token: '--space-17', value: '80px' },
              { token: '--space-19', value: '120px' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} className="flex flex-col items-center gap-2 p-4 card min-w-[60px]">
                <div 
                  className="bg-surface rounded-standard w-full transition-base"
                  style={{ height: item.value }}
                />
                <span className="text-micro text-tertiary font-mono">{item.token}</span>
                <span className="text-tiny text-quaternary font-mono">{item.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-h3 text-primary mb-6">Border Radius Scale</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 items-end">
            {[
              { token: '--radius-micro', value: '2px', label: 'Micro' },
              { token: '--radius-standard', value: '4px', label: 'Standard' },
              { token: '--radius-comfortable', value: '6px', label: 'Comfortable' },
              { token: '--radius-card', value: '8px', label: 'Card' },
              { token: '--radius-panel', value: '12px', label: 'Panel' },
              { token: '--radius-large', value: '22px', label: 'Large' },
              { token: '--radius-pill', value: '9999px', label: 'Pill' },
              { token: '--radius-circle', value: '50%', label: 'Circle' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="flex flex-col items-center gap-2 p-4 card min-w-[80px]">
                <div 
                  className="bg-surface w-20 h-20 transition-base"
                  style={{ borderRadius: item.value }}
                />
                <span className="text-micro text-tertiary font-mono">{item.token}</span>
                <span className="text-label text-primary font-medium">{item.label}</span>
                <span className="text-tiny text-quaternary font-mono">{item.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  )
}