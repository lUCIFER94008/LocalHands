'use client';

import React from 'react';
import { Avatar } from '@/ui/Avatar';
import { cn, formatDateTime } from '@/lib/utils';
import { Search } from 'lucide-react';

export function ConversationList({ conversations = [], activePartnerId, onSelect, search, onSearchChange }) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No active conversations found</div>
        ) : (
          conversations.map((c) => {
            const isActive = activePartnerId === c.partnerId;
            return (
              <div
                key={c.partnerId}
                onClick={() => onSelect(c.partnerId)}
                className={cn(
                  'p-4 flex items-center gap-3 cursor-pointer transition-colors',
                  isActive ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                )}
              >
                <div className="relative">
                  <Avatar src={c.photo} name={c.name} size="md" />
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{c.name}</h4>
                    <span className="text-[10px] text-slate-400">{formatDateTime(c.lastMessageDate)}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{c.lastMessage || 'No messages yet'}</p>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{c.profession}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
