# 🔑 Hướng dẫn lấy Supabase Service Role Key

## Bước 1: Truy cập Supabase Dashboard
1. Mở trình duyệt và truy cập: https://supabase.com/dashboard
2. Đăng nhập vào tài khoản của bạn

## Bước 2: Chọn Project
1. Chọn project **WandaEvent** (znkvizblryesyrsockty)
2. Hoặc truy cập trực tiếp: https://supabase.com/dashboard/project/znkvizblryesyrsockty

## Bước 3: Lấy Service Role Key
1. Trong sidebar bên trái, click vào **Settings** (biểu tượng bánh răng)
2. Click vào **API** trong menu Settings
3. Tìm section **Project API keys**
4. Tìm key có label **service_role** (secret)
5. Click vào icon **Copy** để copy key

⚠️ **LƯU Ý**: Service Role Key là key bí mật, KHÔNG BAO GIỜ commit lên Git!

## Bước 4: Cập nhật file .env
1. Mở file `backend/.env`
2. Tìm dòng: `SUPABASE_SERVICE_KEY=PASTE_YOUR_SERVICE_ROLE_KEY_HERE`
3. Thay thế `PASTE_YOUR_SERVICE_ROLE_KEY_HERE` bằng key vừa copy
4. Lưu file

## Bước 5: (Optional) Setup SendGrid
Nếu muốn gửi email notification:

1. Đăng ký tại: https://sendgrid.com (miễn phí 100 emails/ngày)
2. Tạo API Key:
   - Dashboard > Settings > API Keys
   - Click "Create API Key"
   - Chọn "Full Access"
   - Copy API key
3. Verify sender email:
   - Dashboard > Settings > Sender Authentication
   - Click "Verify Single Sender"
   - Nhập email của bạn và verify
4. Cập nhật trong `.env`:
   - `SENDGRID_API_KEY=<your_api_key>`
   - `SENDGRID_FROM_EMAIL=<verified_email>`

## Bước 6: Khởi động server
```bash
cd backend
npm run seed    # Tạo admin account và seed data
npm run dev     # Khởi động server
```

## Kiểm tra
Server sẽ chạy tại: http://localhost:5000

Test health check:
```bash
curl http://localhost:5000/health
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Mercury Wanda API is running",
  "timestamp": "2026-03-29T10:18:00.000Z"
}
```

## Troubleshooting

### Lỗi "Missing Supabase environment variables"
- Kiểm tra file `.env` đã có `SUPABASE_SERVICE_KEY`
- Đảm bảo không có khoảng trắng thừa
- Key phải bắt đầu bằng `eyJ...`

### Lỗi "Invalid API key"
- Key đã copy đúng chưa?
- Thử copy lại từ Supabase Dashboard
- Đảm bảo copy key **service_role**, không phải anon key

### Server không khởi động
- Kiểm tra port 5000 có bị chiếm không
- Chạy `npm install` lại
- Xóa `node_modules` và chạy `npm install` lại
