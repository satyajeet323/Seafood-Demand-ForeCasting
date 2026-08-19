# 🚀 Render Deployment Guide

## Quick Setup

### Step 1: Configure Render Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in these settings:

```
Name:               seafood-api
Region:             Oregon (US West) or closest to you
Branch:             main
Root Directory:     server
Runtime:            Python 3
Build Command:      pip install --upgrade pip setuptools wheel && pip install --no-cache-dir -r requirements.txt
Start Command:      uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 2: Add Environment Variables

In the "Environment" section, add:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` |

### Step 3: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Check logs for any errors
4. Once deployed, copy your URL: `https://your-service.onrender.com`

### Step 4: Update CORS After Frontend Deployment

After deploying your frontend to Vercel:

1. Go to Render dashboard → Your service
2. Environment tab
3. Update `CORS_ORIGINS`:
   ```
   http://localhost:5173,http://localhost:5174,https://your-app.vercel.app
   ```
4. Save (service will auto-redeploy)

---

## 🐛 Troubleshooting

### Build fails with "Could not find a version that satisfies..."

**Solution**: The `requirements.txt` has been updated with compatible versions. Make sure you're using the latest version from your repo.

### "No module named 'app'"

**Solution**: Ensure "Root Directory" is set to `server` in Render settings.

### Port binding errors

**Solution**: Use `$PORT` environment variable (already in start command):
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Service keeps crashing

**Check logs** in Render dashboard. Common issues:
- Missing dependencies
- Python version mismatch
- Port configuration

### "alfires" version error

**Solution**: Already fixed in updated `requirements.txt`. The issue was with incompatible `mlflow` and `prophet` versions.

---

## 📊 Verifying Deployment

### Test Backend Directly

1. Visit: `https://your-service.onrender.com`
   - Should return: `{"message": "Seafood AI Forecasting System", ...}`

2. Visit: `https://your-service.onrender.com/docs`
   - Should show Swagger API documentation

3. Test health endpoint: `https://your-service.onrender.com/health`
   - Should return: `{"status": "healthy", ...}`

4. Test centers endpoint: `https://your-service.onrender.com/centers`
   - Should return list of centers

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically detects changes
4. New deployment starts automatically
5. Check logs to verify success

---

## 💡 Tips

1. **Free tier sleeps after 15 minutes** of inactivity
   - First request takes ~30 seconds to wake up
   - Consider upgrading for production use

2. **Check logs regularly**
   - Render Dashboard → Your Service → Logs
   - Helps identify issues quickly

3. **Use environment variables** for sensitive data
   - Never commit API keys or secrets
   - Use Render's environment variable manager

4. **Monitor usage**
   - Free tier: 750 hours/month
   - Paid tier: $7/month for always-on service

---

## 📁 Files Created for Render

- `runtime.txt` - Specifies Python version
- `render.yaml` - Render configuration (optional)
- `build.sh` - Build script (optional)
- `requirements.txt` - Updated with compatible versions

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Repository connected
- [ ] Root directory set to `server`
- [ ] Environment variables added
- [ ] Build command configured
- [ ] Start command configured
- [ ] Service deployed successfully
- [ ] Backend URL copied
- [ ] Tested all endpoints
- [ ] Ready for frontend deployment

---

## 🆘 Still Having Issues?

1. Check Render logs for specific error messages
2. Verify all environment variables are set
3. Ensure Python version is 3.11.9
4. Make sure Root Directory is `server`
5. Try manual redeploy from Render dashboard

If issues persist, share the error logs for more specific help!
