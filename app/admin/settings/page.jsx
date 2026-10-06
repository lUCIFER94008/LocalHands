'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/ui/Toast';
import { ShieldCheck, LogOut, Database, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out from admin session');
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin System Settings</h1>
        <p className="text-xs text-slate-500">Security configurations and administrative options</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Database Connection</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border text-xs space-y-1">
            <p className="font-bold text-slate-900">MongoDB Database Active</p>
            <p className="text-slate-500">Local Hands production database cluster status: Connected & Healthy</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">Log out from administrative console</span>
          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
