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
      <div className="w-full px-0">
        <div className="surface-panel relative flex items-center justify-between gap-3 overflow-hidden rounded-none rounded-b-[2rem] border-x-0 border-t-0 border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,250,0.82))] px-4 py-3 shadow-[0_24px_70px_-38px_rgba(12,22,54,0.38)] backdrop-blur-[26px] sm:px-5 lg:px-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(196,155,90,0.85),transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.88),rgba(255,255,255,0))]" />
          <Link href="/" className="group flex min-w-0 items-center gap-3 text-primary uppercase">
            <span className="relative flex h-12 items-center gap-3 overflow-hidden rounded-full border border-white/70 bg-white/80 pl-1.5 pr-4 shadow-[0_18px_34px_-24px_rgba(0,17,58,0.38)] ring-1 ring-[rgba(255,255,255,0.45)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_40px_-24px_rgba(0,17,58,0.44)] sm:h-[3.35rem] sm:pr-5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/70 bg-white shadow-[0_12px_24px_-18px_rgba(0,17,58,0.4)] sm:h-10 sm:w-10">
                <Image
                  src="https://znkvizblryesyrsockty.supabase.co/storage/v1/object/public/images/wanda.jpg"
                  alt="Wanda Event logo"
                  fill
                  className="object-cover"
                  sizes="48px"
                  priority
                />
              </span>
              <span className="min-w-0 text-left">
                <span className="block truncate text-[1rem] font-bold tracking-[-0.08em] sm:text-[1.28rem] md:text-[1.45rem]">
                  Wanda Event
                </span>
                <span className="mt-0.5 hidden text-[9px] uppercase tracking-[0.34em] text-primary/46 sm:block">
                  Curated event production
                </span>
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 justify-center px-6 lg:flex xl:px-10">
            <div className="relative flex items-center rounded-full border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,247,0.74))] p-1.5 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.28)] ring-1 ring-[rgba(255,255,255,0.55)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(196,155,90,0.55),transparent)]" />
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.matches);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-5 py-3 font-label text-[11px] uppercase tracking-[0.22em] transition-all duration-300 xl:px-6 ${
                      isActive
                        ? 'bg-[linear-gradient(135deg,rgba(0,17,58,0.96),rgba(20,38,92,0.92))] text-on-primary shadow-[0_14px_30px_-18px_rgba(0,17,58,0.65)]'
                        : 'text-primary/72 hover:-translate-y-0.5 hover:bg-white/85 hover:text-primary'
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
              className="group inline-flex items-center gap-3 rounded-full border border-[rgba(196,155,90,0.22)] bg-[linear-gradient(135deg,rgba(0,17,58,0.98),rgba(18,36,88,0.96))] px-4 py-2.5 text-on-primary shadow-[0_20px_44px_-24px_rgba(0,17,58,0.52)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_-24px_rgba(0,17,58,0.62)] lg:px-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/14 transition-transform duration-300 group-hover:scale-105">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </span>
              <span className="text-left">
                <span className="block font-label text-[10px] uppercase tracking-[0.3em] text-white/58">Tư vấn nhanh</span>
                <span className="mt-0.5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-white">Liên hệ ngay</span>
              </span>
            </Link>
          </div>

          <button
            id="public-mobile-nav-toggle"
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="public-mobile-nav-panel"
            aria-label={isOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="tap-target-comfort touch-manipulation inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/65 bg-[linear-gradient(180deg,rgba(0,17,58,0.96),rgba(18,36,88,0.92))] text-white shadow-[0_16px_34px_-22px_rgba(0,17,58,0.6)] ring-1 ring-[rgba(255,255,255,0.14)] transition-all duration-300 active:scale-[0.97] hover:scale-[1.03] lg:hidden"
          >

            <span className="material-symbols-outlined text-[22px]">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <div className={`px-0 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none invisible h-0 overflow-hidden'}`}>
        <div
          id="public-mobile-nav-panel"
          className={`surface-panel overflow-hidden rounded-none rounded-b-[1.8rem] border-x-0 border-t-0 border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,246,248,0.9))] transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100 shadow-[0_24px_64px_-34px_rgba(15,23,42,0.3)]' : '-translate-y-3 opacity-0'
          }`}
        >

          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,17,58,0.98),rgba(28,44,98,0.96),rgba(94,66,44,0.88))] px-4 py-4 text-white shadow-[0_20px_50px_-34px_rgba(0,17,58,0.9)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/58">Wanda Event</p>
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
