'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-xs',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    yellow: 'bg-amber-50 text-amber-800 border-amber-200/60',
    red: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
