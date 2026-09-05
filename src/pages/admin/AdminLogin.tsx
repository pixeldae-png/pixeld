import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-line p-8">
        <h1 className="mb-1 font-display text-[22px] font-800 text-ink">PIXELD Admin</h1>
        <p className="mb-6 text-[13px] text-mist">Sign in to manage projects.</p>

        <div className="space-y-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-[14px] outline-none focus:border-ink"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-[14px] outline-none focus:border-ink"
          />
        </div>

        {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
