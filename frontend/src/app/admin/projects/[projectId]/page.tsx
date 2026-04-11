'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/lib/api/types';
import {
  BRAND_CONFIG,
  SERVICE_LINE_LABELS,
  getCategoriesForServiceLine,
  getServiceCategoryLabel,
  normalizeBrand,
  toLegacyCategory,
  type BrandKey,
  type ServiceCategory,
  type ServiceLine,
} from '@/lib/service-config';

interface ProjectFormData {
  title: string;
  slug: string;
  service_line: ServiceLine | '';
  brand: BrandKey | '';
  service_category: ServiceCategory | '';
  venue: string;
  scale: string;
  style: string;
  client: string;
  event_date: string;
  description: string;
  thumbnail: string;
  galleryText: string;
  is_featured: boolean;
}

const sanitizeStorageSegment = (value: string, fallback = 'file') => {
  const sanitized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .toLowerCase();

  return sanitized || fallback;
};

const sanitizeSlugInput = (value: string) => sanitizeStorageSegment(value, '');

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const isNewProject = projectId === 'new';

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    service_line: '',
    brand: '',
    service_category: '',
    venue: '',
    scale: '',
    style: '',
    client: '',
    event_date: '',
    description: '',
    thumbnail: '',
    galleryText: '',
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        await apiClient.getMe();
        if (!isNewProject) {
          setLoading(true);
          const response = await apiClient.getAdminProject(projectId);
          const data = response.data;

          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            service_line: data.service_line || 'to-chuc-su-kien',
            brand: data.brand || 'wanda-event',
            service_category: data.service_category || 'Wedding',
            venue: data.venue || '',
            scale: data.scale || '',
            style: data.style || '',
            client: data.client || '',
            event_date: data.event_date ? String(data.event_date).slice(0, 10) : '',
            description: data.description || '',
            thumbnail: data.thumbnail || '',
            galleryText: Array.isArray(data.gallery) ? data.gallery.join('\n') : '',
            is_featured: Boolean(data.is_featured),
          });
          setThumbnailPreview(data.thumbnail || '');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải thông tin dự án';
        setError(message);
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('đăng nhập')) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [isNewProject, projectId, router]);

  const availableCategories = useMemo(
    () => getCategoriesForServiceLine(formData.service_line || 'to-chuc-su-kien'),
    [formData.service_line]
  );

  const selectedBrand = formData.brand ? BRAND_CONFIG[formData.brand] : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'service_line') {
      const serviceLine = value as ServiceLine;
      const nextBrand = normalizeBrand(serviceLine);
      const defaultCategory = getCategoriesForServiceLine(serviceLine)[0];

      setFormData((prev) => ({
        ...prev,
        service_line: serviceLine,
        brand: nextBrand,
        service_category: defaultCategory,
      }));
      return;
    }

    if (name === 'brand') {
      setFormData((prev) => ({ ...prev, brand: value as BrandKey }));
      return;
    }

    if (name === 'service_category') {
      setFormData((prev) => ({ ...prev, service_category: value as ServiceCategory }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setThumbnailPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryFiles(Array.from(e.target.files || []));
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return [] as string[];

    setUploading(true);
    try {
      const results = await Promise.all(files.map((file) => apiClient.uploadImage(file)));
      return results.map((result) => result.data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.service_line || !formData.service_category || !formData.brand) {
      setError('Vui lòng chọn đầy đủ Loại dịch vụ, Brand và Danh mục trước khi lưu.');
      return;
    }


    setSaving(true);

    try {
      const slug = sanitizeSlugInput(formData.slug.trim()) || undefined;

      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        const [uploadedThumbnail] = await uploadFiles([thumbnailFile]);
        thumbnailUrl = uploadedThumbnail || thumbnailUrl;
      }

      let galleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        galleryUrls = await uploadFiles(galleryFiles);
      } else if (formData.galleryText.trim()) {
        galleryUrls = formData.galleryText.split('\n').map((item) => item.trim()).filter(Boolean);
      }

      const payload: Partial<Project> = {
        title: formData.title.trim(),
        slug,
        service_line: formData.service_line,
        brand: formData.brand,
        service_category: formData.service_category,
        category: toLegacyCategory(formData.service_line, formData.service_category),
        venue: formData.venue.trim() || null,
        scale: formData.scale.trim() || null,
        style: formData.style.trim() || null,
        client: formData.client.trim() || null,
        event_date: formData.event_date || null,
        description: formData.description.trim() || null,
        thumbnail: thumbnailUrl || null,
        gallery: galleryUrls.length > 0 ? galleryUrls : null,
        is_featured: formData.is_featured,
      };

      if (isNewProject) {
        await apiClient.createProject(payload);
      } else {
        await apiClient.updateProject(projectId, payload);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu dự án');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;

    try {
      await apiClient.deleteProject(projectId);
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa dự án');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-[#d6e5fa] bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-lg">Đang tải project editor...</div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-10 overflow-hidden rounded-[28px] border border-[#dfe9f6] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_50%,#edf4ff_100%)] p-8 shadow-[0_32px_80px_-40px_rgba(15,76,129,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
            <button
              id="project-editor-back"
              onClick={() => router.back()}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dbe7f5] bg-white px-4 py-2 text-sm font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/30 hover:bg-[#f4f9ff]"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b8ea8]">Project editor</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827]">{isNewProject ? 'Tạo dự án mới' : 'Cập nhật project detail'}</h1>
            <p className="mt-4 text-sm leading-7 text-[#526070]">Dữ liệu dự án, featured ordering và nội dung gallery đều đi qua admin backend API.</p>
          </div>

          <div className="rounded-[24px] border border-[#e4edf8] bg-[#0d1f35] px-6 py-5 text-white shadow-[0_24px_60px_-30px_rgba(13,31,53,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8eb5e3]">Service lane</p>
            <p className="mt-2 text-xl font-semibold">{formData.service_line ? SERVICE_LINE_LABELS[formData.service_line] : 'Chưa chọn'}</p>
            <p className="mt-2 text-sm text-[#bfd1e6]">Brand và category sẽ được đồng bộ theo logic hiện có.</p>
          </div>
        </div>
      </header>

      {error && <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Loại dịch vụ *</label>
              <select
                id="project-service-line"
                name="service_line"
                value={formData.service_line}
                onChange={handleInputChange}
                required
                className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]"
              >
                <option value="">Chọn loại dịch vụ</option>
                <option value="to-chuc-su-kien">Tổ Chức Sự Kiện</option>
                <option value="decor-tiec-cuoi">Decor Tiệc Cưới</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Brand *</label>
              <select
                id="project-brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                disabled={!formData.service_line}
                className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Chọn brand</option>
                <option value="wanda-event">Wanda Event</option>
                <option value="pi-decor">Pi Decor</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Danh mục *</label>
              <select
                id="project-service-category"
                name="service_category"
                value={formData.service_category}
                onChange={handleInputChange}
                required
                disabled={!formData.service_line}
                className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Chọn danh mục</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {getServiceCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedBrand && (
            <div className="mt-6 rounded-[24px] border border-[#dce7f8] bg-[linear-gradient(135deg,#f7fbff_0%,#ffffff_100%)] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Brand context</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{selectedBrand.name}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{selectedBrand.heroCopy}</p>
            </div>
          )}
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
          <h2 className="mb-6 text-2xl font-semibold text-[#191c1d]">Thông tin dự án</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Tên dự án *</label>
              <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Slug</label>
              <input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="de-trong-de-auto-generate" className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Khách hàng</label>
              <input name="client" value={formData.client} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Ngày sự kiện</label>
              <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Venue</label>
              <input name="venue" value={formData.venue} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Quy mô</label>
              <input name="scale" value={formData.scale} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Phong cách</label>
              <input name="style" value={formData.style} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full resize-none rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
          <h2 className="mb-6 text-2xl font-semibold text-[#191c1d]">Media & featured settings</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Thumbnail</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
              {thumbnailFile && <p className="mt-2 text-sm text-slate-500">{thumbnailFile.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Gallery images</label>
              <input type="file" multiple accept="image/*" onChange={handleGalleryFilesChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
              {galleryFiles.length > 0 && <p className="mt-2 text-sm text-slate-500">Đã chọn {galleryFiles.length} ảnh</p>}
            </div>

            {thumbnailPreview && (
              <div className="md:col-span-2">
                <p className="mb-3 text-sm font-semibold text-[#42474f]">Preview thumbnail</p>
                <img src={thumbnailPreview} alt="Thumbnail preview" className="h-72 w-full rounded-[24px] object-cover" />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Gallery URLs (fallback)</label>
              <textarea name="galleryText" value={formData.galleryText} onChange={handleInputChange} rows={5} placeholder="Mỗi dòng là 1 URL ảnh" className="w-full resize-none rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
              {uploading && <p className="mt-3 text-sm text-[#0F4C81]">Đang upload ảnh...</p>}
            </div>

            <div className="md:col-span-2 rounded-[24px] border border-[#e4edf8] bg-[#f8fbff] p-5">
              <label className="inline-flex cursor-pointer items-center gap-3">
                <input id="project-is-featured" type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleCheckboxChange} className="h-4 w-4" />
                <span className="text-sm font-semibold text-[#111827]">Hiển thị nổi bật trên public site</span>
              </label>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div>
            {!isNewProject && (
              <button type="button" onClick={handleDelete} className="rounded-full bg-[#ffdad6] px-6 py-3 font-semibold text-[#ba1a1a] transition hover:bg-[#ffb4ab]">
                Xóa dự án
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="rounded-full bg-[#e7e8e9] px-6 py-3 font-semibold text-[#191c1d] transition hover:bg-[#e1e3e4]">
              Hủy
            </button>
            <button type="submit" disabled={saving || uploading} className="rounded-full bg-[linear-gradient(135deg,#0F4C81_0%,#3b82f6_100%)] px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? 'Đang lưu...' : isNewProject ? 'Tạo dự án' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
