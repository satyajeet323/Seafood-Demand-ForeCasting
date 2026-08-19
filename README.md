# Jagdamba Fisheries — Demand Forecasting System

Full-stack application with a **FastAPI backend** and a **React + Vite frontend**.

```
project-root/
├── .env.example  ← Environment variables for both frontend & backend
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

**⚡ Quick Start:** See [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) for simplified 3-step deployment.

**📋 Full Guide:** See [`DEPLOYMENT_SUMMARY.md`](DEPLOYMENT_SUMMARY.md) for complete deployment information.

### Backend Options:
- **Render** (recommended) - See `server/RENDER_FIX.md` for detailed guide
- **Railway** - Good Python support
- **Fly.io** - Excellent for Python apps

### Frontend:
- **Vercel** - See `VERCEL_DEPLOY.md` for step-by-step guide
- Set `VITE_API_URL=https://your-backend-url.com` in environment variables
