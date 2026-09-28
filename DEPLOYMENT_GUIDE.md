# 🌐 MediExplain AI — Production Cloud Deployment Guide

Yeh guide Medicare AI (MediExplain) ko **Vercel**, **Docker**, **Render**, ya **Railway** par live host karne ke exact step-by-step instructions provide karti hai.

---

## 📋 Pre-Flight Checklist (Zaroori Cheezein)

1. **GitHub Repository:** Aapka code pehle se updated hai: `https://github.com/vedumeena01/medicare`
2. **Google Gemini API Key:** Google AI Studio se praapt API key (`AQ...` format support ke sath).
3. **Node.js Environment:** Production target Node.js 22 LTS recommend kiya jata hai.

---

## 🚀 Option 1: Vercel Cloud Deployment (Sabse Asaan & Recommended)

Vercel par Next.js ko deploy karne ke liye humne [`vercel.json`](file:///c:/Users/vedpr/OneDrive/Desktop/medicare/vercel.json) configure kar diya hai jo Prisma client generation aur build process ko automatically handle karta hai.

### Steps:
1. **Vercel par Login karein:**
   - [vercel.com](https://vercel.com) par jayein aur apne GitHub account (`vedumeena01`) se login karein.
2. **Import Project:**
   - **Add New...** -> **Project** par click karein.
   - Apni repository **`vedumeena01/medicare`** ko select karke **Import** dabayein.
3. **Environment Variables Configure karein:**
   - **Environment Variables** section expand karein aur yeh add karein:
     - `GEMINI_API_KEY` = *Aapki Google Gemini API Key*
     - `NODE_ENV` = `production`
4. **Deploy karein:**
   - **Deploy** button dabayein.
   - Vercel automatically dependency install, Prisma client build, aur global edge CDN par website live kar dega.
   - Deploy hone ke baad aapko ek live URL milega jaise: `https://medicare-ai.vercel.app`.

---

## 🐳 Option 2: Docker & Container Deployment (Self-Hosting / VPS / Railway / Render)

Containerized hosting ke liye humne optimized multi-stage [`Dockerfile`](file:///c:/Users/vedpr/OneDrive/Desktop/medicare/Dockerfile) aur [`docker-compose.yml`](file:///c:/Users/vedpr/OneDrive/Desktop/medicare/docker-compose.yml) ready kar diya hai.

### Local ya VPS par Docker se Run karna:

1. **Repository clone karein ya project folder mein jayein:**
   ```bash
   cd medicare
   ```

2. **Environment variable set karein `.env.local` mein:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **1-Command Build & Run:**
   ```bash
   docker compose up --build -d
   ```

4. **Verify karein:**
   - Application URL: `http://localhost:3000`
   - Live Health Check Probe: `http://localhost:3000/api/health`

### Render / Railway par Deploy karna:
1. **Render.com** ya **Railway.app** par jayein.
2. **New Web Service** select karein aur GitHub repo connect karein.
3. Runtime mein **Docker** choose karein (yeh repository ke root `Dockerfile` ko automatic detect kar lega).
4. `GEMINI_API_KEY` environment variable configure karein aur **Deploy** dabayein.

---

## 🩺 Monitoring & Health Probing

Production server ki live health check karne ke liye dedicated endpoint available hai:

- **Endpoint:** `GET /api/health`
- **Sample Output:**
```json
{
  "status": "ok",
  "service": "MediExplain AI Health Engine",
  "environment": "production",
  "timestamp": "2026-09-28T08:00:00.000Z",
  "uptimeSeconds": 1420,
  "latencyMs": 4,
  "checks": {
    "database": "healthy",
    "reportsAvailable": 5,
    "prismaClient": "connected"
  }
}
```

---

## 🔒 Security Best Practices in Production

1. **Non-Root Execution:** Docker container unprivileged `nextjs:nodejs` (UID 1001) user ke under run hota hai.
2. **Security Headers:** Automatic `X-Frame-Options`, `X-Content-Type-Options`, aur strict referrer policy enabled hai.
3. **Data Parity:** SQLite database file persistent volumes ke through restart hone par bhi retain rehti hai.
