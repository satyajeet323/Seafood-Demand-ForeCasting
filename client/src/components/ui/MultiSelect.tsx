import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import MatIcon from './MatIcon'

interface Props {
  label?: string
  options: string[]
  value: string[]
  onChange: (val: string[]) => void
  placeholder?: string
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options…',
}: Props) {
  const { palette } = useTheme()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt))
    else onChange([...value, opt])
  }

  function selectAll() {
    onChange(filtered.every(o => value.includes(o)) ? [] : filtered)
  }

  function removeTag(opt: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter(v => v !== opt))
  }

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  )

  const allSelected = filtered.length > 0 && filtered.every(o => value.includes(o))

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {label && (
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: palette.muted }}
        >
          {label}
        </label>
      )}

      {/* Trigger box */}
      <div
        className="relative rounded-xl border cursor-pointer min-h-[42px] px-3 py-2
          flex items-start flex-wrap gap-1.5 transition-all"
        style={{
          background: palette.surface,
          borderColor: open ? palette.accent : palette.border,
          boxShadow: open ? `0 0 0 2px ${palette.accent}33` : 'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        {value.length === 0 ? (
          <span className="text-sm my-auto" style={{ color: palette.muted }}>
            {placeholder}
          </span>
        ) : (
          value.map(v => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: palette.accent + '22', color: palette.accent }}
              onClick={e => e.stopPropagation()}
            >
              {v}
              <button
                className="hover:opacity-70 leading-none"
                onClick={e => removeTag(v, e)}
                tabIndex={-1}
              >
                <MatIcon name="close" className="text-xs" style={{ fontSize: '0.8rem' }} />
              </button>
            </span>
          ))
        )}

        {/* Chevron */}
        <span className="ml-auto my-auto shrink-0">
          <MatIcon
            name={open ? 'expand_less' : 'expand_more'}
            className="text-xl"
            style={{ color: palette.muted }}
          />
        </span>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 mt-1 rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            width: 'inherit',
            minWidth: '220px',
            maxHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search */}
          <div
            className="px-3 pt-2 pb-1 border-b"
            style={{ borderColor: palette.border }}
          >
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full text-sm px-2 py-1.5 rounded-lg outline-none border"
              style={{
                background: palette.background,
                color: palette.text,
                borderColor: palette.border,
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Select all */}
          {filtered.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b
                hover:opacity-80 transition-all text-left"
              style={{
                borderColor: palette.border,
                color: palette.accent,
                background: palette.surface,
              }}
              onClick={e => { e.stopPropagation(); selectAll() }}
            >
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: palette.accent,
                  background: allSelected ? palette.accent : 'transparent',
                }}
              >
                {allSelected && (
                  <MatIcon name="check" className="text-white" style={{ fontSize: '0.65rem' }} />
                )}
              </span>
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm" style={{ color: palette.muted }}>
                No options found
              </p>
            )}
            {filtered.map(opt => {
              const checked = value.includes(opt)
              return (
                <button
                  key={opt}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                    text-left hover:opacity-80 transition-all"
                  style={{
                    color: palette.text,
                    background: checked ? palette.accent + '15' : 'transparent',
                  }}
                  onClick={e => { e.stopPropagation(); toggle(opt) }}
                >
                  <span
                    className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                    style={{
                      borderColor: checked ? palette.accent : palette.border,
                      background: checked ? palette.accent : 'transparent',
                    }}
                  >
                    {checked && (
                      <MatIcon name="check" className="text-white" style={{ fontSize: '0.65rem' }} />
                    )}
                  </span>
                  <span className="truncate">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Footer count */}
          <div
            className="px-4 py-2 text-xs border-t"
            style={{ borderColor: palette.border, color: palette.muted }}
          >
            {value.length} of {options.length} selected
          </div>
        </div>
      )}
    </div>
  )
}
