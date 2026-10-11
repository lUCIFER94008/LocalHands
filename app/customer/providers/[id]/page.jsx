'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { RatingStars } from '@/ui/RatingStars';
import { Button } from '@/ui/Button';
import { Tabs } from '@/ui/Tabs';
import { Modal } from '@/ui/Modal';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { ProviderCardImage } from '@/ui/ProviderCardImage';
import { ShieldCheck, MapPin, Award, MessageSquare, Calendar, Star, Clock, Check } from 'lucide-react';
import { useToast } from '@/ui/Toast';

export default function ProviderDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [provRes, servRes] = await Promise.all([
          apiFetch(`/api/providers/${id}`),
          apiFetch('/api/services'),
        ]);

        if (provRes.data) {
          setProvider(provRes.data.provider);
          setReviews(provRes.data.reviews || []);
        }
        if (servRes.data) {
          setServices(servRes.data);
        }
      } catch (err) {
        toast.error('Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleStartMessage = () => {
    if (!provider?.user) return;
    const partnerId = provider.user._id || provider.user;
    router.push(`/customer/messages?partnerId=${partnerId}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-semibold">Loading provider profile...</div>;
  }

  if (!provider) {
    return <div className="p-8 text-center text-slate-500 font-semibold">Provider not found</div>;
  }

  const detailTabs = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services Offered' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'location', label: 'Location & Availability' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Provider Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shrink-0 shadow-lg border-2 border-slate-100">
          <ProviderCardImage
            src={provider.photo || provider.userPhoto}
            name={provider.name}
            profession={provider.profession}
            isVerified={provider.isVerified}
            aspect="aspect-square"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{provider.name}</h1>
            <p className="text-sm font-bold text-blue-600">{provider.profession}</p>
          </div>

          <RatingStars rating={provider.rating} totalReviews={provider.totalReviews} size="md" />

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-purple-600" />
              {provider.experience} Experience
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-rose-500" />
              {provider.location}
            </span>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold">
              Rate: {formatPrice(provider.priceFrom)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <Button variant="primary" size="lg" onClick={() => setBookingWizardOpen(true)} className="px-8 font-bold gap-2">
              <Calendar className="w-5 h-5" /> Book Now
            </Button>
            <Button variant="outline" size="lg" onClick={handleStartMessage} className="px-6 gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Message
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={detailTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs min-h-[250px]">
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About {provider.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {provider.description || `${provider.name} is a licensed professional ${provider.profession} with ${provider.experience} of working experience in domestic and commercial repairs.`}
            </p>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Services Offered</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {provider.services?.map((serv, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-800">{serv}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600">{formatPrice(provider.priceFrom)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Customer Feedback & Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews submitted yet for this provider.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id || r._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{r.customerName}</h4>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Service Coverage & Schedule</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border flex items-center gap-3 text-xs font-semibold text-slate-700">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Primary Operating Base: <strong>{provider.location}</strong></span>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700">Working Days</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {provider.availability?.map((item) => (
                  <div key={item.day} className={`p-3 rounded-xl border text-xs ${item.enabled ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="font-bold block">{item.day}</span>
                    <span className="text-[10px]">{item.enabled ? `${item.startTime} - ${item.endTime}` : 'Off'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Wizard Modal */}
      <Modal isOpen={bookingWizardOpen} onClose={() => setBookingWizardOpen(false)} maxWidth="max-w-4xl">
        <BookingWizard provider={provider} services={services} />
      </Modal>
    </div>
  );
}
