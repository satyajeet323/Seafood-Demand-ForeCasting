export interface ForecastPoint {
  date: string; forecast: number
  lower_bound: number; upper_bound: number; confidence: number
}

export function generateForecast(
  centers: string[], items: string[], days: number, model: string
): Record<string, Record<string, ForecastPoint[]>> {
  const result: Record<string, Record<string, ForecastPoint[]>> = {}
  const now = new Date()

  for (const center of centers) {
    result[center] = {}
    for (const item of items) {
      const pts: ForecastPoint[] = []
      for (let i = 0; i < days; i++) {
        const d = new Date(now)
        d.setDate(d.getDate() + i + 1)
        const upper = item.toUpperCase()
        let base = 1000
        if (upper.includes('CHILAPI'))    base = 1500 + Math.sin(i * 0.2) * 300
        else if (upper.includes('MIX FISH')) base = 2000 + Math.sin(i * 0.15) * 400
        else if (upper.includes('PRAWN'))    base = 800  + Math.sin(i * 0.25) * 200
        else if (upper.includes('MUNDI'))    base = 600  + Math.sin(i * 0.3) * 150
        else                              base = 1000 + Math.sin(i * 0.1) * 200

        if (d.getDay() >= 5) base *= 1.2
        const m = d.getMonth() + 1
        if (m >= 3 && m <= 6) base *= 1.3

        const noise = (Math.random() - 0.5) * 200
        const val = Math.max(100, base + noise)
        pts.push({
          date: d.toISOString().slice(0, 10),
          forecast: +val.toFixed(2),
          lower_bound: +(val * 0.85).toFixed(2),
          upper_bound: +(val * 1.15).toFixed(2),
          confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
        })
      }
      result[center][item] = pts
    }
  }
  return result
}

export function csvFromPoints(pts: ForecastPoint[]): string {
  const header = 'date,forecast,lower_bound,upper_bound,confidence'
  const rows = pts.map(p =>
    `${p.date},${p.forecast},${p.lower_bound},${p.upper_bound},${p.confidence}`
  )
  return [header, ...rows].join('\n')
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
