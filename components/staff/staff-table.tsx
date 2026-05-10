"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/staff-utils";
import { User, UserCheck, UserX, MapPin, Mail, Cake } from "lucide-react";

const JobPositionMap = {
  OPERATOR: "Giám sát vận hành",
  TECHNICAL: "Kỹ thuật viên",
  MARSHAL: "Điều phối",
  INCIDENT: "Xử lý sự cố",
} as const;

export type UserRole = "STAFF" | "MANAGE" | "CUSTOMER";

export interface StaffMember {
  id: number;
  user_id: string; 
  username: string;
  full_name: string;
  avatar: string | null;
  email: string;
  birth: number;
  age: number;
  address: string;
  user_role: UserRole;
  is_active: boolean;
  title: keyof typeof JobPositionMap; 
  base_salary: string;
}

interface StaffTableProps {
  staff: StaffMember[];
  onUpdateActive?: (userId: string, is_active: boolean) => void;
}

export function StaffTable({ staff, onUpdateActive }: StaffTableProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(value));
  };

  if (staff.length === 0) {
    return (
      <Empty className="border-2 border-dashed py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <User className="size-8 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle className="mt-4">Chưa có nhân viên nào</EmptyTitle>
          <EmptyDescription>
            Danh sách nhân viên tại bãi xe này hiện đang trống.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[280px]">Thông tin nhân viên</TableHead>
            <TableHead>Vị trí & Lương</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Thông tin cá nhân</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarImage src={member.avatar || ""} alt={member.full_name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-none mb-1">
                      {member.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      @{member.username}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <Badge 
                    variant="outline" 
                    className="w-fit bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    {JobPositionMap[member.title] || member.title}
                  </Badge>
                  <span className="text-xs font-medium text-emerald-600">
                    {formatCurrency(member.base_salary)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{member.email || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{member.address}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Cake className="h-3 w-3 text-orange-500" />
                    <span>Năm sinh: {member.birth}</span>
                  </div>
                  <span className="text-muted-foreground ml-5">{member.age} tuổi</span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={`rounded-full px-3 py-0.5 font-normal ${
                    member.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                  }`}
                >
                  {member.is_active ? "Đang làm việc" : "Đã khóa"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {onUpdateActive && (
                    <Button
                      variant={member.is_active ? "ghost" : "outline"}
                      size="icon"
                      className={`h-8 w-8 rounded-full ${
                        member.is_active 
                        ? "text-muted-foreground hover:text-red-600 hover:bg-red-50" 
                        : "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                      }`}
                      onClick={() => onUpdateActive(member.user_id, !member.is_active)}
                      title={member.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    >
                      {member.is_active ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}