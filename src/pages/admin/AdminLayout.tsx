import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { signOut } = useAuth()

  const links = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/projects', label: 'Projects', end: false },
    { to: '/admin/social', label: 'Social links', end: false },
  ]

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-display text-[16px] font-800">PIXELD Admin</span>
        <button onClick={() => signOut()} className="text-[13px] text-mist hover:text-ink">
          Sign out
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:gap-8 sm:px-6 sm:py-8">
        <nav aria-label="Admin navigation" className="flex flex-wrap gap-1 sm:block sm:w-48 sm:shrink-0 sm:space-y-1">
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

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
