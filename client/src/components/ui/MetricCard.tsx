import { useTheme } from '../../contexts/ThemeContext'

interface Props { label: string; value: string | number; delta?: string }

export default function MetricCard({ label, value, delta }: Props) {
  const { palette } = useTheme()
  return (
    <div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: palette.card, border: `1px solid ${palette.border}` }}
    >
      <p className="text-sm font-medium mb-1" style={{ color: palette.muted }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: palette.text }}>{value}</p>
      {delta && (
        <p className="text-xs mt-1 font-medium" style={{ color: palette.accent }}>{delta}</p>
      )}
    </div>
  )
}
