import { useTheme } from '../../contexts/ThemeContext'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean; variant?: 'primary' | 'secondary'
}

export default function Button({ children, loading, variant = 'primary', className = '', ...rest }: Props) {
  const { palette } = useTheme()

  if (variant === 'secondary') {
    return (
      <button
        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${className}`}
        style={{ background: palette.surface, color: palette.accent, borderColor: palette.accent }}
        {...rest}
      >
        {loading ? 'Loading…' : children}
      </button>
    )
  }

  return (
    <button
      className={`w-full py-3 px-5 rounded-xl font-semibold text-white transition-all shadow-lg
        hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 ${className}`}
      style={{ background: `linear-gradient(120deg, ${palette.accent}, ${palette.accent_alt})` }}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}
