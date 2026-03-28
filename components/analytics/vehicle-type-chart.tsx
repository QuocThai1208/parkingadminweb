'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export interface VehicleTypeData {
  name: string;
  value: number;
  revenue: number;
}

interface VehicleTypeChartProps {
  data: VehicleTypeData[];
}

export function VehicleTypeChart({ data }: VehicleTypeChartProps) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} triệu`;
    }
    return `${(value / 1000).toFixed(0)} nghìn`;
  };


  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Doanh thu theo loại xe</h3>
          <p className="text-xs text-white/60">Phân bổ</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value, name, props) => {
                  if (name === 'value') {
                    return `${value}%`;
                  }
                  const revenue = props.payload?.revenue;
                  return revenue ? formatCurrency(revenue) : value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/10">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-white/80">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(item.revenue)}
                </p>
                <p className="text-xs text-white/60">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
