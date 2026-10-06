'use client';

import React, { Suspense } from 'react';
import { Logo } from '@/components/layout/Logo';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/ui/Spinner';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="lg:w-1/2 bg-slate-950 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo isDark={true} />
        </div>

        <div className="relative z-10 my-auto py-12 space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Join the Local Hands Community</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Register for Quick, Safe Home Services
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Whether you are looking for home repair solutions or offering your professional skills, Local Hands connects you with real opportunities.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-900 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>For Customers: Instant access to top local experts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>For Providers: Grow your service business & earnings</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Local Hands. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white overflow-y-auto">
        <Suspense fallback={<Spinner />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
