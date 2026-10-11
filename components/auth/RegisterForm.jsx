'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerRegisterSchema, providerRegisterSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { Mail, Lock, User, Phone, MapPin, Briefcase, DollarSign, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';
  const [role, setRole] = useState(defaultRole);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form for Customer
  const customerForm = useForm({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  // Form for Provider
  const providerForm = useForm({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      profession: 'Electrician',
      experience: '5 years',
      location: 'Kochi, Kerala',
      priceFrom: 499,
      description: '',
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      const err = 'Image file size exceeds the 5MB limit. Please choose a photo smaller than 5MB.';
      setPhotoError(err);
      toast.error(err);
      return;
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileName = file.name || '';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      const err = 'Unsupported image format. Allowed formats are JPG, JPEG, PNG, and WEBP.';
      setPhotoError(err);
      toast.error(err);
      return;
    }

    setPhotoError('');
    setUploadingImage(true);
    setSelectedFile(file);

    // Create instant preview for great UX
    try {
      setPhotoPreview(URL.createObjectURL(file));
    } catch (e) {}

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch('/api/uploads/provider', {
        method: 'POST',
        body: formData,
      });

      if (res.data?.url) {
        setProfilePhotoUrl(res.data.url);
        setPhotoError('');
        toast.success('Profile photo uploaded successfully');
      } else {
        throw new Error('Upload succeeded but no image URL was returned.');
      }
    } catch (err) {
      const errorMsg = err.message || 'Image upload failed. Please try again.';
      setPhotoError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleRetryUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPhotoPreview('');
    setProfilePhotoUrl('');
    setPhotoError('');
  };

  const onCustomerSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...data, role: 'customer' }),
      });

      if (res.success) {
        toast.success('Account registered successfully!');
        router.push('/customer');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onProviderSubmit = async (data) => {
    if (uploadingImage) {
      toast.info('Please wait for profile photo upload to finish.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          role: 'provider',
          profilePhoto: profilePhotoUrl || '',
        }),
      });

      if (res.success) {
        setSuccessMessage('Application submitted! Your provider account is pending admin approval.');
        toast.success('Provider registration submitted');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Application Under Review</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{successMessage}</p>
        <p className="text-xs font-semibold text-slate-400">Our team will verify your credentials and approve your profile shortly.</p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
        <p className="text-xs text-slate-500">Join Local Hands as a Customer or Service Expert</p>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            role === 'customer'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Customer
        </button>

        <button
          type="button"
          onClick={() => setRole('provider')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            role === 'provider'
              ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Service Provider
        </button>
      </div>

      {/* CUSTOMER FORM */}
      {role === 'customer' && (
        <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            required
            {...customerForm.register('name')}
            error={customerForm.formState.errors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="john@example.com"
            required
            {...customerForm.register('email')}
            error={customerForm.formState.errors.email?.message}
          />

          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="9876543210"
            required
            {...customerForm.register('phone')}
            error={customerForm.formState.errors.phone?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              {...customerForm.register('password')}
              error={customerForm.formState.errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              {...customerForm.register('confirmPassword')}
              error={customerForm.formState.errors.confirmPassword?.message}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
            Create Customer Account
          </Button>
        </form>
      )}

      {/* PROVIDER FORM */}
      {role === 'provider' && (
        <form onSubmit={providerForm.handleSubmit(onProviderSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            placeholder="Arun Kumar"
            required
            {...providerForm.register('name')}
            error={providerForm.formState.errors.name?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="arun@example.com"
              required
              {...providerForm.register('email')}
              error={providerForm.formState.errors.email?.message}
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="9847112233"
              required
              {...providerForm.register('phone')}
              error={providerForm.formState.errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Profession / Category"
              required
              options={SERVICE_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
              {...providerForm.register('profession')}
              error={providerForm.formState.errors.profession?.message}
            />

            <Input
              label="Years of Experience"
              placeholder="6 years"
              required
              {...providerForm.register('experience')}
              error={providerForm.formState.errors.experience?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location / City"
              icon={MapPin}
              placeholder="Kochi, Kerala"
              required
              {...providerForm.register('location')}
              error={providerForm.formState.errors.location?.message}
            />

            <Input
              label="Starting Service Rate (₹)"
              type="number"
              icon={DollarSign}
              placeholder="499"
              required
              {...providerForm.register('priceFrom')}
              error={providerForm.formState.errors.priceFrom?.message}
            />
          </div>

          <Textarea
            label="Description / About Your Services"
            placeholder="Provide details of your experience, certifications, and work specialization..."
            rows={3}
            {...providerForm.register('description')}
          />

          {/* Profile Photo Upload Field (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Profile Photo (Optional)
            </label>
            <p className="text-[11px] text-slate-500">
              Upload a photo to help customers recognize you. You can add one later.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 border border-slate-200 rounded-2xl bg-slate-50">
              <div className="relative shrink-0">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-xs select-none">
                    {providerForm.watch('name')?.trim() ? (
                      providerForm.watch('name').trim().charAt(0).toUpperCase()
                    ) : (
                      <User className="w-7 h-7 text-white/80" />
                    )}
                  </div>
                )}
                {profilePhotoUrl && !uploadingImage && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    disabled={uploadingImage}
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
                  />
                  {(photoPreview || profilePhotoUrl) && !uploadingImage && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  Upload a JPG, PNG, JPEG, or WEBP image up to 5 MB. You can add a photo later.
                </p>

                {uploadingImage && (
                  <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 animate-pulse">
                    <span>Uploading photo to Cloudinary...</span>
                  </p>
                )}

                {profilePhotoUrl && !uploadingImage && (
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo saved & ready for registration
                  </p>
                )}

                {photoError && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <p className="text-xs font-semibold text-rose-600">{photoError}</p>
                    {selectedFile && !uploadingImage && (
                      <button
                        type="button"
                        onClick={handleRetryUpload}
                        className="text-xs font-bold text-blue-600 underline hover:text-blue-700 cursor-pointer"
                      >
                        Retry Upload
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              {...providerForm.register('password')}
              error={providerForm.formState.errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              {...providerForm.register('confirmPassword')}
              error={providerForm.formState.errors.confirmPassword?.message}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
            Apply as Service Provider
          </Button>
        </form>
      )}

      <div className="text-center pt-2 text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
