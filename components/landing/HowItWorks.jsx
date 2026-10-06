'use client';

import React from 'react';
import { Search, UserCheck, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose a Service',
      desc: 'Browse our wide range of home services and select what you need with transparent pricing.',
      icon: Search,
      color: 'from-[#2563EB] to-[#4F46E5]',
    },
    {
      num: '02',
      title: 'Select a Professional',
      desc: 'Pick background-verified, top-rated local experts based on reviews, ratings, and experience.',
      icon: UserCheck,
      color: 'from-[#4F46E5] to-[#7C3AED]',
    },
    {
      num: '03',
      title: 'Book & Relax',
      desc: 'Schedule a convenient date and time slot. Our expert arrives at your doorstep to get it done.',
      icon: CalendarCheck,
      color: 'from-[#7C3AED] to-[#EC4899]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200/60">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3 tracking-tight">
            How Local Hands Works
          </h2>
          <p className="text-sm text-[#64748B] mt-2 font-normal">
            Get your home issues resolved in 3 simple steps with complete peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 rounded-[28px] bg-white border border-slate-200/80 space-y-5 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-black text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#7C3AED] transition-all">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#0F172A]">{step.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

