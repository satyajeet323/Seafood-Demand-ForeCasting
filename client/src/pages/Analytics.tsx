import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAppData } from '../hooks/useAppData'
import PageHeader from '../components/ui/PageHeader'
import Divider from '../components/ui/Divider'
import SectionHeading from '../components/ui/SectionHeading'
import InfoBox from '../components/ui/InfoBox'
import Spinner from '../components/ui/Spinner'
import LineChart from '../components/charts/LineChart'
import HeatmapChart from '../components/charts/HeatmapChart'

export default function Analytics() {
  const { palette } = useTheme()
  const { centers, items, historicalRows, loading } = useAppData()

  // ── Monthly demand trend ──────────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {}
    for (const row of historicalRows) {
      const month = row.date.slice(0, 7)
      map[month] = (map[month] ?? 0) + row.demand
    }
    const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
    return {
      months: sorted.map(([m]) => m),
      demand: sorted.map(([, v]) => v),
    }
  }, [historicalRows])

  // ── Build aggregation map once ────────────────────────────────────────────
  const demandMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    for (const row of historicalRows) {
      if (!map[row.center]) map[row.center] = {}
      map[row.center][row.item] = (map[row.center][row.item] ?? 0) + row.demand
    }
    return map
  }, [historicalRows])

  // ── Heatmap: all centers × all items ─────────────────────────────────────
  const { pivotZ, pivotX, pivotY } = useMemo(() => {
    const centerList = [...centers].sort()
    const itemList   = [...items].sort()
    const z = centerList.map(c =>
      itemList.map(it => demandMap[c]?.[it] ?? 0)
    )
    return { pivotZ: z, pivotX: itemList, pivotY: centerList }
  }, [centers, items, demandMap])

  // ── Pivot table ───────────────────────────────────────────────────────────
  const pivotTable = useMemo(() => {
    const centerList = [...centers].sort()
    const itemList   = [...items].sort()
    const data = centerList.map(c =>
      itemList.map(it => demandMap[c]?.[it] ?? 0)
    )
    // Max value for cell coloring
    const maxVal = Math.max(...data.flat().filter(v => v > 0), 1)
    return { centerList, itemList, data, maxVal }
  }, [centers, items, demandMap])

  if (loading) return <Spinner label="Loading analytics…" />

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Deep dive into historical performance by month, location, and species."
        icon="insights"
      />
      <Divider />

      {historicalRows.length === 0 ? (
        <InfoBox variant="warning">No historical data available for analytics.</InfoBox>
      ) : (
        <>
          <h2 className="text-base font-semibold mb-4" style={{ color: palette.text }}>
            Data Insights
          </h2>

          {/* Monthly Trend */}
          <div
            className="rounded-2xl p-1 mb-6"
            style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
          >
            <LineChart
              x={monthlyData.months}
              y={monthlyData.demand}
              title="Monthly Demand Trends"
              xLabel="Month"
              yLabel="Demand (kg)"
              height={380}
            />
          </div>

          {/* Heatmap */}
          <SectionHeading title="Center-Item Demand Matrix" icon="grid_on" />
          <div
            className="rounded-2xl p-1 mb-6"
            style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
          >
            <HeatmapChart
              z={pivotZ}
              x={pivotX}
              y={pivotY}
              title="Demand Heatmap: Center vs Item"
              height={Math.max(480, pivotY.length * 42 + 180)}
            />
          </div>

          {/* Pivot Table */}
          <SectionHeading title="Demand Table" icon="table_chart" />
          <div
            className="overflow-auto rounded-xl mb-6"
            style={{ border: `1px solid ${palette.border}`, maxHeight: 480 }}
          >
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr
                  className="sticky top-0 z-10"
                  style={{ background: palette.surface }}
                >
                  <th
                    className="px-3 py-2.5 text-left font-semibold whitespace-nowrap"
                    style={{
                      color: palette.muted,
                      borderBottom: `2px solid ${palette.border}`,
                      minWidth: 100,
                    }}
                  >
                    Center ╲ Item
                  </th>
                  {pivotTable.itemList.map(it => (
                    <th
                      key={it}
                      className="px-3 py-2.5 text-right font-semibold whitespace-nowrap"
                      style={{
                        color: palette.muted,
                        borderBottom: `2px solid ${palette.border}`,
                        minWidth: 90,
                      }}
                    >
                      {it}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pivotTable.centerList.map((c, ci) => {
                  const rowTotal = pivotTable.data[ci].reduce((s, v) => s + v, 0)
                  return (
                    <tr
                      key={c}
                      style={{
                        background: ci % 2 === 0 ? palette.surface : palette.background,
                      }}
                    >
                      {/* Center name */}
                      <td
                        className="px-3 py-2 font-semibold whitespace-nowrap"
                        style={{
                          color: palette.text,
                          borderBottom: `1px solid ${palette.border}`,
                        }}
                      >
                        {c}
                        <span
                          className="ml-2 text-[10px] font-normal"
                          style={{ color: palette.muted }}
                        >
                          {(rowTotal / 1e6).toFixed(1)}M kg
                        </span>
                      </td>

                      {/* Value cells */}
                      {pivotTable.data[ci].map((val, ii) => {
                        const intensity = val > 0 ? val / pivotTable.maxVal : 0
                        const bg = val > 0
                          ? `${palette.accent}${Math.round(intensity * 180 + 20).toString(16).padStart(2, '0')}`
                          : 'transparent'
                        const textColor = intensity > 0.55 ? '#ffffff' : palette.muted

                        return (
                          <td
                            key={ii}
                            className="px-3 py-2 text-right whitespace-nowrap font-medium"
                            style={{
                              background: bg,
                              color: val > 0 ? textColor : palette.border,
                              borderBottom: `1px solid ${palette.border}`,
                            }}
                            title={`${c} × ${pivotTable.itemList[ii]}: ${val.toLocaleString()} kg`}
                          >
                            {val > 0 ? (val >= 1e6
                              ? `${(val / 1e6).toFixed(1)}M`
                              : val >= 1000
                                ? `${(val / 1000).toFixed(0)}k`
                                : val.toFixed(0)
                            ) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
