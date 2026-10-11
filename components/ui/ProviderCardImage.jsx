'use client';

import React, { useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';

export function ProviderCardImage({
  src,
  name,
  profession,
  isVerified = false,
  aspect = 'aspect-square',
  className = '',
  imgClassName = '',
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str) => {
    if (!str) return 'LH';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getGradient = (str) => {
    const gradients = [
      'from-blue-600 via-indigo-600 to-purple-700',
      'from-purple-600 via-fuchsia-600 to-pink-600',
      'from-emerald-600 via-teal-600 to-cyan-700',
      'from-slate-800 via-indigo-900 to-slate-900',
      'from-blue-700 via-sky-600 to-teal-600',
      'from-amber-600 via-orange-600 to-rose-700',
    ];
    if (!str) return gradients[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const hasPhoto = Boolean(src && !imgError && typeof src === 'string' && src.trim().length > 0);

  return (
    <div
      className={`relative w-full ${aspect} rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center select-none shadow-xs ${className}`}
    >
      {hasPhoto ? (
        <img
          src={src}
          alt={name || 'Service Provider'}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover transition-transform duration-300 ${imgClassName}`}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${getGradient(
            name
          )} flex flex-col items-center justify-center text-white p-4 relative`}
        >
          {/* Subtle geometric circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/10 blur-xl pointer-events-none" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center shadow-inner mb-2.5">
            {name ? (
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
                {getInitials(name)}
              </span>
            ) : (
              <User className="w-8 h-8 text-white/90" />
            )}
          </div>

          <span className="text-sm font-bold text-white/95 text-center truncate max-w-[90%]">
            {name || 'Service Provider'}
          </span>
          {profession && (
            <span className="text-[11px] font-semibold text-white/75 uppercase tracking-wider mt-0.5">
              {profession}
            </span>
          )}
        </div>
      )}

      {isVerified && (
        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs z-10">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified</span>
        </div>
      )}
    </div>
  );
}
