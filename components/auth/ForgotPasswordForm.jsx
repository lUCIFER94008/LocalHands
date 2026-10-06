'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';
import { OTPForm } from './OTPForm';

export function ForgotPasswordForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success) {
        toast.success('OTP sent to your email address');
        setSubmittedEmail(data.email);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  if (submittedEmail) {
    return <OTPForm email={submittedEmail} onBack={() => setSubmittedEmail('')} />;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h2>
        <p className="text-xs text-slate-500">Enter your registered email address to receive a 6-digit OTP code</p>
      </div>

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

        <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
          Send OTP Code
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Remember your password?{' '}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
