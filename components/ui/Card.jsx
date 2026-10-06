'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-xs p-6 transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200',
        glass && 'bg-white/80 backdrop-blur-md border-white/40 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-bold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-slate-500', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('flex items-center pt-4 border-t border-slate-100 mt-4', className)} {...props}>
      {children}
    </div>
  );
}
