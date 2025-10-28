'use client'

import { useAuth } from '@/hooks/use-auth'
import { Dashboard } from '@/components/dashboard'
import { LandingPage } from '@/components/landing-page'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return user ? <Dashboard /> : <LandingPage />
}