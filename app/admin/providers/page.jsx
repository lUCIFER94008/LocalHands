'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { StatusBadge } from '@/ui/StatusBadge';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { ProviderApprovalModal } from '@/components/admin/ProviderApprovalModal';
import { Search } from 'lucide-react';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchProviders = async () => {
    try {
      const res = await apiFetch(`/api/admin/providers?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.data) setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Approvals & Management</h1>
        <p className="text-xs text-slate-500">Review provider applications, approve licenses, or block accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by profession or location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Profession</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading providers list...</td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No providers found.</td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <Avatar src={p.photo} name={p.name} size="sm" />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{p.profession}</td>
                    <td className="py-3 px-4 text-slate-600">{p.location}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.approvalStatus} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="primary" size="sm" onClick={() => setSelectedProvider(p)}>
                        Review Profile
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Approval Modal */}
      <ProviderApprovalModal
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onRefresh={fetchProviders}
      />
    </div>
  );
}
