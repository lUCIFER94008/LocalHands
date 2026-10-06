'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

export function EarningsChart({ data = [] }) {
  const chartData =
    data.length > 0
      ? data
      : [
          { month: 'May', earnings: 12500 },
          { month: 'Jun', earnings: 18400 },
          { month: 'Jul', earnings: 22100 },
          { month: 'Aug', earnings: 19800 },
          { month: 'Sep', earnings: 26500 },
          { month: 'Oct', earnings: 31200 },
        ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
          <Tooltip
            formatter={(value) => [formatPrice(value), 'Earnings']}
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }}
          />
          <Area type="monotone" dataKey="earnings" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#earningsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
