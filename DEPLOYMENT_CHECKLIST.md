# 📋 Deployment Checklist

## Changes Made to Fix Render Issues ✅

- [x] Updated `server/runtime.txt` to Python 3.11.0
- [x] Simplified `server/requirements.txt` (removed scipy, matplotlib, prophet)
- [x] Updated all dependency versions to use prebuilt wheels
- [x] Fixed build command in `server/render.yaml`
- [x] Created deployment guides

## Your Deployment Steps

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Fix: Render deployment with Python 3.11.0"
git push origin main
```

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Fill in:

**Copy these exact values:**
```
Root Directory:  server
Build Command:   pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt
Start Command:   uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
```
PYTHON_VERSION = 3.11.0
CORS_ORIGINS = http://localhost:5173,http://localhost:5174
```

5. Click "Create Web Service"
6. Wait 3-5 minutes
7. **COPY YOUR URL**: `https://__________.onrender.com`

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:

```
Framework: Vite
Root Directory: ./
Build Command: cd client && npm run build
Output Directory: client/dist
Install Command: cd client && npm install
```

4. Add Environment Variable:
```
VITE_API_URL = [paste your Render URL here - NO trailing slash]
```

5. Click "Deploy"
6. Wait 2-3 minutes

### Step 4: Update CORS

1. Go back to Render
2. Find your service → Environment tab
3. Update `CORS_ORIGINS`:
```
http://localhost:5173,http://localhost:5174,https://your-vercel-app.vercel.app
```
4. Save (auto-redeploys)

### Step 5: Test Everything

- [ ] Backend health: `https://your-backend.onrender.com/health`
- [ ] API docs: `https://your-backend.onrender.com/docs`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Dashboard shows data
- [ ] Forecast generation works
- [ ] No console errors

## Quick Copy-Paste Reference

### Render Build Command
```
pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt
```

### Render Start Command
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables for Render
```
PYTHON_VERSION=3.11.0
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-app.vercel.app
```

### Environment Variable for Vercel
```
VITE_API_URL=https://your-backend.onrender.com
```

## Estimated Time

- Backend deployment: 3-5 minutes
- Frontend deployment: 2-3 minutes
- Total: ~10 minutes

## Need Help?

- **Backend won't build**: Check `server/RENDER_FIX.md`
- **Frontend can't connect**: Verify `VITE_API_URL` is set correctly
- **CORS errors**: Update `CORS_ORIGINS` to include your Vercel URL
- **Detailed guides**: See `VERCEL_DEPLOY.md` and `DEPLOYMENT.md`

---

**Status**: ⏳ Ready to deploy!

Push changes to GitHub and follow Step 2 above. 🚀
