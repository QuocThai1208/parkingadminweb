'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Send } from 'lucide-react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { createDfDt } from '@/lib/date-utils';


type FilterPeriod = 'day' | 'month' | 'year';

interface DateFilterProps {
  onFilterChange?: (values: { day: string; month: string; year: string }) => void;
}




export function DateFilter({ onFilterChange }: DateFilterProps) {
  const now = new Date();
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('day');
  const [dateRangeDiplay, setDateRangeDiplay] = useState('');

  const [day, setDay] = useState(now.getDate().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [year, setYear] = useState(now.getFullYear().toString());

  const handleFilterChange = (period: FilterPeriod) => {
    setActiveFilter(period);
    if (period === 'month') setDay('');
    if (period === 'year') { setDay(''); setMonth(''); }
  };

  const validateData = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (activeFilter === 'year') {
      if (!year || y < 1900 || y > 2100) return "Năm không hợp lệ (1900-2100)";
    }

    if (activeFilter === 'month') {
      if (!year || y < 1900 || y > 2100) return "Năm không hợp lệ";
      if (!month || m < 1 || m > 12) return "Tháng phải từ 1-12";
    }

    if (activeFilter === 'day') {
      if (!year || y < 1900 || y > 2100) return "Năm không hợp lệ";
      if (!month || m < 1 || m > 12) return "Tháng không hợp lệ";
      if (!day || d < 1 || d > 31) return "Ngày phải từ 1-31";
      
      // Kiểm tra ngày cuối tháng (VD: tháng 2 có 28/29 ngày)
      const lastDay = new Date(y, m, 0).getDate();
      if (d > lastDay) return `Tháng ${m}/${y} chỉ có ${lastDay} ngày`;
    }

    return null; // Hợp lệ
  };

  const handleSend = () => {
    const error = validateData();
    if (error) {
      toast.error(error); 
      return;
    }
    setDateRangeDiplay(createDfDt(day, month, year))
    onFilterChange?.({day, month, year });
    
  };

 return (
    <div className="flex flex-col gap-3">
      {/* Hàng nút bấm chọn chế độ */}
      <div className="flex items-center justify-end">
        <div className='mr-3 flex'>
          <div className='text-white mr-2 text-sm font-bold'>{dateRangeDiplay}</div>
          <Calendar className="h-5 w-5 text-white/60" />
        </div>
        <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
          {(['day', 'month', 'year'] as FilterPeriod[]).map((period) => (
            <Button
              key={period}
              variant={activeFilter === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange(period)}
              className={`rounded transition-all capitalize ${
                activeFilter === period
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Hàng Input nhập liệu - Hiện/Ẩn dựa trên activeFilter */}
      <div className="flex gap-2 animate-in fade-in duration-300 justify-end">
        {activeFilter === 'day' && (
          <Input
            type="number"
            placeholder="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-15 bg-white/5 border-white/10 text-white placeholder:text-white/20"
            min={1}
            max={31}
          />
        )}
        
        {(activeFilter === 'day' || activeFilter === 'month') && (
          <Input
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-16 bg-white/5 border-white/10 text-white placeholder:text-white/20"
            min={1}
            max={12}
          />
        )}

        <Input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-16 bg-white/5 border-white/10 text-white placeholder:text-white/20"
        />
        <Button 
          size="icon" 
          onClick={handleSend}
          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
        
      </div>
    </div>
  );
}
