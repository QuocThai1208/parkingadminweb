'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { OccupancyMetric } from '@/lib/analytics-data';

interface OccupancyWidgetProps {
  data: OccupancyMetric;
}

export function OccupancyWidget({ data }: OccupancyWidgetProps) {
  const chartData = [
    { name: 'Đã đỗ', value: data.occupied, fill: '#3b82f6' },
    { name: 'Còn trống', value: data.available, fill: '#10b981' },
  ];

  const occupancyPercent = ((data.occupied / data.total) * 100).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Số lượng chỗ đỗ xe</h3>
          <p className="text-xs text-white/60">Trạng thái thời gian thực</p>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `${value} vị trí`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/60">Tỷ lệ đỗ</p>
            <p className="text-xl font-bold text-blue-400">{occupancyPercent}%</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Số vị trí còn trống</p>
            <p className="text-xl font-bold text-green-400">{data.available}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
