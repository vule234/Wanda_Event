import type {
  AdminProfile,
  AdminSession,
  ApiResponse,
  Lead,
  LeadPriority,
  LeadStats,
  LeadStatus,
  LibraryItem,
  PaginationMeta,
  Project,
  ProjectStats,
} from '@/lib/api/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ADMIN_TOKEN_KEY = 'admin_token';

export type LeadPayload = Pick<Lead, 'name' | 'phone' | 'email'> & {
  message?: string;
  event_type?: string;
  event_date?: string;
  website?: string;
  submitted_after_ms?: number;
  captcha_token?: string;
};

export type ProjectPayload = Partial<Project> & {
  gallery?: string[] | null;
};

export type LeadUpdatePayload = Partial<
  Pick<Lead, 'status' | 'priority' | 'internal_note' | 'assigned_to' | 'contacted_at' | 'last_follow_up_at' | 'next_follow_up_at'>
>;

export type LibraryPayload = Partial<LibraryItem> & {
  type?: 'album' | 'video' | 'document' | 'inspiration';
  thumbnail?: string;
  content_url?: string;
};

class ApiClient {
  private baseUrl = API_URL;
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    }
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  }

  private buildHeaders(headers?: HeadersInit, body?: BodyInit | null) {
    const nextHeaders = new Headers(headers);

    if (this.token) {
      nextHeaders.set('Authorization', `Bearer ${this.token}`);
    }

    if (body && !(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
      nextHeaders.set('Content-Type', 'application/json');
    }

    return nextHeaders;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: this.buildHeaders(options.headers, options.body ?? null),
      cache: 'no-store',
    });

    if (!response.ok) {
      let message = 'API request failed';

      try {
        const error = (await response.json()) as { message?: string };
        message = error.message || message;
      } catch {
        message = response.statusText || message;
      }

      if (response.status === 401) {
        this.clearToken();
      }

      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  async login(email: string, password: string) {
    const response = await this.request<
      ApiResponse<{ user: AdminProfile; session: AdminSession }>
    >('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const token = response.data?.session?.access_token;
    if (token) {
      this.setToken(token);
    }

    return response;
  }

  async logout() {
    try {
      if (this.token) {
        await this.request<ApiResponse<null>>('/api/admin/auth/logout', { method: 'POST' });
      }
    } finally {
      this.clearToken();
    }
  }

  async getMe() {
    return this.request<ApiResponse<AdminProfile>>('/api/admin/me');
  }

  async getProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
    serviceLine?: string;
    brand?: string;
    serviceCategory?: string;
  }) {
    const query = new URLSearchParams();

    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (typeof params?.featured === 'boolean') query.set('featured', String(params.featured));
    if (params?.search) query.set('search', params.search);
    if (params?.serviceLine) query.set('service_line', params.serviceLine);
    if (params?.brand) query.set('brand', params.brand);
    if (params?.serviceCategory) query.set('service_category', params.serviceCategory);

    const queryString = query.toString();
    return this.request<ApiResponse<Project[]>>(queryString ? `/api/projects?${queryString}` : '/api/projects');
  }

  async getProjectBySlug(slug: string) {
    return this.request<ApiResponse<Project & { related?: Project[] }>>(`/api/projects/${slug}`);
  }

  async getAdminProjects(params?: { search?: string; serviceLine?: string; featured?: boolean }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.serviceLine) query.set('service_line', params.serviceLine);
    if (typeof params?.featured === 'boolean') query.set('featured', String(params.featured));

    const queryString = query.toString();
    return this.request<ApiResponse<Project[]>>(queryString ? `/api/admin/projects?${queryString}` : '/api/admin/projects');
  }

  async getAdminProject(id: string) {
    return this.request<ApiResponse<Project>>(`/api/admin/projects/${id}`);
  }

  async getProjectStats() {
    return this.request<ApiResponse<ProjectStats>>('/api/admin/projects/stats');
  }

  async createProject(data: ProjectPayload) {
    return this.request<ApiResponse<Project>>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: ProjectPayload) {
    return this.request<ApiResponse<Project>>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<ApiResponse<null>>(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getLeads(params?: { page?: number; limit?: number; status?: LeadStatus; search?: string; priority?: LeadPriority }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.priority) query.set('priority', params.priority);

    const queryString = query.toString();
    return this.request<ApiResponse<Lead[]>>(queryString ? `/api/admin/leads?${queryString}` : '/api/admin/leads');
  }

  async getLead(id: string) {
    return this.request<ApiResponse<Lead>>(`/api/admin/leads/${id}`);
  }

  async getLeadStats() {
    return this.request<ApiResponse<LeadStats>>('/api/admin/leads/stats');
  }

  async updateLead(id: string, data: LeadUpdatePayload) {
    return this.request<ApiResponse<Lead>>(`/api/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request<ApiResponse<null>>(`/api/admin/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async getLibrary() {
    return this.request<ApiResponse<LibraryItem[]>>('/api/library');
  }

  async submitLead(data: LeadPayload) {
    return this.request<ApiResponse<Lead>>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createLibraryItem(data: LibraryPayload) {
    return this.request<ApiResponse<LibraryItem>>('/api/admin/library', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLibraryItem(id: string, data: LibraryPayload) {
    return this.request<ApiResponse<LibraryItem>>(`/api/admin/library/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLibraryItem(id: string) {
    return this.request<ApiResponse<null>>(`/api/admin/library/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<ApiResponse<{ url: string; path: string }>>('/api/admin/upload/image', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
export type { PaginationMeta };
