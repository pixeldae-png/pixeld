import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { signOut } = useAuth()

  const links = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/projects', label: 'Projects', end: false },
  ]

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-display text-[16px] font-800">PIXELD Admin</span>
        <button onClick={() => signOut()} className="text-[13px] text-mist hover:text-ink">
          Sign out
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <nav className="w-48 shrink-0 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-[14px] font-medium ${
                  isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
