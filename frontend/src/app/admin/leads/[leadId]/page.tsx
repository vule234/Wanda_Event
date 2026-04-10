'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import type { Lead, LeadPriority, LeadStatus } from '@/lib/api/types';

const statusOptions: { value: LeadStatus; label: string; description: string }[] = [
  { value: 'new', label: 'Mới', description: 'Lead vừa vào hệ thống, chưa liên hệ.' },
  { value: 'processing', label: 'Đang xử lý', description: 'Đã tiếp nhận và đang follow-up.' },
  { value: 'closed', label: 'Đã chốt', description: 'Đã hoàn tất xử lý / chốt lead.' },
];

const priorityOptions: { value: LeadPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.leadId as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    status: 'new' as LeadStatus,
    priority: 'medium' as LeadPriority,
    assigned_to: '',
    internal_note: '',
    contacted_at: '',
    last_follow_up_at: '',
    next_follow_up_at: '',
  });

  useEffect(() => {
    const loadLead = async () => {
      try {
        await apiClient.getMe();
        const response = await apiClient.getLead(leadId);
        const data = response.data;
        setLead(data);
        setForm({
          status: data.status,
          priority: data.priority || 'medium',
          assigned_to: data.assigned_to || '',
          internal_note: data.internal_note || '',
          contacted_at: data.contacted_at ? String(data.contacted_at).slice(0, 16) : '',
          last_follow_up_at: data.last_follow_up_at ? String(data.last_follow_up_at).slice(0, 16) : '',
          next_follow_up_at: data.next_follow_up_at ? String(data.next_follow_up_at).slice(0, 16) : '',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải chi tiết lead';
        setError(message);
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('đăng nhập')) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadLead();
  }, [leadId, router]);

  const selectedStatus = useMemo(
    () => statusOptions.find((item) => item.value === form.status) || statusOptions[0],
    [form.status]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await apiClient.updateLead(leadId, {
        status: form.status,
        priority: form.priority,
        assigned_to: form.assigned_to || null,
        internal_note: form.internal_note || null,
        contacted_at: form.contacted_at || null,
        last_follow_up_at: form.last_follow_up_at || null,
        next_follow_up_at: form.next_follow_up_at || null,
      });

      setLead(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật lead');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date?: string | null, withTime = false) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('vi-VN', withTime ? undefined : { dateStyle: 'short' });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-[#d6e5fa] bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-lg">Đang tải lead workspace...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#d7e4f4] bg-white px-6 py-16 text-center text-slate-500">Lead không tồn tại.</div>
    );
  }

  return (
    <>
      <header className="mb-10 overflow-hidden rounded-[28px] border border-[#dfe9f6] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_50%,#edf4ff_100%)] p-8 shadow-[0_32px_80px_-40px_rgba(15,76,129,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
            <button
              id="lead-detail-back"
              onClick={() => router.push('/admin/leads')}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dbe7f5] bg-white px-4 py-2 text-sm font-semibold text-[#0F4C81] transition hover:border-[#0F4C81]/30 hover:bg-[#f4f9ff]"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại lead board
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b8ea8]">Lead detail</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827]">{lead.name}</h1>
            <p className="mt-4 text-sm leading-7 text-[#526070]">Xem đầy đủ thông tin lead và cập nhật trạng thái trực tiếp qua admin backend API.</p>
          </div>

          <div className="rounded-[24px] border border-[#e4edf8] bg-[#0d1f35] px-6 py-5 text-white shadow-[0_24px_60px_-30px_rgba(13,31,53,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8eb5e3]">Current status</p>
            <p className="mt-2 text-xl font-semibold">{selectedStatus.label}</p>
            <p className="mt-2 text-sm text-[#bfd1e6]">{selectedStatus.description}</p>
          </div>
        </div>
      </header>

      {error && <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="space-y-8">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
            <h2 className="text-2xl font-semibold text-[#191c1d]">Thông tin liên hệ</h2>
            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Phone</p>
                <p className="mt-2 text-lg font-medium text-[#111827]">{lead.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
                <p className="mt-2 text-lg font-medium text-[#111827]">{lead.email || 'Chưa có email'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Loại nhu cầu</p>
                <p className="mt-2 text-lg font-medium text-[#111827]">{lead.event_type || 'Tư vấn chung'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ngày sự kiện</p>
                <p className="mt-2 text-lg font-medium text-[#111827]">{formatDate(lead.event_date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ngày tạo</p>
                <p className="mt-2 text-lg font-medium text-[#111827]">{formatDate(lead.created_at, true)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#0d1f35] p-8 text-white shadow-[0_24px_60px_-30px_rgba(13,31,53,0.8)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8eb5e3]">Tin nhắn từ khách</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[#d7e5f4]">{lead.message || 'Không có ghi chú từ form liên hệ.'}</p>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#191c1d]">CRM controls</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">Chỉ hỗ trợ xem chi tiết và đổi trạng thái theo scope đã thống nhất.</p>
            </div>
            <button
              id="lead-save-button"
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[linear-gradient(135deg,#0F4C81_0%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu cập nhật'}
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Trạng thái</label>
              <select name="status" value={form.status} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Ưu tiên</label>
              <select name="priority" value={form.priority} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]">
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Người phụ trách</label>
              <input name="assigned_to" value={form.assigned_to} onChange={handleInputChange} placeholder="VD: Trang / Sales Team A" className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Đã liên hệ lúc</label>
              <input type="datetime-local" name="contacted_at" value={form.contacted_at} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Follow-up gần nhất</label>
              <input type="datetime-local" name="last_follow_up_at" value={form.last_follow_up_at} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Lịch follow-up tiếp theo</label>
              <input type="datetime-local" name="next_follow_up_at" value={form.next_follow_up_at} onChange={handleInputChange} className="w-full rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#42474f]">Ghi chú nội bộ</label>
              <textarea name="internal_note" value={form.internal_note} onChange={handleInputChange} rows={8} placeholder="Insight, lịch sử trao đổi, next step nội bộ..." className="w-full resize-none rounded-2xl border border-[#dce6f2] bg-[#f8fbff] px-4 py-3 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-[#d2e4ff]" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
