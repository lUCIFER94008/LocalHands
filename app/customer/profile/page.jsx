'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Avatar } from '@/ui/Avatar';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { User, Mail, Phone, Calendar, ShieldCheck, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiFetch('/api/users');
        if (res.data?.user) {
          setUser(res.data.user);
          setName(res.data.user.name || '');
          setPhone(res.data.user.phone || '');
          setProfileImage(res.data.user.profileImage || '');
        }
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/users', {
        method: 'PUT',
        body: JSON.stringify({ name, phone, profileImage }),
      });

      if (res.success) {
        toast.success('Profile updated successfully!');
        setUser(res.data.user);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Profile</h1>
        <p className="text-xs text-slate-500">Manage your personal account details and preferences</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <Avatar src={profileImage || user?.profileImage} name={name} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
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

          <Input
            label="Profile Image URL"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Email Address</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Member Since</span>
              <span className="font-bold text-slate-900">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={saving} className="gap-2">
              <Save className="w-4 h-4" /> Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
