import Plot from 'react-plotly.js'
import { useTheme } from '../../contexts/ThemeContext'
import { chartLayout, hexToRgba, plotConfig } from '../../utils/chart'
import type { ForecastPoint } from '../../utils/forecast'

interface Props {
  data: ForecastPoint[]
  title: string
  height?: number
  showMarkers?: boolean
}

export default function ForecastChart({ data, title, height = 420, showMarkers = false }: Props) {
  const { palette } = useTheme()

  const dates = data.map(d => d.date)
  const forecasts = data.map(d => d.forecast)
  const upper = data.map(d => d.upper_bound)
  const lower = data.map(d => d.lower_bound)

  const traces: Plotly.Data[] = [
    {
      x: dates, y: upper, mode: 'lines', name: 'Upper Bound',
      line: { color: palette.accent_alt, width: 1, dash: 'dash' },
      showlegend: true, type: 'scatter',
    },
    {
      x: dates, y: lower, mode: 'lines', name: 'Lower Bound',
      fill: 'tonexty', fillcolor: hexToRgba(palette.accent, 0.12),
      line: { color: palette.accent_alt, width: 1, dash: 'dash' },
      showlegend: true, type: 'scatter',
    },
    {
      x: dates, y: forecasts,
      mode: showMarkers ? 'lines+markers' : 'lines',
      name: 'Forecast',
      line: { color: palette.accent, width: 3 },
      type: 'scatter',
    },
  ]

  const layout = chartLayout(palette, {
    title: { text: title, font: { color: palette.text, size: 15 } },
    xaxis: { title: { text: 'Date' } },
    yaxis: { title: { text: 'Demand (kg)' } },
  } as Partial<Plotly.Layout>, height)

  return (
    <Plot
      data={traces as Plotly.Data[]}
      layout={layout as Plotly.Layout}
      config={plotConfig as Plotly.Config}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
