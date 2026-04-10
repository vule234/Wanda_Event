import React from 'react';
import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://www.facebook.com/mercurywanda',
    label: 'Facebook',
    icon: 'public',
  },
  {
    href: 'https://www.tiktok.com/@mercurywanda',
    label: 'TikTok',
    icon: 'play_circle',
  },
];

const navLinks = [
  { href: '/projects', label: 'Tổ chức sự kiện' },
  { href: '/decor-tiec-cuoi', label: 'Decor tiệc cưới' },
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/contact', label: 'Liên hệ' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-outline-variant/15 bg-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,214,91,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

      <div className="section-shell relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.8fr_0.7fr_1fr] xl:gap-10">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/46">Wanda Event</p>
              <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.07em] text-white sm:text-[2.5rem]">
                Những không gian được kiến tạo để lưu lại cảm xúc dài lâu.
              </h2>
            </div>

            <p className="max-w-[32rem] text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              Đơn vị tư vấn, thiết kế và tổ chức sự kiện theo định hướng thẩm mỹ cao cấp, tập trung vào chiều sâu trải nghiệm, bố cục thị giác và khả năng triển khai thực tế.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="tel:0962622438"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-fixed-dim"
              >
                Gọi hotline
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/16"
              >
                Gửi brief dự án
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/48">Điều hướng</p>
            <div className="grid gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 text-sm text-white/74 transition-all duration-300 hover:translate-x-1 hover:text-secondary-fixed-dim"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/48">Thông tin</p>
            <div className="space-y-4 text-sm leading-7 text-white/74">
              <p>372 Trần Đại Nghĩa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng, Việt Nam</p>
              <a href="tel:0962622438" className="block transition-colors duration-300 hover:text-secondary-fixed-dim">
                Hotline: 096 262 24 38
              </a>
              <a
                href="mailto:mercurywandavn@gmail.com"
                className="block break-all transition-colors duration-300 hover:text-secondary-fixed-dim"
              >
                mercurywandavn@gmail.com
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm text-white/78 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-[0_26px_80px_-48px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="relative h-[240px] w-full bg-slate-200 sm:h-[280px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,17,58,0.02),rgba(0,17,58,0.2))]" />
                <iframe
                  title="Footer map Wanda Event"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=108.245096%2C15.969967%2C108.265096%2C15.989967&layer=mapnik&marker=15.979967%2C108.255096"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="space-y-2 px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">Studio location</p>
                <p className="text-base font-semibold text-white">Mercury Wanda Studio</p>
                <p className="text-sm leading-6 text-white/72">
                  Không gian tư vấn trực tiếp cho khách hàng cần trao đổi concept, vật liệu và timeline triển khai.
                </p>
                <a
                  href="https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&fbclid=IwY2xjawQ-xhtleHRuA2FlbQIxMABicmlkETFKeVlqTkdYOXU2a3BUMUJlc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiJpxkQ4oyr22sxlrq4L6Ywe3sDPYLqVsf1_w_KNio4VC8XDAWFD-gMub5oe_aem_NFrORyJJdP4aq5RhNfKKCw&FORM=FBKPL1&q=372+Tr%E1%BA%A7n+%C4%90%E1%BA%A1i+Ngh%C4%A9a%2C+H%C3%B2a+H%E1%BA%A3i%2C+Ng%C5%A9+H%C3%A0nh+S%C6%A1n%2C+Da+Nang%2C+Vietnam&cp=15.980167%7E108.250406&lvl=16.2&style=r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-fixed-dim transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  <span>Xem bản đồ</span>
                  <span className="material-symbols-outlined text-[16px]">north_east</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p>© {currentYear} Wanda Event. All rights reserved.</p>
            <p className="flex flex-col gap-1 normal-case tracking-[0.08em] text-white/52 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <span className="uppercase tracking-[0.18em] text-white/38">Website thực hiện bởi</span>
              <span className="font-medium ">Le Vu</span>
              <a
                href="mailto:vu0918902566@gmail.com"
                className="transition-colors duration-300 hover:text-secondary-fixed-dim"
              >
                vu0918902566@gmail.com
              </a>
              <a
                href="tel:0398083040"
                className="transition-colors duration-300 hover:text-secondary-fixed-dim"
              >
                0398083040
              </a>
            </p>
          </div>
          <p>Curated event experiences · Da Nang, Vietnam</p>
        </div>
      </div>
    </footer>
  );
};
