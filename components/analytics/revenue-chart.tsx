'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import type { ChartDataPoint } from '@/lib/analytics-data';

interface RevenueChartProps {
  dailyData: ChartDataPoint[];
  monthlyData: ChartDataPoint[];
}

export function RevenueChart({ dailyData, monthlyData }: RevenueChartProps) {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const data = view === 'daily' ? dailyData : monthlyData;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} triệu`;
    }
    return `${(value / 1000).toFixed(0)} nghìn`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Xu hướng doanh thu</h3>
            <p className="text-xs text-white/60">Thu nhập theo thời gian</p>
          </div>
          <div className="flex gap-2 bg-white/5 backdrop-blur rounded-lg p-1 border border-white/10">
            <Button
              variant={view === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('daily')}
              className={`rounded text-xs transition-all ${view === 'daily'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              7-Ngày
            </Button>
            <Button
              variant={view === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('monthly')}
              className={`rounded text-xs transition-all ${view === 'monthly'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              12-Tháng
            </Button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="name"
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                tickFormatter={formatCurrency}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `${(value as number / 1000000).toFixed(1)} đ`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
