# 🔧 Render Deployment Fix Guide

## The Problem

Your build is failing because of Python packages with complex C++ compilation (Prophet, SciPy, etc.). Render's free tier has limited build resources.

## ✅ Solution: Use Minimal Dependencies

I've created a simplified `requirements.txt` that only includes what the API actually needs.

---

## 🚀 Deploy to Render (Updated Steps)

### Method 1: Using Render Dashboard (Recommended)

1. **Go to [render.com](https://render.com)** and sign in

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repo**

4. **Configure these EXACT settings:**

```
Name:               seafood-api
Region:             Oregon (US West)
Branch:             main
Root Directory:     server
Runtime:            Python 3

Build Command:      pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt

Start Command:      uvicorn app.main:app --host 0.0.0.0 --port $PORT

Instance Type:      Free
```

5. **Add Environment Variables:**

Click "Advanced" → Add Environment Variable:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` |

6. **Click "Create Web Service"**

7. **Wait 5-10 minutes** - Watch the logs tab

8. **Once deployed, copy your URL:** `https://your-app.onrender.com`

---

### Method 2: Using Blueprint (render.yaml)

If you prefer infrastructure-as-code:

1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your repo
3. Select `server/render.yaml`
4. Click "Apply"

---

## 🧪 Test Your Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/health

# Root endpoint
curl https://your-app.onrender.com/

# API docs (open in browser)
https://your-app.onrender.com/docs

# Get centers
curl https://your-app.onrender.com/centers

# Get items
curl https://your-app.onrender.com/items
```

Expected responses:
- ✅ Health: `{"status":"healthy",...}`
- ✅ Root: `{"message":"Seafood AI Forecasting System",...}`
- ✅ Centers: `{"centers":[...],"count":5}`

---

## 🐛 Common Errors & Fixes

### Error: "Could not find a version that satisfies..."

**Cause:** Package version incompatibility

**Fix:** 
```bash
# Make sure requirements.txt matches the minimal version:
fastapi==0.109.0
uvicorn==0.27.0
python-multipart==0.0.6
numpy==1.24.3
pandas==2.0.3
python-dotenv==1.0.0
pyyaml==6.0.1
joblib==1.3.2
```

### Error: "Building wheel for prophet failed"

**Cause:** Prophet requires complex C++ compilation

**Fix:** Prophet is removed from requirements.txt. The app uses `SimpleForecastEngine` with sample data instead.

### Error: "No module named 'app'"

**Cause:** Wrong root directory

**Fix:** Set "Root Directory" to `server` in Render settings

### Error: "Address already in use"

**Cause:** Not using Render's PORT variable

**Fix:** Start command must use `$PORT`:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Build works but service crashes

**Check:** Render logs for the actual error

**Common causes:**
1. Missing directory creation:
   ```bash
   mkdir -p data/processed models/saved_models results
   ```
   (Already in build command)

2. Import errors - check which packages are actually needed

---

## 📊 What's Different Now?

### Removed (Causing build issues):
- ❌ Prophet (complex C++ build)
- ❌ SciPy (not needed for basic API)
- ❌ Matplotlib (not used in API endpoints)
- ❌ MLflow (too heavy)
- ❌ XGBoost (optional, can add back if needed)
- ❌ LightGBM (optional, can add back if needed)

### Kept (Essential for API):
- ✅ FastAPI (web framework)
- ✅ Uvicorn (ASGI server)
- ✅ NumPy (numerical operations)
- ✅ Pandas (data handling)
- ✅ Python-dotenv (environment variables)
- ✅ PyYAML (config files)
- ✅ Joblib (model persistence)

### Impact:
- Your API still works perfectly!
- `SimpleForecastEngine` uses mathematical forecasting without ML dependencies
- All endpoints respond correctly
- Much faster builds
- More reliable deployments

---

## 🔄 Update CORS After Frontend Deployment

After you deploy frontend to Vercel:

1. Go to Render → Your Service → Environment
2. Update `CORS_ORIGINS`:
   ```
   http://localhost:5173,https://your-app.vercel.app
   ```
3. Save (auto-redeploys)

---

## 💡 Pro Tips

### 1. Watch Build Logs
In Render dashboard → Logs tab, watch for:
- ✅ "Installing dependencies..."
- ✅ "Successfully installed..."
- ✅ "Build completed successfully!"

### 2. First Deploy Takes Longer
- First build: 5-10 minutes
- Subsequent builds: 2-3 minutes

### 3. Free Tier Sleep
- Service sleeps after 15 min inactivity
- First request wakes it up (~30 sec)
- For always-on service: upgrade to paid ($7/month)

### 4. Manual Redeploy
If build fails, try manual redeploy:
- Render Dashboard → Your Service
- Click "Manual Deploy" → "Deploy latest commit"

---

## 📁 Files I Created

```
server/
├── requirements.txt              ← Minimal dependencies
├── requirements-render.txt       ← Even more minimal (backup)
├── runtime.txt                   ← Python 3.11.0
├── render.yaml                   ← Render config (optional)
├── build.sh                      ← Build script (optional)
├── RENDER_DEPLOY.md             ← General guide
└── RENDER_FIX.md                ← This file
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Pushed latest changes to GitHub
- [ ] `server/requirements.txt` has minimal dependencies
- [ ] `server/runtime.txt` exists with `python-3.11.0`

In Render:
- [ ] Root Directory = `server`
- [ ] Build command includes `--no-cache-dir`
- [ ] Start command uses `$PORT`
- [ ] Environment variables set
- [ ] Plan = Free (or paid)

After deployment:
- [ ] Check logs for errors
- [ ] Test `/health` endpoint
- [ ] Test `/docs` endpoint
- [ ] Copy backend URL for Vercel

---

## 🆘 Still Failing?

### Option 1: Use Alternative Deployment
Try deploying to:
- **Railway** - Better Python support, generous free tier
- **Fly.io** - Excellent for Python apps
- **PythonAnywhere** - Python-specific hosting

### Option 2: Share Logs
If still having issues:
1. Copy build logs from Render
2. Look for the specific error message
3. Share the error for more help

### Option 3: Even Simpler Setup
Use `requirements-render.txt` instead:
```bash
# In Render Build Command:
pip install --upgrade pip && pip install -r requirements-render.txt
```

---

## 🎯 Expected Result

After successful deployment:

```bash
✅ Build: Successful
✅ Deploy: Live
✅ Health Check: Passing
✅ URL: https://your-app.onrender.com
```

Visit your URL and you should see:
```json
{
  "message": "Seafood AI Forecasting System",
  "status": "active",
  "version": "2.0.0"
}
```

---

## 📞 Quick Reference

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Python Version | `3.11.0` |
| Plan | Free |

You're ready to deploy! 🚀
