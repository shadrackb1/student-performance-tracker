import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import OnboardingFlow from './OnboardingFlow'

export default function OnboardingTrigger() {
  const { user, loading: authLoading } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      const hasCompleted = localStorage.getItem('onboarding_complete')
      const dismissed = localStorage.getItem('onboarding_dismissed')
      
      if (!hasCompleted && !dismissed) {
        // Small delay to let the app settle
        setTimeout(() => setShowOnboarding(true), 500)
      }
      setChecked(true)
    }
  }, [user, authLoading])

  const handleComplete = () => {
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.removeItem('onboarding_progress')
    setShowOnboarding(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('onboarding_dismissed', 'true')
    setShowOnboarding(false)
  }

  if (authLoading || !user || !checked || !showOnboarding) {
    return null
  }

  return (
    <OnboardingFlow 
      onComplete={handleComplete}
      isOpen={showOnboarding}
      onClose={handleDismiss}
    />
  )
}