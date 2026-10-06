'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/ui/Toast';
import { Bell, Shield, LogOut } from 'lucide-react';

export default function ProviderSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Settings</h1>
        <p className="text-xs text-slate-500">Configure account notifications and security settings</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Job Request Notifications</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Instant Job Alerts</span>
              <span className="text-slate-500">Get notified immediately when a customer requests a service</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={() => setEmailNotifs(!emailNotifs)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">Log out from provider session</span>
          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
