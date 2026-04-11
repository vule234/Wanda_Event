'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TurnstileWidget } from '@/components/common/TurnstileWidget';
import { apiClient } from '@/lib/api/client';
import { PROJECT_CATEGORY_LABELS } from '@/lib/project-category-labels';

const CONTACT_EVENT_OPTIONS = [
  'Wedding',
  'Corporate',
  'School',
  'Birthday',
  'Graduation',
  'Festival',
  'Exhibition',
  'Other',
] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface pt-24 md:pt-0">
      <div className="mx-auto  px-6 py-16 md:px-12 lg:px-16 xl:px-20">
        <section className="mx-auto w-full ">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-label text-[11px] uppercase tracking-[0.28em] text-primary/70"
          >
            Liên hệ tư vấn
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-headline text-4xl font-semibold leading-tight tracking-tight text-primary md:text-5xl xl:text-6xl"
          >
            Trao đổi ý tưởng cho sự kiện của bạn

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-6  text-lg leading-8 text-on-surface-variant"
          >
            Hãy để lại thông tin cơ bản để đội ngũ Wanda Event liên hệ, tư vấn concept, timeline và phương án triển khai phù hợp với nhu cầu thực tế của bạn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-10 grid gap-5 md:grid-cols-2"
          >
            <div className="rounded-[28px] border border-outline-variant/35 bg-white px-5 py-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.18)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <p className="mt-4 font-label text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Hotline
              </p>
              <p className="mt-2 text-lg font-semibold text-primary">096 262 24 38</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Tư vấn nhanh cho tiệc cưới, doanh nghiệp, trường học và các chương trình theo yêu cầu.
              </p>
            </div>

            <div className="rounded-[28px] border border-outline-variant/35 bg-white px-5 py-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.18)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <p className="mt-4 font-label text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Email
              </p>
              <p className="mt-2 text-lg font-semibold text-primary break-all">mercurywandavn@gmail.com</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Phù hợp khi bạn cần gửi brief, moodboard, file tham khảo hoặc yêu cầu báo giá chi tiết.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-8 rounded-[32px] border border-outline-variant/35 bg-slate-50/90 px-6 py-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Quy trình làm việc
                </p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Tiếp nhận yêu cầu → tư vấn sơ bộ → đề xuất concept → báo giá → triển khai.
                </p>
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Thời gian phản hồi
                </p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Trong giờ hành chính hoặc sớm hơn với các yêu cầu cần hỗ trợ gấp.
                </p>
              </div>
            </div>
          </motion.div>

          <ContactForm />
        </section>

        <section className="mx-auto mt-10 w-full overflow-hidden rounded-[30px] border border-outline-variant/30 bg-white shadow-[0_24px_80px_-46px_rgba(15,23,42,0.18)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative h-[260px] overflow-hidden bg-slate-100 md:h-[320px] lg:h-full">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,53,95,0.08),rgba(0,0,0,0.02))]" />
              <iframe
                title="Bản đồ Mercury Wanda Studio"
                src="https://www.openstreetmap.org/export/embed.html?bbox=108.245096%2C15.969967%2C108.265096%2C15.989967&layer=mapnik&marker=15.979967%2C108.255096"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-center space-y-3 px-6 py-6 md:px-8 md:py-8">
              <p className="font-label text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Điểm chạm thương hiệu
              </p>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-slate-900">Mercury Wanda Studio</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    372 Trần Đại Nghĩa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng, Việt Nam.
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    Ghé studio để trao đổi concept, xem mẫu trang trí và thống nhất phương án triển khai phù hợp cho sự kiện của bạn.
                  </p>
                  <a
                    id="contact-open-bing-map"
                    href="https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&fbclid=IwY2xjawQ-xhtleHRuA2FlbQIxMABicmlkETFKeVlqTkdYOXU2a3BUMUJlc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiJpxkQ4oyr22sxlrq4L6Ywe3sDPYLqVsf1_w_KNio4VC8XDAWFD-gMub5oe_aem_NFrORyJJdP4aq5RhNfKKCw&FORM=FBKPL1&q=372+Tr%E1%BA%A7n+%C4%90%E1%BA%A1i+Ngh%C4%A9a%2C+H%C3%B2a+H%E1%BA%A3i%2C+Ng%C5%A9+H%C3%A0nh+S%C6%A1n%2C+Da+Nang%2C+Vietnam&cp=15.980167%7E108.250406&lvl=16.2&style=r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target-comfort touch-manipulation mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4.5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-on-primary transition active:scale-[0.98] hover:-translate-y-0.5 hover:bg-primary/90"
                  >

                    <span>Mở trên Bing Maps</span>
                    <span className="material-symbols-outlined text-[16px]">north_east</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ContactForm() {
  const router = useRouter();
  const formStartedAtRef = React.useRef(Date.now());
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';
  const isCaptchaEnabled =
    turnstileSiteKey.length > 0 &&
    turnstileSiteKey !== 'your_turnstile_site_key_here';
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    event_date: '',
    message: '',
    website: '',
  });
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      event_type: '',
      event_date: '',
      message: '',
      website: '',
    });
    setCaptchaToken(null);
    formStartedAtRef.current = Date.now();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (isCaptchaEnabled && !captchaToken) {
      setError('Vui lòng hoàn tất CAPTCHA để xác thực bạn không phải bot.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await apiClient.submitLead({
        ...formData,
        submitted_after_ms: Date.now() - formStartedAtRef.current,
        captcha_token: captchaToken ?? undefined,
      });

      if (!response.success) {
        throw new Error(response.message || 'Gửi yêu cầu thất bại');
      }

      setSuccess(true);
      resetForm();

      window.setTimeout(() => {
        router.push('/contact/thank-you');
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại sau ít phút.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28 }}
      className="mt-10 rounded-[32px] border border-outline-variant/35 bg-white p-7 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.22)] md:p-8"
    >
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="font-label text-[11px] uppercase tracking-[0.22em] text-primary/70">
            Form liên hệ
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Nhận tư vấn trong thời gian sớm nhất
          </h3>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-primary md:flex">
          <span className="material-symbols-outlined">edit_square</span>
        </div>
      </div>

      <motion.form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm.
          </div>
        )}

        <input
          id="contact-company-website"
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <label
              htmlFor="contact-name"
              className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Họ và tên
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2.5">
            <label
              htmlFor="contact-phone"
              className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Số điện thoại
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="096 262 24 38"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <label
              htmlFor="contact-email"
              className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@company.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2.5">
            <label
              htmlFor="contact-event-date"
              className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Ngày dự kiến
            </label>
            <input
              id="contact-event-date"
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="contact-event-type"
            className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            Loại sự kiện
          </label>
          <select
            id="contact-event-type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-4 py-3.5 text-slate-800 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          >
            <option value="">Chọn loại sự kiện</option>
            {CONTACT_EVENT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {PROJECT_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="contact-message"
            className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            Nội dung cần tư vấn
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Chia sẻ sơ bộ về chương trình, quy mô khách mời, phong cách mong muốn hoặc các hạng mục bạn cần hỗ trợ..."
            required
            className="w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {isCaptchaEnabled && (
          <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(255,255,255,0.98))] p-4 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.18)]">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary/70">
                  Cloudflare Turnstile
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Xác thực nhanh để bảo vệ form liên hệ khỏi spam và lượt gửi tự động.
                </p>
              </div>
            </div>
            <TurnstileWidget
              id="contact-turnstile"
              siteKey={turnstileSiteKey}
              theme="light"
              onTokenChange={(token) => {
                setCaptchaToken(token);
                setError((currentError) => {
                  if (currentError.includes('CAPTCHA')) {
                    return '';
                  }
                  return currentError;
                });
              }}
              onError={(message) => {
                setError(message);
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            {isCaptchaEnabled
              ? 'Mercury Wanda sẽ liên hệ lại sau khi nhận được thông tin và xác thực chống spam thành công.'
              : 'Mercury Wanda sẽ liên hệ lại sau khi nhận được thông tin của bạn.'}
          </p>
          <button
            id="contact-submit-button"
            type="submit"
            disabled={loading || (isCaptchaEnabled && !captchaToken)}
            className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-primary transition-all active:scale-[0.98] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? 'Đang gửi...' : isCaptchaEnabled && !captchaToken ? 'Xác thực CAPTCHA để gửi' : 'Gửi yêu cầu tư vấn'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
