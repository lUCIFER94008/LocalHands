'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { EarningsChart } from '@/components/provider/EarningsChart';
import { StatusBadge } from '@/ui/StatusBadge';
import { Button } from '@/ui/Button';
import { Calendar, Clock, CheckCircle2, DollarSign, PlayCircle, Star, ShieldCheck } from 'lucide-react';

export default function ProviderDashboard() {
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, bookRes] = await Promise.all([
          apiFetch('/api/providers/profile').catch(() => null),
          apiFetch('/api/bookings').catch(() => null),
        ]);

        if (profRes?.data?.provider) setProvider(profRes.data.provider);
        if (bookRes?.data) setBookings(bookRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const activeJobs = bookings.filter((b) => ['accepted', 'in_progress'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.totalAmount || b.price || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              Active Provider
            </span>
            {provider?.isApproved && (
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {provider?.user?.name || provider?.profession || 'Partner'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {provider?.profession} • {provider?.location} • Rating ★ {provider?.rating || '5.0'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/provider/requests">
            <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs">
              View Requests ({pendingRequests.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingRequests.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Jobs</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{completedJobs.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(totalEarnings)}</p>
        </div>
      </div>

      {/* Earnings Overview Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Earnings Performance</h3>
            <p className="text-xs text-slate-500">Monthly revenue trends from completed service bookings</p>
          </div>
          <Link href="/provider/earnings" className="text-xs font-bold text-blue-600 hover:underline">
            View Analytics →
          </Link>
        </div>

        <EarningsChart />
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Pending Booking Requests</h2>
          <Link href="/provider/requests" className="text-xs font-bold text-blue-600 hover:underline">
            Manage All Requests
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
            No pending booking requests at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.slice(0, 2).map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{b.serviceName}</span>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-xs text-slate-600">Customer: <strong>{b.customerName}</strong> ({b.customerPhone})</p>
                <p className="text-xs text-slate-500">{b.bookingDate} at {b.bookingTime}</p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-black text-blue-600">{formatPrice(b.totalAmount)}</span>
                  <Link href="/provider/requests">
                    <Button variant="primary" size="sm">
                      Review Request
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
