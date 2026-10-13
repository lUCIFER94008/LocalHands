'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/ui/StatusBadge';
import { Tabs } from '@/ui/Tabs';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { RatingStars } from '@/ui/RatingStars';
import { Textarea } from '@/ui/Textarea';
import { useToast } from '@/ui/Toast';
import { Calendar, Clock, MapPin, Star, Eye, XCircle } from 'lucide-react';

export default function CustomerBookingsPage() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await apiFetch('/api/bookings');
      if (res.data) setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await apiFetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      if (res.success) {
        toast.success('Booking cancelled');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setSubmittingReview(true);
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: reviewBooking.id || reviewBooking._id,
          rating,
          comment,
        }),
      });

      if (res.success) {
        toast.success('Review submitted successfully!');
        setReviewBooking(null);
        setComment('');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const upcomingList = bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const completedList = bookings.filter((b) => b.status === 'completed');
  const cancelledList = bookings.filter((b) => ['cancelled', 'rejected'].includes(b.status));

  const bookingTabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingList.length },
    { id: 'completed', label: 'Completed', count: completedList.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledList.length },
  ];

  let displayList = upcomingList;
  if (activeTab === 'completed') displayList = completedList;
  if (activeTab === 'cancelled') displayList = cancelledList;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-xs text-slate-500">Track and manage all your service appointments</p>
      </div>

      <Tabs tabs={bookingTabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading bookings...</div>
      ) : displayList.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
          No {activeTab} bookings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <Link
                    href={`/customer/bookings/${b.id}`}
                    className="text-[10px] font-mono font-bold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    ID: {b.id.substring(0, 8)}...
                  </Link>
                  <StatusBadge status={b.status} />
                </div>

                <div className="space-y-2 pt-3">
                  <h3 className="text-base font-bold text-slate-900">{b.serviceName}</h3>
                  <p className="text-xs font-semibold text-blue-600">Provider: {b.providerName}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {b.bookingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-500" /> {b.bookingTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-rose-500" /> {b.address}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount</span>
                  <span className="text-base font-black text-slate-900">{formatPrice(b.totalAmount)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/customer/bookings/${b.id}`}>
                    <Button variant="outline" size="sm" className="text-slate-700 hover:text-blue-600">
                      View Details
                    </Button>
                  </Link>

                  {['pending', 'accepted'].includes(b.status) && (
                    <Button variant="outline" size="sm" onClick={() => handleCancelBooking(b.id)} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                      Cancel
                    </Button>
                  )}

                  {b.status === 'completed' && !b.review && (
                    <Button variant="primary" size="sm" onClick={() => setReviewBooking(b)}>
                      Leave Review
                    </Button>
                  )}

                  {b.review && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-center">
                      Reviewed ★ {b.review.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave Review Modal */}
      <Modal isOpen={!!reviewBooking} onClose={() => setReviewBooking(null)} title="Write Service Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <p className="text-xs text-slate-500">How was your service experience with <strong>{reviewBooking?.providerName}</strong> for {reviewBooking?.serviceName}?</p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
            <RatingStars rating={rating} interactive={true} onRatingChange={setRating} size="lg" />
          </div>

          <Textarea
            label="Your Comment & Feedback"
            placeholder="Share your experience regarding punctuality, work quality, and behavior..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setReviewBooking(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submittingReview}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
