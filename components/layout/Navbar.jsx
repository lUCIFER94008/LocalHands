'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check user session
    apiFetch('/api/auth/me')
      .then((res) => {
        if (res.data?.user) setUser(res.data.user);
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'provider') return '/provider';
    if (user.role === 'admin') return '/admin';
    return '/customer';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1220]/85 backdrop-blur-xl border-b border-white/[0.08] py-4 shadow-2xl'
          : 'bg-[#0B1220]/40 backdrop-blur-md border-b border-white/[0.06] py-5'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo on Left */}
          <Logo isDark={true} />

          {/* Desktop Navigation Centered */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold tracking-wide">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors relative group py-1.5"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>

            <Link
              href="/customer/services"
              className="text-white/80 hover:text-white transition-colors relative group py-1.5"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>

            <a
              href="#how-it-works"
              className="text-white/80 hover:text-white transition-colors relative group py-1.5"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] group-hover:w-full transition-all duration-300 rounded-full" />
            </a>

            <a
              href="#about"
              className="text-white/80 hover:text-white transition-colors relative group py-1.5"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          </nav>

          {/* Action Buttons on Right */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <Link href={getDashboardPath()}>
                <Button variant="primary" className="gap-2 rounded-[14px] px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-lg shadow-blue-600/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    className="gap-2 rounded-[14px] px-5 py-2.5 font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-lg shadow-blue-600/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-white/90 hover:bg-white/10 focus:outline-none border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Animated Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 p-5 border border-white/15 bg-[#0B1220]/95 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-4"
            >
              <nav className="flex flex-col gap-2.5 font-medium text-sm text-white/90">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/customer/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  Services
                </Link>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  About
                </a>
              </nav>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                {user ? (
                  <Link href={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center border-white/20 text-white hover:bg-white/10 rounded-[14px]">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-center rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

