'use client';

import React from 'react';
import { RatingStars } from '@/ui/RatingStars';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Dr. Priya Nair',
      role: 'Homeowner in Marine Drive',
      comment: 'Found an electrician within 15 minutes of booking on Local Hands. Arun arrived on time and resolved our breaker trip issue efficiently!',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Mathew Thomas',
      role: 'Apartment Owner in Kakkanad',
      comment: 'The deep home cleaning team was outstanding. Every corner of the kitchen and bathrooms was sanitized properly. Very affordable rates.',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Lakshmi Menon',
      role: 'Resident in Edappally',
      comment: 'Booked Suresh for split AC gas refilling. Honest pricing and genuine customer service. I recommend Local Hands to all my friends.',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">
            Loved by Thousands of Families
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            See what our happy homeowners have to say about their Local Hands experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-blue-500/20 absolute top-6 right-6" />

              <div className="space-y-3">
                <RatingStars rating={r.rating} />
                <p className="text-sm text-slate-300 leading-relaxed italic">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img src={r.photo} alt={r.name} className="w-11 h-11 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-white">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
