import Plot from 'react-plotly.js'
import { useTheme } from '../../contexts/ThemeContext'
import { chartLayout, plotConfig } from '../../utils/chart'

interface Props {
  x: (string | number)[]
  y: (string | number)[]
  title: string
  xLabel?: string
  yLabel?: string
  horizontal?: boolean
  height?: number
}

export default function BarChart({ x, y, title, xLabel, yLabel, horizontal, height = 380 }: Props) {
  const { palette } = useTheme()

  const trace: Plotly.Data = {
    x, y, type: 'bar',
    orientation: horizontal ? 'h' : 'v',
    marker: { color: palette.accent, line: { color: palette.accent_alt, width: 1 } },
  }

  const layout = chartLayout(palette, {
    title: { text: title, font: { color: palette.text, size: 14 } },
    xaxis: { title: { text: xLabel } },
    yaxis: { title: { text: yLabel }, automargin: true },
    bargap: 0.3,
  } as Partial<Plotly.Layout>, height)

  return (
    <Plot
      data={[trace]}
      layout={layout as Plotly.Layout}
      config={plotConfig as Plotly.Config}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
