'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { TurnstileWidget } from '@/components/common/TurnstileWidget';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/lib/api/types';
import { getProjectHref, getServiceCategoryLabel } from '@/lib/service-config';

const HERO_SLIDES = [
  {
    id: 'signature-event-banner',
    eyebrow: 'The Nocturnal Muse • Curating Atmospheric Legacies',
    lineOne: 'TỔ CHỨC & TRANG TRÍ',
    highlight: 'SỰ KIỆN ĐẲNG CẤP',
    description:
      'Không gian sự kiện được kiến tạo theo tinh thần tinh gọn, sang trọng và giàu chiều sâu cảm xúc.',
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
    position: 'center center',
  },
  {
    id: 'wedding-event-banner',
    eyebrow: 'Refined Wedding Styling • Layered Light • Elegant Rhythm',
    lineOne: 'KHÔNG GIAN CƯỚI',
    highlight: 'SANG TRỌNG & TINH TẾ',
    description:
      'Bố cục, ánh sáng và chất liệu được chọn lọc kỹ để từng khoảnh khắc trở nên mềm mại và đáng nhớ.',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    position: 'center 42%',
  },
  {
    id: 'brand-launch-banner',
    eyebrow: 'Brand Launches • Galas • Immersive Corporate Experiences',
    lineOne: 'TRẢI NGHIỆM THƯƠNG HIỆU',
    highlight: 'CHỈNH CHU & CUỐN HÚT',
    description:
      'Từ concept đến triển khai thực tế, mọi lớp trải nghiệm đều được kiểm soát để tạo nên ấn tượng rõ nét.',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    position: 'center center',
  },
] as const;

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

const REASONS = [
  {
    icon: 'tips_and_updates',
    title: 'Ý tưởng có bản sắc',
    desc: 'Mỗi concept được phát triển từ câu chuyện riêng của khách hàng, giúp không gian mang chiều sâu cảm xúc thay vì chỉ dừng ở vẻ đẹp bề mặt.',
  },
  {
    icon: 'groups_2',
    title: 'Triển khai đồng bộ',
    desc: 'Đội ngũ giàu kinh nghiệm cùng quy trình rõ ràng giúp mọi hạng mục từ thiết kế đến vận hành được thực thi chỉnh chu và đúng nhịp.',
  },
  {
    icon: 'workspace_premium',
    title: 'Chuẩn thẩm mỹ cao cấp',
    desc: 'Wanda Event ưu tiên bố cục tinh tế, vật liệu phù hợp và nhịp ánh sáng được cân chỉnh kỹ để tổng thể luôn sang trọng, tiết chế.',
  },
  {
    icon: 'payments',
    title: 'Ngân sách tối ưu',
    desc: 'Chúng tôi tư vấn phương án linh hoạt theo mục tiêu và mức đầu tư, đảm bảo khách hàng nhìn thấy rõ giá trị thật ở mỗi hạng mục.',
  },
] as const;

const TESTIMONIALS = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BVdT8YU7OJkqaCPmpCfWjoRDuiifVJ_Pd4w1UQociqZL-LQ3rdOzU1SP-RVYId9BHH1dyUFSugclodA9N-pbltGuP4Z4-V1q8k2OAl4ko5VMYmuGqxdTcE6FX_pBmPPESGcr6f43tm_2s3JDeLwhiF12OWRS7sT4UflXWZpimNYINlJ-ZkeXatxYAphA-DQufRLLOYQBfsZ2TutVLuF5jrkSci_-N9YDkFQBSQeKrhiY48-uuOzU4Aot_OY4KvVxq6OR7e5qE-7o',
    quote:
      'Sự tỉ mỉ của Wanda Event đã khiến ngày cưới của chúng tôi trở thành một ký ức sang trọng và đầy cảm xúc đối với tất cả khách mời.',
    name: 'Hoàng Anh & Minh Tú',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAB87u-F8YlTCn1n-VWXbrMrympn8-SOAgnKumkcq-e0LpmEgAU_YpH18E3HhLhl7UEiXSL_6wjBMeAQPFRiVR4kb18eFwNGjwWFJxlu2L-ZhaTBByiykmBN9kn_umxXC-z_ajdKlAfid9rj8h9UZw_nX8mdVR6-zX3ZESZ4whzrODLStNnNFjftHjl5keIQzF8wFkpv9xtLFDx0QA6t8FEFpVVDp_VhiFGgc7cm_5gHstUPQEDEeyxKIDRDAg3tSyxPlI6J2kgHt6',
    quote:
      'Chuyên nghiệp, bình tĩnh và giàu khả năng xử lý chi tiết. Các bạn đã nâng tầm toàn bộ hình ảnh sự kiện ra mắt của thương hiệu chúng tôi.',
    name: 'CEO TechVibe Vietnam',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQIfPfuzONQxS7WWt-J8E8CE_ZcQNO-YnoMK0Rrm4MsTy5bLaSZDkiio6Km8ciPe_BwQjttj3yZI4Vm9xK3uKcQ1CNqKD9cOfJMGveHJsFJrCyRcd0bdGr7U4SpN0CMxj3Aryz1LRwrl3GQ-MUSk2BQ9ygMpOZjksQ9YcNnSMFKGTLb1BiUjtr0ljjrtTtw-gRm5jzwgShH25ssz3YUZ4UQUlgXjozP0aBY7aGNjXOXOJVGjPOWGjHHBnsVwJjIARGOGzEtvSx3NUf',
    quote:
      'Không chỉ đẹp, không gian còn rất có hồn. Mọi chi tiết đều khiến khách mời cảm nhận được sự đầu tư và sự tinh tế của thương hiệu.',
    name: 'Ms. Thùy Dương',
  },
] as const;

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    const heroInterval = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(heroInterval);
  }, []);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const featuredResponse = await apiClient.getProjects({ featured: true, limit: 24 });

        const featuredData =
          featuredResponse?.success && Array.isArray(featuredResponse.data)
            ? featuredResponse.data.filter(
              (project): project is Project => typeof project.slug === 'string'
            )
            : [];

        if (featuredData.length > 0) {
          setFeaturedProjects(featuredData);
          return;
        }

        const fallbackResponse = await apiClient.getProjects({ limit: 24 });
        if (fallbackResponse?.success && Array.isArray(fallbackResponse.data)) {
          setFeaturedProjects(
            fallbackResponse.data.filter(
              (project): project is Project => typeof project.slug === 'string'
            )
          );
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const currentHeroSlide = HERO_SLIDES[activeHeroSlide];

  return (
    <main className="overflow-hidden bg-surface">
      <section className="safe-top-offset relative flex min-h-screen items-center overflow-hidden bg-primary pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <div
              className="h-full w-full bg-cover bg-no-repeat opacity-28 mix-blend-screen"
              style={{
                backgroundImage: `url('${currentHeroSlide.image}')`,
                backgroundPosition: currentHeroSlide.position,
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,17,58,0.22)_0%,rgba(0,17,58,0.64)_38%,rgba(0,17,58,0.96)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(254,214,91,0.12),transparent_18%),radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%)]" />
            <div className="absolute inset-x-0 top-0 h-5 bg-white/30" />
          </motion.div>
        </AnimatePresence>

        <div className="section-shell relative z-10 flex w-full justify-center py-12 md:py-16">
          <div className="mx-auto flex max-w-[1120px] flex-col items-center text-center text-white">
            <motion.p
              key={`${currentHeroSlide.id}-eyebrow`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-[10px] uppercase tracking-[0.42em] text-white/62 sm:text-[11px]"
            >
              {currentHeroSlide.eyebrow}
            </motion.p>

            <motion.div
              key={`${currentHeroSlide.id}-headline`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="mt-8 sm:mt-12"
            >
              <p className="font-serif text-[clamp(1.7rem,6vw,5.2rem)] leading-[1.04] tracking-[-0.035em] text-white sm:text-[clamp(2.3rem,6vw,5.2rem)] sm:tracking-[-0.05em]">
                {currentHeroSlide.lineOne}
              </p>
              <p className="mt-2 font-serif text-[clamp(1.95rem,7vw,6rem)] font-semibold italic leading-[0.98] tracking-[-0.04em] text-secondary-fixed-dim drop-shadow-[0_12px_40px_rgba(233,195,73,0.22)] sm:text-[clamp(2.6rem,7vw,6rem)] sm:tracking-[-0.06em]">
                {currentHeroSlide.highlight}
              </p>
            </motion.div>

            <motion.div
              key={`${currentHeroSlide.id}-divider`}
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-8 h-px w-20 bg-secondary-fixed-dim/70"
            />

            <motion.p
              key={`${currentHeroSlide.id}-description`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.16 }}
              className="text-measure mt-8 text-sm uppercase tracking-[0.28em] text-white/64 sm:text-[13px]"
            >
              {currentHeroSlide.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-12 flex items-center gap-3"
            >
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeHeroSlide;

                return (
                  <button
                    key={slide.id}
                    id={`home-hero-slide-dot-${index + 1}`}
                    type="button"
                    aria-label={`Chuyển tới banner ${index + 1}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveHeroSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${isActive
                        ? 'w-12 bg-secondary-fixed-dim shadow-[0_0_20px_rgba(233,195,73,0.35)]'
                        : 'w-2.5 bg-white/36 hover:bg-white/56'
                      }`}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-stack relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/6 to-transparent" />
        <div className="section-shell relative">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/54">Selected works</p>
            <h2 className="display-sm mt-4 text-primary">Dự án tiêu biểu</h2>
            <p className="mx-auto mt-4 max-w-[720px] text-base leading-8 text-slate-600">
              Những không gian được chọn lọc để thể hiện rõ nhất cách Wanda Event kể chuyện bằng ánh sáng, nhịp bố cục và cảm xúc thương hiệu.
            </p>
          </div>

          <div className="mt-10">
            {loadingFeatured ? (
              <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="mb-6 break-inside-avoid overflow-hidden rounded-[1.8rem] bg-surface-container"
                    style={{ height: `${280 + (index % 3) * 86}px` }}
                  >
                    <div className="h-full w-full animate-pulse bg-gradient-to-br from-surface-container-high to-surface-container-highest" />
                  </div>
                ))}
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="section-card surface-panel rounded-[2rem] px-8 py-20 text-center">
                <p className="text-outline">Chưa có dự án tiêu biểu. Hãy bật &quot;is_featured&quot; trong Admin.</p>
              </div>
            ) : (
              <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
                {featuredProjects.map((project, index) => {
                  const categoryLabel = getServiceCategoryLabel(project.service_category || project.category);
                  const heights = [440, 360, 500, 340, 420, 460, 390, 480];
                  const minHeight = heights[index % heights.length];

                  return (
                    <motion.article
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.06 }}
                      viewport={{ once: true, amount: 0.15 }}
                      className="group touch-hover-reset mb-6 break-inside-avoid"
                      style={{ minHeight: `${minHeight}px` }}
                    >
                      <Link href={getProjectHref(project)} className="interactive-card touch-manipulation block h-full rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/25">
                        <div className="relative h-full overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_22px_65px_-30px_rgba(15,23,42,0.22)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-34px_rgba(15,76,129,0.32)]">
                          <div className="relative h-full min-h-[320px] overflow-hidden bg-slate-200">
                            {project.thumbnail ? (
                              <img
                                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={project.thumbnail}
                                alt={project.title}
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/16 to-transparent" />
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-200/65 via-sky-100/10 to-transparent" />

                            <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
                              <span className="rounded-full border border-white/25 bg-white/14 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                                {categoryLabel}
                              </span>
                              <div className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/28 text-white/90 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                <span className="material-symbols-outlined">arrow_outward</span>
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Wanda Event</p>
                              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight drop-shadow-sm">
                                {project.title}
                              </h3>
                              <p className="mt-3 text-sm text-white/78">
                                {project.venue || categoryLabel}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>

                  );
                })}
              </div>
            )}
          </div>

          {!loadingFeatured && featuredProjects.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/projects"
                className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full border border-primary/12 bg-primary px-7 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-on-primary shadow-[0_24px_60px_-28px_rgba(0,17,58,0.42)] transition-all duration-300 active:scale-[0.98] hover:-translate-y-1 hover:bg-primary-container"
              >
                Xem tất cả dự án
              </Link>

            </div>
          )}
        </div>
      </section>

      <section className="section-stack relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.16))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
        <div className="section-shell relative">
          <div>
            <div className="mx-auto max-w-[760px] text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/54">Why Wanda Event</p>
              <h2 className="display-sm mt-4 text-white">Lý do nên chọn Wanda Event</h2>
              <p className="mx-auto mt-5 max-w-[680px] text-base leading-8 text-white/74">
                Chúng tôi kết hợp tư duy sáng tạo với khả năng triển khai thực chiến để mang lại những sự kiện có khí chất rõ ràng, chỉnh chu trong từng lớp trải nghiệm.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {REASONS.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group relative flex h-full flex-col items-center rounded-[1.8rem] border border-white/12 bg-white/8 px-5 py-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#ffd479]/35 hover:bg-white/12 hover:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.58)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_top,rgba(255,212,121,0.14),transparent_48%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/12 text-[#ffd479] shadow-[0_18px_40px_-26px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:scale-110 group-hover:border-[#ffd479]/40 group-hover:bg-[#ffd479]/12">
                    <span className="material-symbols-outlined text-[28px] drop-shadow-md transition-transform duration-500 group-hover:scale-110">{item.icon}</span>
                  </div>
                  <h3 className="relative mt-5 text-xl font-semibold text-white drop-shadow-md transition-colors duration-300 group-hover:text-[#ffe3a3]">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-white/84">{item.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-stack bg-surface-container">
        <div className="section-shell">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-secondary">Hồi ức tuyệt vời</p>
            <h2 className="display-sm mt-4 text-primary">Lời cảm ơn từ tâm</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[2rem] bg-primary shadow-[0_24px_70px_-42px_rgba(15,23,42,0.35)]"
              >
                <div className="relative aspect-[4/4.9] overflow-hidden sm:aspect-[3/4]">
                  <img
                    className="h-full w-full object-cover opacity-72 transition-transform duration-700 group-hover:scale-105"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/34 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-base italic leading-8 text-on-primary/92">&quot;{testimonial.quote}&quot;</p>
                  <h3 className="mt-4 text-lg font-semibold text-on-primary">{testimonial.name}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-stack bg-surface-container-low">
        <div className="section-shell">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start xl:gap-14">
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-primary/70">Liên hệ tư vấn</p>
              <h2 className="display-sm mt-5 text-primary">
                Trao đổi ý tưởng
                <span className="mt-2 block font-semibold">cho sự kiện của bạn</span>
              </h2>
              <p className="text-measure mt-6 text-base leading-8 text-on-surface-variant md:text-lg md:leading-9">
                Gửi thông tin cơ bản để đội ngũ Wanda Event liên hệ, tư vấn concept, timeline và phương án triển khai phù hợp với ngân sách và kỳ vọng của bạn.
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[1.8rem] border border-outline-variant/40 bg-white px-5 py-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.16)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-outline">Hotline</p>
                      <p className="mt-1 text-lg font-semibold text-primary">096 262 24 38</p>
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                        Hỗ trợ nhanh cho tiệc cưới, doanh nghiệp, trường học và các sự kiện theo yêu cầu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-outline-variant/40 bg-white px-5 py-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.16)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-outline">Email</p>
                      <p className="mt-1 break-all text-lg font-semibold text-primary">mercurywandavn@gmail.com</p>
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                        Phù hợp khi bạn cần gửi brief, moodboard, timeline hoặc yêu cầu báo giá chi tiết.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.9rem] border border-outline-variant/35 bg-slate-50/90 px-6 py-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Quy trình làm việc</p>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                      Tiếp nhận yêu cầu → tư vấn sơ bộ → đề xuất concept → báo giá → triển khai.
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Thời gian phản hồi</p>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                      Trong giờ hành chính hoặc sớm hơn với các yêu cầu cần hỗ trợ gấp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <HomepageLeadForm />
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-outline-variant/30 bg-white shadow-[0_24px_80px_-46px_rgba(15,23,42,0.18)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative h-[260px] overflow-hidden bg-slate-100 md:h-[320px] lg:h-full lg:min-h-[360px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,53,95,0.08),rgba(0,0,0,0.02))]" />
                <iframe
                  title="Bản đồ văn phòng Wanda Event"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=108.245096%2C15.969967%2C108.265096%2C15.989967&layer=mapnik&marker=15.979967%2C108.255096"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex flex-col justify-center space-y-3 px-6 py-6 md:px-8 md:py-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Studio & địa chỉ tư vấn</p>
                <p className="text-base font-semibold leading-7 text-primary md:text-lg">
                  372 Trần Đại Nghĩa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng, Việt Nam
                </p>
                <p className="text-sm leading-7 text-on-surface-variant">
                  Nếu bạn muốn trao đổi trực tiếp, đội ngũ Wanda Event sẵn sàng đón tiếp tại studio để cùng thống nhất concept, ngân sách và timeline triển khai.
                </p>
                <a
                  id="home-contact-open-bing-map"
                  href="https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&fbclid=IwY2xjawQ-xhtleHRuA2FlbQIxMABicmlkETFKeVlqTkdYOXU2a3BUMUJlc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiJpxkQ4oyr22sxlrq4L6Ywe3sDPYLqVsf1_w_KNio4VC8XDAWFD-gMub5oe_aem_NFrORyJJdP4aq5RhNfKKCw&FORM=FBKPL1&q=372+Tr%E1%BA%A7n+%C4%90%E1%BA%A1i+Ngh%C4%A9a%2C+H%C3%B2a+H%E1%BA%A3i%2C+Ng%C5%A9+H%C3%A0nh+S%C6%A1n%2C+Da+Nang%2C+Vietnam&cp=15.980167%7E108.250406&lvl=16.2&style=r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-on-primary transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <span>Xem vị trí trên Bing Maps</span>
                  <span className="material-symbols-outlined text-[16px]">north_east</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomepageLeadForm() {
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
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.16 }}
      viewport={{ once: true }}
      className="rounded-[2rem] border border-outline-variant/35 bg-white p-6 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.22)] md:p-8 xl:p-10"
    >
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary/70">Form liên hệ</p>
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
          id="home-contact-company-website"
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
              htmlFor="home-contact-name"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Họ và tên
            </label>
            <input
              id="home-contact-name"
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
              htmlFor="home-contact-phone"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Số điện thoại
            </label>
            <input
              id="home-contact-phone"
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
              htmlFor="home-contact-email"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Email
            </label>
            <input
              id="home-contact-email"
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
              htmlFor="home-contact-event-date"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Ngày dự kiến
            </label>
            <input
              id="home-contact-event-date"
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
            htmlFor="home-contact-event-type"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            Loại sự kiện
          </label>
          <select
            id="home-contact-event-type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-4 py-3.5 text-slate-800 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          >
            <option value="">Chọn loại sự kiện</option>
            {CONTACT_EVENT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {getServiceCategoryLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="home-contact-message"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            Nội dung cần tư vấn
          </label>
          <textarea
            id="home-contact-message"
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
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary/70">Cloudflare Turnstile</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Xác thực nhanh để bảo vệ form liên hệ khỏi spam và lượt gửi tự động.
                </p>
              </div>
            </div>
            <TurnstileWidget
              id="home-contact-turnstile"
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
              ? 'Wanda Event sẽ liên hệ lại sau khi nhận được thông tin và xác thực chống spam thành công.'
              : 'Wanda Event sẽ liên hệ lại sau khi nhận được thông tin của bạn.'}
          </p>
          <button
            type="submit"
            disabled={loading || (isCaptchaEnabled && !captchaToken)}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-primary transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Đang gửi...' : isCaptchaEnabled && !captchaToken ? 'Xác thực CAPTCHA để gửi' : 'Gửi yêu cầu tư vấn'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
