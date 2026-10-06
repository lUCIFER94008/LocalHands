'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { apiFetch } from '@/lib/api';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((res) => {
        if (res.data?.user) setUser(res.data.user);
      })
      .catch(() => {});

    apiFetch('/api/admin/stats')
      .then((res) => {
        if (res.data?.pendingProviders !== undefined) {
          setPendingCount(res.data.pendingProviders);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar pendingCount={pendingCount} />

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <DashboardHeader user={user} role="admin" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>

      <MobileBottomNav role="admin" />
    </div>
  );
}
