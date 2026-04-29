# Mercury Wanda Backend

Backend API cho he thong quan ly su kien Mercury Wanda.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Email**: SendGrid
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Structure

```text
backend/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- routes/
|   `-- server.js
|-- scripts/
|   `-- seed.js
|-- .env.example
`-- package.json
```

## API Surface

Backend phuc vu cac nhom chuc nang chinh:

- Quan ly du an su kien
- Quan ly thu vien media
- Thu thap lead tu form lien he
- Quan tri noi dung sau dang nhap

## Database

- `projects` - Du an su kien
- `leads` - Khach hang tiem nang
- `library` - Thu vien media
- `admins` - Tai khoan admin

## Security

Secrets, credentials, and environment-specific values are managed outside source control.
