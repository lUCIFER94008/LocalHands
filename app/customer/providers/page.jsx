'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { RatingStars } from '@/ui/RatingStars';
import { Button } from '@/ui/Button';
import { SkeletonCard } from '@/ui/Skeleton';
import { ProviderCardImage } from '@/ui/ProviderCardImage';
import { Search, MapPin, ShieldCheck, Bookmark, Award, Heart } from 'lucide-react';
import { useToast } from '@/ui/Toast';

export default function CustomerProvidersPage() {
  const searchParams = useSearchParams();
  const initialProfession = searchParams.get('profession') || 'all';

  const toast = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profession, setProfession] = useState(initialProfession);
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        let url = `/api/providers?profession=${encodeURIComponent(profession)}&location=${encodeURIComponent(location)}&search=${encodeURIComponent(search)}`;
        const res = await apiFetch(url);
        if (res.data) setProviders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, [profession, location, search]);

  const toggleSaveProvider = async (providerId, index) => {
    try {
      const res = await apiFetch(`/api/providers/${providerId}`, { method: 'POST' });
      if (res.success) {
        const updated = [...providers];
        updated[index].isSaved = res.data.isSaved;
        setProviders(updated);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Professionals</h1>
        <p className="text-xs text-slate-500">Book background-verified local experts with top customer ratings</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Professions</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter location (e.g. Kochi)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Service Professionals Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your location or profession search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p, index) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between relative">
              <button
                type="button"
                onClick={() => toggleSaveProvider(p.id, index)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-xs border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors z-10"
              >
                <Heart className={`w-4 h-4 ${p.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <div>
                <ProviderCardImage
                  src={p.photo || p.userPhoto}
                  name={p.name}
                  profession={p.profession}
                  isVerified={p.isVerified}
                  className="mb-4"
                />

                <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mb-2">{p.profession}</p>

                <RatingStars rating={p.rating} totalReviews={p.totalReviews} />

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-purple-600" /> {p.experience}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {p.location}
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Starts from</span>
                  <p className="text-sm font-black text-slate-900">{formatPrice(p.priceFrom)}</p>
                </div>

                <Link href={`/customer/providers/${p.id}`}>
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
  );
}
