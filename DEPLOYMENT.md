# Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. Deploy Backend First (Choose One Platform)

#### Option A: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: seafood-api (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Root Directory**: `server`
   - **Runtime**: Python 3
   - **Build Command**: `pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: 
     - `PYTHON_VERSION=3.11.0`
     - `CORS_ORIGINS=http://localhost:5173,http://localhost:5174`
5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Copy your deployed backend URL (e.g., `https://your-app.onrender.com`)

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select `server` folder as root
4. Railway auto-detects Python
5. Add environment variables if needed
6. Copy your deployed URL

#### Option C: Fly.io
```bash
cd server
fly launch
fly deploy
```

### 2. Deploy Frontend on Vercel

#### Option A: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as is (monorepo detected automatically)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (your backend URL from Step 1)

6. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from root directory
vercel

# Follow prompts:
# - Set root directory to current
# - Confirm settings
# - Add VITE_API_URL environment variable when prompted
```

### 3. Configure CORS on Backend

After deploying frontend, update your backend's CORS settings to include your Vercel domain:

In `server/app/main.py`, update:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://your-app.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app",          # Allow all Vercel preview deployments
],
```

Or use environment variable:
```python
import os
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then add `CORS_ORIGINS` to your backend environment variables:
```
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Check browser console for errors
3. Verify API calls are reaching your backend
4. Test all features

---

## 🔧 Troubleshooting

### Frontend shows "Network Error" or "API Error"
- ✅ Verify `VITE_API_URL` is set correctly in Vercel
- ✅ Check backend is running (visit backend URL directly)
- ✅ Verify CORS settings on backend include your Vercel domain
- ✅ Check browser console for specific error messages

### Build fails on Vercel
- ✅ Check build logs in Vercel dashboard
- ✅ Verify all dependencies are in package.json
- ✅ Test build locally: `cd client && npm run build`
- ✅ Check Node.js version compatibility

### Backend deployment issues
- ✅ Verify requirements.txt includes all dependencies
- ✅ Check logs on your hosting platform
- ✅ Ensure port is set correctly (use `$PORT` env variable)
- ✅ Verify Python version is 3.11+

---

## 📋 Environment Variables Reference

### Frontend (Vercel)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | Your backend URL | ✅ Yes |

### Backend (Render/Railway/Fly.io)
| Variable | Value | Required |
|----------|-------|----------|
| `PORT` | 8000 | Platform sets this |
| `CORS_ORIGINS` | Your frontend URL(s) | ✅ Yes |
| `PYTHON_VERSION` | 3.11 | Recommended |
| `DEBUG` | false | For production |

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is accessible via HTTPS
- [ ] Frontend loads without errors
- [ ] API calls work (check Network tab)
- [ ] All features function correctly
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] SSL certificates are valid
- [ ] Performance is acceptable

---

## 🔄 Continuous Deployment

Both Vercel and most backend platforms support automatic deployments:

- **Push to main branch** → Automatic production deployment
- **Push to other branches** → Preview deployments (Vercel)
- **Pull requests** → Automatic preview URLs

---

## 💡 Tips

1. **Use preview deployments**: Test changes before merging to main
2. **Monitor logs**: Check both frontend and backend logs regularly
3. **Set up alerts**: Configure error monitoring (Sentry, LogRocket, etc.)
4. **Cache management**: Clear cache if you see stale data
5. **API versioning**: Consider versioning your API for breaking changes

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Fly.io Docs: https://fly.io/docs
