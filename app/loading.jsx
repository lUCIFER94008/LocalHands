import React from 'react';
import { Spinner } from '@/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <Spinner size="lg" />
      <p className="text-sm font-semibold text-slate-600 mt-4 animate-pulse">Loading Local Hands...</p>
    </div>
  );
}
