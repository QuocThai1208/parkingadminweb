import type { FeeType } from './parking-fee-data';
import { Bike, Car, Truck, Bus } from 'lucide-react';

export const getFeeTypeIcon = (type: FeeType) => {
  switch (type) {
    case 'MOTORCYCLE':
      return Bike;
    case 'CAR':
      return Car;
    case 'TRUCK':
      return Truck;
    case 'BUS':
      return Bus;
    default:
      return Car;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const getStatusColor = (active: boolean) => {
  return active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400';
};

export const getStatusLabel = (active: boolean) => {
  return active ? 'Đang áp dụng' : 'Ngừng áp dụng';
};
