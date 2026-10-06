'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { ShieldCheck, ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Reliable Professionals For Your Home Needs',
      subtitle: 'Easily book electricians, plumbers, carpenters, and painters right from your smartphone.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
      badge: 'Certified Experts',
      icon: Zap,
    },
    {
      id: 2,
      title: 'Verified & Background Checked Experts',
      subtitle: 'Every professional on Local Hands undergoes identity verification and background screening for your peace of mind.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80',
      badge: '100% Safe',
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: 'Safe, Affordable & Convenient Services',
      subtitle: 'Enjoy upfront transparent pricing, flexible scheduling, and instant status updates for every booking.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      badge: 'Top Rated',
      icon: Award,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/register');
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <Logo isDark={true} />
        <Link href="/register" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
          Skip Tour
        </Link>
      </div>

      {/* Main Slide Content */}
      <div className="max-w-4xl mx-auto w-full my-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <activeSlide.icon className="w-4 h-4" />
              <span>{activeSlide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {activeSlide.title}
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
              {activeSlide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-4/5 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl"
          >
            <img src={activeSlide.image} alt={activeSlide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Footer */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-t border-slate-900 pt-6 z-10">
        {/* Indicators */}
        <div className="flex gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-slate-800'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <Button onClick={handleNext} variant="primary" className="px-7 py-3 text-sm font-bold gap-2">
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
