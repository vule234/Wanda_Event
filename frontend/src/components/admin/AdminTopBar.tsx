'use client';

import { useState } from 'react';

interface AdminTopBarProps {
  breadcrumbs?: { label: string; active?: boolean }[];
}

export default function AdminTopBar({ breadcrumbs = [] }: AdminTopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-[#f8f9fa] flex justify-between items-center px-8 z-40 border-b border-[#e1e3e4]">
      {/* Left Section: Breadcrumbs + Search */}
      <div className="flex items-center gap-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="material-symbols-outlined text-xs">
                    chevron_right
                  </span>
                )}
                <span
                  className={
                    crumb.active
                      ? 'text-[#0F4C81] font-bold border-b-2 border-[#C5A065] pb-0.5'
                      : 'hover:text-[#0F4C81] transition-colors cursor-pointer'
                  }
                >
                  {crumb.label}
                </span>
              </div>
            ))
          ) : (
            <>
              <span className="hover:text-[#0F4C81] transition-colors cursor-pointer">
                Main
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-[#0F4C81] font-bold border-b-2 border-[#C5A065] pb-0.5">
                Dashboard
              </span>
            </>
          )}
        </nav>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        {/* Search */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="pl-10 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-[#d2e4ff] focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Section: Notifications + User */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-[#e7e8e9] rounded-full transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-[#e7e8e9] rounded-full transition-all">
          <span className="text-xs font-semibold text-[#191c1d]">
            Wanda Admin
          </span>
          <span
            className="material-symbols-outlined text-[#0F4C81]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}
