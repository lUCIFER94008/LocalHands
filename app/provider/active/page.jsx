'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/ui/StatusBadge';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { PlayCircle, CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';

export default function ProviderActiveJobsPage() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchActiveJobs = async () => {
    try {
      const res = await apiFetch('/api/bookings');
      if (res.data) {
        const activeList = res.data.filter((b) => ['accepted', 'in_progress'].includes(b.status));
        setJobs(activeList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const handleStartJob = async (jobId) => {
    setProcessingId(jobId);
    try {
      const res = await apiFetch(`/api/bookings/${jobId}/start`, { method: 'POST' });
      if (res.success) {
        toast.success('Job marked as in progress!');
        fetchActiveJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start job');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteJob = async (jobId) => {
    setProcessingId(jobId);
    try {
      const res = await apiFetch(`/api/bookings/${jobId}/complete`, { method: 'POST' });
      if (res.success) {
        toast.success('Job completed successfully!');
        fetchActiveJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete job');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Jobs</h1>
        <p className="text-xs text-slate-500">Manage accepted jobs in progress</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading active jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No active or in-progress jobs currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">{job.serviceName}</h3>
                  <StatusBadge status={job.status} />
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p>Customer: <strong className="text-slate-900">{job.customerName}</strong> ({job.customerPhone})</p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> {job.bookingDate} at {job.bookingTime}
                  </p>
                  <p className="flex items-start gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /> {job.address}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payout</span>
                  <span className="text-base font-black text-slate-900">{formatPrice(job.totalAmount)}</span>
                </div>

                <div>
                  {job.status === 'accepted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={processingId === job.id}
                      onClick={() => handleStartJob(job.id)}
                      className="gap-1"
                    >
                      <PlayCircle className="w-4 h-4" /> Start Job
                    </Button>
                  )}

                  {job.status === 'in_progress' && (
                    <Button
                      variant="success"
                      size="sm"
                      isLoading={processingId === job.id}
                      onClick={() => handleCompleteJob(job.id)}
                      className="gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
