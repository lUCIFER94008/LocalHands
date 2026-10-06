import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { ServiceCategories } from '@/components/landing/ServiceCategories';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TopProfessionals } from '@/components/landing/TopProfessionals';
import { PromoBanner } from '@/components/landing/PromoBanner';
import { WhyUs } from '@/components/landing/WhyUs';
import { Testimonials } from '@/components/landing/Testimonials';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ServiceCategories />
        <HowItWorks />
        <TopProfessionals />
        <PromoBanner />
        <WhyUs />
        <Testimonials />

        {/* Final CTA Section */}
        <section className="py-20 bg-[#0B1220] text-white text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, rgba(124,58,237,0.22), transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(37,99,235,0.18), transparent 45%)
              `,
            }}
          />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Everything your home needs, in one place.
            </h2>
            <p className="text-[#CBD5E1] text-base sm:text-lg max-w-xl mx-auto font-normal">
              Join thousands of satisfied homeowners who rely on Local Hands for fast, reliable, and background-verified professionals.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg" className="px-8 py-3.5 rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-xl shadow-blue-600/30">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link href="/register?role=provider">
                <Button variant="outline" size="lg" className="px-8 py-3.5 rounded-[14px] border-white/20 text-white hover:bg-white/10">
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

