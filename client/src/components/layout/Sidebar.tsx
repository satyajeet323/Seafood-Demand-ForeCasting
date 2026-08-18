import { NavLink } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import MatIcon from '../ui/MatIcon'

const NAV = [
  { label: 'Dashboard',         to: '/',           icon: 'leaderboard' },
  { label: 'Forecast Generator', to: '/forecast',   icon: 'precision_manufacturing' },
  { label: 'Data Analyzer',     to: '/analyzer',   icon: 'database' },
  { label: 'Analytics',         to: '/analytics',  icon: 'insights' },
]

export default function Sidebar() {
  const { palette, theme, toggle } = useTheme()

  return (
    <aside
      className="flex flex-col w-64 min-h-screen p-5 shrink-0"
      style={{ background: palette.surface, borderRight: `1px solid ${palette.border}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-5"
        style={{ borderBottom: `1px solid ${palette.border}` }}>
        <MatIcon name="donut_small" className="text-3xl" style={{ color: palette.accent } as React.CSSProperties} />
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: palette.text }}>
            Jagdamba fisheries
          </p>
          <p className="text-xs" style={{ color: palette.muted }}>Demand Intelligence Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-5 flex flex-col gap-1">
        {NAV.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive ? 'text-white shadow-lg' : 'hover:opacity-80'}`
            }
            style={({ isActive }) => ({
              background: isActive
                ? `linear-gradient(120deg, ${palette.accent}, ${palette.accent_alt})`
                : 'transparent',
              color: isActive ? '#fff' : palette.text,
            })}
          >
            <MatIcon name={icon} className="text-xl" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{ color: palette.muted, border: `1px solid ${palette.border}` }}
      >
        <MatIcon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} className="text-xl" />
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>

      {/* Footer */}
      <p className="mt-4 text-xs text-center" style={{ color: palette.muted }}>
        v3.0.2 | ML | DS | MERN
      </p>
    </aside>
  )
}
