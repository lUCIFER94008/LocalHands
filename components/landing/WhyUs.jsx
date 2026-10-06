'use client';

import React from 'react';
import { ShieldCheck, Tag, Lock, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhyUs() {
  const features = [
    {
      title: 'Verified Professionals',
      description: 'Every expert is background-checked, identity verified, and trained for excellence.',
      icon: ShieldCheck,
      color: 'bg-[#10B981]/10 text-[#10B981]',
    },
    {
      title: 'Transparent Pricing',
      description: 'Upfront rates with zero hidden charges. Know exactly what you pay before booking.',
      icon: Tag,
      color: 'bg-[#2563EB]/10 text-[#2563EB]',
    },
    {
      title: 'Secure Booking',
      description: 'Protected payments and instant booking confirmations backed by service guarantee.',
      icon: Lock,
      color: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    },
    {
      title: '24/7 Dedicated Support',
      description: 'Round-the-clock customer support to answer questions and assist with any issues.',
      icon: Headphones,
      color: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/60">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3 tracking-tight">
            Why Local Hands?
          </h2>
          <p className="text-sm text-[#64748B] mt-2 font-normal">
            Built to provide homeowners with absolute trust, convenience, and superior service quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-7 rounded-[24px] bg-[#F8FAFC] border border-slate-200/70 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
