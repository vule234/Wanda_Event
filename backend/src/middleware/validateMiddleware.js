const { z } = require('zod');

const EVENT_PROJECT_CATEGORIES = [
  'Wedding',
  'Corporate',
  'Birthday',
  'Graduation',
  'Festival',
  'Exhibition',
  'School',
  'Other',
];

const DECOR_PROJECT_CATEGORIES = [
  'Trang Tri Gia Tien',
  'Trang Tri Nha Hang',
  'Trang Tri Tiec Cuoi Ngoai Troi',
];

const PROJECT_CATEGORIES = [...EVENT_PROJECT_CATEGORIES, ...DECOR_PROJECT_CATEGORIES];
const SERVICE_LINES = ['to-chuc-su-kien', 'decor-tiec-cuoi'];
const BRANDS = ['wanda-event', 'pi-decor'];
const LEAD_STATUSES = ['new', 'processing', 'closed'];
const LEAD_PRIORITIES = ['low', 'medium', 'high'];

function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues || error.errors || [];

        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: issues.map((err) => ({
            field: Array.isArray(err.path) ? err.path.join('.') : '',
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
};

const blankToUndefined = (value) => {
  if (value === '' || value === null || typeof value === 'undefined') {
    return undefined;
  }

  return value;
};

const blankToNull = (value) => {
  if (value === '' || typeof value === 'undefined') {
    return null;
  }

  return value;
};

const normalizeString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized === '' ? '' : normalized;
};

const normalizeOptionalString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized === '' ? undefined : normalized;
};

const normalizeOptionalLowercaseEmail = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === '' ? undefined : normalized;
};

const optionalDateString = z.preprocess(
  blankToUndefined,
  z.string().refine(isValidDate, 'Ngày không hợp lệ').optional()
);

const nullableDateString = z.preprocess(
  blankToNull,
  z.string().refine(isValidDate, 'Ngày không hợp lệ').nullable()
);

const leadSchema = z.object({
  name: z.preprocess(
    normalizeString,
    z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên không được vượt quá 100 ký tự')
  ),
  phone: z.preprocess(
    normalizeString,
    z
      .string()
      .regex(phoneRegex, 'Số điện thoại không hợp lệ (hỗ trợ: 0912345678, +84912345678, 84912345678)')
  ),
  email: z.preprocess(
    normalizeOptionalLowercaseEmail,
    z.string().email('Email không hợp lệ').optional()
  ),
  event_type: z.preprocess(blankToUndefined, z.enum(EVENT_PROJECT_CATEGORIES).optional()),
  event_date: optionalDateString,
  message: z.preprocess(
    normalizeOptionalString,
    z.string().max(1000, 'Tin nhắn không được vượt quá 1000 ký tự').optional()
  ),
  website: z.preprocess((value) => (typeof value === 'string' ? value.trim() : value), z.string().max(0).optional().default('')),
  submitted_after_ms: z.preprocess(
    (value) => {
      if (value === '' || value === null || typeof value === 'undefined') {
        return undefined;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : value;
    },
    z.number().int().min(0).max(1000 * 60 * 60).optional()
  ),
  captcha_token: z.preprocess(normalizeOptionalString, z.string().min(10, 'Captcha token không hợp lệ').optional()),
});

const projectSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  slug: z.preprocess(blankToNull, z.string().max(250, 'Slug quá dài').nullable().optional()),
  category: z.enum(EVENT_PROJECT_CATEGORIES),
  service_line: z.enum(SERVICE_LINES),
  brand: z.enum(BRANDS),
  service_category: z.enum(PROJECT_CATEGORIES),
  venue: z.preprocess(blankToNull, z.string().max(200, 'Địa điểm không được vượt quá 200 ký tự').nullable().optional()),
  scale: z.preprocess(blankToNull, z.string().max(100, 'Quy mô không được vượt quá 100 ký tự').nullable().optional()),
  style: z.preprocess(blankToNull, z.string().max(100, 'Phong cách không được vượt quá 100 ký tự').nullable().optional()),
  client: z.preprocess(blankToNull, z.string().max(100, 'Tên khách hàng không được vượt quá 100 ký tự').nullable().optional()),
  event_date: nullableDateString.optional(),
  description: z.preprocess(blankToNull, z.string().max(5000, 'Mô tả không được vượt quá 5000 ký tự').nullable().optional()),
  thumbnail: z.preprocess(blankToNull, z.string().url('URL thumbnail không hợp lệ').nullable().optional()),
  gallery: z.preprocess(
    (value) => (value === '' ? null : value),
    z.array(z.string().url('URL ảnh không hợp lệ')).max(50, 'Không được vượt quá 50 ảnh').nullable().optional()
  ),
  is_featured: z.boolean().optional(),
  featured_order: z.preprocess(
    blankToNull,
    z.number({ invalid_type_error: 'Thứ tự nổi bật phải là số' }).int('Thứ tự nổi bật phải là số nguyên').min(1, 'Thứ tự nổi bật phải lớn hơn 0').nullable().optional()
  ),
  featured_note: z.preprocess(blankToNull, z.string().max(2000, 'Ghi chú nội bộ không được vượt quá 2000 ký tự').nullable().optional()),
});

const leadUpdateSchema = z
  .object({
    status: z.preprocess(blankToUndefined, z.enum(LEAD_STATUSES).optional()),
    priority: z.preprocess(blankToUndefined, z.enum(LEAD_PRIORITIES).optional()),
    internal_note: z.preprocess(blankToNull, z.string().max(3000, 'Ghi chú nội bộ không được vượt quá 3000 ký tự').nullable().optional()),
    assigned_to: z.preprocess(blankToNull, z.string().max(200, 'Người phụ trách không được vượt quá 200 ký tự').nullable().optional()),
    contacted_at: nullableDateString.optional(),
    last_follow_up_at: nullableDateString.optional(),
    next_follow_up_at: nullableDateString.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Vui lòng cung cấp ít nhất một trường cần cập nhật',
  });

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

const librarySchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  type: z.enum(['album', 'video', 'document', 'inspiration']),
  description: z.string().max(2000, 'Mô tả không được vượt quá 2000 ký tự').optional(),
  thumbnail: z.string().url('URL thumbnail không hợp lệ').optional(),
  content_url: z.string().url('URL nội dung không hợp lệ').optional(),
});

module.exports = {
  validate,
  leadSchema,
  leadUpdateSchema,
  projectSchema,
  loginSchema,
  librarySchema,
  EVENT_PROJECT_CATEGORIES,
  DECOR_PROJECT_CATEGORIES,
  PROJECT_CATEGORIES,
  SERVICE_LINES,
  BRANDS,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
};
