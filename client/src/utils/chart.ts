import type { Layout, Config } from 'plotly.js'

export function hexToRgba(hex: string, alpha = 1): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return `rgba(0,0,0,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function chartLayout(
  palette: Record<string, string>,
  overrides: Partial<Layout> = {},
  height = 400,
): Partial<Layout> {
  return {
    height,
    plot_bgcolor: palette.plot_bg ?? palette.surface,
    paper_bgcolor: palette.paper_bg ?? palette.surface,
    font: { color: palette.text, size: 12, family: 'Inter, sans-serif' },
    hovermode: 'x unified',
    legend: {
      bgcolor: palette.paper_bg ?? palette.surface,
      bordercolor: palette.border,
      borderwidth: 1,
      font: { color: palette.text },
    },
    margin: { l: 50, r: 20, t: 60, b: 50 },
    xaxis: {
      showgrid: true, gridcolor: palette.grid,
      linecolor: palette.border, zeroline: false,
      showline: true, tickfont: { color: palette.muted },
      title: { font: { color: palette.text } },
    },
    yaxis: {
      showgrid: true, gridcolor: palette.grid,
      linecolor: palette.border, zeroline: false,
      showline: true, tickfont: { color: palette.muted },
      title: { font: { color: palette.text } },
    },
    ...overrides,
  } as Partial<Layout>
}

export const plotConfig: Partial<Config> = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'select2d'],
  responsive: true,
}
