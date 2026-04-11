'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Giới Thiệu', matches: ['/'] },
  { href: '/projects', label: 'Tổ Chức Sự Kiện', matches: ['/projects'] },
  { href: '/decor-tiec-cuoi', label: 'Decor Tiệc Cưới', matches: ['/decor-tiec-cuoi'] },
  { href: '/about', label: 'Về chúng tôi', matches: ['/about'] },
];

export const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActiveLink = (matches: string[]) =>
    matches.some((match) => (match === '/' ? pathname === match : pathname.startsWith(match)));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="page-shell-tight pt-3 sm:pt-4">
        <div className="surface-panel flex items-center justify-between gap-3 rounded-[1.6rem] border border-white/60 bg-white/72 px-4 py-3 shadow-[0_22px_54px_-32px_rgba(0,17,58,0.34)] backdrop-blur-[24px] sm:px-5 lg:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-primary uppercase">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/55 bg-white/80 shadow-[0_10px_24px_-16px_rgba(0,17,58,0.35)] sm:h-12 sm:w-12">
              <Image
                src="https://znkvizblryesyrsockty.supabase.co/storage/v1/object/public/images/wanda.jpg"
                alt="Wanda Event logo"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[1.05rem] font-bold tracking-[-0.07em] sm:text-[1.35rem] md:text-[1.55rem]">
                Wanda Event
              </span>
              <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.24em] text-primary/48 sm:block">
                Curated event production
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center rounded-full border border-white/65 bg-white/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.matches);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-5 py-3 font-label text-[12px] uppercase tracking-[0.16em] transition-all duration-300 xl:px-6 ${
                      isActive
                        ? 'bg-primary/92 text-on-primary shadow-[0_12px_30px_-18px_rgba(0,17,58,0.7)]'
                        : 'text-primary/78 hover:-translate-y-0.5 hover:bg-white/78 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/contact"
              className="rounded-full border border-primary/12 bg-primary/92 px-5 py-3 font-label text-[11px] tracking-[0.18em] uppercase text-on-primary shadow-[0_18px_40px_-24px_rgba(0,17,58,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary lg:px-7"
            >
              Liên hệ ngay
            </Link>
          </div>

          <button
            id="public-mobile-nav-toggle"
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="public-mobile-nav-panel"
            aria-label={isOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="tap-target-comfort touch-manipulation inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary text-white shadow-[0_14px_30px_-20px_rgba(0,17,58,0.5)] transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] lg:hidden"
          >

            <span className="material-symbols-outlined text-[22px]">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <div className={`page-shell-tight lg:hidden ${isOpen ? 'pointer-events-auto mt-3' : 'pointer-events-none invisible h-0 overflow-hidden'}`}>
        <div
          id="public-mobile-nav-panel"
          className={`surface-panel overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/84 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >

          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
            <div className="rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(0,17,58,0.98),rgba(17,37,88,0.95))] px-4 py-4 text-white shadow-[0_20px_50px_-34px_rgba(0,17,58,0.9)]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/58">Wanda Event</p>
              <p className="mt-2 text-base font-semibold leading-6 text-white">Không gian cảm xúc, vận hành chỉn chu, ngôn ngữ thẩm mỹ tinh tế.</p>
            </div>

            <div className="grid gap-2">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.matches);

                return (
                  <Link
                    id={`mobile-nav-${link.href === '/' ? 'home' : link.href.replace(/\//g, '-')}`}
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-[1.2rem] border px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'border-primary/18 bg-primary text-white shadow-[0_18px_32px_-20px_rgba(0,17,58,0.62)]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary/16 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/contact"
                className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 active:scale-[0.98] hover:bg-primary/92"
              >
                Liên hệ tư vấn
              </Link>
              <a
                href="tel:0962622438"
                className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full border border-primary/12 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-all duration-300 active:scale-[0.98] hover:bg-slate-50"
              >
                Gọi hotline
              </a>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
