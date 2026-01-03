# Deployment Guide - Free Hosting

This guide will help you deploy your real-time chat application for free using:
- **Vercel** (Frontend - Next.js)
- **Railway** or **Render** (Backend - NestJS)

## Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free) or Render account (free)

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/chat-real-time.git
git push -u origin main
```

---

## Step 2: Deploy Backend (NestJS) - Choose One Option

### Option A: Railway (Recommended)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your `chat-real-time` repository
4. **Configure**:
   - **Root Directory**: Set to `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. **Environment Variables**:
   - `PORT`: Railway sets this automatically
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (you'll update this after deploying frontend)
6. **Get URL**: Railway will provide a URL like `https://your-app.up.railway.app`
7. **Copy the URL** - you'll need it for the frontend

### Option B: Render

1. **Sign up**: Go to [render.com](https://render.com) and sign up with GitHub
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repository**: Select your `chat-real-time` repository
4. **Configure**:
   - **Name**: `chat-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render uses this port)
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (update after frontend deploy)
6. **Deploy**: Click "Create Web Service"
7. **Get URL**: Render will provide a URL like `https://your-app.onrender.com`
8. **Copy the URL** - you'll need it for the frontend

---

## Step 3: Deploy Frontend (Next.js) - Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **New Project**: Click "Add New" → "Project"
3. **Import Repository**: Select your `chat-real-time` repository
4. **Configure**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. **Environment Variables**:
   - `NEXT_PUBLIC_SERVER_URL`: Your backend URL from Step 2
     - Railway: `https://your-app.up.railway.app`
     - Render: `https://your-app.onrender.com`
6. **Deploy**: Click "Deploy"
7. **Get URL**: Vercel will provide a URL like `https://your-app.vercel.app`

---

## Step 4: Update CORS Settings

After deploying the frontend, you need to update the backend's CORS settings:

### For Railway:
1. Go to your Railway project
2. Click on "Variables" tab
3. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
4. Railway will automatically redeploy

### For Render:
1. Go to your Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
5. Render will automatically redeploy

---

## Step 5: Test Your Deployment

1. Open your Vercel frontend URL
2. Enter a username
3. Open the same URL in another browser/incognito window
4. Enter a different username
5. Try sending messages - they should appear in real-time!

---

## Troubleshooting

### WebSocket Connection Issues

If you see connection errors:

1. **Check CORS settings**: Make sure `ALLOWED_ORIGINS` includes your Vercel URL
2. **Check backend URL**: Verify `NEXT_PUBLIC_SERVER_URL` in Vercel matches your backend URL
3. **Check backend logs**: Look at Railway/Render logs for errors

### Build Errors

1. **Railway**: Check the build logs in the "Deployments" tab
2. **Render**: Check the build logs in the "Logs" tab
3. **Vercel**: Check the build logs in the deployment page

### Port Issues

- **Railway**: Automatically sets `PORT` - don't override it
- **Render**: Uses port `10000` - make sure your code reads from `process.env.PORT`

---

## Free Tier Limits

### Vercel
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Perfect for Next.js

### Railway
- ✅ $5 free credit/month
- ✅ 500 hours of usage
- ✅ Auto-sleeps after inactivity (wakes on request)

### Render
- ✅ Free tier available
- ⚠️ Spins down after 15 minutes of inactivity (takes ~30s to wake)
- ✅ 750 hours/month

---

## Cost Optimization Tips

1. **Railway**: Use the free tier - it's generous for small projects
2. **Render**: Free tier works but has cold starts
3. **Vercel**: Completely free for Next.js projects

---

## Next Steps

- Add a custom domain (free on Vercel)
- Set up monitoring
- Add error tracking (Sentry free tier)
- Enable HTTPS (automatic on all platforms)

---

## Support

If you encounter issues:
1. Check the logs on your hosting platform
2. Verify environment variables are set correctly
3. Make sure both frontend and backend are deployed
4. Check that CORS allows your frontend URL

