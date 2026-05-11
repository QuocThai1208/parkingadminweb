"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Eye, EyeOff, Plus } from "lucide-react";
import { StaffMember, UserRole } from "./staff-table";
import apiAxios from "@/config/api/apiAxios";
import { ENDPOINTS } from "@/config/api/endpoints";

export type CreateStaffPayload = Omit<
  StaffMember,
  "id" | "age" | "avatar" | "is_active"
> & {
  avatar?: File | null;
  password: string;
  parking_lot: number;
};

interface JobPosition {
  id: number;
  title: string;
  description: string;
  base_salary: number;
}

export const JobPosition = {
  OPERATOR: "Giám sát vận hành",
  TECHNICAL: "Kỹ thuật viên",
  MARSHAL: "Điều phối",
  INCIDENT: "Xử lý sự cố",
} as const;

interface AddStaffDialogProps {
  onAdd?: (staff: CreateStaffPayload) => void;
}

export function AddStaffDialog({ onAdd }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const parking_lot = localStorage.getItem("selected_parking_id") || "";
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectAvatar, setSelectAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [jobPosition, setJobPosition] = useState<JobPosition[]>([]);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    birth: 2000,
    address: "",
    user_role: "STAFF" as UserRole,
    password: "",
    job_position: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.username || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    // Add mode: return CreateStaffPayload
    const payload: CreateStaffPayload = {
      ...formData,
      avatar: selectAvatar,
      parking_lot: parseInt(parking_lot),
    };
    onAdd?.(payload);
    resetForm();
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birth" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      username: "",
      email: "",
      birth: 2000,
      address: "",
      user_role: "STAFF",
      password: "",
      job_position: null,
    });
    setSelectAvatar(null);
    setPreviewImage(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const res = await apiAxios.get(ENDPOINTS.JOB_POSITIONS.POSITIONS);
        setJobPosition(res.data);
      } catch (error) {
        console.error("Error fetching job positions:", error);
      }
    };
    fetchJobPositions();
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tạo mới tài khoản nhận viên</DialogTitle>
          <DialogDescription>Nhận thông tin</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4"
        >
          <div className="flex flex-col items-center space-y-4 border-r pr-2">
            <Label>Ảnh đại diện</Label>
            <div className="relative group w-40 h-40">
              <div className="w-full h-full rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity text-xs"
              >
                Chọn ảnh
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Định dạng: JPG, PNG. <br /> Tối đa 2MB.
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Tên đầy đủ <p className="text-red-500">*</p>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">
                Tên đăng nhập <p className="text-red-500">*</p>
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <p className="text-red-500">*</p>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth">Năm sinh</Label>
              <Input
                id="birth"
                name="birth"
                type="number"
                value={formData.birth || ""}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_role">Vị trí</Label>
              <select
                id="job_position"
                name="job_position"
                value={formData.job_position || ""}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {jobPosition.map((position) => (
                  <option key={position.id} value={position.id}>
                    {JobPosition[position.title as keyof typeof JobPosition] ||
                      position.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
