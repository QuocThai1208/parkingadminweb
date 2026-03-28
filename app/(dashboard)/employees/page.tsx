"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffMember, StaffTable } from "@/components/staff/staff-table";
import { AddStaffDialog } from "@/components/staff/add-staff-dialog";
import { Search } from "lucide-react";
import { EmployeesService } from "@/src/services/employeesService";
import { FooterPagination } from "@/components/footer-pagination";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/loading-overlay";

type RoleFilter = "" | "MANAGE" | "STAFF";

export default function EmployeesPage() {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [searchFullName, setSearchFullName] = useState("");
  const [searchRole, setSearchRole] = useState<RoleFilter>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Tính toán tổng số trang dựa trên 'count' từ Backend
  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const handleAddStaff = async (staff: any) => {
    console.log(staff);
    setLoading(true);
    try {
      const data =
        staff.user_role === "STAFF"
          ? await EmployeesService.staff_register(staff)
          : await EmployeesService.manage_register(staff);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchEmployees();
      }
    } catch (error: any) {
      console.log("Lỗi khi tạo nhân viên:", error);
      const errorMsg = error.message || "Không thể tạo nhân viên";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
  };

  const handleUpdateStaff = async (staff: any) => {
    setLoading(true);
    try {
      const { id, ...payload } = staff;
      const data = await EmployeesService.updateEmployees(payload, id);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchEmployees();
      }
    } catch (error: any) {
      console.log("Lỗi khi cập nhật thông tin nhân viên:", error);
      const errorMsg = error.detail || "Không thể cập nhật thông tin nhân viên";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
    setEditingStaff(null);
  };

  const handleUpdateActive = async (id: string, is_active: boolean) => {
    setLoading(true);
    try {
      const data = await EmployeesService.updateEmployeesActive(is_active, id);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchEmployees();
      }
    } catch (error: any) {
      console.log("Lỗi khi cập nhật thông tin nhân viên:", error);
      const errorMsg = error.detail || "Không thể cập nhật thông tin nhân viên";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: entriesPerPage.toString(),
        full_name: searchFullName,
        role: searchRole,
      });

      const data = await EmployeesService.getEmployees(params);
      setRecords(data?.results || []);
      setTotalCount(data?.count || 0);
    } catch (e) {
      console.log("Error at fetchemployees: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, entriesPerPage, searchFullName, searchRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchFullName, searchRole]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <LoadingOverlay isLoading={loading} />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quản lý nhân viên
            </h1>
          </div>
          <AddStaffDialog
            onAdd={handleAddStaff}
            editingStaff={editingStaff}
            onEdit={handleUpdateStaff}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nhập tên nhân viên"
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Tabs */}
          <Tabs
            value={searchRole}
            onValueChange={(value) => setSearchRole(value as RoleFilter)}
          >
            <TabsList>
              <TabsTrigger value="">Tất cả</TabsTrigger>
              <TabsTrigger value="MANAGE">Quản lý</TabsTrigger>
              <TabsTrigger value="STAFF">Nhân viên</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Table Section */}
        <div className="rounded-lg bg-white shadow-sm">
          <StaffTable
            staff={records}
            onEdit={handleEditStaff}
            onUpdateActive={handleUpdateActive}
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
