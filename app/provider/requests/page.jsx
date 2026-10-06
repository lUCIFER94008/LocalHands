'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/ui/StatusBadge';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { useToast } from '@/ui/Toast';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function ProviderRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBooking, setActionBooking] = useState(null);
  const [actionType, setActionType] = useState(''); // 'accept' or 'reject'
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await apiFetch('/api/bookings?status=pending');
      if (res.data) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmAction = async () => {
    if (!actionBooking || !actionType) return;
    setProcessing(true);
    try {
      const endpoint = actionType === 'accept' ? 'accept' : 'reject';
      const res = await apiFetch(`/api/bookings/${actionBooking.id || actionBooking._id}/${endpoint}`, {
        method: 'POST',
      });

      if (res.success) {
        toast.success(`Booking ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully!`);
        setActionBooking(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Requests</h1>
        <p className="text-xs text-slate-500">Review pending service requests submitted by customers</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No pending booking requests right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">{r.serviceName}</h3>
                  <StatusBadge status={r.status} />
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p>Customer: <strong className="text-slate-900">{r.customerName}</strong> ({r.customerPhone})</p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> {r.bookingDate} at {r.bookingTime}
                  </p>
                  <p className="flex items-start gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /> {r.address}
                  </p>
                  {r.notes && <p className="text-slate-500 italic bg-slate-50 p-2 rounded-xl border mt-2">"{r.notes}"</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount</span>
                  <span className="text-base font-black text-slate-900">{formatPrice(r.totalAmount)}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActionBooking(r);
                      setActionType('reject');
                    }}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActionBooking(r);
                      setActionType('accept');
                    }}
                  >
                    Accept Request
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={!!actionBooking} onClose={() => setActionBooking(null)} title={`Confirm ${actionType === 'accept' ? 'Acceptance' : 'Rejection'}`}>
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            Are you sure you want to <strong>{actionType}</strong> the booking request from <strong>{actionBooking?.customerName}</strong> for <strong>{actionBooking?.serviceName}</strong> on {actionBooking?.bookingDate}?
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setActionBooking(null)}>
              Cancel
            </Button>

            <Button
              variant={actionType === 'accept' ? 'primary' : 'danger'}
              isLoading={processing}
              onClick={handleConfirmAction}
            >
              Confirm {actionType === 'accept' ? 'Accept' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
