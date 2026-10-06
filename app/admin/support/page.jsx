'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/ui/Button';
import { StatusBadge } from '@/ui/StatusBadge';
import { useToast } from '@/ui/Toast';
import { Headphones, CheckCircle2 } from 'lucide-react';

export default function AdminSupportPage() {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await apiFetch('/api/admin/support');
      if (res.data) setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolveTicket = async (ticketId) => {
    try {
      const res = await apiFetch('/api/admin/support', {
        method: 'PUT',
        body: JSON.stringify({ ticketId, status: 'Resolved' }),
      });

      if (res.success) {
        toast.success('Ticket marked as resolved');
        fetchTickets();
      }
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Support Tickets</h1>
        <p className="text-xs text-slate-500">Manage support inquiries and dispute resolutions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading support tickets...</td>
                </tr>
              ) : tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{t.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{t.user}</td>
                  <td className="py-3 px-4 text-slate-700">{t.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    {t.status !== 'Resolved' && (
                      <Button variant="success" size="sm" onClick={() => handleResolveTicket(t.id)}>
                        Mark Resolved
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
