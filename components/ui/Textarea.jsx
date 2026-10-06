'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef(
  ({ label, error, className, id, name, required, rows = 4, ...props }, ref) => {
    const textareaId = id || name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          name={name}
          rows={rows}
          ref={ref}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-xl text-slate-900 text-sm p-3.5 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
