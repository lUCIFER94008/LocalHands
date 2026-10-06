'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none shadow-xs';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:opacity-95 hover:shadow-md hover:shadow-blue-500/20 border border-white/10',
    secondary:
      'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700/50 shadow-xs',
    outline:
      'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100/80 shadow-none',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-500/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/20',
    soft: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 shadow-none',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2.5 h-10 gap-2',
    lg: 'text-base px-6 py-3 h-12 gap-2.5 rounded-2xl',
    icon: 'h-10 w-10 p-0 justify-center',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
