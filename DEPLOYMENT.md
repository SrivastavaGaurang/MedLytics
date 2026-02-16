# 🚀 Quick Deployment Reference

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster running
- [ ] Vercel account created
- [ ] Render account created

---

## 🎯 Deployment Steps (30-Minute Guide)

### 1️⃣ Backend (Render) - 10 minutes

**URL:** https://dashboard.render.com/

1. **New Web Service** → Connect GitHub repo
2. **Settings:**
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

3. **Environment Variables** (from `server/.env`):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   AUTH0_DOMAIN=<your-domain>
   AUTH0_AUDIENCE=https://api.medlytics.com
   AUTH0_SECRET=<your-auth0-secret>
   AUTH0_ISSUER_BASE_URL=<your-issuer-url>
   FRONTEND_URL=<add-after-frontend-deploy>
   ```

4. **Deploy** → Copy backend URL

---

### 2️⃣ MongoDB Atlas - 5 minutes

**URL:** https://cloud.mongodb.com/

1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** (`0.0.0.0/0`)
3. **Confirm**

---

### 3️⃣ Frontend (Vercel) - 10 minutes

**URL:** https://vercel.com/new

1. **Import Repository** → Select `medlytics` folder
2. **Settings:**
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://<your-backend>.onrender.com/api
   ```

4. **Deploy** → Copy frontend URL

---

### 4️⃣ Update Backend - 5 minutes

1. **Render Dashboard** → Your Service
2. **Environment Tab**
3. **Update** `FRONTEND_URL` with Vercel URL
4. **Save** (auto-redeploys)

---

## ✅ Verification

Visit your Vercel URL:
- Homepage loads ✓
- Navigation works ✓
- Contact form works ✓
- API calls succeed ✓

---

## 📦 Files Created

| File | Purpose |
|------|---------|
| `medlytics/vercel.json` | Vercel config |
| `server/render.yaml` | Render config |
| `.env.example` | Env vars template |

---

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Blog page error | Check MongoDB IP whitelist |
| CORS error | Update `FRONTEND_URL` on Render |
| API not found | Check `VITE_API_URL` on Vercel |
| Backend sleeping | Normal for free tier (30s wake) |

---

## 🔗 Useful Links

- [Full Deployment Guide](file:///C:/Users/Gaurang%20srivastava/.gemini/antigravity/brain/a7be25e0-83e2-43c9-a6a2-52935215dc6a/walkthrough.md)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [MongoDB Atlas](https://cloud.mongodb.com/)

---

**Total Time:** ~30 minutes  
**Total Cost:** $0

Good luck with your deployment! 🎉
