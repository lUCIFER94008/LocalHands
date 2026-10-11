'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { RatingStars } from '@/ui/RatingStars';
import { Button } from '@/ui/Button';
import { ProviderCardImage } from '@/ui/ProviderCardImage';
import { Bookmark, ShieldCheck, MapPin, Award, Trash2 } from 'lucide-react';
import { useToast } from '@/ui/Toast';

export default function CustomerSavedPage() {
  const toast = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedProviders = async () => {
    try {
      const res = await apiFetch('/api/providers?savedOnly=true');
      if (res.data) setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProviders();
  }, []);

  const handleRemoveSaved = async (providerId) => {
    try {
      const res = await apiFetch(`/api/providers/${providerId}`, { method: 'POST' });
      if (res.success) {
        toast.success('Provider removed from saved list');
        fetchSavedProviders();
      }
    } catch (err) {
      toast.error('Failed to update saved list');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Professionals</h1>
        <p className="text-xs text-slate-500">Quick access to your bookmarked service experts</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading saved providers...</div>
      ) : providers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No saved providers. Click the heart icon on any provider card to save them here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between relative">
              <div>
                <div className="relative mb-4">
                  <ProviderCardImage
                    src={p.photo || p.userPhoto}
                    name={p.name}
                    profession={p.profession}
                    isVerified={p.isVerified}
                    aspect="aspect-square"
                  />
                  <button
                    onClick={() => handleRemoveSaved(p.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md text-rose-600 hover:bg-rose-50 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mb-2">{p.profession}</p>
                <RatingStars rating={p.rating} totalReviews={p.totalReviews} />
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Rate</span>
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
