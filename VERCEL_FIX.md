# 🔧 Vercel Deployment Fix

## The Problem

Error: `cd: client: No such file or directory`

This happens because Vercel's build command was trying to `cd client` but the build context was already in the client directory or wrong directory.

## ✅ The Solution

I've fixed the configuration files. Now you have **two options**:

---

## Option 1: Deploy Client Directory Only (Recommended)

### Step 1: Configure Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your repository
4. **IMPORTANT:** Set Root Directory to `client`

### Step 2: Configure Build Settings

```
Framework Preset:   Vite
Root Directory:     client          ← IMPORTANT!
Build Command:      npm run build   (or leave blank for auto-detect)
Output Directory:   dist            (or leave blank for auto-detect)
Install Command:    npm install     (or leave blank for auto-detect)
```

### Step 3: Add Environment Variable

```
Name:   VITE_API_URL
Value:  https://your-backend.onrender.com
```

**⚠️ Use your actual Render backend URL, NO trailing slash**

### Step 4: Deploy

Click "Deploy" and wait 2-3 minutes.

---

## Option 2: Deploy from Project Root

If you want to deploy from the root directory:

### Step 1: Configure Vercel Dashboard

1. Import your repository
2. **Root Directory:** Leave blank (use root)

### Step 2: Override Build Settings

```
Framework Preset:   Vite
Build Command:      cd client && npm run build
Output Directory:   client/dist
Install Command:    cd client && npm install
```

### Step 3: Add Environment Variable

```
Name:   VITE_API_URL
Value:  https://your-backend.onrender.com
```

### Step 4: Deploy

---

## 🧪 Verify Configuration

The root `vercel.json` and `client/vercel.json` have been updated. After pushing changes:

```bash
git add vercel.json client/vercel.json
git commit -m "Fix: Update Vercel configuration"
git push origin main
```

Then redeploy on Vercel.

---

## 🐛 Troubleshooting

### Error: "cd: client: No such file or directory"

**Fix:** Set Root Directory to `client` in Vercel dashboard

### Error: "Cannot find module"

**Fix:** Ensure Install Command is correct:
- If Root Directory is `client`: `npm install`
- If Root Directory is root: `cd client && npm install`

### Build succeeds but 404 on routes

**Fix:** Already fixed in `vercel.json` with rewrites config

### API calls fail with CORS error

**Fix:** 
1. Verify `VITE_API_URL` is set correctly
2. Update backend CORS to include Vercel domain

---

## 📋 Step-by-Step Vercel Deploy

### Using Vercel Dashboard (Easiest)

1. **Push latest changes:**
   ```bash
   git add .
   git commit -m "Fix: Vercel configuration"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

3. **Create New Project:**
   - Click "Add New..." → "Project"
   - Select your repository

4. **Configure Project:**
   ```
   Project Name:       seafood-forecasting (or any name)
   Framework Preset:   Vite
   Root Directory:     client             ← Set this!
   ```

5. **Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com`

6. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your Vercel URL

7. **Update Backend CORS:**
   - Go to Render dashboard
   - Your service → Environment
   - Update `CORS_ORIGINS` to include your Vercel URL

---

## Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? seafood-forecasting
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev

# Add environment variable
vercel env add VITE_API_URL production
# Paste your backend URL when prompted

# Deploy to production
vercel --prod
```

---

## 📁 Configuration Files

### `client/vercel.json` (Client-specific)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### `vercel.json` (Root - for deploying from root)
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install --prefix client",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ Success Indicators

After deployment:

1. **Build logs show:**
   ```
   Installing dependencies...
   added 433 packages
   Building...
   Collecting page data
   Build Completed
   ```

2. **Deployment succeeds:**
   - You get a URL: `https://your-app.vercel.app`
   - Site loads correctly
   - No 404 errors on routes

3. **API works:**
   - No CORS errors in console
   - Data loads from backend
   - All features work

---

## 🎯 Key Points

### When deploying client directory:

**Root Directory:** `client`
**Build Command:** `npm run build` (auto-detect works)
**Output Directory:** `dist` (auto-detect works)
**Install Command:** `npm install` (auto-detect works)

### When deploying from root:

**Root Directory:** *(leave blank)*
**Build Command:** `cd client && npm run build`
**Output Directory:** `client/dist`
**Install Command:** `cd client && npm install`

---

## 🔄 Redeploy After Fix

If you already created a Vercel project:

1. **Go to Vercel Dashboard**
2. **Your Project → Settings**
3. **General → Root Directory**
4. **Set to:** `client`
5. **Save**
6. **Deployments → Latest → Redeploy**

OR

1. **Delete the project**
2. **Create new project**
3. **Use correct settings from start**

---

## 💡 Pro Tips

### Tip 1: Use Root Directory Setting
Setting "Root Directory" to `client` is cleaner than using `cd` commands.

### Tip 2: Environment Variables
Always set `VITE_API_URL` before deploying, or add it after and redeploy.

### Tip 3: Preview Deployments
Every push creates a preview deployment. Test before merging to main.

### Tip 4: Check Build Logs
If deployment fails, check the build logs for specific errors.

---

## 🆘 Still Having Issues?

### Check These:

1. **Root Directory is set to `client`** in Vercel dashboard
2. **`client/package.json` exists** and has build script
3. **`client/vite.config.ts` exists** and is properly configured
4. **Environment variable `VITE_API_URL`** is set
5. **Latest changes pushed** to GitHub

### Common Mistakes:

- ❌ Root Directory not set to `client`
- ❌ Using `cd client` when Root Directory is already `client`
- ❌ Forgetting to add `VITE_API_URL`
- ❌ Trailing slash in `VITE_API_URL`

---

## ✅ Final Checklist

- [ ] Pushed latest changes to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root Directory set to `client`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Deployment triggered
- [ ] Build succeeded
- [ ] Site loads correctly
- [ ] Backend CORS updated with Vercel URL
- [ ] API calls work
- [ ] All features tested

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ Fully working application
- ✅ FREE hosting!

**Your deployment is ready!** 🚀
