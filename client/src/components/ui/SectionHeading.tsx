import MatIcon from './MatIcon'
import { useTheme } from '../../contexts/ThemeContext'

interface Props { title: string; icon?: string }

export default function SectionHeading({ title, icon = 'insights' }: Props) {
  const { palette } = useTheme()
  return (
    <div className="flex items-center gap-2 mt-6 mb-3">
      <span
        className="mat-icon text-xl rounded-lg px-1 py-0.5"
        style={{ color: palette.accent, background: palette.accent + '1a' }}
      >{icon}</span>
      <span
        className="text-sm font-semibold tracking-widest uppercase"
        style={{ color: palette.muted }}
      >{title}</span>
    </div>
  )
}
