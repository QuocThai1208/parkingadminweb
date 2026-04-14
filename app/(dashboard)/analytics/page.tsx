"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, DollarSign, TrendingUp } from "lucide-react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { StatCard } from "@/components/analytics/stat-card";
import { DateFilter } from "@/components/analytics/date-filter";
import { OccupancyWidget } from "@/components/analytics/occupancy-widget";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import {
  PeakHourData,
  PeakHoursChart,
} from "@/components/analytics/peak-hours-chart";
import { OccupancyMetric, RevenueChartData } from "@/lib/analytics-data";
import {
  VehicleTypeChart,
  VehicleTypeData,
} from "@/components/analytics/vehicle-type-chart";
import { AnalyticsService } from "@/src/services/analyticsService";
import { LeaderboardTable } from "@/components/analytics/leaderboard-table";

export default function AnalyticsPage() {
  const now = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [peakHours, setPeakHours] = useState<PeakHourData[]>([]);
  const [vehicleType, setVehicleType] = useState<VehicleTypeData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [type, setType] = useState<string>("CAR");
  const [dateValues, setDateValues] = useState({
    day: now.getDate().toString(),
    month: (now.getMonth() + 1).toString(),
    year: now.getFullYear().toString(),
  });
  const [revenueCompare, setRevenueCompare] = useState({
    revenue: 0,
    change: 0,
    period: "",
  });

  const [parkingLogCompare, setParkingLogCompare] = useState({
    total: 0,
    change: 0,
    period: "",
  });

  const [occupancy, setOccupancy] = useState<OccupancyMetric>({
    occupied: 0,
    available: 0,
    total: 0,
  });
  const [revenueChart, setRevenueChart] = useState<RevenueChartData>({
    daily: [],
    monthly: [],
  });

  const [lotId, setLotId] = useState<string>('');

  useEffect(() => {
    const id = localStorage.getItem('selected_parking_id') || '';
    setLotId(id);
  }, []);

  const fetchVehicleType = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        day: dateValues.day,
        month: dateValues.month,
        year: dateValues.year,
      });
      const data = await AnalyticsService.get_revenue_by_vehicle_type(params);
      setVehicleType(data?.result);
    } catch (e) {
      console.log("error at fetchVehicleType, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeakHours = async () => {
    try {
      setIsLoading(true);
      const data = await AnalyticsService.get_peak_hours();
      setPeakHours(data?.result);
    } catch (e) {
      console.log("error at fetchTotalRevenue, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchrevenueCompare = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        day: dateValues.day,
        month: dateValues.month,
        year: dateValues.year,
      });

      const data = await AnalyticsService.get_revenue_compare(params);
      setRevenueCompare(data?.result);
    } catch (e) {
      console.log("error at fetchTotalRevenue, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParkingLogCompare = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        day: dateValues.day,
        month: dateValues.month,
        year: dateValues.year,
      });

      const data = await AnalyticsService.get_parking_log_compare(params);
      setParkingLogCompare(data?.result);
    } catch (e) {
      console.log("error at fetchTotalRevenue, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      setIsLoading(true);
      const data = await AnalyticsService.get_total_revenue();
      setRevenue(data?.result?.revenue);
    } catch (e) {
      console.log("error at fetchTotalRevenue, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenueChartData = async () => {
    try {
      setIsLoading(true);
      const data = await AnalyticsService.refresh_data_chart();
      setRevenueChart(data?.result);
    } catch (e) {
      console.log("error at fetchRevenueChartData, ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOccupancy = useCallback(async () => {
    if(!lotId) return;
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        parking_lot_id: lotId,
        vehicle_type: type,
      });
      const data = await AnalyticsService.refresh_occupied(params);
      setOccupancy(data?.result);
    } catch (e) {
      console.log("error at fetchOccupancy, ", e);
    } finally {
      setIsLoading(false);
    }
  },[lotId, type]);

  const handleFilterChange = (values: {
    day: string;
    month: string;
    year: string;
  }) => {
    setDateValues(values);
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchRevenueChartData();
    fetchrevenueCompare();
    fetchPeakHours();
  }, []);

  useEffect(() => {
    fetchOccupancy();
  }, [fetchOccupancy]);

  useEffect(() => {
    // Chỉ chạy ở client sau khi mount
    setLastUpdated(new Date().toLocaleString("vi-VN"));
  }, []);

  useEffect(() => {
    // kHởi tạo kết nói websocket
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/analytics/");

    socket.onopen = () => {
      console.log("Kết nối websocket thành công.");
      setLoadingOccupancy(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "parking_current_stats_update") {
          setOccupancy(data.result);
        }
      } catch (e) {
        console.error("Lỗi giải mã dữ liệu Socket:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Lỗi kết nối Socket:", error);
      setIsLoading(false);
    };
    socket.onclose = () => {
      console.log("🔌 Đã ngắt kết nối WebSocket");
    };
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchVehicleType();
    fetchParkingLogCompare();
    fetchrevenueCompare();
  }, [dateValues]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <LoadingOverlay isLoading={isLoading} />

      {/* Header Section */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Phân tích thông tin
              </h1>
              <p className="text-white/60 mt-2">
                Thông tin chi tiết và số liệu quản lý bãi đậu xe theo thời gian
                thực
              </p>
            </div>
            <DateFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng doanh thu"
            value={revenue}
            icon={DollarSign}
            currency="₫"
          />
          <StatCard
            title="Danh thu thời gian hiện tại"
            value={revenueCompare.revenue}
            icon={DollarSign}
            change={revenueCompare.change}
            changeLabel={revenueCompare.period}
          />
          <StatCard
            title="Phiên đỗ xe"
            value={parkingLogCompare.total}
            icon={TrendingUp}
            change={parkingLogCompare.change}
            changeLabel={parkingLogCompare.period}
          />

          <StatCard
            title="Tỷ lệ phiên trung bình"
            value={
              revenueCompare.revenue && parkingLogCompare.total
                ? `${(revenueCompare.revenue / parkingLogCompare.total / 1000).toFixed(0)}K`
                : "0 đ"
            }
            icon={BarChart3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OccupancyWidget 
          data={occupancy} 
          type={type}
          setType={setType} />
          <div className="lg:col-span-2">
            <RevenueChart
              dailyData={revenueChart.daily}
              monthlyData={revenueChart.monthly}
            />
          </div>
        </div>

        {/* Middle Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VehicleTypeChart data={vehicleType} />
          <div className="lg:col-span-2">
            <PeakHoursChart data={peakHours} />
          </div>
        </div>

        {/* Leaderboard Section */}
        <div>
          <LeaderboardTable />
        </div>

        {/* Footer Info */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md p-6">
          <p className="text-sm text-white/80">
            <span className="font-semibold">Cập nhật lần cuối:</span>{" "}
            {lastUpdated}
          </p>
          <p className="text-xs text-white/50 mt-2">
            Dữ liệu được cập nhật tự động sau mỗi 5 phút.
          </p>
        </div>
      </div>
    </main>
  );
}
