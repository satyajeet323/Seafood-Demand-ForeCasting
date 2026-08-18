import Plot from 'react-plotly.js'
import { useTheme } from '../../contexts/ThemeContext'
import { chartLayout, plotConfig } from '../../utils/chart'

interface Props {
  x: string[]; y: number[]
  title: string; xLabel?: string; yLabel?: string; height?: number
}

export default function LineChart({ x, y, title, xLabel, yLabel, height = 380 }: Props) {
  const { palette } = useTheme()

  const trace: Plotly.Data = {
    x, y, type: 'scatter', mode: 'lines+markers',
    line: { color: palette.accent, width: 2 },
    marker: { color: palette.accent, size: 6 },
  }

  const layout = chartLayout(palette, {
    title: { text: title, font: { color: palette.text, size: 14 } },
    xaxis: { title: { text: xLabel } },
    yaxis: { title: { text: yLabel } },
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
