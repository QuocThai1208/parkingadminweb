"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface PeakHourData {
  name: string;
  value: number;
}

interface PeakHoursChartProps {
  data: PeakHourData[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {

  const getPeakHourMetrics = () => {
    if (!data || data.length === 0) {
      return { max: 0, min: 0, peakName: "--:--" };
    }

    const values = data.map((d) => d.value);

    const allEqual = values.every((v) => v === values[0]);

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    let peakName = "--:--";
    if (!allEqual && maxVal > 0) {
      const peakEntry = data.find((d) => d.value === maxVal);
      peakName = peakEntry ? peakEntry.name : "--:--";
    }

    return {
      max: maxVal,
      min: minVal,
      peakName: peakName,
    };
  };

  const { max, min, peakName } = getPeakHourMetrics();

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">
            Mô hình giờ cao điểm
          </h3>
          <p className="text-xs text-white/60">
            Xu hướng tỷ lệ đỗ trong 24 giờ
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: "11px" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => `${value} phương tiện`}
              />
              <Bar
                dataKey="value"
                fill="url(#colorBar)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/60">Giờ cao điểm</p>
            <p className="text-lg font-bold text-blue-400">{peakName}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Số chỗ cao nhất</p>
            <p className="text-lg font-bold text-green-400">{max}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Số chỗ thấp nhất</p>
            <p className="text-lg font-bold text-yellow-400">{min}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
