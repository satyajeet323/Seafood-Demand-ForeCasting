import Plot from 'react-plotly.js'
import { useTheme } from '../../contexts/ThemeContext'
import { plotConfig } from '../../utils/chart'

interface Props {
  z: number[][]
  x: string[]
  y: string[]
  title: string
  height?: number
}

export default function HeatmapChart({ z, x, y, title, height = 580 }: Props) {
  const { palette } = useTheme()
  const isDark = palette.background === '#0f172a'

  // Flat list of all values to compute min/max
  const allVals = z.flat().filter(v => v > 0)
  const zMax = allVals.length ? Math.max(...allVals) : 1
  const zMin = 0

  // Color scale: low → mid → high
  // In light mode: white → steel-blue → deep-blue
  // In dark mode:  dark-slate → indigo → vivid-blue
  const colorscale: [number, string][] = isDark
    ? [
        [0.00, '#0f172a'],
        [0.15, '#1e3a5f'],
        [0.40, '#1d4ed8'],
        [0.70, '#3b82f6'],
        [1.00, '#93c5fd'],
      ]
    : [
        [0.00, '#f0f4ff'],
        [0.20, '#bfdbfe'],
        [0.50, '#3b82f6'],
        [0.80, '#1d4ed8'],
        [1.00, '#1e3a8a'],
      ]

  // Build hover text
  const hovertext: string[][] = y.map((center, ri) =>
    x.map((item, ci) => {
      const val = z[ri]?.[ci] ?? 0
      return val > 0
        ? `<b>${center}</b><br>${item}<br><b>${val.toLocaleString()} kg</b>`
        : `<b>${center}</b><br>${item}<br>No data`
    })
  )

  const trace: Plotly.Data = {
    type: 'heatmap',
    z,
    x,
    y,
    zmin: zMin,
    zmax: zMax,
    colorscale,
    hoverinfo: 'text',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hovertext: hovertext as any,
    colorbar: {
      title: { text: 'Demand (kg)', font: { color: palette.muted, size: 11 } },
      tickfont: { color: palette.muted, size: 10 },
      bgcolor: palette.surface,
      bordercolor: palette.border,
      borderwidth: 1,
      thickness: 14,
    },
    xgap: 2,
    ygap: 2,
  }

  const layout: Partial<Plotly.Layout> = {
    height,
    title: {
      text: title,
      font: { color: palette.text, size: 14, family: 'Inter, sans-serif' },
    },
    plot_bgcolor: palette.plot_bg ?? palette.surface,
    paper_bgcolor: palette.paper_bg ?? palette.surface,
    font: { color: palette.text, family: 'Inter, sans-serif' },
    margin: { l: 90, r: 20, t: 60, b: 130 },
    xaxis: {
      title: { text: 'Item', font: { color: palette.text, size: 12 } },
      tickangle: -40,
      tickfont: { color: palette.muted, size: 10 },
      showgrid: false,
      showline: false,
      automargin: true,
    },
    yaxis: {
      title: { text: 'Center', font: { color: palette.text, size: 12 } },
      tickfont: { color: palette.muted, size: 11 },
      showgrid: false,
      showline: false,
      automargin: true,
    },
    hovermode: 'closest',
  }

  return (
    <Plot
      data={[trace]}
      layout={layout}
      config={plotConfig as Plotly.Config}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
