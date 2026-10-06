'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/Toast';
import { apiFetch } from '@/lib/api';
import { Clock, Check } from 'lucide-react';

export function AvailabilitySelector({ initialAvailability = [] }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const defaultDays = [
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Saturday', enabled: true, startTime: '10:00', endTime: '16:00' },
    { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '18:00' },
  ];

  const [availability, setAvailability] = useState(
    initialAvailability.length > 0 ? initialAvailability : defaultDays
  );

  const handleToggle = (index) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/providers/availability', {
        method: 'PUT',
        body: JSON.stringify({ availability }),
      });

      if (res.success) {
        toast.success('Working schedule updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update working schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Working Days & Hours</h3>
          <p className="text-xs text-slate-500">Configure your weekly availability schedule for customer bookings</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={loading}>
          <Check className="w-4 h-4 mr-1" /> Save Schedule
        </Button>
      </div>

      <div className="space-y-3">
        {availability.map((item, index) => (
          <div
            key={item.day}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => handleToggle(index)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-900 min-w-28">{item.day}</span>
            </div>

            {item.enabled ? (
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none"
                />
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 italic">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
