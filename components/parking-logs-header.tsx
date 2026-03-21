'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ParkingLogsHeaderProps {
  onSearchChange: (value: string) => void
  onDateChange?: (startDate: Date, endDate: Date) => void
  searchValue?: string
}

export function ParkingLogsHeader({ 
  onSearchChange, 
  searchValue = '' 
}: ParkingLogsHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lịch Sử Gửi Xe</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý và theo dõi các bản ghi đỗ xe</p>
        </div>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm biển số..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Bộ lọc</span>
        </button>
      </div>
    </div>
  )
}
