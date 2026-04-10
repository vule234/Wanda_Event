import type { BrandKey, ServiceCategory, ServiceLine } from '@/lib/service-config';

export type LeadStatus = 'new' | 'processing' | 'closed';
export type LeadPriority = 'low' | 'medium' | 'high';

export interface Project {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  service_line: ServiceLine;
  brand: BrandKey;
  service_category: ServiceCategory;
  venue?: string | null;
  scale?: string | null;
  style?: string | null;
  client?: string | null;
  event_date?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  gallery?: string[] | null;
  is_featured?: boolean;
  featured_order?: number | null;
  featured_note?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  message?: string | null;
  source?: string | null;
  status: LeadStatus;
  priority?: LeadPriority | null;
  internal_note?: string | null;
  contacted_at?: string | null;
  last_follow_up_at?: string | null;
  next_follow_up_at?: string | null;
  assigned_to?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role?: string;
  last_login?: string | null;
}

export interface AdminSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ProjectStats {
  totalProjects: number;
  featuredProjects: number;
  eventProjects: number;
  decorProjects: number;
}

export interface LeadStats {
  total: number;
  new: number;
  processing: number;
  closed: number;
}
