import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
  palette: Record<string, string>
}

const palettes = {
  light: {
    background: '#f4f6fb', surface: '#ffffff', card: '#ffffff',
    border: '#e2e8f0', text: '#0f172a', muted: '#475569',
    accent: '#2563eb', accent_alt: '#0ea5e9',
    success_bg: '#ecfdf3', success_border: '#34d399',
    info_bg: '#eef2ff', info_border: '#818cf8',
    warning_bg: '#fff7ed', warning_border: '#fb923c',
    grid: '#d0d7e3', plot_bg: '#ffffff', paper_bg: '#ffffff',
  },
  dark: {
    background: '#0f172a', surface: '#1e293b', card: '#1f2937',
    border: '#334155', text: '#f8fafc', muted: '#cbd5e1',
    accent: '#60a5fa', accent_alt: '#818cf8',
    success_bg: '#064e3b', success_border: '#34d399',
    info_bg: '#1e3a8a', info_border: '#60a5fa',
    warning_bg: '#78350f', warning_border: '#fbbf24',
    grid: '#334155', plot_bg: '#1e293b', paper_bg: '#1e293b',
  },
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light', toggle: () => {}, palette: palettes.light,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('theme') as Theme) || 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggle, palette: palettes[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export { palettes }
