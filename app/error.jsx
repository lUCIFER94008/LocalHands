'use client';

import React from 'react';
import { Button } from '@/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Something Went Wrong</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-8">
        An unexpected error occurred while processing your request. Please try again or contact support.
      </p>
      <Button onClick={() => reset()} variant="primary" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
