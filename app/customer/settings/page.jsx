'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/ui/Toast';
import { Shield, Bell, Lock, User, LogOut, Moon } from 'lucide-react';

export default function CustomerSettingsPage() {
  const router = useRouter();
  const toast = useToast();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);

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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500">Security options and notification preferences</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notification Preferences</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <span className="font-bold text-slate-900 block">Email Booking Status Alerts</span>
                <span className="text-slate-500">Receive email when provider accepts or completes job</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={() => setEmailNotifs(!emailNotifs)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <span className="font-bold text-slate-900 block">SMS Notifications</span>
                <span className="text-slate-500">Receive instant SMS notifications on service arrival</span>
              </div>
              <input
                type="checkbox"
                checked={smsNotifs}
                onChange={() => setSmsNotifs(!smsNotifs)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Security & Privacy</span>
          </div>

          <div className="space-y-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/forgot-password')}>
              Change Password / Send OTP
            </Button>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">Log out from this browser session</span>
          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
