'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { formatDateTime } from '@/lib/utils';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export function ChatWindow({ partner, messages = [], onSendMessage, onBackMobile, loading }) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  if (!partner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mb-3">
          <Send className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-700">Select a Conversation</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">Choose a chat thread from the left menu to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Top Partner Header */}
      <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackMobile && (
            <button type="button" onClick={onBackMobile} className="lg:hidden p-1 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Avatar src={partner.photo} name={partner.name} size="md" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{partner.name}</h3>
            <p className="text-[11px] font-semibold text-blue-600 uppercase">{partner.profession || 'Service User'}</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No messages in this chat yet. Send a message to start conversing!
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id || m._id} className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  m.isSelf
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p>{m.message}</p>
                <span className={`text-[10px] block mt-1 text-right ${m.isSelf ? 'text-blue-100' : 'text-slate-400'}`}>
                  {formatDateTime(m.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <Button type="submit" variant="primary" size="sm" className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
