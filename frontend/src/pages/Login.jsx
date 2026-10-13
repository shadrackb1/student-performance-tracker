import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Login({ register }) {
  const [isRegister, setIsRegister] = useState(!!register)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (isRegister) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    try {
      if (isRegister) {
        await registerUser(formData.email, formData.password, formData.full_name)
        toast.success('Account created successfully! Please login.')
        setIsRegister(false)
        setFormData({ email: '', password: '', full_name: '', confirmPassword: '' })
      } else {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
        navigate(from, { replace: true })
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Authentication failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setErrors({})
    setFormData({ email: '', password: '', full_name: '', confirmPassword: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-accent-primary rounded-comfortable flex items-center justify-center">
              <span className="text-primary font-bold">SPT</span>
            </div>
            <span className="text-h3 font-linear text-primary">Student Tracker</span>
          </Link>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-h1 font-linear text-primary"
          >
            {isRegister ? 'Create your account' : 'Welcome back'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body text-tertiary mt-2"
          >
            {isRegister ? 'Start tracking student performance today' : 'Sign in to your dashboard'}
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label htmlFor="full_name" className="label">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                className={`input ${errors.full_name ? 'border-danger' : ''}`}
                placeholder="John Doe"
              />
              {errors.full_name && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-caption text-danger">
                  {errors.full_name}
                </motion.p>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isRegister ? 0.1 : 0 }}
          >
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'border-danger' : ''}`}
              placeholder="teacher@school.edu"
            />
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-caption text-danger">
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isRegister ? 0.2 : 0.1 }}
          >
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={formData.password}
                onChange={handleChange}
                className={`input ${errors.password ? 'border-danger' : ''} pr-12`}
                placeholder="••••••••"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary p-1"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </motion.button>
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-caption text-danger">
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {isRegister && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input ${errors.confirmPassword ? 'border-danger' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-caption text-danger">
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isRegister ? 0.3 : 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner" />
                  {isRegister ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-body-sm text-tertiary">
            {isRegister ? 'Already have an account?' : 'Don\'t have an account?'} {' '}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={toggleMode}
              className="text-accent-interactive hover:text-accent-hover font-medium"
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </motion.button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-caption text-quaternary"
        >
          <p>Demo: teacher@demo.com / password123</p>
        </motion.div>
      </motion.div>
    </div>
  )
}