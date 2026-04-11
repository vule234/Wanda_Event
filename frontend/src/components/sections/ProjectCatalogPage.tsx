'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/lib/api/types';
import {
  type BrandKey,
  type ServiceLine,
  getBrandConfig,
  getProjectHref,
  getServiceCategoryLabel,
} from '@/lib/service-config';

const CATEGORY_ACCENTS: Record<string, string> = {
  Wedding: 'from-rose-400/25 via-fuchsia-400/15 to-transparent',
  Corporate: 'from-cyan-400/25 via-sky-400/15 to-transparent',
  Birthday: 'from-amber-300/30 via-orange-300/15 to-transparent',
  Graduation: 'from-violet-400/25 via-indigo-400/15 to-transparent',
  Festival: 'from-emerald-400/25 via-teal-400/15 to-transparent',
  Exhibition: 'from-blue-400/25 via-indigo-400/15 to-transparent',
  School: 'from-lime-300/25 via-emerald-300/15 to-transparent',
  Other: 'from-slate-300/25 via-slate-200/10 to-transparent',
  'Trang Tri Gia Tien': 'from-[#d6a77a]/40 via-[#f2d4b7]/20 to-transparent',
  'Trang Tri Nha Hang': 'from-[#b47b84]/35 via-[#f0d6cf]/20 to-transparent',
  'Trang Tri Tiec Cuoi Ngoai Troi': 'from-[#7ea78d]/35 via-[#d9e9dc]/18 to-transparent',
};

const PROJECTS_PER_PAGE = 9;

interface ProjectCatalogPageProps {
  serviceLine: ServiceLine;
  brand: BrandKey;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
}

export default function ProjectCatalogPage({
  serviceLine,
  brand,
  eyebrow,
  title,
  description,
  ctaLabel,
}: ProjectCatalogPageProps) {
  const brandConfig = getBrandConfig(brand, serviceLine);
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProjects({
          limit: 100,
          serviceLine,
          brand,
        });

        if (response.success && Array.isArray(response.data)) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [mounted, brand, serviceLine]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(projects.map((project) => project.service_category || project.category).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryKey = project.service_category || project.category;
      const matchesCategory = activeCategory === 'All' || categoryKey === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.venue?.toLowerCase().includes(normalizedQuery) ||
        project.description?.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, projects, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProjects = filteredProjects.slice(
    (safeCurrentPage - 1) * PROJECTS_PER_PAGE,
    safeCurrentPage * PROJECTS_PER_PAGE
  );

  if (!mounted) {
    return (
      <main className="pt-28 pb-24">
        <div className="mx-auto  px-6 md:px-10 xl:px-0">
          <div className="h-[320px] animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.18)]" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(147,197,253,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_42%,#ffffff_100%)] pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute right-[-8%] top-40 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1480px] pl-4 pr-6 md:pl-6 md:pr-8 xl:pl-8 xl:pr-10 space-y-8">
        <section className="relative overflow-hidden rounded-[38px] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.88)_52%,rgba(255,255,255,0.95)_100%)] p-6 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.22)] backdrop-blur-xl md:p-10 xl:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/60 blur-3xl" />
            <div className={`absolute right-[-8%] top-[-12%] h-72 w-72 rounded-full bg-gradient-to-br opacity-25 blur-3xl ${brandConfig.accentClass}`} />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/55 to-transparent" />
          </div>

          <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.18fr)_380px] xl:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-white/80 bg-white/82 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]">
                  {eyebrow}
                </span>
                <div className={`inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_14px_35px_-18px_rgba(15,23,42,0.4)] ${brandConfig.accentClass}`}>
                  {brandConfig.shortName}
                </div>
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl md:leading-[1.02] xl:text-[4.4rem]">
                  {title}
                </h1>
                <div className="flex items-start gap-4">
                  <div className={`mt-2 hidden h-16 w-[3px] rounded-full bg-gradient-to-b md:block ${brandConfig.accentClass}`} />
                  <p className="text-base leading-8 text-slate-600 md:text-lg md:leading-9">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(160deg,rgba(15,23,42,0.96)_0%,rgba(30,41,59,0.94)_45%,rgba(15,23,42,0.98)_100%)] px-6 py-7 text-white shadow-[0_34px_100px_-46px_rgba(15,23,42,0.78)] md:px-7 md:py-8">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${brandConfig.accentClass}`} />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Signature Positioning</p>
                <h2 className="mt-4 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white md:text-[1.9rem]">
                  {brandConfig.heroCopy}
                </h2>



                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={brandConfig.contactHref}
                    target={brandConfig.contactHref.startsWith('http') ? '_blank' : undefined}
                    rel={brandConfig.contactHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full bg-white px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-950 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-20px_rgba(255,255,255,0.55)]"
                  >
                    {ctaLabel}
                  </a>
                  {brandConfig.facebook && (
                    <a
                      href={brandConfig.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full border border-white/18 bg-white/[0.03] px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/80 transition-all duration-300 active:scale-[0.98] hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
                    >
                      Facebook
                    </a>
                  )}

                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)] xl:items-start">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor={`${serviceLine}-search-input`}
                    className="text-[11px] uppercase tracking-[0.24em] text-slate-500"
                  >
                    Tìm kiếm nhanh
                  </label>
                  <div className="relative mt-3">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      search
                    </span>
                    <input
                      id={`${serviceLine}-search-input`}
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Tên album, địa điểm..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#0f4c81] focus:bg-white focus:ring-4 focus:ring-[#d8e6ff]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Danh mục</p>
                    <button
                      id={`${serviceLine}-reset-filters`}
                      type="button"
                      onClick={() => {
                        setActiveCategory('All');
                        setSearchQuery('');
                      }}
                      className="tap-target-comfort touch-manipulation rounded-full px-3 text-xs font-medium text-[#0f4c81] transition-colors active:scale-[0.98] hover:text-[#163d63]"
                    >
                      Xóa lọc
                    </button>

                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {categories.map((category) => {
                      const isActive = activeCategory === category;
                      const count =
                        category === 'All'
                          ? projects.length
                          : projects.filter(
                            (project) => (project.service_category || project.category) === category
                          ).length;

                      return (
                        <button
                          id={`${serviceLine}-category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`tap-target-comfort touch-manipulation group flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300 active:scale-[0.99] ${isActive
                            ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-[0_16px_30px_-18px_rgba(15,76,129,0.75)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#b8d2ff] hover:bg-[#f5f9ff] hover:text-[#0f4c81]'
                            }`}
                        >

                          <span className="line-clamp-2 leading-6">{getServiceCategoryLabel(category)}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] ${isActive
                              ? 'bg-white/15 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-[#dfeeff] group-hover:text-[#0f4c81]'
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/5] animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.18)]"
                  />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-8 py-20 text-center shadow-[0_18px_60px_-34px_rgba(15,23,42,0.16)] backdrop-blur-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff] text-[#0f4c81]">
                  <span className="material-symbols-outlined text-3xl">folder_open</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">Chưa có album phù hợp</h3>
                <p className="mx-auto mt-3 text-sm leading-7 text-slate-500 md:text-base">
                  Hãy thử đổi danh mục hoặc nhập từ khóa khác để hiển thị thêm dự án.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {paginatedProjects.map((project, index) => {
                    const categoryKey = project.service_category || project.category;

                    return (
                      <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.04 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="group touch-hover-reset"
                      >
                        <Link href={getProjectHref(project)} className="interactive-card touch-manipulation block h-full rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/25">
                          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_22px_65px_-30px_rgba(15,23,42,0.22)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-34px_rgba(15,76,129,0.32)]">
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                              {project.thumbnail ? (
                                <img
                                  alt={project.title}
                                  src={project.thumbnail}
                                  className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
                              )}

                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/16 to-transparent" />
                              <div
                                className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${CATEGORY_ACCENTS[categoryKey] || CATEGORY_ACCENTS.Other}`}
                              />

                              <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
                                <span className="rounded-full border border-white/25 bg-white/14 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                                  {getServiceCategoryLabel(categoryKey)}
                                </span>
                                <div className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/28 text-white/90 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                  <span className="material-symbols-outlined">arrow_outward</span>
                                </div>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">{brandConfig.shortName}</p>
                                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight drop-shadow-sm">
                                  {project.title}
                                </h3>
                                <p className="mt-3 flex items-center gap-2 text-sm text-white/78">
                                  <span className="material-symbols-outlined text-base">location_on</span>
                                  <span className="line-clamp-1">{project.venue || brandConfig.shortName}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>

                    );
                  })}
                </div>

                <div className="rounded-[28px] border border-white/70 bg-white/75 px-5 py-5 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl md:px-6">
                  <div className="flex justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        id={`${serviceLine}-pagination-prev`}
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={safeCurrentPage === 1}
                        className="tap-target-comfort touch-manipulation rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#b8d2ff] hover:text-[#0f4c81]"
                      >
                        Trước
                      </button>


                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        const isActive = page === safeCurrentPage;

                        return (
                          <button
                            id={`${serviceLine}-pagination-${page}`}
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`tap-target-comfort touch-manipulation h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold transition active:scale-[0.98] ${isActive
                              ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-[0_16px_30px_-18px_rgba(15,76,129,0.75)]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-[#b8d2ff] hover:text-[#0f4c81]'
                              }`}
                          >
                            {page}
                          </button>

                        );
                      })}

                      <button
                        id={`${serviceLine}-pagination-next`}
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={safeCurrentPage === totalPages}
                        className="tap-target-comfort touch-manipulation rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#b8d2ff] hover:text-[#0f4c81]"
                      >
                        Sau
                      </button>

                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
