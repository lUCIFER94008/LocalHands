'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { useToast } from '@/ui/Toast';

export default function CustomerMessagesPage() {
  const searchParams = useSearchParams();
  const partnerIdFromUrl = searchParams.get('partnerId');
  const toast = useToast();

  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(partnerIdFromUrl || '');
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await apiFetch('/api/messages/conversations');
      if (res.data) setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatMessages = async (partnerId) => {
    if (!partnerId) return;
    setLoadingMessages(true);
    try {
      const res = await apiFetch(`/api/messages?partnerId=${partnerId}`);
      if (res.data) setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load chat messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      fetchChatMessages(activePartnerId);
    }
  }, [activePartnerId]);

  const handleSendMessage = async (text) => {
    if (!activePartnerId) return;
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: activePartnerId,
          message: text,
        }),
      });

      if (res.success && res.data?.message) {
        setMessages((prev) => [...prev, res.data.message]);
        fetchConversations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  const activePartner = conversations.find((c) => c.partnerId === activePartnerId) || (activePartnerId ? { partnerId: activePartnerId, name: 'Service Provider', profession: 'Provider' } : null);

  const filteredConversations = conversations.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.profession?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex">
      {/* Left Conversation List Column */}
      <div className={`w-full lg:w-80 shrink-0 ${activePartnerId ? 'hidden lg:block' : 'block'}`}>
        <ConversationList
          conversations={filteredConversations}
          activePartnerId={activePartnerId}
          onSelect={(id) => setActivePartnerId(id)}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* Right Chat Window Column */}
      <div className={`flex-1 ${!activePartnerId ? 'hidden lg:flex' : 'flex'}`}>
        <ChatWindow
          partner={activePartner}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBackMobile={() => setActivePartnerId('')}
          loading={loadingMessages}
        />
      </div>
    </div>
  );
}
