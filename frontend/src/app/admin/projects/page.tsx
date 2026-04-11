'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/admin/ProjectCard';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/lib/api/types';
import { SERVICE_LINE_LABELS, getServiceCategoryLabel } from '@/lib/service-config';

type ViewMode = 'grid' | 'list';
type ServiceFilter = 'all' | 'to-chuc-su-kien' | 'decor-tiec-cuoi';
type FeaturedFilter = 'all' | 'featured';
type BulkAction = 'delete' | 'feature' | null;
type ConfirmAction =
  | { type: 'delete-single'; project: Project }
  | { type: 'feature-single'; project: Project }
  | { type: 'unfeature-single'; project: Project }
  | { type: 'bulk-delete' }
  | { type: 'bulk-feature' }
  | null;

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [featuringIds, setFeaturingIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await apiClient.getMe();
        const response = await apiClient.getAdminProjects();
        setProjects(response.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách dự án';
        setError(message);
        if (
          message.toLowerCase().includes('unauthorized') ||
          message.toLowerCase().includes('đăng nhập') ||
          message.toLowerCase().includes('không có quyền')
        ) {
          apiClient.clearToken();
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [router]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesService = serviceFilter === 'all' || project.service_line === serviceFilter;
      const matchesFeatured = featuredFilter === 'all' || (featuredFilter === 'featured' && Boolean(project.is_featured));
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.client?.toLowerCase().includes(query) ||
        project.venue?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.featured_note?.toLowerCase().includes(query);

      return matchesService && matchesFeatured && matchesQuery;
    });
  }, [featuredFilter, projects, searchQuery, serviceFilter]);

  const visibleIds = useMemo(() => filteredProjects.map((project) => String(project.id)), [filteredProjects]);

  const selectedVisibleCount = useMemo(
    () => visibleIds.filter((id) => selectedIds.includes(id)).length,
    [selectedIds, visibleIds],
  );

  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const selectedProjects = useMemo(
    () => projects.filter((project) => selectedIds.includes(String(project.id))),
    [projects, selectedIds],
  );

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Hôm nay';
    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const counts = {
    all: projects.length,
    featured: projects.filter((project) => project.is_featured).length,
    'to-chuc-su-kien': projects.filter((project) => project.service_line === 'to-chuc-su-kien').length,
    'decor-tiec-cuoi': projects.filter((project) => project.service_line === 'decor-tiec-cuoi').length,
  };

  const toggleSelection = (projectId: string) => {
    setSelectedIds((current) =>
      current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId],
    );
  };

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...visibleIds])));
  };

  const removeProjectsFromState = (idsToRemove: string[]) => {
    setProjects((current) => current.filter((project) => !idsToRemove.includes(String(project.id))));
    setSelectedIds((current) => current.filter((id) => !idsToRemove.includes(id)));
  };

  const getNextFeaturedOrder = (items: Project[]) =>
    items.reduce((max, item) => {
      if (!item.is_featured || !item.featured_order) return max;
      return Math.max(max, item.featured_order);
    }, 0);

  const mergeUpdatedProjects = (updatedProjects: Project[]) => {
    const updatedMap = new Map(updatedProjects.map((project) => [String(project.id), project]));
    setProjects((current) => current.map((item) => updatedMap.get(String(item.id)) ?? item));
  };

  const handleDeleteProject = async (project: Project) => {
    const projectId = String(project.id);

    setError('');
    setDeletingIds((current) => [...current, projectId]);

    try {
      await apiClient.deleteProject(projectId);
      removeProjectsFromState([projectId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xoá project');
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== projectId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;

    setError('');
    setBulkAction('delete');
    const idsToDelete = selectedProjects.map((project) => String(project.id));
    setDeletingIds((current) => Array.from(new Set([...current, ...idsToDelete])));

    try {
      await Promise.all(idsToDelete.map((id) => apiClient.deleteProject(id)));
      removeProjectsFromState(idsToDelete);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xoá các project đã chọn');
    } finally {
      setDeletingIds((current) => current.filter((id) => !idsToDelete.includes(id)));
      setBulkAction(null);
    }
  };

  const handleFeatureProject = async (project: Project) => {
    const projectId = String(project.id);

    setError('');
    setFeaturingIds((current) => [...current, projectId]);

    try {
      if (project.is_featured) {
        const response = await apiClient.updateProject(projectId, {
          is_featured: false,
          featured_order: null,
          featured_note: project.featured_note ?? null,
        });

        mergeUpdatedProjects([response.data]);
        return;
      }

      const response = await apiClient.updateProject(projectId, {
        is_featured: true,
        featured_order: getNextFeaturedOrder(projects) + 1,
        featured_note: project.featured_note || undefined,
      });

      mergeUpdatedProjects([response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : project.is_featured ? 'Không thể bỏ project khỏi nổi bật' : 'Không thể thêm project vào nổi bật');
    } finally {
      setFeaturingIds((current) => current.filter((id) => id !== projectId));
    }
  };

  const handleBulkFeature = async () => {
    const projectsToFeature = selectedProjects.filter((project) => !project.is_featured);

    if (projectsToFeature.length === 0) {
      setError('Các project đã chọn đều đang ở trạng thái nổi bật.');
      return;
    }

    setError('');
    setBulkAction('feature');
    const idsToFeature = projectsToFeature.map((project) => String(project.id));
    setFeaturingIds((current) => Array.from(new Set([...current, ...idsToFeature])));

    let nextOrder = getNextFeaturedOrder(projects);

    try {
      const responses = await Promise.all(
        projectsToFeature.map((project) => {
          nextOrder += 1;
          return apiClient.updateProject(String(project.id), {
            is_featured: true,
            featured_order: nextOrder,
            featured_note: project.featured_note || undefined,
          });
        }),
      );

      mergeUpdatedProjects(responses.map((response) => response.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể thêm các project đã chọn vào nổi bật');
    } finally {
      setFeaturingIds((current) => current.filter((id) => !idsToFeature.includes(id)));
      setBulkAction(null);
    }
  };

  const openFeatureDialog = (project: Project) => {
    setConfirmAction({ type: project.is_featured ? 'unfeature-single' : 'feature-single', project });
  };

  const confirmActionTitle =
    confirmAction?.type === 'bulk-delete'
      ? `Xoá ${selectedProjects.length} project đã chọn?`
      : confirmAction?.type === 'bulk-feature'
        ? `Thêm ${selectedProjects.filter((project) => !project.is_featured).length} project vào nổi bật?`
        : confirmAction?.type === 'delete-single'
          ? `Xoá project “${confirmAction.project.title}”?`
          : confirmAction?.type === 'unfeature-single'
            ? `Bỏ project “${confirmAction.project.title}” khỏi nổi bật?`
            : confirmAction?.type === 'feature-single'
              ? `Thêm project “${confirmAction.project.title}” vào nổi bật?`
              : '';

  const confirmActionDescription =
    confirmAction?.type === 'bulk-delete'
      ? 'Hành động này sẽ xoá toàn bộ project đang chọn và không thể hoàn tác.'
      : confirmAction?.type === 'bulk-feature'
        ? 'Các project chưa nổi bật sẽ được thêm vào danh sách featured và tự gán thứ tự tiếp theo.'
        : confirmAction?.type === 'delete-single'
          ? 'Project sẽ bị xoá khỏi hệ thống ngay sau khi bạn xác nhận.'
          : confirmAction?.type === 'unfeature-single'
            ? 'Ngôi sao sẽ tắt sáng và project sẽ bị gỡ khỏi danh sách nổi bật.'
            : confirmAction?.type === 'feature-single'
              ? 'Ngôi sao sẽ sáng lên và project sẽ được thêm vào danh sách nổi bật.'
              : '';

  const confirmActionLabel =
    confirmAction?.type === 'bulk-delete' || confirmAction?.type === 'delete-single'
      ? bulkAction === 'delete'
        ? 'Đang xoá...'
        : 'Xác nhận xoá'
      : confirmAction?.type === 'bulk-feature' || confirmAction?.type === 'feature-single' || confirmAction?.type === 'unfeature-single'
        ? bulkAction === 'feature' || (confirmAction?.project && featuringIds.includes(String(confirmAction.project.id)))
          ? 'Đang cập nhật...'
          : confirmAction?.type === 'unfeature-single'
            ? 'Bỏ nổi bật'
            : 'Thêm nổi bật'
        : 'Xác nhận';

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const currentAction = confirmAction;
    setConfirmAction(null);

    if (currentAction.type === 'bulk-delete') {
      await handleBulkDelete();
      return;
    }

    if (currentAction.type === 'bulk-feature') {
      await handleBulkFeature();
      return;
    }

    if (currentAction.type === 'delete-single') {
      await handleDeleteProject(currentAction.project);
      return;
    }

    await handleFeatureProject(currentAction.project);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-[#d6e5fa] bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-lg">
          Đang tải project hub...
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-10 overflow-hidden rounded-[28px] border border-[#dfe9f6] bg-[linear-gradient(135deg,#ffffff_0%,#f6faff_55%,#edf4ff_100%)] p-8 shadow-[0_32px_80px_-40px_rgba(15,76,129,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b8ea8]">Project management</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827]">
              Curate project catalog và featured lineup từ admin API.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#526070]">
              Quản lý chung cả Wanda Event và Pi Decor, lọc theo dòng dịch vụ, trạng thái nổi bật và thao tác xoá nhanh từng project hoặc hàng loạt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="projects-create-button"
              onClick={() => router.push('/admin/projects/new')}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0F4C81_0%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(15,76,129,0.7)] transition hover:brightness-110"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New project
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
      )}

      <section className="mb-8 rounded-[24px] bg-white p-6 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Bộ lọc project</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(['all', 'to-chuc-su-kien', 'decor-tiec-cuoi'] as ServiceFilter[]).map((service) => (
                  <button
                    key={service}
                    id={`projects-service-filter-${service}`}
                    onClick={() => setServiceFilter(service)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${serviceFilter === service ? 'bg-[#0F4C81] text-white' : 'bg-[#f3f6fb] text-slate-600 hover:bg-[#e9f0fa]'}`}
                  >
                    {service === 'all' ? `Tất cả (${counts.all})` : `${SERVICE_LINE_LABELS[service]} (${counts[service]})`}
                  </button>
                ))}

                <span className="mx-1 hidden h-8 w-px bg-[#e2eaf4] xl:block" />

                <button
                  id="projects-featured-toggle"
                  onClick={() => setFeaturedFilter((current) => (current === 'featured' ? 'all' : 'featured'))}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${featuredFilter === 'featured' ? 'bg-[#10233d] text-white shadow-lg shadow-[#10233d]/10' : 'bg-[#f8f4e8] text-[#8a6a21] hover:bg-[#f4ecd1]'}`}
                >
                  Nổi bật ({counts.featured})
                </button>
              </div>
            </div>

            <div className="min-w-fit rounded-[20px] border border-[#dbe7f5] bg-[#f8fbff] p-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Hiển thị</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{filteredProjects.length}</p>
              <p className="mt-1 text-xs text-slate-500">Đã chọn {selectedVisibleCount}/{filteredProjects.length} project</p>
              <button
                id="projects-select-all-visible"
                onClick={handleSelectAllVisible}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d6e5fa] bg-white px-4 py-2 text-sm font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/20 hover:bg-[#eef5ff]"
              >
                <span className="material-symbols-outlined text-base">select_all</span>
                {allVisibleSelected ? 'Bỏ chọn đang hiển thị' : `Chọn tất cả (${visibleIds.length})`}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0F4C81]">
                search
              </span>
              <input
                id="projects-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, khách hàng, venue hoặc featured note..."
                className="w-full rounded-2xl border border-[#e2eaf4] bg-[#f8fbff] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0F4C81]/25 focus:ring-2 focus:ring-[#d2e4ff]"
              />
            </div>

            <div className="flex gap-1 rounded-full bg-[#f3f6fb] p-1">
              <button
                id="projects-view-grid"
                onClick={() => setViewMode('grid')}
                className={`rounded-full px-4 py-2 text-sm transition ${viewMode === 'grid' ? 'bg-white text-[#0F4C81] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Grid
              </button>
              <button
                id="projects-view-list"
                onClick={() => setViewMode('list')}
                className={`rounded-full px-4 py-2 text-sm transition ${viewMode === 'list' ? 'bg-white text-[#0F4C81] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                List
              </button>
            </div>
          </div>

          {selectedProjects.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[24px] border border-[#d9e9ff] bg-[linear-gradient(135deg,rgba(239,246,255,0.92)_0%,rgba(255,255,255,0.98)_100%)] p-4 shadow-[0_18px_40px_-28px_rgba(15,76,129,0.35)] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F4C81]">Đã chọn {selectedProjects.length} project</p>
                <p className="mt-1 text-xs text-slate-500">Mở popup để thêm toàn bộ vào nổi bật hoặc xoá hàng loạt.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  id="projects-bulk-feature"
                  onClick={() => setConfirmAction({ type: 'bulk-feature' })}
                  disabled={bulkAction !== null}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  {bulkAction === 'feature' ? 'Đang thêm...' : 'Thêm tất cả vào nổi bật'}
                </button>
                <button
                  id="projects-bulk-delete"
                  onClick={() => setConfirmAction({ type: 'bulk-delete' })}
                  disabled={bulkAction !== null}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  {bulkAction === 'delete' ? 'Đang xoá...' : 'Xoá đã chọn'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectId = String(project.id);
            const isSelected = selectedIds.includes(projectId);
            const isDeleting = deletingIds.includes(projectId);
            const isFeaturing = featuringIds.includes(projectId);

            return (
              <div
                key={project.id}
                className={`relative rounded-[28px] transition ${isSelected ? 'shadow-[0_24px_50px_-30px_rgba(15,76,129,0.45)]' : ''}`}
              >
                <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3">
                  <label
                    htmlFor={`select-project-${projectId}`}
                    className="pointer-events-auto inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/92 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-lg backdrop-blur"
                  >
                    <input
                      id={`select-project-${projectId}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(projectId)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                    />
                    Chọn
                  </label>

                  <div className="pointer-events-auto flex items-center gap-2">
                    <button
                      id={`feature-project-${projectId}`}
                      onClick={() => openFeatureDialog(project)}
                      disabled={isFeaturing}
                      aria-label={project.is_featured ? `Bỏ project ${project.title} khỏi nổi bật` : `Thêm project ${project.title} vào nổi bật`}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-50 ${project.is_featured ? 'border-amber-300/90 bg-amber-100/95 text-amber-800 hover:bg-amber-200/90' : 'border-slate-200/90 bg-white/92 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className={`material-symbols-outlined text-sm ${project.is_featured ? 'text-amber-500' : 'text-slate-400'}`}>star</span>
                      {isFeaturing ? 'Đang cập nhật...' : project.is_featured ? 'Đang nổi bật' : 'Thêm nổi bật'}
                    </button>
                    <button
                      id={`delete-project-${projectId}`}
                      onClick={() => setConfirmAction({ type: 'delete-single', project })}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-white/92 px-3 py-1.5 text-[11px] font-semibold text-rose-700 shadow-lg backdrop-blur transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      {isDeleting ? 'Đang xoá...' : 'Xoá'}
                    </button>
                  </div>
                </div>

                <ProjectCard
                  title={project.title}
                  subtitle={`${SERVICE_LINE_LABELS[project.service_line]} • ${getServiceCategoryLabel(project.service_category)}`}
                  status={{
                    label: project.is_featured ? `Featured #${project.featured_order || '—'}` : project.brand === 'pi-decor' ? 'Pi Decor' : 'Wanda Event',
                    color: project.is_featured ? 'text-amber-700' : project.brand === 'pi-decor' ? 'text-[#7c3858]' : 'text-blue-700',
                    bgColor: project.is_featured ? 'bg-amber-100' : project.brand === 'pi-decor' ? 'bg-[#f7e8ef]' : 'bg-blue-50',
                  }}
                  timestamp={formatTimestamp(project.updated_at || project.created_at)}
                  imageUrl={project.thumbnail || '/placeholder-project.jpg'}
                  imageAlt={project.title}
                  isSelected={isSelected}
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                />

                {project.is_featured && project.featured_note && (
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                    <span className="font-semibold">Featured note:</span> {project.featured_note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const projectId = String(project.id);
            const isSelected = selectedIds.includes(projectId);
            const isDeleting = deletingIds.includes(projectId);
            const isFeaturing = featuringIds.includes(projectId);

            return (
              <div
                key={project.id}
                className={`rounded-[24px] border bg-white p-6 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)] transition ${isSelected ? 'border-[#0F4C81]/20 ring-2 ring-[#d9e9ff]' : 'border-transparent hover:border-[#0F4C81]/10 hover:shadow-xl'}`}
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-3 pt-1">
                      <input
                        id={`list-select-project-${projectId}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(projectId)}
                        className="h-4 w-4 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                      />
                      <img src={project.thumbnail || '/placeholder-project.jpg'} alt={project.title} className="h-20 w-20 rounded-2xl object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          id={`open-project-${projectId}`}
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                          className="text-left text-lg font-semibold text-[#191c1d] transition hover:text-[#0F4C81]"
                        >
                          {project.title}
                        </button>
                        {project.is_featured && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Featured #{project.featured_order || '—'}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {SERVICE_LINE_LABELS[project.service_line]} • {getServiceCategoryLabel(project.service_category)}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {project.client || 'Chưa có khách hàng'} • {project.venue || 'Chưa có venue'}
                      </p>
                      {project.featured_note && <p className="mt-3 text-sm text-slate-600">{project.featured_note}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 xl:flex-col xl:items-end">
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {formatTimestamp(project.updated_at || project.created_at)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        id={`feature-list-project-${projectId}`}
                        onClick={() => openFeatureDialog(project)}
                        disabled={isFeaturing}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${project.is_featured ? 'border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className={`material-symbols-outlined text-sm ${project.is_featured ? 'text-amber-500' : 'text-slate-400'}`}>star</span>
                        {isFeaturing ? 'Đang cập nhật...' : project.is_featured ? 'Bỏ nổi bật' : 'Thêm nổi bật'}
                      </button>
                      <button
                        id={`delete-list-project-${projectId}`}
                        onClick={() => setConfirmAction({ type: 'delete-single', project })}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        {isDeleting ? 'Đang xoá...' : 'Xoá'}
                      </button>
                      <button
                        id={`open-list-project-${projectId}`}
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f6fb] px-3 py-1.5 text-xs font-semibold text-[#0F4C81] transition hover:bg-[#e7eef8]"
                      >
                        Chi tiết
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 && !loading && (
        <div className="rounded-[28px] border border-dashed border-[#d7e4f4] bg-white px-6 py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">folder_open</span>
          <p className="text-lg font-medium text-slate-600">Không tìm thấy dự án nào</p>
          <p className="mt-2 text-sm text-slate-400">Thử nới bộ lọc hoặc tìm theo featured note / client / venue.</p>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020817]/55 px-4 backdrop-blur-sm">
          <div className="w-full  overflow-hidden rounded-[32px] border border-white/20 bg-[linear-gradient(145deg,rgba(15,23,42,0.96)_0%,rgba(30,41,59,0.92)_100%)] shadow-[0_40px_120px_-40px_rgba(2,6,23,0.8)]">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                <span className="material-symbols-outlined text-sm text-amber-300">notification_important</span>
                Xác nhận thao tác
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{confirmActionTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{confirmActionDescription}</p>
            </div>

            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                id="projects-confirm-cancel"
                onClick={() => setConfirmAction(null)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Huỷ
              </button>
              <button
                id="projects-confirm-submit"
                onClick={() => void handleConfirmAction()}
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${confirmAction?.type === 'bulk-delete' || confirmAction?.type === 'delete-single' ? 'bg-[linear-gradient(135deg,#fb7185_0%,#e11d48_100%)] text-white hover:brightness-110' : 'bg-[linear-gradient(135deg,#f6d365_0%,#f59e0b_100%)] text-slate-950 hover:brightness-105'}`}
              >
                {confirmActionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
