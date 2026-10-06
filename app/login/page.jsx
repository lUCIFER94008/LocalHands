'use client';

import React, { Suspense } from 'react';
import { Logo } from '@/components/layout/Logo';
import { LoginForm } from '@/components/auth/LoginForm';
import { ShieldCheck, CheckCircle2, Award, Clock } from 'lucide-react';
import { Spinner } from '@/ui/Spinner';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Dark Navy Panel */}
      <div className="lg:w-1/2 bg-slate-950 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo isDark={true} />
        </div>

        <div className="relative z-10 my-auto py-12 space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Trusted Service Marketplace</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Your Local Service Partner
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Connect with verified electrical, plumbing, carpentry, painting, and cleaning professionals in your neighborhood.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-900 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>100% Background-Verified Professionals</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Transparent Upfront Pricing with No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Hassle-Free Booking & 24/7 Dedicated Support</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Local Hands. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white">
        <Suspense fallback={<Spinner />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
