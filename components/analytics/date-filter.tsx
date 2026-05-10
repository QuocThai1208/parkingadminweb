"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";


const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const days = range(1, 31);
const months = range(1, 12);
const years = range(2020, new Date().getFullYear()); // Lấy từ 2020 đến nay

interface DateFilterProps {
  onFilterChange?: (values: {
    day: string;
    month: string;
    year: string;
  }) => void;
}

export function DateFilter({ onFilterChange }: DateFilterProps) {
  const now = new Date();

  const [day, setDay] = useState(now.getDate().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [year, setYear] = useState(now.getFullYear().toString());

  // Hàm kiểm tra tính hợp lệ của ngày trong tháng
  const isDateInvalid = (d: string, m: string, y: string) => {
    if (d === "" || !d) return false;

    // Nếu đã chọn ngày thì BẮT BUỘC phải có tháng và năm để kiểm tra
    if (m === "" || !m || !y) return true;

    const dayNum = parseInt(d);
    const monthNum = parseInt(m);
    const yearNum = parseInt(y);

    const date = new Date(yearNum, monthNum - 1, dayNum);

    return (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    );
  };

  const dateError = isDateInvalid(day, month, year);

  const handleSend = () => {
    if (dateError) return;
    onFilterChange?.({ day, month, year });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {dateError && (
        <span className="text-xs text-red-400 font-medium animate-pulse">
          * Ngày không hợp lệ!
        </span>
      )}

      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
        <div className="pl-2 text-white/40">
          <CalendarIcon className="w-4 h-4" />
        </div>
        {/* Select Năm */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[90px] border-none bg-transparent text-white focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem
                key={y}
                value={y.toString()}
                className="focus:bg-white/10 focus:text-white"
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-[1px] h-4 bg-white/10" />
        {/* Chọn Tháng */}
        <Select value={month} onValueChange={setMonth} disabled={!year}>
          <SelectTrigger className="w-[120px] border-none bg-transparent text-white focus:ring-0 focus:ring-offset-0 disabled:opacity-30">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="none"
              className="focus:bg-white/10 focus:text-white"
            >
              Tất cả tháng
            </SelectItem>
            {months.map((m) => (
              <SelectItem
                key={m}
                value={m.toString()}
                className="focus:bg-white/10 focus:text-white"
              >
                Tháng {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-[1px] h-4 bg-white/10" />
        {/* Chọn Ngày */}
        <Select
          value={day}
          onValueChange={setDay}
          disabled={!month || month === ""}
        >
          <SelectTrigger
            className={`w-[85px] border-none bg-transparent focus:ring-0 focus:ring-offset-0 disabled:opacity-30 ${
              dateError ? "text-red-400" : "text-white"
            }`}
          >
            <SelectValue placeholder="Ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="none"
              className="focus:bg-white/10 focus:text-white"
            >
              Tất cả
            </SelectItem>
            {days.map((d) => (
              <SelectItem
                key={d}
                value={d.toString()}
                className="focus:bg-white/10 focus:text-white"
              >
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        size="icon"
        onClick={handleSend}
        disabled={dateError}
        className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>

      {/* Nút Xóa lọc style phù hợp với Dark Mode */}
      {(day !== "" || month !== "") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDay("");
            setMonth("");
          }}
          className="text-white/50 hover:text-white hover:bg-white/10 text-xs h-8"
        >
          Xóa lọc
        </Button>
      )}
    </div>
  );
}
