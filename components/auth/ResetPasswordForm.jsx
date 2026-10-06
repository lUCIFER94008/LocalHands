'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { Lock, CheckCircle2 } from 'lucide-react';

export function ResetPasswordForm({ email, otp }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp, newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success) {
        toast.success('Password reset successfully!');
        setResetDone(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (resetDone) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Password Reset Complete</h3>
        <p className="text-xs text-slate-500">Your account password has been updated successfully.</p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Proceed to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-500">Choose a secure new password for account <strong className="text-slate-800">{email}</strong></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          required
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />

        <Input
          label="Confirm New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          required
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
