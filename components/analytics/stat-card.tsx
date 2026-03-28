'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  currency?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  currency,
}: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/60">{title}</p>
            <p className="text-2xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
              {currency && ` ${currency}`}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 text-white/70 group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {change !== undefined && changeLabel && (
          <div className="flex items-center gap-2 pt-2">
            <span
              className={`text-xs font-semibold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-xs text-white/50">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
