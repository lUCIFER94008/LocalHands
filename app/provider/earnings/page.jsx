'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { EarningsChart } from '@/components/provider/EarningsChart';
import { DollarSign, CheckCircle2, TrendingUp, Award } from 'lucide-react';

export default function ProviderEarningsPage() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetch('/api/bookings?status=completed');
        if (res.data) setCompletedJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.totalAmount || b.price || 0), 0);
  const avgBookingValue = completedJobs.length > 0 ? Math.round(totalEarnings / completedJobs.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Earnings & Revenue</h1>
        <p className="text-xs text-slate-500">Track your completed payouts and financial analytics</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Total Lifetime Earnings</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-slate-900">{formatPrice(totalEarnings)}</p>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Completed Jobs</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-blue-600">{completedJobs.length}</p>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Average Job Value</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-purple-600">{formatPrice(avgBookingValue)}</p>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Revenue Trends</h3>
        <EarningsChart />
      </div>
    </div>
  );
}
