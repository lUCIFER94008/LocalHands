'use client';

import React from 'react';
import Link from 'next/link';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Zap, Droplets, Hammer, Paintbrush, Wind, Sparkles, Tv, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Wind,
  Sparkles,
  Tv,
  ShieldCheck,
};

export function ServiceCategories() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/60">
              Popular Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3 tracking-tight">
              Popular Services
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-xl font-normal">
              Everything you need, from trusted professionals.
            </p>
          </div>

          <Link href="/customer/services" className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#7C3AED] transition-colors">
              Explore All Services
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {SERVICE_CATEGORIES.map((cat, index) => {
            const Icon = iconMap[cat.icon] || Zap;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/customer/services?category=${cat.id}`}
                  className="group block p-6 rounded-[24px] bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300 mb-4 p-3">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-2">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-[#64748B] leading-relaxed mb-6 line-clamp-2 font-normal">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 text-xs font-semibold text-[#0F172A]">
                    <span>Starts at <strong className="text-sm text-[#2563EB] font-extrabold">{formatPrice(cat.startingPrice)}</strong></span>
                    <span className="w-8 h-8 rounded-full bg-white group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

