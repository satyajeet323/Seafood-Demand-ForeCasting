import { useTheme } from '../../contexts/ThemeContext'

type Variant = 'info' | 'success' | 'warning' | 'neutral'

interface Props { children: React.ReactNode; variant?: Variant; className?: string }

export default function InfoBox({ children, variant = 'info', className = '' }: Props) {
  const { palette } = useTheme()

  const map: Record<Variant, { bg: string; border: string }> = {
    info:    { bg: palette.info_bg,    border: palette.info_border },
    success: { bg: palette.success_bg, border: palette.success_border },
    warning: { bg: palette.warning_bg, border: palette.warning_border },
    neutral: { bg: palette.surface,    border: palette.border },
  }

  const { bg, border } = map[variant]
  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm ${className}`}
      style={{ background: bg, border: `1px solid ${border}`, color: palette.text }}
    >
      {children}
    </div>
  )
}
