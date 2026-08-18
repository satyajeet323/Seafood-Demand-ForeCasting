import { useTheme } from '../../contexts/ThemeContext'

export default function Spinner({ label = 'Loading…' }: { label?: string }) {
  const { palette } = useTheme()
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: `${palette.border} ${palette.border} ${palette.border} ${palette.accent}` }}
      />
      <p className="text-sm font-medium" style={{ color: palette.muted }}>{label}</p>
    </div>
  )
}
