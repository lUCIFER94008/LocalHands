'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] p-8 sm:p-14 text-white shadow-2xl shadow-blue-900/20"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-amber-300 border border-white/20">
              <Tag className="w-3.5 h-3.5" />
              <span>LIMITED TIME OFFER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Get 20% Off On Your First Booking!
            </h2>

            <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
              Use promo code <strong className="bg-white/20 px-2.5 py-1 rounded-lg font-mono text-white">LOCAL20</strong> at checkout to claim your instant discount on electrician, plumbing, AC, or cleaning service.
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <Link href="/customer/services">
                <Button variant="secondary" className="bg-white text-[#2563EB] hover:bg-slate-100 font-extrabold px-8 py-3.5 rounded-[14px] shadow-lg">
                  Book Your Service
                  <ArrowRight className="w-4.5 h-4.5 ml-1.5 text-[#2563EB]" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

