'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-slate-400 border-t border-white/[0.08] pt-16 pb-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo isDark={true} />
            <p className="text-sm text-[#CBD5E1] max-w-sm leading-relaxed font-normal">
              Local Hands connects homeowners with background-verified, top-rated service professionals. Fast booking, transparent pricing, and 100% satisfaction guaranteed.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>100% Background Verified Experts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Popular Services</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/customer/services?category=electrician" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Electrician
                </Link>
              </li>
              <li>
                <Link href="/customer/services?category=plumber" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Plumber
                </Link>
              </li>
              <li>
                <Link href="/customer/services?category=carpenter" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Carpenter
                </Link>
              </li>
              <li>
                <Link href="/customer/services?category=painter" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Painter
                </Link>
              </li>
              <li>
                <Link href="/customer/services?category=ac_service" className="text-[#CBD5E1] hover:text-white transition-colors">
                  AC Repair & Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Company</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/customer/services" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="text-[#CBD5E1] hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#CBD5E1] hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/register?role=provider" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Support</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-2.5 text-[#CBD5E1]">
                <Phone className="w-4 h-4 text-[#2563EB]" />
                <span>+91 98470 12345</span>
              </li>
              <li className="flex items-center gap-2.5 text-[#CBD5E1]">
                <Mail className="w-4 h-4 text-[#7C3AED]" />
                <span>support@localhands.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#CBD5E1]">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Kochi, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] font-medium">
          <p>© 2026 Local Hands. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Safety Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

