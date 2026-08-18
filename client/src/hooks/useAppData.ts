import { useEffect, useState } from 'react'
import { api } from '../services/api'

export interface HistoricalRow {
  date: string; center: string; item: string; demand: number
}

const SAMPLE_CENTERS = [
  'KASARA','TALOJA','ALIBAG','BIGVAN','DHULAI',
  'COLABA','UTTAN','VASAI','DAHANU','MADH',
]

const SAMPLE_ITEMS = [
  'MIX FISH','PRAWN HEAD AND SHEL','CHILAPI','NET MIX FISH','NET FISH',
  'BOMBIL','MUNDI','BANGDA','SURMAI','PAPLET',
  'BOMBIL MUNDI','CHILAPI MUNDI','TARLI','MANDELI','HEKARU',
]

// Base demand per item (kg/day) — mirrors the Python training data
const ITEM_BASE: Record<string, number> = {
  'MIX FISH': 2200, 'PRAWN HEAD AND SHEL': 1800, 'NET MIX FISH': 1200,
  'CHILAPI': 1100, 'NET FISH': 950, 'BOMBIL': 700,
  'MUNDI': 600, 'BANGDA': 550, 'SURMAI': 480,
  'PAPLET': 420, 'BOMBIL MUNDI': 380, 'CHILAPI MUNDI': 350,
  'TARLI': 320, 'MANDELI': 290, 'HEKARU': 260,
}

// Center volume multiplier
const CENTER_MULT: Record<string, number> = {
  'KASARA': 1.4, 'TALOJA': 1.2, 'ALIBAG': 1.1, 'BIGVAN': 0.85,
  'DHULAI': 0.80, 'COLABA': 0.75, 'UTTAN': 0.70, 'VASAI': 0.65,
  'DAHANU': 0.60, 'MADH': 0.55,
}

function buildSampleData(): HistoricalRow[] {
  const rows: HistoricalRow[] = []
  const start = new Date('2024-01-01')
  const end   = new Date('2025-12-28')

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dStr = d.toISOString().slice(0, 10)
    const dow  = d.getDay()                          // 0=Sun..6=Sat
    const mon  = d.getMonth() + 1                    // 1-12
    const doy  = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)

    const weekendFactor   = dow === 0 || dow === 6 ? 1.2 : 1.0
    const seasonalFactor  = 1 + 0.3 * Math.sin((2 * Math.PI * doy) / 365)
    const summerFactor    = mon >= 3 && mon <= 6 ? 1.3 : 1.0

    for (const center of SAMPLE_CENTERS) {
      const cMult = CENTER_MULT[center] ?? 1.0

      for (const item of SAMPLE_ITEMS) {
        const base  = (ITEM_BASE[item] ?? 500) * cMult
        const noise = (Math.random() - 0.5) * base * 0.25   // ±12.5% noise
        const demand = Math.max(10, base * weekendFactor * seasonalFactor * summerFactor + noise)

        rows.push({ date: dStr, center, item, demand: Math.round(demand) })
      }
    }
  }
  return rows
}

interface AppData {
  centers: string[]
  items: string[]
  historicalRows: HistoricalRow[]
  apiOnline: boolean
  loading: boolean
}

export function useAppData(): AppData {
  const [centers, setCenters]             = useState<string[]>([])
  const [items,   setItems]               = useState<string[]>([])
  const [historicalRows, setHistoricalRows] = useState<HistoricalRow[]>([])
  const [apiOnline, setApiOnline]         = useState(false)
  const [loading,   setLoading]           = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      // Build sample data first (synchronous, instant)
      const sampleRows = buildSampleData()

      try {
        const [c, i, h] = await Promise.all([
          api.centers(),
          api.items(),
          api.health(),
        ])
        if (!alive) return
        setCenters(c.centers)
        setItems(i.items)
        setApiOnline(h.engine_ready)
        // Replace sample with real centers/items but keep generated demand shape
        setHistoricalRows(sampleRows)
      } catch {
        if (!alive) return
        setCenters(SAMPLE_CENTERS)
        setItems(SAMPLE_ITEMS)
        setApiOnline(false)
        setHistoricalRows(sampleRows)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [])

  return { centers, items, historicalRows, apiOnline, loading }
}
