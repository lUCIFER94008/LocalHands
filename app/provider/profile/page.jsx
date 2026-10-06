'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Avatar } from '@/ui/Avatar';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { Select } from '@/ui/Select';
import { Button } from '@/ui/Button';
import { StatusBadge } from '@/ui/StatusBadge';
import { AvailabilitySelector } from '@/components/provider/AvailabilitySelector';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { useToast } from '@/ui/Toast';
import { User, Phone, MapPin, Briefcase, DollarSign, Save, ShieldCheck } from 'lucide-react';

export default function ProviderProfilePage() {
  const toast = useToast();
  const [provider, setProvider] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [priceFrom, setPriceFrom] = useState(499);
  const [description, setDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProviderProfile() {
      try {
        const res = await apiFetch('/api/providers/profile');
        if (res.data?.provider) {
          const p = res.data.provider;
          setProvider(p);
          setName(p.user?.name || '');
          setPhone(p.user?.phone || '');
          setProfession(p.profession || '');
          setExperience(p.experience || '');
          setLocation(p.location || '');
          setPriceFrom(p.priceFrom || 499);
          setDescription(p.description || '');
          setProfilePhoto(p.profilePhoto || p.user?.profileImage || '');
          setIsAvailable(p.isAvailable ?? true);
        }
      } catch (err) {
        toast.error('Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    }
    loadProviderProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/providers/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          profession,
          experience,
          location,
          priceFrom: Number(priceFrom),
          description,
          profilePhoto,
          isAvailable,
        }),
      });

      if (res.success) {
        toast.success('Provider profile updated successfully!');
        setProvider(res.data.provider);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading profile details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Profile</h1>
        <p className="text-xs text-slate-500">Update your public profile, service pricing, and working schedule</p>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <Avatar src={profilePhoto || provider?.profilePhoto} name={name} size="xl" />
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
              <StatusBadge status={provider?.approvalStatus} />
            </div>
            <p className="text-xs font-bold text-blue-600">{profession}</p>
            <p className="text-xs text-slate-500">{provider?.user?.email} • {phone}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Phone Number"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Profession"
              options={SERVICE_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />

            <Input
              label="Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Operating Location"
              icon={MapPin}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <Input
              label="Starting Service Rate (₹)"
              type="number"
              icon={DollarSign}
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              required
            />
          </div>

          <Input
            label="Profile Image URL"
            value={profilePhoto}
            onChange={(e) => setProfilePhoto(e.target.value)}
            placeholder="https://..."
          />

          <Textarea
            label="About & Bio"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-800 cursor-pointer">
              Currently accepting new booking requests
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={saving} className="gap-2">
              <Save className="w-4 h-4" /> Save Profile Details
            </Button>
          </div>
        </form>
      </div>

      {/* Availability Schedule Editor Component */}
      <AvailabilitySelector initialAvailability={provider?.availability || []} />
    </div>
  );
}
