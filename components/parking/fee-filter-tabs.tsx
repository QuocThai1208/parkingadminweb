'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeeType, filterFeesByType, ParkingFee } from '@/lib/parking-fee-data';

type FilterType = FeeType | 'ALL';

interface FeeFilterTabsProps {
  fees: ParkingFee[],
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FeeFilterTabs({fees, selectedFilter, onFilterChange }: FeeFilterTabsProps) {
  const filters: { value: FilterType; label: string; count: number }[] = [
    {
      value: 'ALL',
      label: 'Tất cả',
      count: fees.length,
    },
    {
      value: 'MOTORCYCLE',
      label: 'Xe máy',
      count: fees.filter(f => f.fee_type === 'MOTORCYCLE').length,
    },
    {
      value: 'CAR',
      label: 'Ô tô',
      count: fees.filter(f => f.fee_type === 'CAR').length,
    },
    {
      value: 'TRUCK',
      label: 'Xe tải',
      count: fees.filter(f => f.fee_type === 'TRUCK').length,
    },
    {
      value: 'BUS',
      label: 'Xe bus',
      count: fees.filter(f => f.fee_type === 'BUS').length,
    },
  ];

  return (
    <Tabs value={selectedFilter} onValueChange={(v) => onFilterChange(v as FilterType)}>
      <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 ">
        {filters.map(filter => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className="text-xs sm:text-sm data-[state=active]:bg-white/20 data-[state=active]:shadow-lg transition-all"
          >
            <span>{filter.label}</span>
            <span className="ml-1 text-[10px] sm:text-xs font-bold opacity-70">({filter.count})</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
