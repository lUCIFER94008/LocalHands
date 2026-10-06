'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, Calendar, MessageSquare, User, LayoutDashboard, Briefcase } from 'lucide-react';

export function MobileBottomNav({ role = 'customer', unreadCount = 0 }) {
  const pathname = usePathname();

  const customerItems = [
    { label: 'Home', href: '/customer', icon: Home },
    { label: 'Explore', href: '/customer/services', icon: Search },
    { label: 'Bookings', href: '/customer/bookings', icon: Calendar },
    { label: 'Messages', href: '/customer/messages', icon: MessageSquare, badge: unreadCount },
    { label: 'Profile', href: '/customer/profile', icon: User },
  ];

  const providerItems = [
    { label: 'Home', href: '/provider', icon: LayoutDashboard },
    { label: 'Requests', href: '/provider/requests', icon: Calendar },
    { label: 'Active', href: '/provider/active', icon: Briefcase },
    { label: 'Messages', href: '/provider/messages', icon: MessageSquare, badge: unreadCount },
    { label: 'Profile', href: '/provider/profile', icon: User },
  ];

  const adminItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: User },
    { label: 'Providers', href: '/admin/providers', icon: Briefcase },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Settings', href: '/admin/settings', icon: User },
  ];

  let items = customerItems;
  if (role === 'provider') items = providerItems;
  if (role === 'admin') items = adminItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href.endsWith('/customer') || item.href.endsWith('/provider') || item.href.endsWith('/admin')
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative text-xs font-semibold',
                isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5 mb-0.5', isActive ? 'text-blue-600' : 'text-slate-400')} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
