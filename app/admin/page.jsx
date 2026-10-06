'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { BookingOverviewChart, RevenueChart, UserDistributionChart } from '@/components/admin/AdminCharts';
import { Button } from '@/ui/Button';
import { Users, Briefcase, Calendar, DollarSign, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsRes, reportsRes, provRes] = await Promise.all([
          apiFetch('/api/admin/stats').catch(() => null),
          apiFetch('/api/admin/reports').catch(() => null),
          apiFetch('/api/admin/providers?status=pending').catch(() => null),
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (reportsRes?.data) setReports(reportsRes.data);
        if (provRes?.data) setPendingProviders(provRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-400 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">System Control Dashboard</h1>
          <p className="text-xs text-slate-400">Monitor users, provider approvals, platform revenue, and service metrics</p>
        </div>

        <Link href="/admin/providers">
          <Button variant="primary" className="gap-2">
            <Clock className="w-4 h-4" /> Provider Approvals ({pendingProviders.length})
          </Button>
        </Link>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Providers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalProviders || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalBookings || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Platform Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{formatPrice(stats?.totalRevenue || 0)}</p>
        </div>
      </div>

      {/* Admin Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Booking Status Overview</h3>
          <BookingOverviewChart data={reports?.bookingOverview || []} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Revenue by Service Category</h3>
          <RevenueChart data={reports?.revenueByCategory || []} />
        </div>
      </div>

      {/* Recent Provider Registrations */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Pending Provider Approval Applications</h3>
          <Link href="/admin/providers" className="text-xs font-bold text-blue-600 hover:underline">
            View All Providers →
          </Link>
        </div>

        {pendingProviders.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No pending provider applications right now.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingProviders.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                  <p className="text-[11px] text-slate-500">{p.profession} • {p.location} • {p.experience}</p>
                </div>
                <Link href="/admin/providers">
                  <Button variant="primary" size="sm">
                    Review Application
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
