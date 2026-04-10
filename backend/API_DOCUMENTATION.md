# Mercury Wanda Backend API Documentation

## Quick Start

### 1. Setup Environment
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your Supabase Service Role Key and SendGrid API Key
```

### 2. Seed Database
```bash
npm run seed
```

This will:
- Create default admin account (admin@mercurywanda.com / MercuryWanda2024!)
- Create Supabase Storage bucket for images
- Seed sample projects and library items

### 3. Start Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Public Endpoints (No Authentication)

#### Projects
- `GET /api/projects` - List all projects with pagination
  - Query: `page`, `limit`, `category`, `featured`, `search`
  - Response: `{ success, data, pagination }`

- `GET /api/projects/:slug` - Get project details
  - Response: `{ success, data: { ...project, related: [] } }`

#### Library
- `GET /api/library` - List library items
  - Query: `type`, `page`, `limit`
  - Response: `{ success, data, pagination }`

- `GET /api/library/:id` - Get library item details
  - Response: `{ success, data }`

#### Leads (Rate Limited: 10 requests/15 min)
- `POST /api/leads` - Submit lead form
  - Body: `{ name, phone, email?, event_type?, event_date?, message? }`
  - Response: `{ success, message, data: { id, name }, meta: { zalo: { success, skipped, code, attempts, durationMs, status?, responseData? } } }`
  - Notes:
    - `meta.zalo` luôn trả về để frontend biết trạng thái gửi thông báo realtime.
    - Nếu `ZALO_STRICT_MODE=true` và Zalo gửi fail (không phải skipped), API có thể trả `502` dù lead đã lưu thành công.

---

### Admin Endpoints (Require Authentication)

#### Authentication
- `POST /api/auth/login` - Admin login
  - Body: `{ email, password }`
  - Response: `{ success, data: { user, session } }`

- `POST /api/auth/logout` - Admin logout
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `GET /api/auth/me` - Get current user info
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data: { id, email, role, last_login } }`

#### Projects Management
- `POST /api/admin/projects` - Create project
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title, category, venue?, scale?, style?, client?, event_date?, description?, thumbnail?, gallery?, is_featured? }`
  - Response: `{ success, message, data }`

- `PUT /api/admin/projects/:id` - Update project
  - Headers: `Authorization: Bearer <token>`
  - Body: Same as POST
  - Response: `{ success, message, data }`

- `DELETE /api/admin/projects/:id` - Delete project
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `GET /api/admin/projects/stats` - Get project statistics
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data: { total_projects, wedding_count, corporate_count, birthday_count, featured_count } }`

#### Leads Management
- `GET /api/admin/leads` - List all leads
  - Headers: `Authorization: Bearer <token>`
  - Query: `page`, `limit`, `status`, `event_type`, `search`
  - Response: `{ success, data, pagination }`

- `PUT /api/admin/leads/:id` - Update lead status
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ status, notes? }`
  - Response: `{ success, message, data }`

- `DELETE /api/admin/leads/:id` - Delete lead
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

- `GET /api/admin/leads/export` - Export leads to CSV
  - Headers: `Authorization: Bearer <token>`
  - Response: CSV file download

- `GET /api/admin/leads/stats` - Get lead statistics
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data: { total_leads, new_leads, processing_leads, closed_leads } }`

#### Library Management
- `POST /api/admin/library` - Create library item
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title, type, description?, thumbnail?, content_url? }`
  - Response: `{ success, message, data }`

- `PUT /api/admin/library/:id` - Update library item
  - Headers: `Authorization: Bearer <token>`
  - Body: Same as POST
  - Response: `{ success, message, data }`

- `DELETE /api/admin/library/:id` - Delete library item
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, message }`

#### File Upload
- `POST /api/admin/upload/image` - Upload single image
  - Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
  - Body: `{ image: File }`
  - Response: `{ success, message, data: { url, path } }`

- `POST /api/admin/upload/images` - Upload multiple images
  - Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
  - Body: `{ images: File[] }`
  - Response: `{ success, message, data: [{ url, path }, ...] }`

- `DELETE /api/admin/upload/image` - Delete image
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ path }`
  - Response: `{ success, message }`

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

---

## Authentication Flow

1. **Login**: Send credentials to `POST /api/auth/login`
2. **Receive**: Access token + Refresh token
3. **Store**: Save access token (localStorage or memory)
4. **Use**: Include in header: `Authorization: Bearer <access_token>`
5. **Refresh**: When token expires, use refresh token to get new access token

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mercurywanda.com",
    "password": "MercuryWanda2024!"
  }'
```

### Get Projects
```bash
curl http://localhost:5000/api/projects?page=1&limit=12
```

### Submit Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0909123456",
    "email": "a@example.com",
    "event_type": "Wedding",
    "message": "Tôi muốn tổ chức đám cưới"
  }'
```

### Create Project (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Tiệc Cưới Mới",
    "category": "Wedding",
    "venue": "Saigon Palace",
    "is_featured": true
  }'
```

---

## Database Schema

### Projects Table
- `id` (BIGSERIAL) - Primary key
- `title` (VARCHAR) - Project title
- `slug` (VARCHAR) - URL-friendly slug
- `category` (VARCHAR) - Wedding/Corporate/Birthday/Other
- `venue` (VARCHAR) - Event venue
- `scale` (VARCHAR) - Event scale
- `style` (VARCHAR) - Event style
- `client` (VARCHAR) - Client name
- `event_date` (TIMESTAMP) - Event date
- `description` (TEXT) - Project description
- `thumbnail` (TEXT) - Thumbnail image URL
- `gallery` (TEXT[]) - Array of image URLs
- `is_featured` (BOOLEAN) - Featured flag
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

### Leads Table
- `id` (BIGSERIAL) - Primary key
- `name` (VARCHAR) - Lead name
- `phone` (VARCHAR) - Phone number
- `email` (VARCHAR) - Email address
- `event_type` (VARCHAR) - Event type
- `event_date` (TIMESTAMP) - Event date
- `message` (TEXT) - Message content
- `status` (VARCHAR) - New/Processing/Closed
- `source` (VARCHAR) - Lead source
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

### Library Table
- `id` (BIGSERIAL) - Primary key
- `title` (VARCHAR) - Item title
- `type` (VARCHAR) - album/video/document/inspiration
- `description` (TEXT) - Item description
- `thumbnail` (TEXT) - Thumbnail URL
- `content_url` (TEXT) - Content URL
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development/production |
| `SUPABASE_URL` | Supabase project URL | https://znkvizblryesyrsockty.supabase.co |
| `SUPABASE_SERVICE_KEY` | Service role key | eyJhbGc... |
| `SUPABASE_ANON_KEY` | Anon key | eyJhbGc... |
| `SENDGRID_API_KEY` | SendGrid API key | SG.xxx |
| `SENDGRID_FROM_EMAIL` | From email | noreply@mercurywanda.com |
| `ADMIN_EMAIL` | Admin email | admin@mercurywanda.com |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |
| `OPENCLAW_GATEWAY_URL` | OpenClaw Gateway base URL | http://localhost:18789 |
| `OPENCLAW_GATEWAY_TOKEN` | OpenClaw token for auth | long-random-token |
| `ZALO_RECIPIENT_PHONE` | Phone nhận lead notification | 0398083040 |
| `ZALO_TIMEOUT_MS` | Timeout cho mỗi lần gửi Zalo | 5000 |
| `ZALO_MAX_RETRIES` | Số lần retry khi gửi Zalo lỗi | 1 |
| `ZALO_RETRY_DELAY_MS` | Delay giữa các lần retry (ms) | 600 |
| `ZALO_STRICT_MODE` | Nếu true: Zalo fail => `/api/leads` fail | false |
| `ADMIN_DASHBOARD_URL` | Link dashboard đính kèm tin nhắn | http://localhost:3000/admin |


---

## Support

For issues or questions, check:
1. `.env` file configuration
2. Supabase project status
3. SendGrid API key validity
4. Network connectivity
