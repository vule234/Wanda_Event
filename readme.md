# Mercury Wanda – Tổng quan dự án (README mới nhất)

> Nền tảng website + CMS quản trị cho dịch vụ tổ chức sự kiện cao cấp Mercury Wanda.

## 1) Tổng quan

Mercury Wanda gồm **2 ứng dụng tách biệt**:

- **Frontend**: Next.js (App Router) cho website public + giao diện admin
- **Backend**: Express.js REST API, kết nối Supabase (PostgreSQL + Auth + Storage)

Mục tiêu chính:

- Trình bày portfolio dự án sự kiện chuyên nghiệp
- Thu thập lead từ form liên hệ
- Quản trị dự án/lead/thư viện từ admin dashboard

---

## 2) Kiến trúc hệ thống

```text
Browser (User/Admin)
   │
   ├─> Frontend (Next.js 16, React 19)  [localhost:3000]
   │       │
   │       └─> REST API calls
   │
   └─> Backend (Express 5)              [localhost:5000]
           │
           ├─> Supabase PostgreSQL (projects, leads, library, admins)
           ├─> Supabase Auth (admin login)
           ├─> Supabase Storage (image upload bucket: images)
           ├─> SendGrid (email thông báo lead + thank-you)
           └─> Zalo Webhook (thông báo lead realtime)
```

---

## 3) Công nghệ sử dụng

### Frontend (`/frontend`)

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- Framer Motion `^12`
- Supabase JS client

### Backend (`/backend`)

- Node.js + Express `^5.2.1`
- Supabase JS client `^2.100.1`
- Zod `^4` (validation)
- Helmet + CORS + Morgan
- express-rate-limit
- Multer (memory upload)
- SendGrid mail API

---

## 4) Cấu trúc thư mục chính

```text
WandaEvent/
├─ frontend/
│  ├─ src/app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  ├─ contact/thank-you/page.tsx
│  │  │  ├─ library/page.tsx
│  │  │  └─ projects/
│  │  │     ├─ page.tsx
│  │  │     └─ [slug]/page.tsx
│  │  └─ admin/
│  │     ├─ login/page.tsx
│  │     ├─ dashboard/page.tsx
│  │     ├─ leads/page.tsx
│  │     └─ projects/
│  │        ├─ page.tsx
│  │        └─ [projectId]/page.tsx
│  └─ src/lib/api/client.ts
│
├─ backend/
│  ├─ src/server.js
│  ├─ src/routes/
│  │  ├─ publicRoutes.js
│  │  └─ adminRoutes.js
│  ├─ src/controllers/
│  │  ├─ authController.js
│  │  ├─ leadController.js
│  │  ├─ projectController.js
│  │  ├─ libraryController.js
│  │  └─ uploadController.js
│  ├─ src/middleware/
│  │  ├─ authMiddleware.js
│  │  ├─ validateMiddleware.js
│  │  └─ rateLimitMiddleware.js
│  ├─ src/config/
│  │  ├─ supabase.js
│  │  ├─ storage.js
│  │  ├─ email.js
│  │  └─ zalo.js
│  └─ scripts/seed.js
│
├─ PROJECT_README.md
├─ QUICK_START.md
└─ readme.md (file này)
```

---

## 5) Tính năng hiện có

### Public website

- Trang chủ
- Danh sách dự án (`/projects`) + lọc theo category phía frontend
- Chi tiết dự án (`/projects/[slug]`) có gallery + related projects
- Trang About
- Trang Contact + submit lead (lưu DB + gửi Email + gửi Zalo webhook)
- Thank-you page sau submit thành công
- Trang Library (UI tĩnh)

### Admin

- Login admin qua Supabase Auth
- Dashboard thống kê
- Quản lý Leads (list/update/delete/export)
- Quản lý Projects (CRUD)
- Upload ảnh 1 hoặc nhiều ảnh lên Supabase Storage
- Quản lý Library items (CRUD API)

---

## 6) API hiện tại (theo code backend)

Base URL backend: `http://localhost:5000`

### 6.1 Public endpoints

- `GET /health`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/library`
- `GET /api/library/:id`
- `POST /api/leads` (có rate limit + Zod validation)

### 6.2 Admin endpoints

#### Auth
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout` (auth)
- `GET /api/admin/auth/me` (auth)

#### Projects
- `POST /api/admin/projects` (auth + admin + validate)
- `PUT /api/admin/projects/:id` (auth + admin + validate)
- `DELETE /api/admin/projects/:id` (auth + admin)
- `GET /api/admin/projects/stats` (auth + admin)

#### Leads
- `GET /api/admin/leads` (auth + admin)
- `PUT /api/admin/leads/:id` (auth + admin)
- `DELETE /api/admin/leads/:id` (auth + admin)
- `GET /api/admin/leads/export` (auth + admin)
- `GET /api/admin/leads/stats` (auth + admin)

#### Library
- `POST /api/admin/library` (auth + admin + validate)
- `PUT /api/admin/library/:id` (auth + admin + validate)
- `DELETE /api/admin/library/:id` (auth + admin)

#### Upload
- `POST /api/admin/upload/image` (multipart field: `image`)
- `POST /api/admin/upload/images` (multipart field: `images`, max 10)
- `DELETE /api/admin/upload/image`

---

## 7) Mô hình dữ liệu (Supabase)

Các bảng chính đang được backend sử dụng:

- `projects`
- `leads`
- `library`
- `admins`

Các hàm RPC backend đang gọi:

- `search_projects(search_query)`
- `generate_slug(title)`
- `get_project_stats()`
- `get_lead_stats()`

> Lưu ý: cần đảm bảo các table/RPC này tồn tại đúng schema trong Supabase.

---

## 8) Biến môi trường

## Backend (`backend/.env`)

Tham khảo mẫu từ `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
SUPABASE_ANON_KEY=...

SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@mercurywanda.com
ADMIN_EMAIL=admin@mercurywanda.com

ZALO_MODE=webhook
ZALO_WEBHOOK_URL=
ZALO_TIMEOUT_MS=5000

CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 9) Chạy local

### 9.1 Backend

```bash
cd backend
npm install
npm run dev
```

Backend chạy tại `http://localhost:5000`

### 9.2 Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:3000`

---

## 10) Seed dữ liệu

Backend có script seed:

```bash
cd backend
npm run seed
```

Script sẽ:

- Tạo tài khoản admin mặc định (nếu chưa có)
- Tạo storage bucket `images` (public)
- Seed sample projects
- Seed sample library items

### Tài khoản admin mặc định (development)

- Email: `admin@mercurywanda.com`
- Password: `MercuryWanda2024!`

> **Quan trọng:** đổi mật khẩu ngay khi dùng ở môi trường thật.

---

## 11) Bảo mật và middleware

Backend đang dùng:

- `helmet()`
- `cors({ origin, credentials: true })`
- `express-rate-limit`
  - API chung: 100 req/15 phút
  - Lead submit: 10 req/15 phút
- Zod request validation
- Middleware `authenticate` + `requireAdmin`
- Request ID cho trace lỗi

---

## 12) SEO & metadata (frontend)

`src/app/layout.tsx` đã có metadata cơ bản:

- `title`
- `description`
- `keywords`
- `openGraph`

Khuyến nghị bổ sung tiếp:

- Metadata riêng cho từng page public
- sitemap.xml + robots.txt
- Canonical URLs

---

## 13) Trạng thái hiện tại & khoảng trống cần hoàn thiện

1. **README cũ không đồng bộ code**
   - Có nội dung Cloudinary/JWT_SECRET/kiến trúc cũ không còn đúng.

2. **Một số mismatch FE ↔ BE cần fix**
   - FE `getMe()` đang gọi `/api/admin/me`, trong khi backend là `/api/admin/auth/me`.

3. **Contact form frontend chưa gửi đầy đủ field**
   - Hiện gửi: `name`, `phone`, `message`
   - Backend hỗ trợ thêm: `email`, `event_type`, `event_date`

4. **Library page public hiện là UI tĩnh**
   - Chưa consume API `/api/library`.

5. **Chưa có test automation**
   - Chưa có unit/integration/e2e test.

---

## 14) Định hướng triển khai production

- Frontend: deploy Vercel
- Backend: Render/Railway/Fly.io
- Supabase: production project riêng
- Thiết lập domain + HTTPS + CORS origin chính xác
- Bật monitoring logs + uptime checks
- Tách secrets theo từng môi trường (dev/staging/prod)

---

## 15) Tài liệu liên quan trong repo

- `PROJECT_README.md` – tổng quan vận hành
- `QUICK_START.md` – hướng dẫn khởi động nhanh
- `backend/README.md` – tài liệu backend cũ (cần đối chiếu)
- `frontend/README.md` – README mặc định Next.js

---

## 16) Ghi chú bảo trì tài liệu

Khi thay đổi API/schema/luồng auth/upload/notification (Email, Zalo Webhook), hãy cập nhật ngay file này để giữ đúng vai trò **Single Source of Truth** cho dự án.