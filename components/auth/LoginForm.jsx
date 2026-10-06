'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { Mail, Lock, UserCheck, Briefcase } from 'lucide-react';

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
        const target = redirectPath || res.data.redirectPath || '/customer';
        router.push(target);
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-500">Sign in to manage your bookings and account</p>
      </div>

      {/* Role Toggle Switch */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            role === 'customer'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Customer
        </button>

        <button
          type="button"
          onClick={() => setRole('provider')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            role === 'provider'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Service Provider
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
            <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
          Sign In as {role === 'customer' ? 'Customer' : 'Provider'}
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-slate-500">
        Don't have an account?{' '}
        <Link href={`/register?role=${role}`} className="font-bold text-blue-600 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
