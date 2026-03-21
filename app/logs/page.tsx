'use client'

import { useState, useMemo, useEffect } from 'react'
import { ParkingLogsHeader } from '@/components/parking-logs-header'
import { ParkingLogsTable } from '@/components/parking-logs-table'
import { ParkingLogsPagination } from '@/components/parking-logs-pagination'
import { toast } from 'sonner'
import { AdminService } from '@/src/services/adminService'

interface ParkingRecord {
  id: string
  plate: string
  vehicle_image: string | null
  vehicle_name: string
  owner_name: string | null
  check_in: string
  check_out: string | null
  duration_minutes: number
  fee: number
  status: 'in_garage' | 'completed'
}


export default function ParkingLogsPage() {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)


  // Tính toán tổng số trang dựa trên 'count' từ Backend
  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const fetchParkingLogs = async () => {
    setLoading(true)
    try{
        const params = new URLSearchParams({
            page: currentPage.toString(),
            page_size: entriesPerPage.toString(),
            plate: searchValue
        })

        const data = await AdminService.get_logs(params);
        setRecords(data?.results || [])
        setTotalCount(data?.count || 0)

    }catch (error) {
      console.error("Lỗi khi lấy log:", error);
      toast.error("Không thể tải dữ liệu lịch sử");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParkingLogs();
  }, [currentPage, entriesPerPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue])

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <ParkingLogsHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <div className="bg-card border border-border rounded-lg">
            {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">Loading...</div>}
          <ParkingLogsTable
            records={records}
          />
          <ParkingLogsPagination
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
  )
}
