'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export function Avatar({ src, name, size = 'md', className, ...props }) {
  const [error, setError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-2xl',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getGradient = (str) => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-sky-600 to-blue-700',
      'from-violet-600 to-purple-700',
      'from-rose-600 to-red-600',
    ];
    if (!str) return gradients[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const hasImage = Boolean(src && !error && typeof src === 'string' && src.trim().length > 0);

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-bold shrink-0 select-none shadow-2xs transition-all',
        hasImage
          ? 'bg-slate-100 border border-slate-200 text-slate-600'
          : `bg-gradient-to-br ${getGradient(name)} text-white border border-white/20`,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {hasImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className="tracking-wider">{getInitials(name)}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-white/80" />
      )}
    </div>
  );
}
