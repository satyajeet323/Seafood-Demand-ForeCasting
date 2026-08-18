# Jagdamba Fisheries — Demand Forecasting System

Full-stack application with a **FastAPI backend** and a **React + Vite frontend**.

```
project-root/
├── server/       ← Python FastAPI backend
│   ├── app/          FastAPI app + SimpleForecastEngine
│   ├── config/       config.yaml, model_config.yaml
│   ├── data/         raw CSV + processed parquet
│   ├── models/       trained .pkl files + registry
│   ├── monitoring/   drift detection & performance tracking
│   ├── scripts/      data pipeline, training, deployment
│   ├── tests/        unit + integration tests
│   ├── results/      training metrics JSON
│   ├── requirements.txt
│   └── run.py        ← start backend here
│
└── client/       ← React + Vite + TypeScript + Tailwind frontend
    ├── src/
    │   ├── pages/        Dashboard, ForecastGenerator, DataAnalyzer, Analytics
    │   ├── components/   UI primitives + chart wrappers
    │   ├── hooks/        useAppData (data fetching)
    │   ├── services/     api.ts (FastAPI client)
    │   ├── contexts/     ThemeContext (light/dark)
    │   └── utils/        chart helpers, forecast generator
    ├── vite.config.ts    dev proxy → localhost:8000
    ├── vercel.json       Vercel deployment config
    └── .env.example      VITE_API_URL for production
```

## Quick Start

### 1. Backend (server/)

```bash
cd server
pip install -r requirements.txt

# First time — run the data pipeline & train models:
python scripts/data_pipeline.py
python scripts/train_model.py

# Start the API server:
python run.py
# → http://localhost:8000
# → http://localhost:8000/docs
```

### 2. Frontend (client/)

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server automatically proxies `/api/*` to `http://localhost:8000`.

### 3. Run both together (Windows PowerShell)

```powershell
# Terminal 1
cd server; python run.py

# Terminal 2
cd client; npm run dev
```

## Production Deployment

- **Backend**: Deploy `server/` to Render / Railway / Fly.io
- **Frontend**: Deploy `client/` to Vercel
  - Set `VITE_API_URL=https://your-backend-url.com` in Vercel env vars
