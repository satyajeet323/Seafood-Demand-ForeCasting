import { useState, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
import Divider from '../components/ui/Divider'
import SectionHeading from '../components/ui/SectionHeading'
import MetricCard from '../components/ui/MetricCard'
import InfoBox from '../components/ui/InfoBox'
import Spinner from '../components/ui/Spinner'
import MatIcon from '../components/ui/MatIcon'
import { api, type AnalysisResponse } from '../services/api'

interface ParsedRow { [key: string]: string | number }

export default function DataAnalyzer() {
  const { palette } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)

  const [analysis,   setAnalysis]   = useState<AnalysisResponse | null>(null)
  const [previewRows, setPreviewRows] = useState<ParsedRow[]>([])
  const [previewCols, setPreviewCols] = useState<string[]>([])
  const [analyzing,  setAnalyzing]  = useState(false)
  const [fileName,   setFileName]   = useState('')
  const [dragOver,   setDragOver]   = useState(false)
  const [err,        setErr]        = useState('')

  async function processFile(file: File) {
    if (!file.name.endsWith('.csv')) { setErr('Only CSV files are supported.'); return }
    setFileName(file.name); setErr(''); setAnalyzing(true)
    setAnalysis(null); setPreviewRows([]); setPreviewCols([])
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(Boolean)
      if (lines.length > 1) {
        const cols = lines[0].split(',').map(c => c.trim().replace(/"/g, ''))
        const rows = lines.slice(1, 201).map(line => {
          const vals = line.split(',')
          const obj: ParsedRow = {}
          cols.forEach((c, i) => { obj[c] = vals[i]?.trim().replace(/"/g, '') ?? '' })
          return obj
        })
        setPreviewCols(cols); setPreviewRows(rows)
      }
      const result = await api.analyzeData(file)
      setAnalysis(result)
    } catch {
      // Fallback: parse locally
      try {
        const text = await file.text()
        const lines = text.split('\n').filter(Boolean)
        const cols = lines[0].split(',').map(c => c.trim())
        setAnalysis({
          total_records: lines.length - 1, columns: cols,
          date_range: null, centers: [], products: [],
          total_demand: 0, status: 'success',
          recommendations: [
            'Data uploaded successfully.',
            `${lines.length - 1} records found.`,
            'API offline — running local analysis.',
          ],
        })
      } catch { setErr('Failed to parse file.') }
    } finally { setAnalyzing(false) }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function clearFile() {
    setAnalysis(null); setPreviewRows([]); setPreviewCols([])
    setFileName(''); setErr('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <PageHeader title="Data Analyzer"
        subtitle="Explore uploaded operational data and activate forecasting workflows."
        icon="database" />
      <Divider />

      <SectionHeading title="Upload Data for Analysis" icon="cloud_upload" />

      {/* Drop zone */}
      <div
        className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
        style={{
          borderColor: dragOver ? palette.accent : palette.border,
          background: dragOver ? palette.accent + '0d' : palette.surface,
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <MatIcon name="cloud_upload" className="text-5xl mb-2" style={{ color: palette.accent } as React.CSSProperties} />
        <p className="font-semibold" style={{ color: palette.text }}>
          Drag & drop a CSV file here, or click to browse
        </p>
        <p className="text-sm mt-1" style={{ color: palette.muted }}>Supports .csv files</p>
        {fileName && (
          <p className="text-sm mt-2 font-medium" style={{ color: palette.accent }}>
            Selected: {fileName}
          </p>
        )}
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      </div>

      {err && <p className="text-red-500 text-sm mt-2">{err}</p>}

      {analyzing && <Spinner label="Analyzing file…" />}

      {analysis && !analyzing && (
        <>
          <InfoBox variant="success" className="mt-4">
            Data analyzed successfully. &nbsp;
            <button onClick={clearFile} className="underline text-xs ml-2" style={{ color: palette.muted }}>
              Clear / Upload new
            </button>
          </InfoBox>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <MetricCard label="Total Records"  value={analysis.total_records.toLocaleString()} />
            <MetricCard label="Total Demand"   value={analysis.total_demand ? `${analysis.total_demand.toLocaleString()} kg` : 'N/A'} />
            <MetricCard label="Locations"      value={analysis.centers.length || 'N/A'} />
            <MetricCard label="Products"       value={analysis.products.length || 'N/A'} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
            {/* Left */}
            <div>
              {analysis.date_range && (
                <InfoBox variant="info" className="mb-3">
                  <strong>Date Range</strong><br />
                  {analysis.date_range.start} → {analysis.date_range.end}
                </InfoBox>
              )}
              {analysis.centers.length > 0 && (
                <div className="rounded-xl p-4 mb-3"
                  style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: palette.text }}>
                    Locations detected ({analysis.centers.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.centers.slice(0, 15).map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: palette.accent + '1a', color: palette.accent }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right */}
            <div>
              {analysis.products.length > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: palette.text }}>
                    Products detected ({analysis.products.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.products.slice(0, 15).map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: palette.accent_alt + '1a', color: palette.accent_alt }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <>
              <SectionHeading title="Recommendations" icon="task_alt" />
              <ul className="space-y-1.5">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: palette.text }}>
                    <span className="mat-icon text-base" style={{ color: palette.accent }}>task_alt</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Data preview table */}
          {previewRows.length > 0 && (
            <>
              <SectionHeading title="Uploaded Data Preview" icon="table_chart" />
              <div className="overflow-auto rounded-xl" style={{ border: `1px solid ${palette.border}`, maxHeight: 320 }}>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ background: palette.surface }}>
                      {previewCols.map(c => (
                        <th key={c} className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                          style={{ color: palette.muted, borderBottom: `1px solid ${palette.border}` }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? palette.surface : palette.background }}>
                        {previewCols.map(c => (
                          <td key={c} className="px-3 py-1.5 whitespace-nowrap"
                            style={{ color: palette.text, borderBottom: `1px solid ${palette.border}` }}>
                            {String(row[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {!analysis && !analyzing && !fileName && (
        <InfoBox variant="neutral" className="mt-6">
          Please upload a CSV file to analyze.
        </InfoBox>
      )}
    </div>
  )
}
