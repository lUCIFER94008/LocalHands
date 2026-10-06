'use client';

import React, { useState } from 'react';
import { Modal } from '@/ui/Modal';
import { Button } from '@/ui/Button';
import { StatusBadge } from '@/ui/StatusBadge';
import { Avatar } from '@/ui/Avatar';
import { formatPrice } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/ui/Toast';
import { ShieldCheck, CheckCircle2, XCircle, Ban, RefreshCw } from 'lucide-react';

export function ProviderApprovalModal({ provider, isOpen, onClose, onRefresh }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!provider) return null;

  const handleAction = async (endpoint, body = {}) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/providers/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ providerId: provider.id || provider._id, ...body }),
      });

      if (res.success) {
        toast.success(res.message || 'Action executed successfully');
        onRefresh?.();
        onClose?.();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Provider Application" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Profile Box */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <Avatar src={provider.photo || provider.profilePhoto} name={provider.name} size="xl" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{provider.name}</h3>
              <StatusBadge status={provider.approvalStatus} />
            </div>
            <p className="text-xs font-semibold text-blue-600">{provider.profession}</p>
            <p className="text-xs text-slate-500">{provider.email} • {provider.phone}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Experience</span>
            <span className="font-bold text-slate-900">{provider.experience}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Location</span>
            <span className="font-bold text-slate-900">{provider.location}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Starting Rate</span>
            <span className="font-bold text-slate-900">{formatPrice(provider.priceFrom)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold block">Applied Date</span>
            <span className="font-bold text-slate-900">{new Date(provider.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        {provider.description && (
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700">Applicant Description</h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border leading-relaxed">
              {provider.description}
            </p>
          </div>
        )}

        {showRejectInput && (
          <div className="space-y-2 pt-2 border-t">
            <label className="block text-xs font-bold text-slate-700">Reason for Rejection</label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Incomplete license documentation..."
              className="w-full px-3 py-2 text-xs border rounded-xl"
            />
            <Button
              variant="danger"
              size="sm"
              isLoading={loading}
              onClick={() => handleAction('reject', { reason: rejectReason })}
            >
              Confirm Rejection
            </Button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t">
          {provider.approvalStatus !== 'approved' && (
            <Button
              variant="success"
              isLoading={loading}
              onClick={() => handleAction('approve')}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Application
            </Button>
          )}

          {provider.approvalStatus === 'pending' && !showRejectInput && (
            <Button
              variant="outline"
              onClick={() => setShowRejectInput(true)}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject
            </Button>
          )}

          {provider.approvalStatus === 'approved' && (
            <Button
              variant="danger"
              isLoading={loading}
              onClick={() => handleAction('block')}
              className="gap-1.5"
            >
              <Ban className="w-4 h-4" /> Block Provider
            </Button>
          )}

          {provider.approvalStatus === 'blocked' && (
            <Button
              variant="primary"
              isLoading={loading}
              onClick={() => handleAction('unblock')}
              className="gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Unblock & Restore
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
