'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import {
  LayoutDashboard,
  Clock,
  PlayCircle,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export function ProviderSidebar({ unreadCount = 0 }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/provider', icon: LayoutDashboard },
    { label: 'Booking Requests', href: '/provider/requests', icon: Clock },
    { label: 'Active Jobs', href: '/provider/active', icon: PlayCircle },
    { label: 'Completed Jobs', href: '/provider/completed', icon: CheckCircle2 },
    { label: 'Earnings', href: '/provider/earnings', icon: DollarSign },
    { label: 'Messages', href: '/provider/messages', icon: MessageSquare, badge: unreadCount },
    { label: 'Profile', href: '/provider/profile', icon: User },
    { label: 'Settings', href: '/provider/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 hidden lg:flex flex-col min-h-screen border-r border-slate-900 sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-slate-900">
        <Logo isDark={true} />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/provider'
              ? pathname === '/provider'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
