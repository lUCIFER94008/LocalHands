'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

export function BookingOverviewChart({ data = [] }) {
  const defaultData = [
    { name: 'Completed', value: 45, fill: '#10B981' },
    { name: 'Accepted', value: 25, fill: '#2563EB' },
    { name: 'Pending', value: 15, fill: '#F59E0B' },
    { name: 'In Progress', value: 10, fill: '#7C3AED' },
    { name: 'Cancelled', value: 5, fill: '#EF4444' },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || entry.fill || '#2563EB'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data = [] }) {
  const defaultData = [
    { category: 'Electrician', revenue: 24500 },
    { category: 'Plumber', revenue: 18900 },
    { category: 'AC Service', revenue: 32000 },
    { category: 'Painter', revenue: 15400 },
    { category: 'Cleaning', revenue: 28000 },
    { category: 'Carpentry', revenue: 12000 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
          <Tooltip formatter={(val) => [formatPrice(val), 'Revenue']} contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF' }} />
          <Bar dataKey="revenue" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UserDistributionChart({ data = [] }) {
  const defaultData = [
    { name: 'Customers', count: 1850, fill: '#2563EB' },
    { name: 'Providers', count: 540, fill: '#7C3AED' },
    { name: 'Admins', count: 10, fill: '#0B1220' },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF' }} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
