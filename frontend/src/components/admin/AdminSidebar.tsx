'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

const navItems = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/leads', icon: 'person_search', label: 'Leads' },
  { href: '/admin/projects', icon: 'architecture', label: 'Projects' },
  { href: '/admin/settings', icon: 'settings', label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
      apiClient.clearToken();
    } finally {
      router.push('/admin/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#0F4C81] flex flex-col justify-between py-8 shadow-2xl z-50">
      <div>
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#C5A065]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">Mercury Wanda</h1>
            <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] mt-1">Editorial Ledger</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 transition-all duration-200 ${
                  isActive ? 'text-white border-l-4 border-[#C5A065] bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined mr-4">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-10">
          <Link
            href="/admin/projects/new"
            className="w-full py-3 rounded-lg bg-gradient-to-br from-[#00355f] to-[#0f4c81] text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Project</span>
          </Link>
        </div>
      </div>

      <div className="px-6">
        <button
          id="admin-logout-button"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center px-6 py-3 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg disabled:opacity-60"
        >
          <span className="material-symbols-outlined mr-4">logout</span>
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
