import { Link, NavLink } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

const nav = [
  { to: '/', label: 'Главная', end: true },
  { to: '/solve', label: 'Решать', end: false },
  { to: '/library', label: 'Библиотека', end: false },
]

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-bg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight text-text">LectureMate</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {nav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-1.5 transition',
                  isActive
                    ? 'bg-surface-2 text-text'
                    : 'text-muted hover:bg-surface hover:text-text',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}