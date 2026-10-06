'use client';

import React, { Suspense } from 'react';
import { Logo } from '@/components/layout/Logo';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Spinner } from '@/ui/Spinner';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Logo className="justify-center mb-4" />
      </div>

      <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-3xl sm:px-10 max-w-md mx-auto w-full">
        <Suspense fallback={<Spinner />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
