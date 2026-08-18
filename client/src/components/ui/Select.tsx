import { useTheme } from '../../contexts/ThemeContext'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string }

export default function Select({ label, className = '', children, ...rest }: Props) {
  const { palette } = useTheme()
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.muted }}>
          {label}
        </label>
      )}
      <select
        className={`rounded-xl px-3 py-2 text-sm font-medium outline-none border
          focus:ring-2 transition-all ${className}`}
        style={{
          background: palette.surface, color: palette.text,
          borderColor: palette.border,
        }}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
