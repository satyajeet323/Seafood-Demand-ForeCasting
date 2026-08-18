import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ForecastGenerator from './pages/ForecastGenerator'
import DataAnalyzer from './pages/DataAnalyzer'
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/forecast"  element={<ForecastGenerator />} />
            <Route path="/analyzer"  element={<DataAnalyzer />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
