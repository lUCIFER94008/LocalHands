'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newBookingFormSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { useToast } from '@/ui/Toast';
import { RatingStars } from '@/ui/RatingStars';
import { ProviderCardImage } from '@/ui/ProviderCardImage';
import { Spinner } from '@/ui/Spinner';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Home,
  Navigation,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('providerId');
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newBookingFormSchema),
    defaultValues: {
      serviceId: '',
      bookingDate: todayStr,
      bookingTime: '10:00 AM',
      fullName: '',
      phone: '',
      house: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      notes: '',
    },
  });

  const watchServiceId = watch('serviceId');
  const watchDate = watch('bookingDate');
  const watchTime = watch('bookingTime');
  const watchFullName = watch('fullName');
  const watchPhone = watch('phone');
  const watchHouse = watch('house');
  const watchStreet = watch('street');
  const watchCity = watch('city');
  const watchState = watch('state');
  const watchPincode = watch('pincode');
  const watchNotes = watch('notes');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  // 1. Fetch provider, services, and current user
  useEffect(() => {
    async function loadData() {
      if (!providerId) {
        setLoading(false);
        setErrorMessage('No service provider was specified. Please choose a provider to book.');
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const [provRes, servRes, meRes] = await Promise.all([
          apiFetch(`/api/providers/${providerId}`).catch((err) => ({ error: err })),
          apiFetch('/api/services').catch(() => ({ data: [] })),
          apiFetch('/api/auth/me').catch(() => ({ data: { user: null } })),
        ]);

        if (provRes.error || !provRes.data?.provider) {
          setErrorMessage(
            provRes.error?.message || 'Could not find the requested service provider.'
          );
          return;
        }

        const p = provRes.data.provider;
        setProvider(p);

        // Prepopulate authenticated customer info
        const user = meRes.data?.user;
        if (user) {
          setCurrentUser(user);
          if (user.role !== 'customer') {
            toast.info(`You are signed in as a ${user.role}. Bookings require a customer account.`);
          }
          if (user.name) setValue('fullName', user.name);
          if (user.phone) setValue('phone', user.phone);
        } else {
          // Redirect unauthenticated customers to login while preserving destination
          toast.info('Please sign in to complete your booking');
          router.push(`/login?redirect=/customer/bookings/new?providerId=${providerId}`);
          return;
        }

        // Prepopulate city/state from provider location if user location is blank
        if (p.location && p.location.includes(',')) {
          const parts = p.location.split(',');
          setValue('city', parts[0]?.trim() || '');
          setValue('state', parts[1]?.trim() || '');
        }

        // Filter services for this provider
        const allServices = servRes.data || [];
        const matchingServices = allServices.filter((s) => {
          if (!s.isActive) return false;
          const matchCat =
            s.category &&
            p.profession &&
            s.category.toLowerCase().trim() === p.profession.toLowerCase().trim();
          const matchName =
            Array.isArray(p.services) &&
            p.services.some(
              (name) =>
                name.toLowerCase().trim() === s.name.toLowerCase().trim() ||
                name.toLowerCase().trim() === s.category?.toLowerCase().trim()
            );
          return matchCat || matchName;
        });

        const activeServices = matchingServices.length > 0 ? matchingServices : allServices;
        setServices(activeServices);

        if (activeServices.length > 0) {
          setValue('serviceId', activeServices[0].id || activeServices[0]._id);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [providerId, setValue, router, toast]);

  // Selected service and price calculations
  const selectedService =
    services.find((s) => (s.id || s._id) === watchServiceId) || services[0] || null;

  const basePrice = selectedService?.startingPrice || provider?.priceFrom || 299;
  const tax = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + tax;

  // Day of week availability validation
  const selectedDayName = watchDate
    ? new Date(watchDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })
    : '';

  const dayAvailability = provider?.availability?.find(
    (a) => a.day?.toLowerCase() === selectedDayName.toLowerCase()
  );
  const isDayOff = dayAvailability && dayAvailability.enabled === false;

  const isProviderAvailable =
    provider &&
    provider.approvalStatus === 'approved' &&
    provider.isApproved &&
    provider.isActive !== false &&
    provider.isAvailable !== false;

  // Step transitions
  const handleNextToDateTime = () => {
    if (!watchServiceId) {
      toast.error('Please select a service before proceeding');
      return;
    }
    setStep(2);
  };

  const handleNextToAddress = () => {
    if (!watchDate) {
      toast.error('Please select a booking date');
      return;
    }
    if (watchDate < todayStr) {
      toast.error('Booking date cannot be in the past');
      return;
    }
    if (isDayOff) {
      toast.error(`The provider is unavailable on ${selectedDayName}s. Please pick another date.`);
      return;
    }
    if (!watchTime) {
      toast.error('Please select a preferred time slot');
      return;
    }
    setStep(3);
  };

  const handleNextToConfirm = () => {
    if (!watchFullName?.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!watchPhone?.trim() || watchPhone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!watchHouse?.trim() || !watchStreet?.trim() || !watchCity?.trim()) {
      toast.error('Please fill in complete street, house, and city address details');
      return;
    }
    if (!watchPincode?.trim() || watchPincode.trim().length < 4) {
      toast.error('Please enter a valid PIN code');
      return;
    }
    setStep(4);
  };

  // Submit booking
  const onSubmit = async (formData) => {
    if (!isProviderAvailable) {
      toast.error('This provider is currently unavailable for bookings');
      return;
    }

    if (currentUser && currentUser.role !== 'customer') {
      toast.error('Only customers can book services. Please sign in with a customer account.');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = `${formData.house}, ${formData.street}, ${formData.city}, ${
        formData.state || ''
      } - ${formData.pincode}`.trim();

      const payload = {
        providerId: provider.id || provider._id,
        serviceId: formData.serviceId,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        address: fullAddress,
        notes: formData.notes || '',
        fullName: formData.fullName,
        phone: formData.phone,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data?.booking) {
        toast.success('Booking submitted successfully!');
        const bookingId = res.data.booking.id || res.data.booking.bookingId;
        router.push(`/customer/bookings/${bookingId}`);
      } else {
        throw new Error(res.error?.message || 'Failed to submit booking');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (errorMessage || !provider) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Unable to Start Booking</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {errorMessage || 'The requested service provider could not be loaded.'}
        </p>
        <div className="pt-2">
          <Link href="/customer/providers">
            <Button variant="primary" className="px-6 py-2.5 font-bold">
              Browse Available Providers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Provider Header Quick Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-slate-100">
          <ProviderCardImage
            src={provider.photo || provider.userPhoto}
            name={provider.name}
            profession={provider.profession}
            isVerified={provider.isVerified}
            aspect="aspect-square"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{provider.name}</h1>
            {provider.isVerified && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified
              </span>
            )}
          </div>

          <p className="text-sm font-bold text-blue-600">{provider.profession}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-500" /> {provider.experience} Exp
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-500" /> {provider.location}
            </span>
            <RatingStars rating={provider.rating} totalReviews={provider.totalReviews} />
          </div>

          {!isProviderAvailable && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>This provider is currently unavailable for new bookings.</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Card with Progress Steps */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Step Indicator Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-6 py-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="font-extrabold text-base tracking-tight">Reserve Appointment</h2>
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Step {step} of 4: {['Select Service', 'Date & Time', 'Address Details', 'Review & Confirm'][step - 1]}
            </span>
          </div>

          {/* Stepper Dots & Labels */}
          <div className="grid grid-cols-4 gap-2 pt-4 text-center">
            {[
              { num: 1, title: 'Service' },
              { num: 2, title: 'Date & Time' },
              { num: 3, title: 'Address' },
              { num: 4, title: 'Confirm' },
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-1.5 hidden sm:block ${
                      isActive ? 'text-blue-400' : isPast ? 'text-emerald-400' : 'text-white/40'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Content */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Step 1: Choose Required Service
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select the specialized work needed from {provider.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((s) => {
                      const sId = s.id || s._id;
                      const isSelected = watchServiceId === sId;
                      return (
                        <div
                          key={sId}
                          onClick={() => setValue('serviceId', sId)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-slate-900 text-base">{s.name}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {s.description || `Professional ${s.name} service.`}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              Starting from
                            </span>
                            <span className="text-sm font-black text-blue-600">
                              {formatPrice(s.startingPrice || provider.priceFrom)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextToDateTime}
                      className="px-8 font-bold gap-2"
                      disabled={!isProviderAvailable}
                    >
                      Next: Date & Time <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DATE & TIME SELECTION */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Step 2: Appointment Date & Time
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pick when you would like {provider.name} to visit your premises.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Input
                        label="Select Date"
                        type="date"
                        min={todayStr}
                        required
                        {...register('bookingDate')}
                        error={errors.bookingDate?.message}
                      />

                      {selectedDayName && (
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            Selected: <strong>{selectedDayName}</strong>
                          </span>
                        </p>
                      )}

                      {isDayOff && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Provider is off on {selectedDayName}s. Please choose another date.</span>
                        </div>
                      )}
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Available Time Slots <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {timeSlots.map((slot) => {
                          const isSelected = watchTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setValue('bookingTime', slot)}
                              className={`py-3 px-3.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                              <span>{slot}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Provider Availability Working Days Reference */}
                  {provider.availability && provider.availability.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Regular Working Schedule
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {provider.availability.map((item) => (
                          <span
                            key={item.day}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                              item.enabled
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            {item.day.substring(0, 3)}: {item.enabled ? `${item.startTime}-${item.endTime}` : 'Off'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Services
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextToAddress}
                      className="px-8 font-bold gap-2"
                      disabled={isDayOff}
                    >
                      Next: Address <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ADDRESS DETAILS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Step 3: Service Location & Contact
                    </h3>
                    <p className="text-xs text-slate-500">
                      Provide contact details and precise address for the professional.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Full Name"
                      icon={User}
                      placeholder="Your Full Name"
                      required
                      {...register('fullName')}
                      error={errors.fullName?.message}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      icon={Phone}
                      placeholder="9876543210"
                      required
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Flat / House / Building"
                      icon={Home}
                      placeholder="e.g. Flat 402, Green Heights"
                      required
                      {...register('house')}
                      error={errors.house?.message}
                    />

                    <Input
                      label="Street / Landmark / Area"
                      icon={Navigation}
                      placeholder="e.g. MG Road, Near Metro Pillar 42"
                      required
                      {...register('street')}
                      error={errors.street?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="Kochi"
                      required
                      {...register('city')}
                      error={errors.city?.message}
                    />

                    <Input
                      label="State"
                      placeholder="Kerala"
                      required
                      {...register('state')}
                      error={errors.state?.message}
                    />

                    <Input
                      label="PIN Code"
                      placeholder="682001"
                      required
                      {...register('pincode')}
                      error={errors.pincode?.message}
                    />
                  </div>

                  <Textarea
                    label="Special Notes or Instructions (Optional)"
                    placeholder="E.g. Please bring an extension cord, gate bell is out of order, parking available..."
                    rows={2}
                    {...register('notes')}
                  />

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Date & Time
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextToConfirm}
                      className="px-8 font-bold gap-2"
                    >
                      Next: Review Summary <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & CONFIRM */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Step 4: Final Booking Summary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify your appointment details before submitting the request.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Service Professional
                        </span>
                        <p className="font-extrabold text-slate-900 text-base">{provider.name}</p>
                        <p className="text-xs font-semibold text-blue-600">{provider.profession}</p>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Selected Service
                        </span>
                        <p className="font-extrabold text-slate-900 text-base">
                          {selectedService?.name || 'General Service'}
                        </p>
                        <p className="text-xs text-slate-500">{provider.profession} Category</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Date & Arrival Slot
                        </span>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{watchDate} ({selectedDayName})</span>
                        </p>
                        <p className="font-semibold text-slate-600 flex items-center gap-1.5 text-xs mt-1">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          <span>{watchTime}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Service Address & Contact
                        </span>
                        <p className="font-bold text-slate-900">
                          {watchFullName} ({watchPhone})
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {watchHouse}, {watchStreet}, {watchCity}, {watchState} - {watchPincode}
                        </p>
                        {watchNotes && (
                          <p className="text-[11px] text-slate-500 italic mt-1 bg-white p-2 rounded-lg border">
                            "{watchNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Service Base Rate</span>
                        <span className="font-bold text-slate-900">{formatPrice(basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>GST & Taxes (18%)</span>
                        <span className="font-bold text-slate-900">{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                        <span>Total Payable</span>
                        <span className="text-blue-600 text-lg">{formatPrice(totalAmount)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1">
                        * You pay only after service completion. Initial booking is submitted as pending provider confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Edit Address
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={submitting}
                      className="px-8 font-bold gap-2 text-base shadow-lg shadow-blue-600/25"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm & Submit Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  );
}
