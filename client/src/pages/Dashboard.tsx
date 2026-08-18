import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAppData } from '../hooks/useAppData'
import PageHeader from '../components/ui/PageHeader'
import Divider from '../components/ui/Divider'
import SectionHeading from '../components/ui/SectionHeading'
import MetricCard from '../components/ui/MetricCard'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ForecastChart from '../components/charts/ForecastChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import { generateForecast, csvFromPoints, downloadCsv, type ForecastPoint } from '../utils/forecast'
import { api } from '../services/api'

export default function Dashboard() {
  const { palette } = useTheme()
  const { centers, items, historicalRows, loading } = useAppData()

  const [selCenter, setSelCenter] = useState('')
  const [selItem, setSelItem]     = useState('')
  const [forecastDays, setForecastDays] = useState(30)
  const [forecastData, setForecastData] = useState<ForecastPoint[] | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const centerItems = selCenter
    ? [...new Set(historicalRows.filter(r => r.center === selCenter).map(r => r.item))].sort()
    : items

  async function handleGenerate() {
    if (!selCenter || !selItem) { setError('Please select a center and item.'); return }
    setError(''); setGenerating(true)
    try {
      const res = await api.forecast(selCenter, selItem, forecastDays, 'xgboost')
      const pts = res.forecasts?.[selCenter]?.[selItem]
      if (pts) { setForecastData(pts) }
      else { throw new Error('No data') }
    } catch {
      setForecastData(generateForecast([selCenter], [selItem], forecastDays, 'xgboost')[selCenter][selItem])
    } finally { setGenerating(false) }
  }

  // Historical aggregations
  const centerDemand = centers.map(c => ({
    center: c,
    demand: historicalRows.filter(r => r.center === c).reduce((s, r) => s + r.demand, 0),
  })).sort((a, b) => b.demand - a.demand)

  const itemDemand = items.map(it => ({
    item: it,
    demand: historicalRows.filter(r => r.item === it).reduce((s, r) => s + r.demand, 0),
  })).sort((a, b) => b.demand - a.demand).slice(0, 10)

  const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const weekdayAvg = WEEKDAYS.map(day => {
    const rows = historicalRows.filter(r => {
      const d = new Date(r.date); const n = d.getDay()
      const name = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][n]
      return name === day
    })
    return { day, avg: rows.length ? rows.reduce((s, r) => s + r.demand, 0) / rows.length : 0 }
  })

  const totalDemand = historicalRows.reduce((s, r) => s + r.demand, 0)

  if (loading) return <Spinner label="Loading dashboard…" />

  return (
    <div>
      <PageHeader
        title="Jagdamba Fisheries Demand Forecasting Dashboard"
        subtitle="Monitor key demand signals and simulate forward-looking scenarios."
        icon="leaderboard"
      />
      <Divider />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <MetricCard label="Total Centers" value={centers.length} />
        <MetricCard label="Total Items" value={items.length} />
        <MetricCard label="Total Historical Demand" value={`${(totalDemand / 1e6).toFixed(1)}M kg`} />
        <MetricCard label="Available Models" value={2} />
      </div>

      <Divider />
      <SectionHeading title="Quick Forecast" icon="bolt" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select label="Select Center" value={selCenter} onChange={e => { setSelCenter(e.target.value); setSelItem('') }}>
          <option value="">-- Choose center --</option>
          {centers.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select label="Select Item" value={selItem} onChange={e => setSelItem(e.target.value)}>
          <option value="">-- Choose item --</option>
          {centerItems.map(i => <option key={i}>{i}</option>)}
        </Select>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.muted }}>
            Forecast Days
          </label>
          <input type="number" min={7} max={365} value={forecastDays}
            onChange={e => setForecastDays(+e.target.value)}
            className="rounded-xl px-3 py-2 text-sm border outline-none"
            style={{ background: palette.surface, color: palette.text, borderColor: palette.border }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <Button onClick={handleGenerate} loading={generating} disabled={generating}>
        Generate Forecast
      </Button>

      {generating && <Spinner label="Generating forecast…" />}

      {forecastData && !generating && (
        <>
          <div className="mt-4 rounded-2xl p-1" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
            <ForecastChart
              data={forecastData}
              title={`Forecast for ${selItem} at ${selCenter}`}
              height={480}
            />
          </div>

          <SectionHeading title="Forecast Summary" icon="analytics" />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <MetricCard label="Average Forecast" value={`${Math.round(forecastData.reduce((s,d)=>s+d.forecast,0)/forecastData.length).toLocaleString()} kg`} />
            <MetricCard label="Peak Demand"      value={`${Math.round(Math.max(...forecastData.map(d=>d.forecast))).toLocaleString()} kg`} />
            <MetricCard label="Minimum Demand"   value={`${Math.round(Math.min(...forecastData.map(d=>d.forecast))).toLocaleString()} kg`} />
          </div>
          <Button variant="secondary" className="w-auto"
            onClick={() => downloadCsv(csvFromPoints(forecastData), `forecast_${selCenter}_${selItem}.csv`)}>
            ⬇ Download Forecast CSV
          </Button>
        </>
      )}

      <Divider />
      <SectionHeading title="Historical Data Overview" icon="query_stats" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-1" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
          <BarChart x={centerDemand.map(d=>d.center)} y={centerDemand.map(d=>d.demand)}
            title="Total Demand by Center" xLabel="Center" yLabel="Demand (kg)" />
        </div>
        <div className="rounded-2xl p-1" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
          <BarChart x={itemDemand.map(d=>d.demand)} y={itemDemand.map(d=>d.item)}
            title="Top 10 Items by Demand" xLabel="Demand (kg)" yLabel="Item" horizontal />
        </div>
      </div>

      <SectionHeading title="Weekly Demand Pattern" icon="calendar_month" />
      <div className="rounded-2xl p-1" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
        <LineChart x={weekdayAvg.map(d=>d.day)} y={weekdayAvg.map(d=>d.avg)}
          title="Average Demand by Weekday" xLabel="Weekday" yLabel="Average Demand (kg)" height={360} />
      </div>
    </div>
  )
}
