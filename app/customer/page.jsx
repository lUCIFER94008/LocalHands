'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { RatingStars } from '@/ui/RatingStars';
import { Button } from '@/ui/Button';
import { SkeletonCard } from '@/ui/Skeleton';
import { Search, MapPin, ShieldCheck, ArrowRight, Calendar, Bookmark, Award, Sparkles, Zap, Droplets, Wind, Hammer, Paintbrush, Tv } from 'lucide-react';

const iconMap = { Zap, Droplets, Hammer, Paintbrush, Wind, Sparkles, Tv };

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, provRes, bookRes, savedRes] = await Promise.all([
          apiFetch('/api/auth/me').catch(() => null),
          apiFetch('/api/providers?limit=4').catch(() => null),
          apiFetch('/api/bookings').catch(() => null),
          apiFetch('/api/providers?savedOnly=true').catch(() => null),
        ]);

        if (userRes?.data?.user) setUser(userRes.data.user);
        if (provRes?.data) setProviders(provRes.data);
        if (bookRes?.data) setBookings(bookRes.data);
        if (savedRes?.data) setSavedCount(savedRes.data.length);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/customer/services?search=${encodeURIComponent(search)}`);
  };

  const upcomingBookings = bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello {user?.name || 'Customer'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Find the best professionals for your home needs with instant online booking.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link href="/customer/services">
            <Button variant="primary" className="bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs">
              Explore Services
            </Button>
          </Link>
        </div>
      </div>

      {/* Booking Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{upcomingBookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{completedBookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Experts</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{savedCount}</p>
        </div>
      </div>

      {/* Large Service Search */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-blue-600 ml-2 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for an electrician, plumber, AC service or carpenter..."
          className="w-full text-sm font-medium focus:outline-none bg-transparent"
        />
        <Button type="submit" variant="primary" size="sm" className="px-5">
          Search
        </Button>
      </form>

      {/* Service Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Service Categories</h2>
          <Link href="/customer/services" className="text-xs font-bold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Zap;
            return (
              <Link
                key={cat.id}
                href={`/customer/services?category=${cat.id}`}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">Special Offer</span>
          <h3 className="text-2xl font-black">Get 20% Off On Your First Booking</h3>
          <p className="text-xs text-blue-100">Use promo code LOCAL20 for instant discount at checkout.</p>
        </div>
        <Link href="/customer/services">
          <Button variant="secondary" className="bg-white text-blue-900 font-bold whitespace-nowrap px-6">
            Claim Offer Now
          </Button>
        </Link>
      </div>

      {/* Top Professionals Near You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Top Professionals Near You</h2>
          <Link href="/customer/providers" className="text-xs font-bold text-blue-600 hover:underline">
            Explore All Professionals
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={p.photo || p.userPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {p.isVerified && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 mb-2">{p.profession}</p>

                  <RatingStars rating={p.rating} totalReviews={p.totalReviews} />

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>{p.experience} exp</span>
                    <span>•</span>
                    <span className="truncate">{p.location}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Rate</span>
                    <span className="text-xs font-black text-slate-900">{formatPrice(p.priceFrom)}</span>
                  </div>
                  <Link href={`/customer/bookings/new?providerId=${p.id || p._id}`}>
                    <Button variant="primary" size="sm">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
