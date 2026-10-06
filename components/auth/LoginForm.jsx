'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Mail, Lock, UserRound, BriefcaseBusiness, ShieldCheck } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const toast = useToast();
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ ...data, role }),
      });

      if (res.success) {
        toast.success('Login successful!');
        const userRole = res.data?.user?.role;
        let defaultRedirect = '/customer';
        if (userRole === 'provider') defaultRedirect = '/provider';
        if (userRole === 'admin') defaultRedirect = '/admin';

        const target = redirectPath || res.data?.redirectPath || defaultRedirect;
        router.push(target);
      }
    } catch (err) {
      const msg = err.message || 'Invalid email or password.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (role === 'admin') return 'Sign In as Admin';
    if (role === 'provider') return 'Sign In as Service Provider';
    return 'Sign In as Customer';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-500 font-normal">
          {role === 'admin'
            ? 'Sign in to manage Local Hands platform'
            : 'Sign in to manage your bookings and account'}
        </p>
      </div>

      {/* Role Toggle Switch (3 options: Customer, Service Provider, Admin) */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-center">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            role === 'customer'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <UserRound className="w-4 h-4 shrink-0" />
          <span className="truncate">Customer</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('provider')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            role === 'provider'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BriefcaseBusiness className="w-4 h-4 shrink-0" />
          <span className="truncate">Service Provider</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            role === 'admin'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="truncate">Admin</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            required
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="flex justify-end pt-1">
            <Link href="/forgot-password" className="text-xs font-semibold text-[#2563EB] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="w-full py-3 text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl shadow-lg shadow-blue-600/25"
        >
          {getButtonText()}
        </Button>
      </form>

      {role !== 'admin' && (
        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href={`/register?role=${role}`} className="font-bold text-[#2563EB] hover:underline">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}

