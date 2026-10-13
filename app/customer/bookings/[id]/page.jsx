'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/ui/StatusBadge';
import { Button } from '@/ui/Button';
import { RatingStars } from '@/ui/RatingStars';
import { ProviderCardImage } from '@/ui/ProviderCardImage';
import { Spinner } from '@/ui/Spinner';
import { useToast } from '@/ui/Toast';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Home,
  ShieldCheck,
  AlertCircle,
  XCircle,
  FileText,
  User,
} from 'lucide-react';

export default function BookingDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/bookings/${id}`);
      if (res.data?.booking) {
        setBooking(res.data.booking);
      } else {
        toast.error('Booking details not found');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const res = await apiFetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      if (res.success) {
        toast.success('Booking cancelled successfully');
        fetchBooking();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleMessageProvider = () => {
    const partnerId =
      booking?.provider?.user?._id ||
      booking?.provider?.user ||
      booking?.provider?._id ||
      booking?.provider;
    if (partnerId) {
      router.push(`/customer/messages?partnerId=${partnerId}`);
    } else {
      router.push('/customer/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Booking Not Found</h2>
        <p className="text-sm text-slate-500">The booking reference could not be found or has been removed.</p>
        <Link href="/customer/bookings">
          <Button variant="primary">View My Bookings</Button>
        </Link>
      </div>
    );
  }

  const isPending = booking.status === 'pending';
  const isAccepted = booking.status === 'accepted';
  const isInProgress = booking.status === 'in_progress';
  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/customer/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400">
          ID: {booking.id.substring(0, 10)}...
        </span>
      </div>

      {/* Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl text-center space-y-4">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner ${
            isPending
              ? 'bg-amber-100 text-amber-600'
              : isAccepted || isInProgress
              ? 'bg-blue-100 text-blue-600'
              : isCompleted
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-rose-100 text-rose-600'
          }`}
        >
          {isPending ? (
            <Clock className="w-10 h-10 animate-pulse" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : isCancelled ? (
            <XCircle className="w-10 h-10" />
          ) : (
            <CheckCircle2 className="w-10 h-10" />
          )}
        </div>

        <div>
          <div className="inline-block mb-2">
            <StatusBadge status={booking.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isPending && 'Booking Submitted Successfully!'}
            {isAccepted && 'Booking Accepted by Provider!'}
            {isInProgress && 'Service In Progress'}
            {isCompleted && 'Service Completed'}
            {isCancelled && 'Booking Cancelled / Rejected'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            {isPending &&
              'Your request has been submitted and is waiting for provider confirmation. The service professional has been notified.'}
            {isAccepted &&
              'The provider accepted your appointment and will arrive at your specified time.'}
            {isInProgress &&
              'The service professional has started working on your requested service.'}
            {isCompleted &&
              'The service job has been marked completed. Thank you for using Local Hands!'}
            {isCancelled &&
              'This service booking is no longer active.'}
          </p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        {/* Provider Profile Summary */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-slate-100">
            <ProviderCardImage
              src={booking.providerPhoto}
              name={booking.providerName}
              profession={booking.providerProfession}
              aspect="aspect-square"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Professional
            </span>
            <h3 className="text-lg font-bold text-slate-900">{booking.providerName}</h3>
            <p className="text-xs font-semibold text-blue-600">{booking.providerProfession}</p>
            {booking.providerPhone && (
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {booking.providerPhone}
              </p>
            )}
          </div>

          <div className="flex sm:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessageProvider}
              className="gap-1.5 text-xs font-bold"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" /> Message
            </Button>
          </div>
        </div>

        {/* Appointment Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Service Selected
            </span>
            <p className="font-bold text-slate-900 text-sm">{booking.serviceName}</p>
            <p className="text-slate-500">{booking.serviceCategory || booking.providerProfession}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Scheduled Date & Time
            </span>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{booking.bookingDate}</span>
            </p>
            <p className="font-semibold text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>{booking.bookingTime}</span>
            </p>
          </div>
        </div>

        {/* Location & Instructions */}
        <div className="space-y-2 pb-6 border-b border-slate-100 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Service Location
          </span>
          <p className="font-semibold text-slate-800 flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{booking.address}</span>
          </p>
          {booking.notes && (
            <p className="text-slate-500 italic bg-slate-50 p-3 rounded-xl border mt-2">
              Note: "{booking.notes}"
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Payment Summary
          </span>
          <div className="flex justify-between text-slate-600">
            <span>Service Base Rate</span>
            <span className="font-semibold text-slate-900">{formatPrice(booking.price)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST & Taxes (18%)</span>
            <span className="font-semibold text-slate-900">{formatPrice(booking.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Amount</span>
            <span className="text-blue-600 text-lg">{formatPrice(booking.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex gap-2">
          <Link href="/customer/bookings">
            <Button variant="primary" className="font-bold gap-2">
              View My Bookings
            </Button>
          </Link>
          <Link href="/customer">
            <Button variant="outline" className="font-bold">
              Back to Home
            </Button>
          </Link>
        </div>

        {(isPending || isAccepted) && (
          <Button
            variant="outline"
            onClick={handleCancel}
            isLoading={cancelling}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold"
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}
