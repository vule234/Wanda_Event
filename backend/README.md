# Mercury Wanda Backend

Backend API cho hệ thống quản lý sự kiện Mercury Wanda.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (miễn phí thay thế Cloudinary)
- **Email**: SendGrid
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:
- `SUPABASE_SERVICE_KEY`: Lấy từ Supabase Dashboard > Settings > API > service_role key
- `SENDGRID_API_KEY`: Đăng ký tại https://sendgrid.com (miễn phí 100 emails/ngày)

### 3. Seed database
```bash
npm run seed
```

Lệnh này sẽ:
- Tạo admin account mặc định
- Tạo storage bucket cho images
- Seed dữ liệu mẫu (projects, library)

### 4. Chạy server
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

## Thông tin đăng nhập Admin

Xem file `ADMIN_CREDENTIALS.txt` để biết thông tin đăng nhập mặc định.

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình (Supabase, Storage, Email)
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, Validation, Error handling
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── scripts/
│   └── seed.js          # Database seeding
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json
```

## API Endpoints

Xem file `API_DOCUMENTATION.md` để biết chi tiết về tất cả endpoints.

### Public Endpoints
- `GET /api/projects` - Danh sách dự án
- `GET /api/projects/:slug` - Chi tiết dự án
- `GET /api/library` - Thư viện media
- `POST /api/leads` - Gửi form liên hệ

### Admin Endpoints (Require Auth)
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user
- `POST /api/admin/projects` - Tạo dự án
- `GET /api/admin/leads` - Quản lý leads
- `POST /api/admin/upload/image` - Upload ảnh

## Database Schema

### Tables
- `projects` - Dự án sự kiện
- `leads` - Khách hàng tiềm năng
- `library` - Thư viện media
- `admins` - Tài khoản admin

### Functions
- `search_projects(query)` - Full-text search
- `get_project_stats()` - Thống kê dự án
- `get_lead_stats()` - Thống kê leads

## Testing

### Test với cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mercurywanda.com","password":"MercuryWanda2024!"}'
```

**Get Projects:**
```bash
curl http://localhost:5000/api/projects
```

**Submit Lead:**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"0909123456","event_type":"Wedding"}'
```

## Supabase Storage (Miễn phí)

Thay vì Cloudinary, project sử dụng Supabase Storage:
- **Miễn phí**: 1GB storage
- **Public bucket**: `images`
- **Max file size**: 10MB
- **Allowed types**: image/png, image/jpeg, image/jpg, image/webp

## SendGrid Setup

1. Đăng ký tại https://sendgrid.com
2. Tạo API Key: Settings > API Keys > Create API Key
3. Verify sender email: Settings > Sender Authentication
4. Thêm API key vào `.env`

**Miễn phí**: 100 emails/ngày

## Troubleshooting

### Lỗi kết nối Supabase
- Kiểm tra `SUPABASE_URL` và `SUPABASE_SERVICE_KEY` trong `.env`
- Đảm bảo project Supabase đang active

### Lỗi gửi email
- Kiểm tra `SENDGRID_API_KEY` hợp lệ
- Verify sender email trong SendGrid dashboard

### Lỗi upload ảnh
- Kiểm tra storage bucket `images` đã được tạo
- Chạy `npm run seed` để tạo bucket

## Production Deployment

### Environment Variables
Đảm bảo set các biến môi trường sau:
- `NODE_ENV=production`
- `PORT=5000`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SENDGRID_API_KEY`
- `CORS_ORIGIN` (URL frontend production)

### Recommended Platforms
- **Render**: Free tier, auto-deploy từ Git
- **Railway**: Free tier với $5 credit/tháng
- **Vercel**: Serverless functions (cần adapt code)

## Security Notes

⚠️ **Quan trọng**:
- Không commit file `.env` lên Git
- Thay đổi password admin sau lần đăng nhập đầu tiên
- Sử dụng HTTPS trong production
- Enable rate limiting cho tất cả public endpoints

## Support

Nếu gặp vấn đề, kiểm tra:
1. File `.env` đã cấu hình đúng
2. Supabase project đang active
3. SendGrid API key hợp lệ
4. Port 5000 không bị chiếm dụng
