'use client';

import React from 'react';
import { cn, getStatusBadgeColor } from '@/lib/utils';

export function StatusBadge({ status, className }) {
  const formattedStatus = status
    ? status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Unknown';

  const colorStyle = getStatusBadgeColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize',
        colorStyle,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {formattedStatus}
    </span>
  );
}
