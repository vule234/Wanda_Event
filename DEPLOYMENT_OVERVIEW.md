# Wanda Event Deployment Overview

## Repository structure

This project is intended to live in a single Git repository at the workspace root:

- `frontend/` → Next.js app, deploy to Vercel
- `backend/` → Express API, deploy to Render

## Security before pushing to GitHub

Do **not** commit these files:

- `frontend/.env.local`
- `backend/.env`
- `backend/.env.production`
- `backend/ADMIN_CREDENTIALS.txt`
- any `*.pem`, `*.key`, or certificate files

Use these example files instead:

- `frontend/.env.example`
- `backend/.env.example`

## GitHub SSH remote

Recommended remote:

```bash
git remote add origin git@github.com:vule234/Wanda_Event.git
```

## Vercel configuration

- Framework: Next.js
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`

### Vercel environment variables

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

## Render configuration

- Service Type: Web Service
- Root Directory: `backend`
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`

### Render environment variables

- `PORT`
- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `ADMIN_EMAIL`
- `TURNSTILE_SECRET_KEY`
- `CORS_ORIGIN`
- `ZALO_BOT_TOKEN`
- `ZALO_RECIPIENT_ID`
- `ZALO_TIMEOUT_MS`
- `ZALO_MAX_RETRIES`
- `ZALO_RETRY_DELAY_MS`
- `ZALO_STRICT_MODE`
- `ADMIN_DASHBOARD_URL`

## Deployment flow

1. Push the cleaned root repository to GitHub over SSH.
2. Create a Vercel project using the `frontend` directory.
3. Create a Render web service using the `backend` directory.
4. Set all environment variables directly in Vercel/Render dashboards.
5. Update `CORS_ORIGIN` on Render to the final Vercel domain.
6. Update `NEXT_PUBLIC_API_URL` on Vercel to the final Render domain.
7. Redeploy both services and run end-to-end checks.
