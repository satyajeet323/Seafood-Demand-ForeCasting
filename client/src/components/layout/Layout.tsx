import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../../contexts/ThemeContext'

export default function Layout() {
  const { palette } = useTheme()
  return (
    <div className="flex min-h-screen" style={{ background: palette.background }}>
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto max-w-[1400px]">
        <Outlet />
        <footer className="mt-10 pt-5 text-center text-sm"
          style={{ borderTop: `1px solid ${palette.border}`, color: palette.muted }}>
          Jagdamba Fisheries Demand Forecasting System v3.0 · Seafood Demand Forecasting
        </footer>
      </main>
    </div>
  )
}
