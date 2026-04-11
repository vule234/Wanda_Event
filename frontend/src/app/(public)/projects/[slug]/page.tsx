'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/lib/api/types';
import {
  getBrandConfig,
  getListingPath,
  getProjectHref,
  getServiceCategoryLabel,
} from '@/lib/service-config';

interface ProjectDetail extends Project {
  related?: Project[];
}

function formatDate(date?: string | null) {
  if (!date) return 'Đang cập nhật';

  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiClient.getProjectBySlug(slug);
        if (response.success) {
          setProject(response.data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const brandConfig = useMemo(
    () => getBrandConfig(project?.brand, project?.service_line),
    [project?.brand, project?.service_line]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Đang tải...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-800">Không tìm thấy dự án</h1>
          <Link href="/projects" className="text-primary hover:underline">
            Quay lại danh sách dự án
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = project.gallery || [];
  const infoItems = [
    { label: 'Dịch vụ', value: getServiceCategoryLabel(project.service_category || project.category) },
    { label: 'Địa điểm', value: project.venue || 'Đang cập nhật' },
    { label: 'Quy mô', value: project.scale || 'Đang cập nhật' },
    { label: 'Phong cách', value: project.style || 'Đang cập nhật' },
    { label: 'Khách hàng', value: project.client || 'Đang cập nhật' },
    { label: 'Ngày diễn ra', value: formatDate(project.event_date) },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_44%,#ffffff_100%)]">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="relative h-[560px] md:h-[720px]">
          {project.thumbnail ? (
            <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-300 via-slate-100 to-white" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/15" />
          <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${brandConfig.accentClass}`} />

          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 md:px-16 md:pb-16">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Link
                  href={getListingPath(project.service_line)}
                  className="tap-target-comfort touch-manipulation inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 backdrop-blur-md transition active:scale-[0.98] hover:bg-white/14"
                >

                  <span className="material-symbols-outlined text-base">west</span>
                  Quay lại danh sách
                </Link>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                    {brandConfig.shortName}
                  </span>
                  <span className="rounded-full border border-white/20 bg-slate-950/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
                    {getServiceCategoryLabel(project.service_category || project.category)}
                  </span>
                </div>
                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr] md:px-10 xl:px-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 self-start lg:sticky lg:top-24 lg:pr-4"
          >
            {project.description && (
              <div className="rounded-[24px] border border-white/70 bg-white/86 p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.22)] backdrop-blur-xl md:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Câu chuyện dự án</p>
                <p className="mt-4 whitespace-pre-wrap text-[14px] leading-7 text-slate-700">{project.description}</p>
              </div>
            )}

            <div className="rounded-[24px] border border-white/70 bg-white/86 p-5 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.22)] backdrop-blur-xl md:p-6">
              <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Liên hệ nhanh</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{brandConfig.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{brandConfig.heroCopy}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <a href={`tel:${brandConfig.phoneDisplay.replace(/\s+/g, '')}`} className="tap-target-comfort touch-manipulation block rounded-2xl px-3 py-2 transition active:scale-[0.99] hover:text-primary">
                  Hotline: {brandConfig.phoneDisplay}
                </a>
                {brandConfig.email && (
                  <a href={`mailto:${brandConfig.email}`} className="tap-target-comfort touch-manipulation block break-all rounded-2xl px-3 py-2 transition active:scale-[0.99] hover:text-primary">
                    {brandConfig.email}
                  </a>
                )}
                {brandConfig.facebook && (
                  <a href={brandConfig.facebook} target="_blank" rel="noopener noreferrer" className="tap-target-comfort touch-manipulation block rounded-2xl px-3 py-2 transition active:scale-[0.99] hover:text-primary">
                    Facebook Pi Decor
                  </a>
                )}
              </div>
              <a
                href={brandConfig.contactHref}
                target={brandConfig.contactHref.startsWith('http') ? '_blank' : undefined}
                rel={brandConfig.contactHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="tap-target-comfort touch-manipulation mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-primary transition active:scale-[0.98] hover:-translate-y-0.5 hover:bg-primary/90"
              >

                {project.service_line === 'decor-tiec-cuoi' ? 'Chat Zalo Pi Decor' : 'Liên hệ Wanda Event'}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Hình ảnh {project.service_line === 'decor-tiec-cuoi' ? 'decor' : 'sự kiện'}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Bộ ảnh được sắp xếp để khách hàng có thể cảm nhận rõ ngôn ngữ thẩm mỹ, chất liệu không gian và cách thương hiệu được thể hiện.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={image}
                  type="button"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onClick={() => setSelectedImage(image)}
                  className="tap-target-comfort touch-manipulation group relative aspect-square overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_18px_60px_-36px_rgba(15,23,42,0.28)] active:scale-[0.99]"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - ${index + 1}`}
                    fill
                    className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/24" />

                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {project.related && project.related.length > 0 && (
        <section className="border-t border-slate-200/70 bg-white/80 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-0">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Liên quan</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Dự án cùng nhóm dịch vụ</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {project.related.map((relatedProject, index) => (
                <motion.div
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Link href={getProjectHref(relatedProject)} className="interactive-card touch-manipulation group block rounded-[26px] focus:outline-none focus:ring-2 focus:ring-primary/25">
                    <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_22px_70px_-42px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.99]">
                      <div className="relative aspect-[4/4.5] overflow-hidden bg-slate-100">
                        {relatedProject.thumbnail ? (
                          <Image
                            src={relatedProject.thumbnail}
                            alt={relatedProject.title}
                            fill
                            className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
                        )}
                      </div>
                      <div className="p-5">

                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                          {getServiceCategoryLabel(relatedProject.service_category || relatedProject.category)}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-primary">
                          {relatedProject.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            onClick={(event) => event.stopPropagation()}
            className="relative h-full max-h-[90vh] w-full max-w-5xl"
          >
            <Image src={selectedImage} alt="Full size" fill className="object-contain" />
            <button
              id="project-gallery-lightbox-close"
              type="button"
              onClick={() => setSelectedImage(null)}
              className="tap-target-comfort touch-manipulation absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-black/55 text-white transition active:scale-[0.97] hover:bg-black/68"
              aria-label="Đóng ảnh phóng to"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
