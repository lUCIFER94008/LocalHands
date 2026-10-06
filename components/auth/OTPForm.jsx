'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ResetPasswordForm } from './ResetPasswordForm';

export function OTPForm({ email, onBack }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success) {
        toast.success('OTP verified successfully');
        setVerifiedOtp(data.otp);
      }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (verifiedOtp) {
    return <ResetPasswordForm email={email} otp={verifiedOtp} />;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enter OTP Code</h2>
        <p className="text-xs text-slate-500">We have sent a 6-digit verification code to <strong className="text-slate-800">{email}</strong></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="6-Digit OTP Code"
          type="text"
          maxLength={6}
          icon={ShieldAlert}
          placeholder="123456"
          required
          {...register('otp')}
          error={errors.otp?.message}
        />

        <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
          Verify OTP Code
        </Button>
      </form>

      <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
        <button type="button" onClick={onBack} className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button type="button" onClick={() => toast.info('New OTP sent to email')} className="font-bold text-blue-600 hover:underline">
          Resend OTP
        </button>
      </div>
    </div>
  );
}
