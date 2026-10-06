'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/ui/StatusBadge';
import { RatingStars } from '@/ui/RatingStars';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function ProviderCompletedPage() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompleted() {
      try {
        const res = await apiFetch('/api/bookings?status=completed');
        if (res.data) setCompleted(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCompleted();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Completed Jobs</h1>
        <p className="text-xs text-slate-500">History of your finished service appointments</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading completed jobs...</div>
      ) : completed.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No completed jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">{job.serviceName}</h3>
                <StatusBadge status={job.status} />
              </div>

              <div className="text-xs space-y-1 text-slate-600">
                <p>Customer: <strong>{job.customerName}</strong></p>
                <p className="text-slate-500">{job.bookingDate} at {job.bookingTime}</p>
                <p className="font-extrabold text-blue-600 text-sm pt-1">Total Payout: {formatPrice(job.totalAmount)}</p>
              </div>

              {job.review && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Customer Review</span>
                    <RatingStars rating={job.review.rating} />
                  </div>
                  {job.review.comment && <p className="text-xs text-slate-600 italic">"{job.review.comment}"</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
