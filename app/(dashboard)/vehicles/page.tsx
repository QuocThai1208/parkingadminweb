"use client";

import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VehicleService } from "@/src/services/vehicleService";
import { FooterPagination } from "@/components/footer-pagination";
import { Vehicle, VehicleTable } from "@/components/vehicles/vehicle-table";
import { toast } from "sonner";

type TabValue = "all" | "1" | "0";

export default function VehiclesPage() {
  const [searchPlate, setSearchPlate] = useState("");
  const [selectedTab, setSelectedTab] = useState<TabValue>("all");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Vehicle[]>([]);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: entriesPerPage.toString(),
        license_plate: searchPlate,
      });

      if (selectedTab !== "all"){
        params.append("is_approved", selectedTab)
      }

      const data = await VehicleService.getgetVehicles(params);
      setRecords(data?.results || []);
      setTotalCount(data?.count || 0);
    } catch (e) {
      console.log("Error at fetchemployees: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, value: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        value: value
      })
      const data = await VehicleService.handleApprove(id, params)
      toast.success(data?.message || "Cập nhật thành công.")
      setRecords((prev) => 
        prev.map((item) => 
          item.id === id ? {...item, is_approved: value === "1"}: item
        )
      );
    } catch (e:any) {
      toast.error(e?.message || "Cập nhật thất bại.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, entriesPerPage, searchPlate, selectedTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchPlate, selectedTab]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <LoadingOverlay isLoading={loading} />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            Quản lý phương tiện
          </h1>
          <p className="text-muted-foreground">
            Theo dõi, duyệt phê và quản lý tất cả phương tiện trong hệ thống
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nhập biển số xe"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as TabValue)}
          >
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="1">Đã duyệt</TabsTrigger>
              <TabsTrigger value="0">Chờ duyệt</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          {/* Tabs & Table Section */}
          <VehicleTable
            vehicles={records}
            onApprove={handleApprove}
        />
        </div>
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
    </main>
  );
}
