import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './AuthProvider'

function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4">
      <p role="status" className="text-sm font-medium text-foreground-muted">
        Memeriksa sesi...
      </p>
    </main>
  )
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <AuthLoading />
  if (!user || user.role !== 'STUDENT') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <AuthLoading />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

