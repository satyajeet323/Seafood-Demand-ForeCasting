import MatIcon from './MatIcon'
import { useTheme } from '../../contexts/ThemeContext'

interface Props { title: string; subtitle?: string; icon?: string }

export default function PageHeader({ title, subtitle = '', icon = 'monitoring' }: Props) {
  const { palette } = useTheme()
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-6 mb-6 shadow-lg"
      style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
    >
      <MatIcon
        name={icon}
        className="text-5xl"
        style={{ color: palette.accent } as React.CSSProperties}
      />
      <div>
        <h1 className="text-2xl font-bold m-0" style={{ color: palette.text }}>{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm m-0" style={{ color: palette.muted }}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
