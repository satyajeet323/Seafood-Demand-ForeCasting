import { useTheme } from '../../contexts/ThemeContext'

export default function Divider() {
  const { palette } = useTheme()
  return (
    <hr
      className="my-6 border-0 h-0.5"
      style={{ background: `linear-gradient(90deg, ${palette.accent}, transparent)` }}
    />
  )
}
