'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar } from '@/ui/Avatar';
import { MapPin, Bell, Search, Menu, LogOut, ChevronDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function DashboardHeader({ user, title, role = 'customer', onMobileMenuToggle }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/notifications')
      .then((res) => {
        if (res.data?.unreadCount !== undefined) {
          setUnreadCount(res.data.unreadCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  const getNotificationLink = () => {
    if (role === 'provider') return '/provider/notifications';
    if (role === 'admin') return '/admin/notifications';
    return '/customer/notifications';
  };

  const getProfileLink = () => {
    if (role === 'provider') return '/provider/profile';
    if (role === 'admin') return '/admin/settings';
    return '/customer/profile';
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Title & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {title ? (
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200/60">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Kochi, Kerala</span>
            </div>
          )}
        </div>

        {/* Right Action Icons & Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Link
            href={getNotificationLink()}
            className="relative p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <Avatar
                src={user?.profileImage || user?.profilePhoto}
                name={user?.name || 'User'}
                size="sm"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'My Account'}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link
                  href={getProfileLink()}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
