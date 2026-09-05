import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <div className="flex min-h-screen items-center justify-center text-[14px] text-mist">Loading…</div>
  if (!session) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
