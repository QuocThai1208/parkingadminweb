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
import { getBadgeVariant, getRoleLabel, getInitials } from "@/lib/staff-utils";
import { Eye, Trash2, Edit, User, UserCheck, UserX } from "lucide-react";

export type UserRole = "STAFF" | "MANAGE" | "CUSTOMER";

export interface StaffMember {
  id: Number;
  username: string;
  full_name: string;
  avatar: string;
  email: string;
  birth: number;
  age: number;
  address: string;
  user_role: UserRole;
  is_active: boolean;
}

interface StaffTableProps {
  staff: StaffMember[];
  onEdit?: (staff: StaffMember) => void;
  onUpdateActive?: (id: string, is_active: boolean) => void;
}

export function StaffTable({ staff, onEdit, onUpdateActive }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <User className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Không tìm thấy nhân viên</EmptyTitle>
          <EmptyDescription>
            Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc lọc của bạn.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Tuổi</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id.toString()}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.full_name} />
                    <AvatarFallback>
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {member.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{member.username}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(member.user_role)}>
                  {getRoleLabel(member.user_role)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">{member.email || "--"}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {member.address || "--"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    Sinh năm {member.birth || "--"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {member.age || "--"} tuổi
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-2xl ${member.is_active ? "bg-green-200" : "bg-red-200"}`}>
                    <span
                  className={`text-sm ${member.is_active ? "text-green-700" : "text-red-700"}`}
                >
                  {member.is_active ? "Hoạt động" : "Bị khóa"}
                </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(member)}
                      title="Edit staff"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onUpdateActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateActive(member.id.toString(), !member.is_active)}
                      title="Delete staff"
                    >
                      {member.is_active ? (
                        <>
                          <UserX className="h-4 w-4 text-red-500" />
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 text-green-500" />
                        </>
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
