"use client";

import { LeaderboardEntry } from "@/lib/analytics-data";
import { AnalyticsService } from "@/src/services/analyticsService";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FooterPagination } from "../footer-pagination";

export function LeaderboardTable() {
  const [records, setRecords] = useState<LeaderboardEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Tính toán tổng số trang dựa trên 'count' từ Backend
  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} triệu`;
    }
    return `${(value / 1000).toFixed(0)} nghìn`;
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-400";
    return "text-white/40";
  };

  const fetchRevenueByUser = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: entriesPerPage.toString(),
      });

      const data = await AnalyticsService.get_revenue_by_user(params);
      setRecords(data?.results || []);
      setTotalCount(data?.count || 0);
    } catch (error) {
      console.error("Lỗi khi lấy log:", error);
      toast.error("Không thể tải dữ liệu lịch sử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueByUser();
  }, [currentPage, entriesPerPage]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Khách hàng hàng đầu
            </h3>
            <p className="text-xs text-white/60">Theo tổng doanh thu</p>
          </div>
        </div>

        <div className="space-y-2">
          {records.map((entry, index) => (
            <div
              key={index + 1}
              className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/5 hover:border-white/20 transition-all hover:bg-white/10 group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-8 h-8 flex items-center justify-center font-bold rounded-full bg-white/10 ${getMedalColor(index + 1)}`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{entry.full_name}</p>
                  <p className="text-xs text-white/50">{entry.email}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(entry.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10">
          <FooterPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={totalCount}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onEntriesPerPageChange={(e) => {
              setEntriesPerPage(e);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
