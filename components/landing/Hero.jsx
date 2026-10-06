'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, ShieldCheck, CheckCircle2, Zap, Droplets, Wind, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Kochi, Kerala');

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/customer/services?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#0B1220] text-white min-h-[760px] flex items-center">
      {/* Background Radial Glowing Orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 55% 30%, rgba(124,58,237,0.28), transparent 45%),
            radial-gradient(circle at 35% 70%, rgba(37,99,235,0.22), transparent 45%)
          `,
        }}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content (approx 52%) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.15] text-xs font-semibold text-[#CBD5E1] shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>India's #1 Rated Local Service Partner</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[66px] xl:text-[72px] font-black tracking-tight leading-[0.98] sm:leading-[1.02]"
            >
              Everything your home <br className="hidden sm:inline" />
              needs,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                in one place.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base sm:text-[18px] text-[#CBD5E1] max-w-[620px] mx-auto lg:mx-0 font-normal leading-[1.7]"
            >
              Find trusted local professionals for your home services. Verified experts, transparent pricing, and hassle-free booking.
            </motion.p>

            {/* Hero Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              onSubmit={handleSearch}
              className="bg-white p-2.5 sm:p-3 rounded-[20px] shadow-2xl shadow-blue-950/40 border border-white/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-900 max-w-[740px] mx-auto lg:mx-0 min-h-[68px]"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 w-full py-1">
                <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a service (e.g. Electrician, AC Repair)..."
                  className="w-full text-sm font-medium focus:outline-none bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="w-full sm:w-52 flex items-center gap-2.5 px-3.5 py-2 border-t sm:border-t-0 sm:border-l border-slate-200 text-slate-700">
                <MapPin className="w-4.5 h-4.5 text-[#7C3AED] shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full text-xs font-semibold focus:outline-none bg-transparent text-slate-800"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-md shadow-blue-600/30 hover:scale-[1.02] transition-transform"
              >
                Search
              </Button>
            </motion.form>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-6 max-w-[580px] mx-auto lg:mx-0 border-t border-white/10"
            >
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#F59E0B]">
                  <Star className="w-5 h-5 fill-[#F59E0B]" />
                  <span className="text-2xl sm:text-3xl font-black text-white">4.9/5</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1 font-medium">Verified Experts</p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <div className="text-2xl sm:text-3xl font-black text-white">2.4K+</div>
                <p className="text-xs text-[#94A3B8] mt-1 font-medium">Happy Homes</p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <div className="text-2xl sm:text-3xl font-black text-white">24/7</div>
                <p className="text-xs text-[#94A3B8] mt-1 font-medium">Support</p>
              </div>
            </motion.div>
          </div>

          {/* Right Image Container (approx 48%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0"
          >
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl shadow-indigo-950/60 border border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
                alt="Local Hands Service Professional"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-transparent to-transparent" />

              {/* Bottom Glass Card: Background Checked */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-[18px] bg-[#0F172A]/82 backdrop-blur-md border border-white/12 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0 shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Background Checked</h4>
                    <p className="text-xs text-slate-300">Certified & insured professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Service Badges around Image */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="hidden sm:flex absolute -top-3 left-0 items-center gap-2.5 px-4 py-2.5 rounded-[18px] bg-white/95 backdrop-blur-md shadow-xl text-slate-900 border border-white text-xs font-bold z-20"
            >
              <div className="p-1.5 rounded-xl bg-[#F59E0B] text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span>Electrician</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="hidden sm:flex absolute top-1/3 -right-4 items-center gap-2.5 px-4 py-2.5 rounded-[18px] bg-white/95 backdrop-blur-md shadow-xl text-slate-900 border border-white text-xs font-bold z-20"
            >
              <div className="p-1.5 rounded-xl bg-[#2563EB] text-white">
                <Droplets className="w-4 h-4" />
              </div>
              <span>Plumber</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="hidden sm:flex absolute bottom-20 -left-4 items-center gap-2.5 px-4 py-2.5 rounded-[18px] bg-white/95 backdrop-blur-md shadow-xl text-slate-900 border border-white text-xs font-bold z-20"
            >
              <div className="p-1.5 rounded-xl bg-[#4F46E5] text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span>AC Service</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1.5 }}
              className="hidden lg:flex absolute -bottom-3 right-6 items-center gap-2.5 px-4 py-2.5 rounded-[18px] bg-white/95 backdrop-blur-md shadow-xl text-slate-900 border border-white text-xs font-bold z-20"
            >
              <div className="p-1.5 rounded-xl bg-[#7C3AED] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Cleaning</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

