# Mercury Wanda Backend - Deployment Guide

## 📋 Mục Lục
1. [Yêu Cầu](#yêu-cầu)
2. [Chuẩn Bị](#chuẩn-bị)
3. [Triển Khai](#triển-khai)
4. [Xác Minh](#xác-minh)
5. [Rollback](#rollback)

---

## 🔧 Yêu Cầu

### Hệ Thống
- Node.js 18+
- npm 9+
- Git

### Tài Khoản
- GitHub account
- Vercel account cho frontend
- Render account cho backend
- Supabase account (production project)
- SendGrid account (nếu bật email production)

### Credentials
- `SUPABASE_SERVICE_KEY` (production)
- `SENDGRID_API_KEY` (production)
- `TURNSTILE_SECRET_KEY` (production)
- `CORS_ORIGIN` (production frontend URL)

---

## 📦 Chuẩn Bị

### 1. Chuẩn Bị Repository

Repository production nên được quản lý ở thư mục gốc `d:\WandaEvent` với cấu trúc:

- `frontend/` → Next.js app, deploy lên Vercel
- `backend/` → Express API, deploy lên Render

Remote GitHub SSH mục tiêu:

```bash
git remote add origin git@github.com:vule234/Wanda_Event.git
```

### 2. Chuẩn Bị File Môi Trường

Không commit file env thật lên GitHub.

Dùng file mẫu:
- `frontend/.env.example`
- `backend/.env.example`

Các file sau phải được ignore:
- `frontend/.env.local`
- `backend/.env`
- `backend/.env.production`
- `backend/ADMIN_CREDENTIALS.txt`

### 3. Chuẩn Bị Production Credentials

Thiết lập trực tiếp trên dashboard của từng nền tảng:

- **Vercel**: đặt các biến `NEXT_PUBLIC_*`
- **Render**: đặt toàn bộ biến backend bí mật

Tuyệt đối không lưu production secrets trong repository.

---

## 🚀 Triển Khai

### Option 1: Render cho Backend (Recommended)

**Step 1: Connect Repository**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Chọn repository `Wanda_Event`
5. Set **Root Directory** là `backend`

**Step 2: Configure Service**
- Name: `wanda-event-backend`
- Environment: `Node`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

**Step 3: Set Environment Variables**
Thêm các biến cần thiết trên Render dashboard, ví dụ:
- `PORT=5000`
- `NODE_ENV=production`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_KEY=...`
- `SUPABASE_ANON_KEY=...`
- `SENDGRID_API_KEY=...`
- `SENDGRID_FROM_EMAIL=...`
- `ADMIN_EMAIL=...`
- `TURNSTILE_SECRET_KEY=...`
- `CORS_ORIGIN=https://your-frontend-domain.vercel.app`
- `ZALO_BOT_TOKEN=...`
- `ZALO_RECIPIENT_ID=...`
- `ADMIN_DASHBOARD_URL=https://your-frontend-domain.vercel.app/admin`

**Step 4: Deploy**
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Ghi lại backend URL để cấu hình cho Vercel

### Option 2: Vercel cho Frontend

**Step 1: Import Repository**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import repository `Wanda_Event`
4. Set **Root Directory** là `frontend`

**Step 2: Configure Build**
- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`

**Step 3: Set Environment Variables**
Thêm trên Vercel dashboard:
- `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=...`

**Step 4: Deploy**
1. Click deploy
2. Verify build passes
3. Ghi lại frontend domain để cấu hình lại `CORS_ORIGIN` trên Render nếu cần

### Ghi chú

- Không khuyến nghị deploy backend Express truyền thống lên Vercel.
- Nếu đổi domain production, nhớ cập nhật lại cả `NEXT_PUBLIC_API_URL` và `CORS_ORIGIN`.

---

## ✅ Xác Minh

### 1. Health Check

```bash
# Test health endpoint
curl https://your-backend-url/health

# Expected response:
# {
#   "success": true,
#   "message": "Mercury Wanda API is running",
#   "timestamp": "2026-03-29T11:37:33.059Z"
# }
```

### 2. Test Public Endpoints

```bash
# Get projects
curl https://your-backend-url/api/projects

# Get library
curl https://your-backend-url/api/library
```

### 3. Test Admin Endpoints

```bash
# Login
curl -X POST https://your-backend-url/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mercurywanda.com","password":"MercuryWanda2024!"}'

# Expected: Access token in response
```

### 4. Check Logs

```bash
# View logs on Render
# Go to Render Dashboard → Service → Logs

# View logs on Railway
# Go to Railway Dashboard → Project → Logs
```

### 5. Monitor Performance

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-backend-url/health

# Monitor error rates
# Check logs for errors
```

---

## 🔄 Rollback

### If Deployment Fails

**Option 1: Render**
1. Go to Render Dashboard
2. Select the service
3. Go to "Deploys" tab
4. Click "Redeploy" on previous successful deployment

**Option 2: Railway**
1. Go to Railway Dashboard
2. Select the project
3. Go to "Deployments" tab
4. Click "Redeploy" on previous version

**Option 3: Manual Rollback**
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Redeploy
# (Follow deployment steps above)
```

---

## 📊 Post-Deployment Checklist

- [ ] Health check endpoint responds
- [ ] All public endpoints working
- [ ] Admin login working
- [ ] Email notifications sending
- [ ] Rate limiting working
- [ ] CORS configured correctly
- [ ] Security headers present
- [ ] Logs being captured
- [ ] Monitoring alerts configured
- [ ] Database backups configured

---

## 🔐 Security Checklist

- [ ] `.env` file not committed to Git
- [ ] Production credentials are secure
- [ ] HTTPS enabled
- [ ] CORS_ORIGIN set to production URL only
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Database RLS policies enabled
- [ ] Admin password changed from default
- [ ] Monitoring and alerting configured
- [ ] Regular backups scheduled

---

## 📞 Support

If deployment fails:
1. Check logs for error messages
2. Verify all environment variables are set
3. Check Supabase project is active
4. Check SendGrid API key is valid
5. See TROUBLESHOOTING_GUIDE.md for common issues

---

## 🎯 Next Steps

After successful deployment:
1. Update frontend `REACT_APP_API_URL` to production backend URL
2. Test frontend-backend integration
3. Set up monitoring and alerting
4. Configure automated backups
5. Plan regular maintenance schedule

---

**Last Updated**: 2026-03-29
**Version**: 1.0
