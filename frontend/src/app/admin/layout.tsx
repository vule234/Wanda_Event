import './admin-globals.css';
import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminSidebar />
      <AdminTopBar />
      <main className="ml-[280px] pt-24 px-12 pb-12 min-h-screen">
        {children}
      </main>
    </>
  );
}
