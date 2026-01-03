# Quick Deployment Guide

## 🚀 Free Deployment Options

### Recommended Setup:
- **Frontend**: Vercel (Next.js) - Free
- **Backend**: Railway or Render (NestJS) - Free tier

---

## 📋 Quick Steps

### 1. Backend Deployment (Choose One)

#### Railway (Recommended)
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub → Select your repo
3. Settings:
   - Root Directory: `server`
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
4. Add Environment Variable:
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (add after frontend deploy)
5. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

#### Render (Alternative)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. New Web Service → Connect your repo
3. Settings:
   - Root Directory: `server`
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
   - Port: `10000`
4. Add Environment Variables:
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
5. Copy your Render URL (e.g., `https://your-app.onrender.com`)

### 2. Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. New Project → Import your repo
3. Settings:
   - Root Directory: `client`
   - Framework: Next.js (auto-detected)
4. Add Environment Variable:
   - `NEXT_PUBLIC_SERVER_URL`: Your backend URL from step 1
5. Deploy!

### 3. Update Backend CORS

After frontend deploys, update backend `ALLOWED_ORIGINS` with your Vercel URL.

---

## ✅ That's It!

Your app should now be live! Visit your Vercel URL to test.

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

