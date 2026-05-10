'use client'

import { Search, Filter, CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const range = (start: number, end: number) => 
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const days = range(1, 31);
const months = range(1, 12);
const years = range(2020, new Date().getFullYear()); // Lấy từ 2020 đến nay

interface ParkingLogsHeaderProps {
  onSearchChange: (value: string) => void;
  searchValue?: string;
  day: string;
  month: string;
  year: string;
  setDay: (value: string) => void;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
}

export function ParkingLogsHeader({ 
  onSearchChange, 
  searchValue = '',
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear
}: ParkingLogsHeaderProps) {
  // Hàm kiểm tra tính hợp lệ của ngày trong tháng
  const isDateInvalid = (d: string, m: string, y: string) => {
    if (d === "none" || !d) return false;

    // Nếu đã chọn ngày thì BẮT BUỘC phải có tháng và năm để kiểm tra
    if (m === "none" || !m || !y) return true; 

    const dayNum = parseInt(d);
    const monthNum = parseInt(m);
    const yearNum = parseInt(y);

    const date = new Date(yearNum, monthNum - 1, dayNum);

    return date.getFullYear() !== yearNum || 
            date.getMonth() !== monthNum - 1 || 
            date.getDate() !== dayNum;
  };

  const dateError = isDateInvalid(day, month, year);


  return (
    <div className="space-y-4 pb-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lịch Sử Gửi Xe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý và theo dõi các bản ghi đỗ xe
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm biển số..."
            className="pl-10 h-11"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
            <div className="px-2 text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
            </div>
            
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[100px] border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chọn Tháng */}
            <Select 
              value={month} 
              onValueChange={setMonth}
              disabled={!year} // Phải chọn năm trước
            >
              <SelectTrigger className="w-[135px] border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tất cả tháng</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chọn Ngày */}
            <Select 
              value={day} 
              onValueChange={setDay}
              disabled={!month || month === "none"} 
            >
              <SelectTrigger className={`w-[90px] border-none bg-transparent shadow-none focus:ring-0 ${dateError ? "text-destructive" : ""}`}>
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tất cả</SelectItem>
                {days.map((d) => (
                  <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nút Clear nhanh bộ lọc */}
          {(day !== "none" || month !== "none") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setDay("none"); setMonth("none"); }}
              className="text-xs h-8"
            >
              Xóa lọc
            </Button>
          )}

          {dateError && (
            <span className="text-xs text-destructive font-medium animate-pulse">
              * Ngày không hợp lệ trong tháng này!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
