# 🚀 Quick Vercel Deployment Guide

## ⚡ TL;DR

1. **Deploy Backend** → Render/Railway (Python FastAPI cannot run on Vercel)
2. **Get backend URL** → Copy it
3. **Deploy Frontend** → Vercel (follow steps below)
4. **Set environment variable** → Add `VITE_API_URL` in Vercel

---

## 📦 Step 1: Deploy Backend (5 minutes)

### Using Render (Easiest):
1. Visit [render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Connect GitHub → Select your repo
4. Settings:
   ```
   Name: seafood-backend (or any name)
   Region: Choose closest to you
   Root Directory: server
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. Add Environment Variable:
   ```
   PYTHON_VERSION = 3.11
   ```
6. Click "Create Web Service"
7. **COPY THE URL** (e.g., `https://seafood-backend.onrender.com`)

---

## 🌐 Step 2: Deploy Frontend on Vercel (3 minutes)

### Method A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub

2. Click "Add New..." → "Project"

3. Import your repository

4. Configure Build Settings:
   ```
   Framework Preset: Vite
   Root Directory: ./           (leave as is)
   Build Command: cd client && npm run build
   Output Directory: client/dist
   Install Command: cd client && npm install
   ```

5. **IMPORTANT**: Add Environment Variable:
   ```
   Name:  VITE_API_URL
   Value: https://seafood-backend.onrender.com
   ```
   (Use YOUR backend URL from Step 1, NO trailing slash)

6. Click "Deploy" → Wait 2-3 minutes

7. Visit your deployed site!

### Method B: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project name? seafood-forecasting
# - In which directory is your code? ./
# - Want to modify settings? Yes
#   - Build Command: cd client && npm run build
#   - Output Directory: client/dist
#   - Development Command: cd client && npm run dev

# Add environment variable
vercel env add VITE_API_URL production
# Paste your backend URL when prompted

# Deploy to production
vercel --prod
```

---

## 🔧 Step 3: Update Backend CORS (1 minute)

After frontend is deployed, update backend to allow your Vercel domain:

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add/Update:
   ```
   CORS_ORIGINS = http://localhost:5173,https://your-app.vercel.app
   ```
   (Replace `your-app.vercel.app` with your actual Vercel domain)

5. Save → Backend will auto-redeploy

---

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Open browser DevTools (F12) → Console tab
3. Check for errors
4. Test forecast generation
5. Verify data loads correctly

### Expected Result:
- ✅ Dashboard loads
- ✅ API calls succeed (check Network tab)
- ✅ No CORS errors
- ✅ Forecasts generate successfully

---

## 🐛 Common Issues & Fixes

### "API Error: Network Error"
**Fix**: Check `VITE_API_URL` is set correctly in Vercel environment variables (no trailing slash)

### "CORS Policy Error"
**Fix**: Update `CORS_ORIGINS` on backend to include your Vercel domain

### "Module not found" during build
**Fix**: Ensure all dependencies are in `client/package.json`

### Backend shows 500 error
**Fix**: Check backend logs in Render dashboard → Logs tab

---

## 🎯 Your URLs After Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| Backend | `https://seafood-backend.onrender.com` | API Server |
| Frontend | `https://your-app.vercel.app` | User Interface |
| API Docs | `https://seafood-backend.onrender.com/docs` | Swagger UI |

---

## 🔄 Future Updates

After initial deployment, updates are automatic:

1. **Push to GitHub** → Vercel auto-deploys frontend
2. **Push to GitHub** → Render auto-deploys backend
3. **No manual steps needed!**

---

## 💰 Cost

- **Vercel**: Free (Hobby plan)
- **Render**: Free tier available (sleeps after 15 min inactivity)
- **Total**: $0/month for hobby projects

**Pro Tip**: Render's free tier sleeps after inactivity. First request takes ~30 seconds to wake up. Consider upgrading to paid tier ($7/month) for production use.

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python version is 3.11+ |
| Frontend won't build | Run `cd client && npm run build` locally first |
| API not connecting | Verify VITE_API_URL in Vercel settings |
| CORS errors | Add Vercel domain to backend CORS_ORIGINS |

---

## Next Steps

- [ ] Deploy backend to Render
- [ ] Copy backend URL
- [ ] Deploy frontend to Vercel
- [ ] Set VITE_API_URL environment variable
- [ ] Update backend CORS settings
- [ ] Test deployment
- [ ] Share your app! 🎉
