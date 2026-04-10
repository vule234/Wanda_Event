'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import { apiClient } from '@/lib/api/client';
import type { Lead, LeadStatus } from '@/lib/api/types';

type FilterStatus = 'all' | LeadStatus;

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadLeads = async () => {
      try {
        await apiClient.getMe();
        const response = await apiClient.getLeads({ limit: 100 });
        setLeads(response.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách leads';
        setError(message);
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('đăng nhập')) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadLeads();
  }, [router]);

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
      const matchesQuery =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.event_type?.toLowerCase().includes(query) ||
        lead.internal_note?.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [filterStatus, leads, searchQuery]);

  const getStatusBadge = (status: LeadStatus) => {
    const statusMap: Record<LeadStatus, { label: string; className: string }> = {
      new: { label: 'Mới', className: 'bg-emerald-100 text-emerald-800' },
      processing: { label: 'Đang xử lý', className: 'bg-amber-100 text-amber-800' },
      closed: { label: 'Đã chốt', className: 'bg-slate-100 text-slate-800' },
    };

    const statusInfo = statusMap[status] || statusMap.new;

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>{statusInfo.label}</span>;
  };

  const getPriorityBadge = (priority?: Lead['priority']) => {
    const priorityMap = {
      high: 'bg-rose-100 text-rose-700',
      medium: 'bg-blue-100 text-blue-700',
      low: 'bg-slate-100 text-slate-700',
    } as const;

    const tone = priority ? priorityMap[priority] : 'bg-slate-100 text-slate-700';
    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone}`}>{priority || 'none'}</span>;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const leadColumns = [
    {
      key: 'name',
      header: 'Khách hàng',
      render: (lead: Lead) => (
        <div>
          <div className="font-medium text-[#191c1d]">{lead.name}</div>
          <div className="text-xs text-slate-400">{lead.email || 'Chưa có email'} • {lead.phone}</div>
        </div>
      ),
    },
    {
      key: 'event_type',
      header: 'Nhu cầu',
      render: (lead: Lead) => (
        <div>
          <div className="text-sm text-slate-700">{lead.event_type || 'Tư vấn chung'}</div>
          <div className="text-xs text-slate-400">Sự kiện: {formatDate(lead.event_date)}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Ưu tiên',
      render: (lead: Lead) => getPriorityBadge(lead.priority),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (lead: Lead) => getStatusBadge(lead.status),
    },
    {
      key: 'next_follow_up_at',
      header: 'Follow-up',
      render: (lead: Lead) => <span className="text-sm text-slate-500">{formatDate(lead.next_follow_up_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'right' as const,
      render: (lead: Lead) => (
        <button
          id={`lead-open-${lead.id}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/leads/${lead.id}`);
          }}
          className="rounded-full border border-[#dbe7f5] px-3 py-2 text-xs font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/30 hover:bg-[#f4f9ff]"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  const statusCounts = {
    all: leads.length,
    new: leads.filter((lead) => lead.status === 'new').length,
    processing: leads.filter((lead) => lead.status === 'processing').length,
    closed: leads.filter((lead) => lead.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-[#d6e5fa] bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-lg">Đang tải lead board...</div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-10 overflow-hidden rounded-[28px] border border-[#dfe9f6] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_50%,#edf4ff_100%)] p-8 shadow-[0_32px_80px_-40px_rgba(15,76,129,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b8ea8]">Lead management</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827]">Theo dõi pipeline chi tiết với trạng thái chuẩn hóa.</h1>
            <p className="mt-4 text-sm leading-7 text-[#526070]">Trang này chỉ dùng backend API: xem lead detail, đổi status và theo dõi lịch follow-up nhất quán với business rule.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'New', value: statusCounts.new },
              { label: 'Processing', value: statusCounts.processing },
              { label: 'Closed', value: statusCounts.closed },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-[0_20px_40px_-30px_rgba(15,76,129,0.55)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {error && <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>}

      <div className="mb-8 rounded-[24px] bg-white p-6 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'new', 'processing', 'closed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filterStatus === status ? 'bg-[#0F4C81] text-white' : 'bg-[#f3f6fb] text-slate-600 hover:bg-[#e9f0fa]'}`}
              >
                {status === 'all' && `Tất cả (${statusCounts.all})`}
                {status === 'new' && `Mới (${statusCounts.new})`}
                {status === 'processing' && `Đang xử lý (${statusCounts.processing})`}
                {status === 'closed' && `Đã chốt (${statusCounts.closed})`}
              </button>
            ))}
          </div>

          <div className="relative group w-full md:w-[360px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors">search</span>
            <input
              id="leads-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, phone, email hoặc internal note..."
              className="w-full rounded-2xl border border-[#e2eaf4] bg-[#f8fbff] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0F4C81]/25 focus:ring-2 focus:ring-[#d2e4ff]"
            />
          </div>
        </div>
      </div>

      <DataTable columns={leadColumns} data={filteredLeads} onRowClick={(lead) => router.push(`/admin/leads/${lead.id}`)} />

      {filteredLeads.length === 0 && !loading && (
        <div className="mt-8 rounded-[28px] border border-dashed border-[#d7e4f4] bg-white px-6 py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">person_search</span>
          <p className="text-lg font-medium text-slate-600">Không tìm thấy lead nào</p>
          <p className="mt-2 text-sm text-slate-400">Thử đổi bộ lọc hoặc tìm theo internal note / contact info.</p>
        </div>
      )}
    </>
  );
}
