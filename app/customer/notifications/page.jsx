'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { Bell, CheckCheck, Trash2, Calendar, ShieldCheck, MessageSquare } from 'lucide-react';

export default function CustomerNotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/api/notifications');
      if (res.data?.notifications) setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/api/notifications/read', { method: 'POST' });
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const handleClearAll = async () => {
    try {
      await apiFetch('/api/notifications', { method: 'DELETE' });
      toast.success('Notifications cleared');
      setNotifications([]);
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500">Stay updated on your booking status and messages</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1">
            <CheckCheck className="w-4 h-4" /> Mark Read
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-rose-600 hover:bg-rose-50 gap-1">
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No notifications to display right now.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id || n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                n.isRead ? 'bg-white border-slate-200/80' : 'bg-blue-50/60 border-blue-200'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
