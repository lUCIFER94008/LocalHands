'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from '@/lib/validations';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { useToast } from '@/ui/Toast';
import { CheckCircle2, Calendar, Clock, MapPin, Wrench, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BookingWizard({ provider, services = [] }) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const selectedServiceId = services[0]?.id || services[0]?._id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      providerId: provider?.id || provider?._id,
      serviceId: selectedServiceId || '',
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '10:00 AM',
      address: '',
      notes: '',
    },
  });

  const watchServiceId = watch('serviceId');
  const watchDate = watch('bookingDate');
  const watchTime = watch('bookingTime');
  const watchAddress = watch('address');

  const selectedService = services.find((s) => s.id === watchServiceId || s._id === watchServiceId) || services[0];
  const basePrice = provider?.priceFrom || selectedService?.startingPrice || 299;
  const tax = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + tax;

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
     meSlot = '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success && res.data?.booking) {
        toast.success('Booking created successfully!');
        setBookingSuccess({
          ...res.data.booking,
          providerName: provider?.name,
          serviceName: selectedService?.name,
          date: data.bookingDate,
          time: data.bookingTime,
          total: totalAmount,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Confirmed
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">Booking Confirmed!</h2>
          <p className="text-sm text-slate-500 mt-1">
            Your service request has been transmitted to {bookingSuccess.providerName}.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 text-left space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Booking ID</span>
            <span className="font-mono font-bold text-slate-900">{bookingSuccess.id || bookingSuccess.bookingId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Service</span>
            <span className="font-bold text-slate-900">{bookingSuccess.serviceName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Date & Time</span>
            <span className="font-bold text-slate-900">{bookingSuccess.date} at {bookingSuccess.time}</span>
          </div>
          <div className="flex justify-between pt-1 text-base">
            <span className="text-slate-700 font-bold">Total Amount</span>
            <span className="font-black text-blue-600">{formatPrice(bookingSuccess.total)}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button variant="outline" className="w-full" onClick={() => router.push('/customer/bookings')}>
            View My Bookings
          </Button>
          <Button variant="primary" className="w-full" onClick={() => router.push('/customer')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
      {/* Wizard Step Navigation Indicator */}
      <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm">Book Service</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>1. Service</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>2. Date & Time</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>3. Address</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>4. Confirm</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* STEP 1: SERVICE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 1: Select Service</h3>
                  <p className="text-xs text-slate-500">Choose the specific task required from {provider?.name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((s) => {
                    const sId = s.id || s._id;
                    const isSelected = watchServiceId === sId;
                    return (
                      <div
                        key={sId}
                        onClick={() => setValue('serviceId', sId)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                          <span className="text-xs font-bold text-blue-600 mt-2 block">{formatPrice(s.startingPrice)}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={() => setStep(2)}>
                    Next: Date & Time
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE & TIME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 2: Choose Date & Time</h3>
                  <p className="text-xs text-slate-500">Select when you would like the professional to arrive</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Booking Date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    {...register('bookingDate')}
                    error={errors.bookingDate?.message}
                  />

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Preferred Time Slot *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = watchTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setValue('bookingTime', slot)}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button variant="primary" onClick={() => setStep(3)}>
                    Next: Address
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ADDRESS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 3: Service Address</h3>
                  <p className="text-xs text-slate-500">Provide the exact location for the service appointment</p>
                </div>

                <Textarea
                  label="Full Street Address"
                  placeholder="Enter house no, street name, apartment name, landmark, city and pincode..."
                  rows={3}
                  required
                  {...register('address')}
                  error={errors.address?.message}
                />

                <Textarea
                  label="Special Notes or Instructions (Optional)"
                  placeholder="E.g. Please bring extra 16A socket switchboards, ring bell twice..."
                  rows={2}
                  {...register('notes')}
                />

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button variant="primary" onClick={() => watchAddress?.trim() ? setStep(4) : toast.error('Please enter service address')}>
                    Next: Confirm Booking
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONFIRM */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 4: Review & Confirm</h3>
                  <p className="text-xs text-slate-500">Please check your booking details before submitting</p>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">Service Professional</span>
                      <p className="font-bold text-slate-900">{provider?.name}</p>
                      <p className="text-xs text-slate-500">{provider?.profession}</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">Selected Task</span>
                      <p className="font-bold text-slate-900">{selectedService?.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">Date & Time</span>
                      <p className="font-bold text-slate-900">{watchDate} at {watchTime}</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">Service Address</span>
                      <p className="font-bold text-slate-900">{watchAddress}</p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Service Rate</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>GST & Taxes (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Amount Payable</span>
                      <span className="text-blue-600">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" variant="primary" isLoading={loading} className="px-8">
                    Confirm & Book Now
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
