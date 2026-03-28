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



export type CreateStaffPayload = Omit<StaffMember, "id" | "age" | "avatar" | "is_active"> & {
  avatar?: File | null;
  password: string;
};

export type UpdateStaffPayload = Omit<StaffMember, "age" | "email" | "avatar" | "is_active"> & {
  avatar?: File | null;
};

interface AddStaffDialogProps {
  onAdd?: (staff: CreateStaffPayload) => void;
  editingStaff?: StaffMember | null;
  onEdit?: (staff: UpdateStaffPayload) => void;
}

export function AddStaffDialog({ onAdd, editingStaff, onEdit }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!editingStaff;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectAvatar, setSelectAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    birth: 2000,
    address: "",
    user_role: "STAFF" as UserRole,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.username || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    if (isEditMode && editingStaff) {
      // Edit mode: return UpdateStaffPayload (excludes email, age, password)
      const payload: UpdateStaffPayload = {
        id: editingStaff.id,
        username: formData.username,
        full_name: formData.full_name,
        birth: formData.birth,
        address: formData.address,
        user_role: formData.user_role,
        avatar: selectAvatar,
      };
      onEdit?.(payload);
    } else {
      // Add mode: return CreateStaffPayload
      const payload: CreateStaffPayload = {
        ...formData,
        avatar: selectAvatar,
      };
      onAdd?.(payload);
    };
    resetForm()
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
    });
    setSelectAvatar(null);
    setPreviewImage(null);
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        full_name: editingStaff.full_name,
        username: editingStaff.username,
        email: editingStaff.email,
        birth: editingStaff.birth,
        address: editingStaff.address,
        user_role: editingStaff.user_role,
        password: "", 
      });
      setPreviewImage(editingStaff.avatar);
      setOpen(true); 
    }
  }, [editingStaff]);

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
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa thông tin nhân viên" : "Tạo mới tài khoản nhận viên"}
            </DialogTitle>
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
            {!isEditMode && (
            <div className="space-y-2 relative">
              <Label htmlFor="password">
                Mật khẩu <p className="text-red-500">*</p>
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button" // Quan trọng: phải là type="button" để không làm submit form
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5  translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
            
            {!isEditMode && (
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
          )}
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
              <Label htmlFor="user_role">Chức vụ</Label>
              <select
                id="user_role"
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="STAFF">Nhân viên</option>
                <option value="MANAGE">Quản lý</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
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
