'use client';

import { Card } from '@/components/ui/card';
import { getActiveFees, getExpiringSoon, getMaxAmount, ParkingFee } from '@/lib/parking-fee-data';
import { formatCurrency } from '@/lib/parking-fee-utils';
import { TrendingUp, AlertCircle, Clock, BarChart3 } from 'lucide-react';

interface FeeAnalyticsProps {
  fees: ParkingFee[];
}

export function FeeAnalytics({ fees }: FeeAnalyticsProps) {
  const activeFees = getActiveFees(fees);
  const maxAmount = getMaxAmount(fees);
  const expiringSoon = getExpiringSoon(fees);

  const stats = [
    {
      label: 'Tổng số loại phí',
      value: fees.length.toString(),
      icon: BarChart3,
      gradient: 'from-blue-500/20 to-blue-600/20',
    },
    {
      label: 'Phí cao nhất',
      value: formatCurrency(maxAmount),
      icon: TrendingUp,
      gradient: 'from-emerald-500/20 to-emerald-600/20',
    },
    {
      label: 'Đang áp dụng',
      value: activeFees.length.toString(),
      icon: Clock,
      gradient: 'from-purple-500/20 to-purple-600/20',
    },
    {
      label: 'Sắp hết hạn',
      value: expiringSoon.length.toString(),
      icon: AlertCircle,
      gradient: 'from-orange-500/20 to-orange-600/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className={`bg-gradient-to-br ${stat.gradient} !backdrop-blur-md border !border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]`}
          >
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className="p-2 rounded-lg bg-white/10">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
