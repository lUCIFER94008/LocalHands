'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Tabs({ tabs = [], activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            )}
          >
            {tab.label} {tab.count !== undefined && <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
