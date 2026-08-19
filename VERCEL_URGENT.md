# 🚨 VERCEL FIX - "No such file or directory"

## Your Error
```
sh: line 1: cd: client: No such file or directory
Error: Command "cd client && npm run build" exited with 1
```

## ✅ Quick Fix (2 Minutes)

### Step 1: Push Configuration Fix
```bash
git add .
git commit -m "Fix: Vercel configuration"
git push origin main
```

### Step 2: Configure Vercel Correctly

When creating/editing your Vercel project:

**CRITICAL SETTING:**
```
Root Directory: client          ← Set this!
```

**Other Settings:**
```
Framework Preset:   Vite
Build Command:      npm run build       (auto-detect)
Output Directory:   dist                (auto-detect)
Install Command:    npm install         (auto-detect)
```

**Environment Variable:**
```
VITE_API_URL = https://your-backend.onrender.com
```

### Step 3: Deploy

Click "Deploy" - it will work now!

---

## 📋 Exact Steps in Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Your Project → Settings → General
3. **Root Directory:**
   - Click "Edit"
   - Enter: `client`
   - Save
4. Go to Deployments
5. Click "Redeploy" on latest deployment

OR delete project and create new one with correct settings.

---

## 🎯 Why This Works

The build command `cd client && npm run build` assumes you're in the root directory. But when Root Directory is set to `client`, Vercel already starts in the client directory, so `cd client` fails.

**Solution:** Set Root Directory to `client` and use simple commands like `npm run build`.

---

## ✅ Success Looks Like

Build log should show:
```
Cloning completed
Installing dependencies...
added 433 packages in 8s
Building...
> seafood-dashboard@0.0.0 build
> tsc -b && vite build
✓ built in 15s
Build Completed
Deployment Ready
```

---

## 🆘 If Still Failing

Try deleting and recreating:

1. Vercel Dashboard → Your Project → Settings
2. Scroll to bottom → Delete Project
3. Create New Project
4. **Set Root Directory to `client` from the start**
5. Add environment variable
6. Deploy

---

## 📞 Quick Reference

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment | `VITE_API_URL=<backend-url>` |

Deploy now! 🚀
