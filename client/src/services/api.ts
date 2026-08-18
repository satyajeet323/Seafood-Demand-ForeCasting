/**
 * API service — communicates with the FastAPI backend.
 *
 * In development:  Vite proxies /api → http://localhost:8000
 * In production:   Set VITE_API_URL env var to your deployed backend URL
 *                  e.g. https://your-backend.onrender.com
 */
const PROD_BASE = import.meta.env.VITE_API_URL ?? ''
const BASE = PROD_BASE ? `${PROD_BASE}` : '/api'

export interface ForecastPoint {
  date: string
  forecast: number
  lower_bound: number
  upper_bound: number
  confidence: number
}

export interface ForecastResponse {
  center: string
  item: string
  forecast_days: number
  model_used: string
  generated_at: string
  forecasts: Record<string, Record<string, ForecastPoint[]>>
}

export interface CentersResponse { centers: string[]; count: number }
export interface ItemsResponse   { items: string[];   count: number }
export interface HealthResponse  { status: string; timestamp: string; engine_ready: boolean }

export interface AnalysisResponse {
  total_records: number
  columns: string[]
  date_range: { start: string; end: string } | null
  centers: string[]
  products: string[]
  total_demand: number
  recommendations: string[]
  status: string
  error?: string
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  health: () =>
    get<HealthResponse>('/health'),

  centers: () =>
    get<CentersResponse>('/centers'),

  items: (center?: string) =>
    get<ItemsResponse>(`/items${center ? `?center=${encodeURIComponent(center)}` : ''}`),

  forecast: (center: string, item: string, days = 30, model = 'xgboost') =>
    get<ForecastResponse>(
      `/forecast?center=${encodeURIComponent(center)}&item=${encodeURIComponent(item)}&days=${days}&model=${model}`
    ),

  analyzeData: async (file: File): Promise<AnalysisResponse> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`${BASE}/analyze-data`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error(`HTTP ${res.status}: /analyze-data`)
    return res.json() as Promise<AnalysisResponse>
  },
}
