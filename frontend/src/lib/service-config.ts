export const SERVICE_LINES = ['to-chuc-su-kien', 'decor-tiec-cuoi'] as const;
export const BRANDS = ['wanda-event', 'pi-decor'] as const;

export type ServiceLine = (typeof SERVICE_LINES)[number];
export type BrandKey = (typeof BRANDS)[number];

export const EVENT_SERVICE_CATEGORIES = [
  'Wedding',
  'Corporate',
  'Birthday',
  'Graduation',
  'Festival',
  'Exhibition',
  'School',
  'Other',
] as const;

export const DECOR_SERVICE_CATEGORIES = [
  'Trang Tri Gia Tien',
  'Trang Tri Nha Hang',
  'Trang Tri Tiec Cuoi Ngoai Troi',
] as const;

export type EventServiceCategory = (typeof EVENT_SERVICE_CATEGORIES)[number];
export type DecorServiceCategory = (typeof DECOR_SERVICE_CATEGORIES)[number];
export type ServiceCategory = EventServiceCategory | DecorServiceCategory;

export const BRAND_CONFIG: Record<
  BrandKey,
  {
    name: string;
    shortName: string;
    serviceLine: ServiceLine;
    listingPath: string;
    contactHref: string;
    phoneDisplay: string;
    email?: string;
    facebook?: string;
    logo?: string;
    heroCopy: string;
    accentClass: string;
  }
> = {
  'wanda-event': {
    name: 'Wanda Event',
    shortName: 'Wanda Event',
    serviceLine: 'to-chuc-su-kien',
    listingPath: '/projects',
    contactHref: '/contact',
    phoneDisplay: '096 262 24 38',
    email: 'mercurywandavn@gmail.com',
    heroCopy: 'Tổ chức sự kiện chỉnh chu, đậm dấu ấn thương hiệu và cảm xúc.',
    accentClass: 'from-[#0f4c81] via-[#1a5f97] to-[#7ab8ff]',
  },
  'pi-decor': {
    name: 'Pi Decor',
    shortName: 'Pi Decor',
    serviceLine: 'decor-tiec-cuoi',
    listingPath: '/decor-tiec-cuoi',
    contactHref: 'https://zalo.me/0789241260',
    phoneDisplay: '0789 241 260',
    facebook: 'https://www.facebook.com/pi.decor.2024',
    logo: '/pidecor.jpg',
    heroCopy: 'Pi Decor – Kiến tạo không gian cưới sang trọng và giàu cảm xúc',
    accentClass: 'from-[#6b2d5c] via-[#b47b84] to-[#f0d6cf]',
  },
};

export const SERVICE_LINE_LABELS: Record<ServiceLine, string> = {
  'to-chuc-su-kien': 'Tổ Chức Sự Kiện',
  'decor-tiec-cuoi': 'Decor Tiệc Cưới',
};

export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  All: 'Tất cả',
  Wedding: 'Tổ chức tiệc cưới',
  Corporate: 'Tổ chức sự kiện doanh nghiệp',
  Birthday: 'Tổ chức sinh nhật',
  Graduation: 'Lễ tốt nghiệp',
  Festival: 'Sự kiện cộng đồng / lễ hội',
  Exhibition: 'Triển lãm / activation / booth',
  School: 'Tổ chức sự kiện trường học',
  Other: 'Khác',
  'Trang Tri Gia Tien': 'Trang Trí Gia Tiên',
  'Trang Tri Nha Hang': 'Trang Trí Nhà Hàng',
  'Trang Tri Tiec Cuoi Ngoai Troi': 'Trang Trí Tiệc Cưới Ngoài Trời',
};

export function getCategoriesForServiceLine(serviceLine?: ServiceLine | '') {
  if (serviceLine === 'decor-tiec-cuoi') {
    return [...DECOR_SERVICE_CATEGORIES];
  }

  return [...EVENT_SERVICE_CATEGORIES];
}

export function getServiceCategoryLabel(category?: string | null) {
  if (!category) {
    return SERVICE_CATEGORY_LABELS.Other;
  }

  return SERVICE_CATEGORY_LABELS[category] || category;
}

export function getBrandConfig(brand?: string | null, serviceLine?: string | null) {
  if (brand === 'pi-decor' || serviceLine === 'decor-tiec-cuoi') {
    return BRAND_CONFIG['pi-decor'];
  }

  return BRAND_CONFIG['wanda-event'];
}

export function getListingPath(serviceLine?: string | null) {
  return serviceLine === 'decor-tiec-cuoi' ? '/decor-tiec-cuoi' : '/projects';
}

export function getProjectHref(project: { slug: string; service_line?: string | null }) {
  return `${getListingPath(project.service_line)}/${project.slug}`;
}

export function normalizeBrand(serviceLine?: ServiceLine | '', explicitBrand?: BrandKey | ''): BrandKey {
  if (explicitBrand) {
    return explicitBrand;
  }

  return serviceLine === 'decor-tiec-cuoi' ? 'pi-decor' : 'wanda-event';
}

export function toLegacyCategory(serviceLine: ServiceLine, serviceCategory: ServiceCategory) {
  if (serviceLine === 'decor-tiec-cuoi') {
    return 'Wedding';
  }

  return serviceCategory;
}
