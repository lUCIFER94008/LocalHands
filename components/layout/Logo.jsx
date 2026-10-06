'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, isDark = true }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 group select-none', className)}>
      {/* Icon with House/Tool combination & blue-purple glow */}
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border border-white/20 group-hover:scale-105 transition-transform duration-200">
        <Home className="w-5 h-5 opacity-90" />
        <Wrench className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-white bg-[#7C3AED] rounded-md p-0.5 shadow-sm border border-white/40" />
      </div>

      <div className="flex flex-col">
        {/* Brand Name: Local Hands */}
        <span className={cn('font-black text-xl tracking-tight leading-none', isDark ? 'text-white' : 'text-slate-900')}>
          Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC]">Hands</span>
        </span>
        {/* Tagline */}
        <span className={cn('text-[10px] font-semibold tracking-wide mt-1', isDark ? 'text-[#94A3B8]' : 'text-slate-500')}>
          Your Local Service Partner
        </span>
      </div>
    </Link>
  );
}

