# Mercury Wanda Backend - Troubleshooting Guide

## 🔍 Các Vấn Đề Phổ Biến và Giải Pháp

### 1. Lỗi Kết Nối Supabase

**Triệu Chứng:**
```
Error: Invalid API key
Error: Failed to connect to Supabase
```

**Nguyên Nhân:**
- `SUPABASE_SERVICE_KEY` không đúng
- `SUPABASE_URL` không đúng
- Supabase project không active

**Giải Pháp:**
```bash
# 1. Kiểm tra credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# 2. Xác minh Supabase project
# - Đăng nhập vào https://app.supabase.com
# - Chọn project
# - Kiểm tra Settings > API > Keys

# 3. Cập nhật .env file
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_correct_service_key

# 4. Restart server
npm run dev
```

---

### 2. Lỗi SendGrid Email

**Triệu Chứng:**
```
Error: Invalid API key
Email not sending
```

**Nguyên Nhân:**
- `SENDGRID_API_KEY` không đúng
- Sender email không verified
- API key bị disable

**Giải Pháp:**
```bash
# 1. Kiểm tra API key
# - Đăng nhập vào https://sendgrid.com
# - Vào Settings > API Keys
# - Verify key is active

# 2. Verify sender email
# - Vào Settings > Sender Authentication
# - Verify email address

# 3. Cập nhật .env
SENDGRID_API_KEY=SG.your_correct_key
SENDGRID_FROM_EMAIL=verified_email@domain.com

# 4. Test email
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"0909123456","email":"test@example.com"}'
```

---

### 3. Lỗi CORS

**Triệu Chứng:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Nguyên Nhân:**
- `CORS_ORIGIN` không khớp với frontend URL
- CORS middleware không được cấu hình đúng

**Giải Pháp:**
```bash
# 1. Kiểm tra CORS_ORIGIN
echo $CORS_ORIGIN

# 2. Cập nhật .env
# Development:
CORS_ORIGIN=http://localhost:3000

# Production:
CORS_ORIGIN=https://mercurywanda.com

# 3. Restart server
npm run dev

# 4. Test CORS
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:5000/api/projects
```

---

### 4. Lỗi Rate Limiting

**Triệu Chứng:**
```
429 Too Many Requests
```

**Nguyên Nhân:**
- Quá nhiều requests trong thời gian ngắn
- Rate limit configuration quá thấp

**Giải Pháp:**
```bash
# 1. Kiểm tra rate limit settings
echo $RATE_LIMIT_WINDOW_MS
echo $RATE_LIMIT_MAX_REQUESTS

# 2. Điều chỉnh nếu cần
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# 3. Chờ window reset (15 phút)
# Hoặc restart server

# 4. Test lại
curl http://localhost:5000/api/projects
```

---

### 5. Lỗi Authentication

**Triệu Chứng:**
```
401 Unauthorized
Token không hợp lệ hoặc đã hết hạn
```

**Nguyên Nhân:**
- Token hết hạn
- Token không đúng format
- User không tồn tại

**Giải Pháp:**
```bash
# 1. Lấy token mới
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mercurywanda.com","password":"MercuryWanda2024!"}'

# 2. Sử dụng token mới
curl http://localhost:5000/api/admin/me \
  -H "Authorization: Bearer YOUR_NEW_TOKEN"

# 3. Kiểm tra admin account
# - Đăng nhập vào Supabase
# - Kiểm tra admins table
# - Verify user_id matches
```

---

### 6. Lỗi Database

**Triệu Chứng:**
```
Error: relation "projects" does not exist
Error: permission denied
```

**Nguyên Nhân:**
- Tables không được tạo
- RLS policies không được cấu hình
- Permissions không đúng

**Giải Pháp:**
```bash
# 1. Kiểm tra tables
# - Đăng nhập vào Supabase
# - Vào SQL Editor
# - Chạy: SELECT * FROM information_schema.tables WHERE table_schema = 'public';

# 2. Tạo tables nếu cần
# - Chạy migration scripts
# - Hoặc chạy seed script
npm run seed

# 3. Kiểm tra RLS policies
# - Vào Authentication > Policies
# - Verify policies are enabled

# 4. Kiểm tra permissions
# - Verify service role has correct permissions
```

---

### 7. Lỗi Upload File

**Triệu Chứng:**
```
Error: Failed to upload file
Error: Bucket not found
```

**Nguyên Nhân:**
- Storage bucket không tồn tại
- File size quá lớn
- File type không được phép

**Giải Pháp:**
```bash
# 1. Kiểm tra storage bucket
# - Đăng nhập vào Supabase
# - Vào Storage
# - Verify 'images' bucket exists

# 2. Tạo bucket nếu cần
npm run seed

# 3. Kiểm tra file size
# Max: 10MB
# Verify file is < 10MB

# 4. Kiểm tra file type
# Allowed: image/png, image/jpeg, image/jpg, image/webp
# Verify file is correct type

# 5. Test upload
curl -X POST http://localhost:5000/api/admin/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

### 8. Lỗi Server Crash

**Triệu Chứng:**
```
Server stopped
Process exited with code 1
```

**Nguyên Nhân:**
- Unhandled exception
- Missing environment variable
- Memory leak

**Giải Pháp:**
```bash
# 1. Kiểm tra logs
# - Xem console output
# - Kiểm tra error messages

# 2. Kiểm tra environment variables
npm run check-env

# 3. Kiểm tra dependencies
npm install

# 4. Restart server
npm run dev

# 5. Kiểm tra memory usage
# - Monitor system resources
# - Check for memory leaks
```

---

### 9. Lỗi Performance

**Triệu Chứng:**
```
Slow response times
High CPU usage
```

**Nguyên Nhân:**
- Database queries không optimized
- Too many requests
- Memory leak

**Giải Pháp:**
```bash
# 1. Kiểm tra response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/projects

# 2. Kiểm tra database queries
# - Enable query logging
# - Analyze slow queries

# 3. Optimize queries
# - Add indexes
# - Use pagination
# - Cache results

# 4. Monitor resources
# - Check CPU usage
# - Check memory usage
# - Check disk usage
```

---

### 10. Lỗi Deployment

**Triệu Chứng:**
```
Deployment failed
Build error
```

**Nguyên Nhân:**
- Missing dependencies
- Environment variables not set
- Build script error

**Giải Pháp:**
```bash
# 1. Kiểm tra dependencies
npm install

# 2. Kiểm tra environment variables
# - Verify all required variables are set
# - Check for typos

# 3. Test build locally
npm run build

# 4. Check logs
# - View deployment logs
# - Look for error messages

# 5. Rollback if needed
# - Revert to previous version
# - Redeploy
```

---

## 📊 Debugging Tips

### Enable Debug Logging
```bash
# Set debug level
DEBUG=* npm run dev

# Or in code
console.log('[DEBUG]', variable);
```

### Check Environment
```bash
# Print all environment variables
node -e "console.log(process.env)"

# Check specific variable
echo $SUPABASE_URL
```

### Test Endpoints
```bash
# Use curl for testing
curl -v http://localhost:5000/api/projects

# Use Postman for GUI testing
# Import API_DOCUMENTATION.md

# Use Thunder Client (VS Code extension)
```

### Monitor Logs
```bash
# View real-time logs
tail -f logs/app.log

# Search logs
grep "error" logs/app.log

# Count errors
grep -c "error" logs/app.log
```

---

## 🆘 Still Having Issues?

1. **Check Documentation**
   - README.md
   - API_DOCUMENTATION.md
   - SETUP_GUIDE.md

2. **Check Logs**
   - Server console output
   - Supabase logs
   - SendGrid logs

3. **Check Configuration**
   - .env file
   - Environment variables
   - Credentials

4. **Contact Support**
   - Email: support@mercurywanda.com
   - Include error message
   - Include steps to reproduce

---

**Last Updated**: 2026-03-29
**Version**: 1.0
