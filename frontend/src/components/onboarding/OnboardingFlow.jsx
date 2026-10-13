import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Student Performance Tracker',
    subtitle: 'Track. Analyze. Improve.',
    illustration: '📊',
    action: null,
  },
  {
    id: 'role',
    title: 'What\'s your role?',
    subtitle: 'This helps us customize your experience',
    illustration: '👤',
    action: 'select_role',
    options: [
      { value: 'teacher', label: 'Teacher', description: 'Manage your classes, enter marks, generate reports' },
      { value: 'admin', label: 'School Administrator', description: 'Oversee multiple classes, manage teachers, view analytics' },
    ],
  },
  {
    id: 'class-setup',
    title: 'Set up your first class',
    subtitle: 'Create a class to start tracking students',
    illustration: '🏫',
    action: 'create_class',
    fields: [
      { name: 'name', label: 'Class Name', type: 'text', placeholder: 'e.g., Form 4A', required: true },
      { name: 'form_level', label: 'Form Level', type: 'select', options: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Grade 10', 'Grade 11', 'Grade 12'], required: true },
    ],
  },
  {
    id: 'students',
    title: 'Add your students',
    subtitle: 'Import from CSV/Excel or add manually',
    illustration: '👥',
    action: 'import_students',
    options: [
      { value: 'manual', label: 'Add manually', description: 'Enter students one by one' },
      { value: 'csv', label: 'Import CSV/Excel', description: 'Upload a spreadsheet with student data' },
      { value: 'skip', label: 'Skip for now', description: 'Add students later from the dashboard' },
    ],
  },
  {
    id: 'subjects',
    title: 'Configure subjects',
    subtitle: 'Select the subjects your class will study',
    illustration: '📚',
    action: 'select_subjects',
    kcseSubjects: [
      'English', 'Kiswahili', 'Mathematics', 'Biology', 'Physics', 'Chemistry',
      'History', 'Geography', 'CRE', 'Agriculture', 'Computer Studies', 'Business Studies',
    ],
  },
  {
    id: 'grading',
    title: 'Understanding KCSE Grading',
    subtitle: 'Automatic grade calculation using the official 12-point scale',
    illustration: '🎯',
    action: null,
    info: [
      { grade: 'A', range: '80-100', points: 12, desc: 'Excellent' },
      { grade: 'A-', range: '75-79', points: 11, desc: 'Very Good' },
      { grade: 'B+', range: '70-74', points: 10, desc: 'Good' },
      { grade: 'B', range: '65-69', points: 9, desc: 'Good' },
      { grade: 'B-', range: '60-64', points: 8, desc: 'Above Average' },
      { grade: 'C+', range: '55-59', points: 7, desc: 'Average (Pass)' },
      { grade: 'C', range: '50-54', points: 6, desc: 'Average' },
      { grade: 'C-', range: '45-49', points: 5, desc: 'Below Average' },
      { grade: 'D+', range: '40-44', points: 4, desc: 'Weak' },
      { grade: 'D', range: '35-39', points: 3, desc: 'Weak' },
      { grade: 'D-', range: '30-34', points: 2, desc: 'Very Weak' },
      { grade: 'E', range: '0-29', points: 1, desc: 'Fail' },
    ],
  },
  {
    id: 'reports',
    title: 'Automated Reports',
    subtitle: 'Generate professional PDF report cards and Excel analytics',
    illustration: '📄',
    action: null,
    features: [
      'Individual student report cards with grades, ranks, and aggregates',
      'Class ranking spreadsheets (best 7 subjects aggregate)',
      'Subject analysis with grade distributions and pass rates',
      'Performance analytics with interactive charts',
    ],
  },
  {
    id: 'complete',
    title: 'You\'re all set!',
    subtitle: 'Start tracking student performance in minutes',
    illustration: '🚀',
    action: 'finish',
    cta: 'Go to Dashboard',
  },
]

export default function OnboardingFlow({ onComplete, isOpen, onClose }) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    role: '',
    className: '',
    formLevel: '',
    studentMethod: 'skip',
    selectedSubjects: [],
  })
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const step = STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Save onboarding progress to localStorage
  useEffect(() => {
    if (isOpen && !completed) {
      const saved = localStorage.getItem('onboarding_progress')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.currentStep > currentStep && parsed.currentStep < STEPS.length - 1) {
            setCurrentStep(parsed.currentStep)
            setFormData(parsed.formData || {})
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [isOpen, completed, currentStep])

  const saveProgress = useCallback(() => {
    localStorage.setItem('onboarding_progress', JSON.stringify({
      currentStep,
      formData,
      timestamp: Date.now(),
    }))
  }, [currentStep, formData])

  const handleNext = async () => {
    if (step.action) {
      setLoading(true)
      try {
        await executeStepAction(step.action)
        saveProgress()
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(prev => prev + 1)
        }
      } catch (error) {
        console.error('Onboarding step failed:', error)
      } finally {
        setLoading(false)
      }
    } else {
      saveProgress()
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const executeStepAction = async (action) => {
    switch (action) {
      case 'select_role':
        if (!formData.role) throw new Error('Please select a role')
        // Could save role preference to user profile
        break
      case 'create_class':
        if (!formData.className || !formData.formLevel) throw new Error('Please fill in all fields')
        // Create class via API
        await api.post('/classes', {
          name: formData.className,
          form_level: formData.formLevel,
        })
        break
      case 'import_students':
        // Just track the preference, actual import happens on Students page
        break
      case 'select_subjects':
        // Save selected subjects
        break
      case 'finish':
        // Mark onboarding as complete
        localStorage.setItem('onboarding_complete', 'true')
        setCompleted(true)
        onComplete?.()
        break
    }
  }

  const handleOptionSelect = (value) => {
    setFormData(prev => ({ ...prev, [step.action.replace('select_', '').replace('_', '')]: value }))
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter(s => s !== subject)
        : [...prev.selectedSubjects, subject]
    }))
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Backdrop click to close (only on first step) */}
      <div 
        className="absolute inset-0" 
        onClick={isFirstStep ? onClose : undefined}
        aria-hidden="true"
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl max-h-[90vh] bg-surface border border-standard rounded-panel shadow-dialog overflow-hidden flex flex-col"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-border-subtle overflow-hidden">
          <motion.div
            key={currentStep}
            layout
            className="h-full bg-accent-interactive"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          />
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-tertiary">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                className={`w-2 h-2 rounded-circle transition-colors ${
                  i <= currentStep ? 'bg-accent-interactive' : 'bg-border-strong'
                }`}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-comfortable text-tertiary hover:text-primary hover:bg-hover transition-fast"
            aria-label="Close onboarding"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-6 md:p-8"
          >
            <div className="max-w-xl mx-auto text-center space-y-6">
              {/* Illustration */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-6xl md:text-7xl mb-4"
                style={{ lineHeight: 1 }}
              >
                {step.illustration}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-h1 text-primary font-linear"
                id="onboarding-title"
              >
                {step.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-body-lg text-tertiary"
              >
                {step.subtitle}
              </motion.p>

              {/* Step-specific content */}
              {renderStepContent(step, formData, handleFieldChange, handleOptionSelect, handleSubjectToggle)}

              {/* Error message */}
              {step.action && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-caption text-danger h-5 min-h-5"
                >
                  {loading ? 'Processing...' : ''}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-subtle flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={isFirstStep || loading}
            className="btn btn-secondary flex-1 md:flex-none"
            aria-label="Previous step"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex-1" />

          {isLastStep ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={loading}
              className="btn btn-primary flex-1 md:flex-none"
            >
              {step.cta || 'Get Started'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={loading || (step.action && !isStepValid(step, formData))}
              className="btn btn-primary flex-1 md:flex-none"
            >
              {loading ? (
                <>
                  <span className="loading-spinner-sm mr-2" />
                  Continuing...
                </>
              ) : (
                'Continue'
              )}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function renderStepContent(step, formData, handleFieldChange, handleOptionSelect, handleSubjectToggle) {
  switch (step.id) {
    case 'role':
      return (
        <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label="Select your role">
          {step.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option.value)}
              className={`card p-6 text-left relative ${
                formData.role === option.value
                  ? 'border-accent-interactive shadow-[0px_0px_0px_2px_var(--color-accent-interactive)]'
                  : 'border-standard hover:border-strong'
              }`}
              role="radio"
              aria-checked={formData.role === option.value}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-comfortable mb-4"
                style={{ 
                  background: formData.role === option.value 
                    ? 'var(--color-accent-interactive)' 
                    : 'var(--color-bg-hover)' 
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={option.value === 'teacher' 
                      ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      : 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'} 
                  />
                </svg>
              </div>
              <h3 className="text-h3 text-primary mb-1">{option.label}</h3>
              <p className="text-body-sm text-tertiary">{option.description}</p>
              {formData.role === option.value && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-circle bg-accent-interactive flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )

    case 'class-setup':
      return (
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div>
            <label className="label">Class Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Form 4A"
              value={formData.className}
              onChange={(e) => handleFieldChange('className', e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="label">Form Level</label>
            <select
              className="input"
              value={formData.formLevel}
              onChange={(e) => handleFieldChange('formLevel', e.target.value)}
            >
              <option value="">Select form level</option>
              {step.fields[1].options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      )

    case 'students':
      return (
        <div className="space-y-3" role="radiogroup" aria-label="Choose how to add students">
          {step.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleOptionSelect(option.value)}
              className={`card p-5 text-left flex items-center gap-4 ${
                formData.studentMethod === option.value
                  ? 'border-accent-interactive bg-accent-primary/5'
                  : 'border-standard hover:border-strong'
              }`}
              role="radio"
              aria-checked={formData.studentMethod === option.value}
            >
              <div className={`w-10 h-10 rounded-comfortable flex items-center justify-center flex-shrink-0 ${
                formData.studentMethod === option.value 
                  ? 'bg-accent-interactive text-primary' 
                  : 'bg-hover text-tertiary'
              }`}>
                {option.value === 'manual' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ) : option.value === 'csv' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-body font-medium text-primary">{option.label}</h3>
                <p className="text-caption text-tertiary">{option.description}</p>
              </div>
              {formData.studentMethod === option.value && (
                <svg className="w-6 h-6 text-accent-interactive" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>
          ))}
        </div>
      )

    case 'subjects':
      return (
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-body-sm text-tertiary text-center">
            Click to select subjects. Minimum 7 required for KCSE aggregate.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {step.kcseSubjects.map((subject) => (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubjectToggle(subject)}
                className={`card p-4 text-center ${
                  formData.selectedSubjects.includes(subject)
                    ? 'border-accent-interactive bg-accent-primary/5 text-primary'
                    : 'border-standard hover:border-strong text-secondary'
                }`}
              >
                <span className="text-body font-medium">{subject}</span>
                {formData.selectedSubjects.includes(subject) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-circle bg-accent-interactive flex items-center justify-center mx-auto mt-2"
                  >
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          <div className="text-center">
            <span className={`badge ${formData.selectedSubjects.length >= 7 ? 'badge-success' : 'badge-warning'}`}>
              {formData.selectedSubjects.length} of 7+ subjects selected
            </span>
          </div>
        </div>
      )

    case 'grading':
      return (
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="card p-4">
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className="font-semibold text-primary">Grade</div>
              <div className="font-semibold text-primary">Range</div>
              <div className="font-semibold text-primary">Points</div>
              <div className="font-semibold text-primary">Level</div>
            </div>
            <div className="space-y-1 mt-2">
              {step.info.map((item, i) => (
                <motion.div
                  key={item.grade}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-4 gap-2 px-3 py-2 rounded-standard text-sm"
                  style={{ 
                    background: i % 2 === 0 ? 'var(--color-bg-hover)' : 'transparent',
                    borderLeft: `3px solid ${getGradeColor(item.grade)}`
                  }}
                >
                  <span className="font-mono font-medium text-primary">{item.grade}</span>
                  <span className="text-tertiary">{item.range}</span>
                  <span className="font-medium text-accent">{item.points}</span>
                  <span className="text-tertiary">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-caption text-tertiary text-center">
            Aggregate = Sum of best 7 subject points | Pass = C+ (55%) for university entry
          </p>
        </div>
      )

    case 'reports':
      return (
        <div className="space-y-3 max-w-xl mx-auto">
          {step.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-comfortable bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent-interactive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-body text-secondary pt-1">{feature}</p>
            </motion.div>
          ))}
        </div>
      )

    case 'complete':
      return (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-circle bg-success/10 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )

    default:
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-lg mx-auto"
        >
          <div className="card p-6">
            <h3 className="text-h3 text-primary mb-4 text-center">What you'll be able to do</h3>
            <ul className="space-y-3">
              {[
                'Manage students across multiple classes (Form 1–4)',
                'Enter marks with automatic KCSE grade calculation',
                'View subject analytics and class rankings',
                'Generate professional PDF report cards',
                'Export class rankings and subject analysis to Excel',
                'Track performance across terms and examinations',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-body text-secondary"
                >
                  <div className="w-6 h-6 rounded-circle bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent-interactive" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )
  }
}

function isStepValid(step, formData) {
  switch (step.action) {
    case 'select_role':
      return !!formData.role
    case 'create_class':
      return !!formData.className && !!formData.formLevel
    case 'import_students':
      return !!formData.studentMethod
    case 'select_subjects':
      return formData.selectedSubjects.length >= 7
    default:
      return true
  }
}

function getGradeColor(grade) {
  const colors = {
    A: '#16a34a', 'A-': '#22c55e',
    'B+': '#3b82f6', B: '#0ea5e9', 'B-': '#38bdf8',
    'C+': '#f59e0b', C: '#fbbf24', 'C-': '#fcd34d',
    'D+': '#9ca3af', D: '#6b7280', 'D-': '#4b5563',
    E: '#ef4444',
  }
  return colors[grade] || '#6b7280'
}