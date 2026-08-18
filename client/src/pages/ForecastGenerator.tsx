import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAppData } from '../hooks/useAppData'
import PageHeader from '../components/ui/PageHeader'
import Divider from '../components/ui/Divider'
import SectionHeading from '../components/ui/SectionHeading'
import MetricCard from '../components/ui/MetricCard'
import Button from '../components/ui/Button'
import InfoBox from '../components/ui/InfoBox'
import Spinner from '../components/ui/Spinner'
import ForecastChart from '../components/charts/ForecastChart'
import MatIcon from '../components/ui/MatIcon'
import MultiSelect from '../components/ui/MultiSelect'
import { generateForecast, type ForecastPoint } from '../utils/forecast'
import { api } from '../services/api'

type Results = Record<string, Record<string, ForecastPoint[]>>

export default function ForecastGenerator() {
  const { palette } = useTheme()
  const { centers, items, loading } = useAppData()

  const [selCenters,   setSelCenters]   = useState<string[]>([])
  const [selItems,     setSelItems]     = useState<string[]>([])
  const [forecastDays, setForecastDays] = useState(30)
  const [modelType,    setModelType]    = useState<'xgboost' | 'lightgbm'>('xgboost')
  const [results,      setResults]      = useState<Results | null>(null)
  const [generating,   setGenerating]   = useState(false)
  const [warning,      setWarning]      = useState('')
  const [expanded,     setExpanded]     = useState<Record<string, boolean>>({})

  function toggleExpand(key: string) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleGenerate() {
    if (!selCenters.length || !selItems.length) {
      setWarning('Please select at least one center and one item.')
      return
    }
    setWarning('')
    setGenerating(true)
    try {
      const out: Results = {}
      for (const center of selCenters) {
        out[center] = {}
        for (const item of selItems) {
          try {
            const res = await api.forecast(center, item, forecastDays, modelType)
            out[center][item] = res.forecasts?.[center]?.[item] ?? []
          } catch {
            out[center][item] = generateForecast(
              [center], [item], forecastDays, modelType
            )[center][item]
          }
        }
      }
      setResults(out)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <Spinner label="Loading…" />

  return (
    <div>
      <PageHeader
        title="Forecast Generator"
        subtitle="Configure tailored demand simulations by location, category, and model."
        icon="precision_manufacturing"
      />
      <Divider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left panel: Selection Criteria ── */}
        <div
          className="rounded-2xl p-6"
          style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
        >
          <h2 className="font-semibold text-base mb-5" style={{ color: palette.text }}>
            Selection Criteria
          </h2>

          {/* Centers multi-select dropdown */}
          <div className="relative mb-5">
            <MultiSelect
              label="Select Centers"
              options={centers}
              value={selCenters}
              onChange={setSelCenters}
              placeholder="Choose one or more centers…"
            />
          </div>

          {/* Items multi-select dropdown */}
          <div className="relative mb-5">
            <MultiSelect
              label="Select Items"
              options={items}
              value={selItems}
              onChange={setSelItems}
              placeholder="Choose one or more items…"
            />
          </div>

          {/* Forecast days slider */}
          <div className="mb-4">
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-2"
              style={{ color: palette.muted }}
            >
              Forecast Days ({forecastDays})
            </label>
            <input
              type="range"
              min={7}
              max={365}
              value={forecastDays}
              onChange={e => setForecastDays(+e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: palette.accent }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: palette.muted }}>
              <span>7</span><span>365</span>
            </div>
          </div>

          {/* Model type dropdown */}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-1"
              style={{ color: palette.muted }}
            >
              Model Type
            </label>
            <select
              value={modelType}
              onChange={e => setModelType(e.target.value as 'xgboost' | 'lightgbm')}
              className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
              style={{
                background: palette.surface,
                color: palette.text,
                borderColor: palette.border,
              }}
            >
              <option value="xgboost">XGBoost</option>
              <option value="lightgbm">LightGBM</option>
            </select>
          </div>
        </div>

        {/* ── Right panel: Forecast Parameters ── */}
        <div
          className="rounded-2xl p-6"
          style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
        >
          <h2 className="font-semibold text-base mb-5" style={{ color: palette.text }}>
            Forecast Parameters
          </h2>

          <InfoBox variant="info">
            <p className="font-semibold mb-3" style={{ color: palette.text }}>
              Selected Configuration:
            </p>
            <ul className="text-sm space-y-1.5" style={{ color: palette.text }}>
              <li>
                • Centers:{' '}
                <strong>{selCenters.length}</strong>
                {selCenters.length > 0 && (
                  <span style={{ color: palette.muted }}>
                    {' '}({selCenters.join(', ')})
                  </span>
                )}
              </li>
              <li>
                • Items:{' '}
                <strong>{selItems.length}</strong>
                {selItems.length > 0 && (
                  <span style={{ color: palette.muted }}>
                    {' '}({selItems.slice(0, 3).join(', ')}{selItems.length > 3 ? '…' : ''})
                  </span>
                )}
              </li>
              <li>
                • Forecast Period:{' '}
                <strong>{forecastDays} days</strong>
              </li>
              <li>
                • Model:{' '}
                <strong>{modelType}</strong>
              </li>
            </ul>
          </InfoBox>

          {/* Selected tags preview */}
          {(selCenters.length > 0 || selItems.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selCenters.map(c => (
                <span
                  key={c}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: palette.accent + '22', color: palette.accent }}
                >
                  📍 {c}
                </span>
              ))}
              {selItems.map(i => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: palette.accent_alt + '22', color: palette.accent_alt }}
                >
                  🐟 {i}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            {warning && (
              <p className="text-amber-500 text-sm mb-3 flex items-center gap-1">
                <MatIcon name="warning" className="text-base" />
                {warning}
              </p>
            )}
            <Button onClick={handleGenerate} loading={generating} disabled={generating}>
              Generate Forecasts
            </Button>
          </div>
        </div>
      </div>

      {/* Loading spinner */}
      {generating && <Spinner label="Generating forecasts… This may take a moment." />}

      {/* Results */}
      {results && !generating && (
        <>
          <InfoBox variant="success" className="mt-6">
            ✅ Forecasts generated successfully!
          </InfoBox>

          {selCenters.map(center => (
            <div key={center}>
              <SectionHeading title={center} icon="location_on" />
              <div className="flex flex-col gap-3">
                {selItems.map(item => {
                  const pts = results[center]?.[item] ?? []
                  const key = `${center}|${item}`
                  const open = expanded[key] ?? true
                  return (
                    <div
                      key={item}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: `1px solid ${palette.border}`,
                        background: palette.surface,
                      }}
                    >
                      {/* Expander header */}
                      <button
                        className="w-full flex items-center justify-between px-5 py-3
                          font-semibold text-sm transition-all hover:opacity-80"
                        style={{ color: palette.text }}
                        onClick={() => toggleExpand(key)}
                      >
                        <span className="flex items-center gap-2">
                          <MatIcon
                            name="set_meal"
                            className="text-base"
                            style={{ color: palette.accent }}
                          />
                          {item}
                        </span>
                        <MatIcon name={open ? 'expand_less' : 'expand_more'} className="text-xl" />
                      </button>

                      {/* Expander body */}
                      {open && pts.length > 0 && (
                        <div className="px-2 pb-4">
                          <ForecastChart
                            data={pts}
                            title={`Forecast for ${item}`}
                            showMarkers
                            height={380}
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 px-2">
                            <MetricCard
                              label="Avg Forecast"
                              value={`${Math.round(pts.reduce((s, d) => s + d.forecast, 0) / pts.length).toLocaleString()} kg`}
                            />
                            <MetricCard
                              label="Peak"
                              value={`${Math.round(Math.max(...pts.map(d => d.forecast))).toLocaleString()} kg`}
                            />
                            <MetricCard
                              label="Min"
                              value={`${Math.round(Math.min(...pts.map(d => d.forecast))).toLocaleString()} kg`}
                            />
                            <MetricCard
                              label="Avg Confidence"
                              value={`${(pts.reduce((s, d) => s + d.confidence, 0) / pts.length * 100).toFixed(1)}%`}
                            />
                          </div>
                        </div>
                      )}

                      {open && pts.length === 0 && (
                        <div className="px-5 pb-4">
                          <InfoBox variant="warning">No forecast data available for this combination.</InfoBox>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
