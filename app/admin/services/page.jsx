'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { Select } from '@/ui/Select';
import { Modal } from '@/ui/Modal';
import { useToast } from '@/ui/Toast';
import { Wrench, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electrician');
  const [startingPrice, setStartingPrice] = useState(499);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await apiFetch('/api/services');
      if (res.data) setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setCategory('electrician');
    setStartingPrice(499);
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setCategory(service.category);
    setStartingPrice(service.startingPrice);
    setModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      description,
      category,
      startingPrice: Number(startingPrice),
      isActive: true,
    };

    try {
      if (editingService) {
        const res = await apiFetch(`/api/services/${editingService.id || editingService._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (res.success) toast.success('Service updated');
      } else {
        const res = await apiFetch('/api/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.success) toast.success('New service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service category?')) return;
    try {
      const res = await apiFetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Service deleted');
        fetchServices();
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Catalog CRUD</h1>
          <p className="text-xs text-slate-500">Manage platform service offerings, prices, and categories</p>
        </div>

        <Button variant="primary" onClick={openAddModal} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : (
          services.map((s) => (
            <div key={s.id || s._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {s.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting Price</span>
                  <span className="text-sm font-black text-slate-900">{formatPrice(s.startingPrice)}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(s)}>
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteService(s.id || s._id)} className="text-rose-600 hover:bg-rose-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service' : 'Add New Service'}>
        <form onSubmit={handleSaveService} className="space-y-4">
          <Input
            label="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Electrician Services"
            required
          />

          <Select
            label="Category"
            options={SERVICE_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <Input
            label="Starting Price (₹)"
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            required
          />

          <Textarea
            label="Service Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
