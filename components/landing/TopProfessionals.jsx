'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

const SEED_PROVIDERS = [
  {
    id: 'seed-1',
    name: 'Arun Kumar',
    profession: 'Master Electrician',
    rating: 4.9,
    totalReviews: 128,
    experience: '8+ Yrs Exp',
    location: 'Kochi, Kerala',
    priceFrom: 399,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'seed-2',
    name: 'Shameer K.',
    profession: 'Senior Plumbing Expert',
    rating: 4.8,
    totalReviews: 94,
    experience: '6+ Yrs Exp',
    location: 'Ernakulam, Kerala',
    priceFrom: 449,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'seed-3',
    name: 'Riyas M.',
    profession: 'AC & HVAC Specialist',
    rating: 4.95,
    totalReviews: 210,
    experience: '10+ Yrs Exp',
    location: 'Kakkanad, Kochi',
    priceFrom: 599,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'seed-4',
    name: 'Aneesha V.',
    profession: 'Deep Home Cleaning Specialist',
    rating: 5.0,
    totalReviews: 88,
    experience: '5+ Yrs Exp',
    location: 'Aluva, Kerala',
    priceFrom: 699,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'seed-5',
    name: 'Suresh Babu',
    profession: 'Custom Carpentry Expert',
    rating: 4.85,
    totalReviews: 112,
    experience: '12+ Yrs Exp',
    location: 'Tripunithura, Kochi',
    priceFrom: 499,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'seed-6',
    name: 'Manoj P.',
    profession: 'Interior Painting Specialist',
    rating: 4.9,
    totalReviews: 76,
    experience: '7+ Yrs Exp',
    location: 'Edappally, Kochi',
    priceFrom: 899,
    isVerified: true,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
  },
];

export function TopProfessionals() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    apiFetch('/api/providers?limit=6')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProviders(res.data);
        } else {
          setProviders(SEED_PROVIDERS);
        }
      })
      .catch(() => {
        setProviders(SEED_PROVIDERS);
      });
  }, []);

  const displayList = providers.length > 0 ? providers : SEED_PROVIDERS;

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#10B981] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
              Verified Experts
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3 tracking-tight">
              Top Professionals Near You
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-xl">
              Highly experienced, background-verified local service experts ready to assist with guaranteed satisfaction.
            </p>
          </div>

          <Link href="/customer/providers" className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#7C3AED] transition-colors">
              View All Professionals
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayList.slice(0, 6).map((p, idx) => (
            <motion.div
              key={p.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden mb-5 bg-slate-100">
                  <img
                    src={p.photo || p.profilePhoto || SEED_PROVIDERS[idx % SEED_PROVIDERS.length].photo}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {(p.isVerified ?? true) && (
                    <div className="absolute top-3 left-3 bg-[#10B981] text-white text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-[#0F172A] text-lg leading-snug">{p.name}</h3>
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                      {p.profession}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <RatingStars rating={p.rating || 4.9} totalReviews={p.totalReviews || 98} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#64748B] pt-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Award className="w-4 h-4 text-[#7C3AED]" />
                      {p.experience || '5+ Yrs Exp'}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium truncate">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      {p.location || 'Kochi, Kerala'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Starts from</span>
                  <p className="text-base font-black text-[#0F172A]">{formatPrice(p.priceFrom || 399)}</p>
                </div>

                <Link href={`/customer/providers/${p.id}`}>
                  <Button variant="primary" size="sm" className="rounded-xl px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-sm">
                    Book Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

