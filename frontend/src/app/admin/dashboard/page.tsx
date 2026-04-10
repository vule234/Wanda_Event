'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import ProjectCard from '@/components/admin/ProjectCard';
import { apiClient } from '@/lib/api/client';
import type { Lead, LeadStats, Project, ProjectStats } from '@/lib/api/types';
import { getServiceCategoryLabel, SERVICE_LINE_LABELS } from '@/lib/service-config';

const emptyLeadStats: LeadStats = {
  total: 0,
  new: 0,
  processing: 0,
  closed: 0,
};

const emptyProjectStats: ProjectStats = {
  totalProjects: 0,
  featuredProjects: 0,
  eventProjects: 0,
  decorProjects: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [leadStats, setLeadStats] = useState<LeadStats>(emptyLeadStats);
  const [projectStats, setProjectStats] = useState<ProjectStats>(emptyProjectStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await apiClient.getMe();

        const [leadStatsResponse, projectStatsResponse, leadsResponse, projectsResponse] = await Promise.all([
          apiClient.getLeadStats(),
          apiClient.getProjectStats(),
          apiClient.getLeads({ limit: 4 }),
          apiClient.getAdminProjects({ featured: true }),
        ]);

        setLeadStats(leadStatsResponse.data);
        setProjectStats(projectStatsResponse.data);
        setRecentLeads(leadsResponse.data.slice(0, 4));
        setRecentProjects(projectsResponse.data.slice(0, 4));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải dashboard';
        setError(message);
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('đăng nhập')) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [router]);

  const closeRate = useMemo(() => {
    if (!leadStats.total) return '0%';
    return `${Math.round((leadStats.closed / leadStats.total) * 100)}%`;
  }, [leadStats]);

  const getStatusBadge = (status: Lead['status']) => {
    const statusMap: Record<Lead['status'], { label: string; className: string }> = {
      new: { label: 'Mới', className: 'bg-emerald-500/12 text-emerald-700' },
      processing: { label: 'Đang xử lý', className: 'bg-amber-500/12 text-amber-700' },
      closed: { label: 'Đã chốt', className: 'bg-slate-500/12 text-slate-700' },
    };

    const statusInfo = statusMap[status] || statusMap.new;

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

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

  const formatEventDate = (value?: string | null) => {
    if (!value) return 'Chưa chốt ngày';
    return new Date(value).toLocaleDateString('vi-VN');
  };

  const leadColumns = [
    {
      key: 'name',
      header: 'Khách hàng',
      render: (lead: Lead) => (
        <div>
          <div className="font-semibold text-[#191c1d]">{lead.name}</div>
          <div className="mt-1 text-xs text-slate-400">{lead.email || lead.phone}</div>
        </div>
      ),
    },
    {
      key: 'event_type',
      header: 'Nhu cầu',
      render: (lead: Lead) => (
        <div>
          <div className="text-sm text-slate-700">{lead.event_type || 'Tư vấn chung'}</div>
          <div className="mt-1 text-xs text-slate-400">{formatEventDate(lead.event_date)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (lead: Lead) => getStatusBadge(lead.status),
    },
    {
      key: 'created_at',
      header: 'Tạo lúc',
      render: (lead: Lead) => <span className="text-sm text-slate-500">{formatTimestamp(lead.created_at)}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-[#d6e5fa] bg-white/80 px-5 py-3 text-sm font-medium text-slate-500 shadow-lg">
          Đang tải dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-10 overflow-hidden rounded-[28px] border border-[#dfe9f6] bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_50%,#eef5ff_100%)] p-8 shadow-[0_32px_80px_-40px_rgba(15,76,129,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b8ea8]">Editorial overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827]">
              Admin dashboard cho featured projects và lead pipeline.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#526070]">
              Theo dõi nhanh lượng lead mới, tiến độ xử lý và các project nổi bật đang được ưu tiên hiển thị ở public site.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Leads total', value: leadStats.total },
              { label: 'Featured active', value: projectStats.featuredProjects },
              { label: 'Close rate', value: closeRate },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-[0_20px_40px_-30px_rgba(15,76,129,0.55)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="mb-12 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatsCard
            icon="mark_email_unread"
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-50"
            label="Lead mới"
            value={leadStats.new}
            borderColor="border-emerald-500/25"
            badge={{ text: 'Live', color: 'text-emerald-700', bgColor: 'bg-emerald-100' }}
          />
          <StatsCard
            icon="hourglass_top"
            iconColor="text-amber-600"
            iconBgColor="bg-amber-50"
            label="Đang xử lý"
            value={leadStats.processing}
            borderColor="border-amber-500/25"
          />
          <StatsCard
            icon="workspace_premium"
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            label="Projects nổi bật"
            value={projectStats.featuredProjects}
            borderColor="border-blue-500/25"
          />
        </div>

        <div className="xl:col-span-2 rounded-[28px] border border-[#dfe9f6] bg-[#0d1f35] p-6 text-white shadow-[0_32px_80px_-40px_rgba(13,31,53,0.7)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8eb5e3]">Pipeline signal</p>
          <h2 className="mt-4 text-2xl font-semibold">Nhịp xử lý hiện tại</h2>
          <p className="mt-3 text-sm leading-7 text-[#bfd1e6]">
            Lead mới đang chiếm {leadStats.total ? Math.round((leadStats.new / leadStats.total) * 100) : 0}% tổng pipeline. Ưu tiên phản hồi nhanh cho nhóm này để tăng tỉ lệ chốt.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8eb5e3]">Event projects</p>
              <p className="mt-2 text-3xl font-semibold">{projectStats.eventProjects}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8eb5e3]">Decor projects</p>
              <p className="mt-2 text-3xl font-semibold">{projectStats.decorProjects}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#191c1d]">Lead mới nhất</h2>
              <p className="mt-1 text-sm text-slate-500">Toàn bộ dữ liệu đang lấy từ admin API thay vì truy vấn Supabase trực tiếp.</p>
            </div>
            <button
              id="dashboard-view-leads"
              onClick={() => router.push('/admin/leads')}
              className="rounded-full border border-[#dbe7f5] bg-white px-4 py-2 text-sm font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/30 hover:bg-[#f4f9ff]"
            >
              Xem lead board
            </button>
          </div>

          <DataTable columns={leadColumns} data={recentLeads} onRowClick={(lead) => router.push(`/admin/leads/${lead.id}`)} />
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#191c1d]">Featured projects</h2>
              <p className="mt-1 text-sm text-slate-500">Danh sách đang ưu tiên hiển thị ngoài public site.</p>
            </div>
            <button
              id="dashboard-view-projects"
              onClick={() => router.push('/admin/projects')}
              className="rounded-full border border-[#dbe7f5] bg-white px-4 py-2 text-sm font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/30 hover:bg-[#f4f9ff]"
            >
              Mở project hub
            </button>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                subtitle={`${SERVICE_LINE_LABELS[project.service_line]} • ${getServiceCategoryLabel(project.service_category)}`}
                status={{
                  label: project.is_featured ? `Featured #${project.featured_order || '—'}` : 'Standard',
                  color: project.is_featured ? 'text-amber-700' : 'text-slate-600',
                  bgColor: project.is_featured ? 'bg-amber-100' : 'bg-slate-100',
                }}
                timestamp={formatTimestamp(project.updated_at || project.created_at)}
                imageUrl={project.thumbnail || '/placeholder-project.jpg'}
                imageAlt={project.title}
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              />
            ))}

            {recentProjects.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-[#d7e4f4] bg-white px-6 py-10 text-center text-sm text-slate-500">
                Chưa có featured project nào được gắn thứ tự hiển thị.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
