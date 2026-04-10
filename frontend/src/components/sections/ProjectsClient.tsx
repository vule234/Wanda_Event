'use client';

import React, { useState } from 'react';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Button } from '@/components/ui/Button';

const MOCK_PROJECTS = [
  { id: '1', title: 'Tiệc Cưới Hoài Anh & Minh Đức', category: 'Wedding', year: 2023, slug: 'tiec-cuoi-hoai-anh-minh-duc', image: '/projects/wedding-1.jpg' },
  { id: '2', title: 'Sự Kiện Công Ty ABC - Year End Party', category: 'Corporate', year: 2023, slug: 'su-kien-cong-ty-abc', image: '/projects/corporate-1.jpg' },
  { id: '3', title: 'Tiệc Sinh Nhật Bé Minh - 5 Tuổi', category: 'Birthday', year: 2023, slug: 'tiec-sinh-nhat-be-minh', image: '/projects/birthday-1.jpg' },
  { id: '4', title: 'Tiệc Cưới Linh & Hùng', category: 'Wedding', year: 2022, slug: 'tiec-cuoi-linh-hung', image: '/projects/wedding-2.jpg' },
  { id: '5', title: 'Hội Thảo Khách Hàng VIP', category: 'Corporate', year: 2022, slug: 'hoi-thao-khach-hang-vip', image: '/projects/corporate-2.jpg' },
  { id: '6', title: 'Tiệc Sinh Nhật Công Ty - 10 Năm', category: 'Corporate', year: 2022, slug: 'tiec-sinh-nhat-cong-ty', image: '/projects/corporate-3.jpg' },
];

const CATEGORIES = ['Wedding', 'Corporate', 'Birthday'];
const YEARS = [2023, 2022, 2021];

export function ProjectsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedYear && p.year !== selectedYear) return false;
    return true;
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const filterBtnClass = (active: boolean) =>
    `block w-full text-left body-sm px-3 py-2 rounded-sm transition-colors ${
      active ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-low text-on-surface'
    }`;

  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <h2 className="headline-md mb-6">Bộ Lọc</h2>

              {/* Category */}
              <div className="mb-8">
                <p className="label-md mb-4 text-on-surface">Loại Sự Kiện</p>
                <div className="space-y-2">
                  <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); }} className={filterBtnClass(selectedCategory === null)}>Tất Cả</button>
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={filterBtnClass(selectedCategory === cat)}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="mb-8">
                <p className="label-md mb-4 text-on-surface">Năm</p>
                <div className="space-y-2">
                  <button onClick={() => { setSelectedYear(null); setCurrentPage(1); }} className={filterBtnClass(selectedYear === null)}>Tất Cả</button>
                  {YEARS.map((yr) => (
                    <button key={yr} onClick={() => { setSelectedYear(yr); setCurrentPage(1); }} className={filterBtnClass(selectedYear === yr)}>{yr}</button>
                  ))}
                </div>
              </div>

              {(selectedCategory || selectedYear) && (
                <Button variant="secondary" size="md" onClick={() => { setSelectedCategory(null); setSelectedYear(null); setCurrentPage(1); }} className="w-full">
                  Xóa Bộ Lọc
                </Button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="md:col-span-3">
            {paginatedProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>← Trước</Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-sm transition-colors ${currentPage === page ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}>
                        {page}
                      </button>
                    ))}
                    <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Sau →</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="body-lg text-on-surface/70">Không tìm thấy dự án phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
