'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { BookingOverviewChart, RevenueChart, UserDistributionChart } from '@/components/admin/AdminCharts';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await apiFetch('/api/admin/reports');
        if (res.data) setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics & Platform Reports</h1>
        <p className="text-xs text-slate-500">Real-time marketplace revenue, category performance, and user activity metrics calculated directly from MongoDB</p>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Booking Status Breakdown</h3>
          <BookingOverviewChart data={reports?.bookingOverview || []} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Revenue per Category (INR)</h3>
          <RevenueChart data={reports?.revenueByCategory || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">User Distribution</h3>
          <UserDistributionChart data={reports?.userDistribution || []} />
        </div>

        {/* Top Provider Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Top Performing Providers</h3>
          {reports?.providerPerformance?.length === 0 ? (
            <p className="text-xs text-slate-400">No provider metrics calculated yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {reports?.providerPerformance?.map((p, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <p className="text-slate-500">{p.profession} • {p.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-500">★ {p.rating}</span>
                    <p className="text-[10px] text-slate-400">{p.totalReviews} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
