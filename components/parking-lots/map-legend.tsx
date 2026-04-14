'use client';

import { Lock, Zap, Crown, Circle } from 'lucide-react';

export function MapLegend() {
  return (
    <div className=" bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4">Chú thích (Legend)</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#e2e8f0]"></div>
          <span className="text-sm">Trống</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#3b82f6]"></div>
          <span className="text-sm">Đã có xe</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#ef4444]"></div>
          <span className="text-sm">Khóa </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-amber-400"></div>
          <span className="text-sm">Đã đặt </span>
        </div>
      </div>
    </div>
  );
}