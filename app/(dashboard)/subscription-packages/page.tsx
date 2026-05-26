"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    MoreHorizontal,
    Car,
    Bike,
    ShieldAlert,
    X,
    DollarSign,
    Layers,
} from "lucide-react";
import apiAxios from "@/config/api/apiAxios";
import { ENDPOINTS } from "@/config/api/endpoints";
import { toast } from "sonner";

interface SubscriptionPackage {
    id: string;
    owner_name: string;
    parking_lot_name: string;
    vehicle_type: "CAR" | "MOTORCYCLE";
    package_name: string;
    price: number;
    active: boolean;
}

export default function PremiumSubscriptionManagementLight() {
    const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] =
        useState<SubscriptionPackage | null>(null);
    const [lotId, setLotId] = useState<string>("");

    // Form States
    const [createForm, setCreateForm] = useState({
        parking_lot: "Vinhomes Central Park",
        vehicle_type: "CAR" as any,
        package_name: "",
        price: "",
    });
    const [editForm, setEditForm] = useState({ package_name: "", price: "" });

    // Handlers
    const handleToggleActive = async (id: string) => {
        try {
            const res = await apiAxios.patch(ENDPOINTS.ADMIN.SUBSCRIPTION_PACKAGES_DETAIL(id), {
                active: !packages.find((p) => p.id === id)?.active,
            });

            if (res.status === 200) {
                setPackages(
                    packages.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
                );
                setActiveDropdown(null);
                toast.success("Cập nhật trạng thái gói đăng ký thành công!");
            }
        } catch (error) {
            console.error("Failed to toggle active status:", error);
            toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            const res = await apiAxios.post(ENDPOINTS.ADMIN.SUBSCRIPTION_PACKAGES, {
                parking_lot: lotId,
                vehicle_type: createForm.vehicle_type,
                package_name: createForm.package_name,
                price: Number(createForm.price) || 0,
            });

            if (res.status === 201) {
                const newPkg: SubscriptionPackage = {
                    id: `SUB-00${packages.length + 1}`,
                    owner_name: "Hệ thống Quản trị",
                    parking_lot_name: createForm.parking_lot,
                    vehicle_type: createForm.vehicle_type,
                    package_name: createForm.package_name,
                    price: Number(createForm.price) || 0,
                    active: true,
                };
                setPackages([newPkg, ...packages]);
                setCreateForm({
                    parking_lot: "Vinhomes Central Park",
                    vehicle_type: "CAR",
                    package_name: "",
                    price: "",
                });
                toast.success("Tạo gói đăng ký thành công!");
                setIsCreateOpen(false);
            }
        } catch (error: any) {
            console.error("Failed to create subscription package:", error);
            if (error.detail) {
                const backendMessage = error.detail;
                toast.error(backendMessage || "Tạo gói đăng ký thất bại.");
            } else {
                toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
            }
        }
    };

    const handleOpenEdit = (pkg: SubscriptionPackage) => {
        setSelectedPackage(pkg);
        setEditForm({
            package_name: pkg.package_name,
            price: pkg.price.toString(),
        });
        setIsEditOpen(true);
        setActiveDropdown(null);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!selectedPackage) return;

            const res = apiAxios.patch(
                ENDPOINTS.ADMIN.SUBSCRIPTION_PACKAGES_DETAIL(selectedPackage.id),
                {
                    package_name: editForm.package_name,
                    price: Number(editForm.price) || 0,
                },
            );

            setPackages(
                packages.map((p) =>
                    p.id === selectedPackage.id
                        ? {
                            ...p,
                            package_name: editForm.package_name,
                            price: Number(editForm.price) || 0,
                        }
                        : p,
                ),
            );
            setIsEditOpen(false);
            toast.success("Cập nhật gói đăng ký thành công!");
        } catch (error) {
            console.error("Failed to update subscription package:", error);
            toast.error("Cập nhật gói đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    const fetchSubscriptionPackages = async () => {
        if (!lotId) return;
        try {
            const params = new URLSearchParams();
            params.append("parking_lot_id", lotId);
            const res = await apiAxios.get(ENDPOINTS.ADMIN.SUBSCRIPTION_PACKAGES, {
                params,
            });
            setPackages(res.data);
        } catch (error) {
            console.error("Failed to fetch subscription packages:", error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLotId(localStorage.getItem("selected_parking_id") || "");
        }
    }, []);

    useEffect(() => {
        fetchSubscriptionPackages();
    }, [lotId]);

    return (
        <div className="min-h-screen bg-[#fafafa] p-8 text-slate-700 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Cấu Hình Gói Đăng Ký Tháng
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                            Thiết lập cấu hình các gói đăng ký tháng cho bãi xe.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{
                            scale: 1.01,
                            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.15)",
                        }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 bg-black text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-indigo-600/10 transition-all text-sm group"
                    >
                        <Plus
                            size={18}
                            className="group-hover:rotate-90 transition-transform duration-200"
                        />
                        Tạo gói cước mới
                    </motion.button>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Phân loại xe</th>
                                <th className="px-6 py-4">Tên chương trình gói</th>
                                <th className="px-6 py-4 text-right">Chi phí định kỳ</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            <AnimatePresence>
                                {packages.map((pkg) => (
                                    <motion.tr
                                        key={pkg.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="hover:bg-slate-50/50 transition-colors group/row"
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${pkg.vehicle_type === "CAR"
                                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                                    : pkg.vehicle_type === "MOTORCYCLE"
                                                        ? "bg-purple-50 text-purple-600 border-purple-100"
                                                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    }`}
                                            >
                                                {pkg.vehicle_type === "CAR" ? (
                                                    <Car size={13} />
                                                ) : (
                                                    <Bike size={13} />
                                                )}
                                                {pkg.vehicle_type === "CAR"
                                                    ? "Ô tô"
                                                    : pkg.vehicle_type === "MOTORCYCLE"
                                                        ? "Xe máy"
                                                        : "Xe đạp"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 group-hover/row:text-indigo-600 transition-colors">
                                            {pkg.package_name}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(pkg.price)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* PREMIUM LIGHT SWITCH */}
                                            <button
                                                onClick={() => handleToggleActive(pkg.id)}
                                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors mx-auto ${pkg.active ? "bg-indigo-600" : "bg-slate-200"
                                                    }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className="bg-white w-4 h-4 rounded-full shadow-sm"
                                                    animate={{ x: pkg.active ? 20 : 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 30,
                                                    }}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center relative">
                                            <button
                                                onClick={() =>
                                                    setActiveDropdown(
                                                        activeDropdown === pkg.id ? null : pkg.id,
                                                    )
                                                }
                                                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            {/* DROPDOWN MENU */}
                                            <AnimatePresence>
                                                {activeDropdown === pkg.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-20"
                                                            onClick={() => setActiveDropdown(null)}
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                            className="absolute right-6 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 text-left border-slate-100"
                                                        >
                                                            <button
                                                                onClick={() => handleOpenEdit(pkg)}
                                                                className="w-full px-4 py-2.5 text-slate-600 hover:bg-slate-50 text-sm flex items-center gap-2 font-medium transition-colors"
                                                            >
                                                                <Edit3 size={14} className="text-slate-400" />{" "}
                                                                Chỉnh sửa cấu hình
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleActive(pkg.id)}
                                                                className={`w-full px-4 py-2.5 text-sm flex items-center gap-2 border-t border-slate-100 font-medium transition-colors ${pkg.active
                                                                    ? "text-rose-600 hover:bg-rose-50"
                                                                    : "text-emerald-600 hover:bg-emerald-50"
                                                                    }`}
                                                            >
                                                                <ShieldAlert size={14} />{" "}
                                                                {pkg.active ? "Tạm ngưng gói" : "Kích hoạt lại"}
                                                            </button>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <AnimatePresence>
                    {isCreateOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateOpen(false)}
                                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                                className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10"
                            >
                                <div className="px-6 py-4.5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                        <Layers size={18} className="text-indigo-600" /> Thêm Gói
                                        Cước Mới
                                    </h3>
                                    <button
                                        onClick={() => setIsCreateOpen(false)}
                                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Loại Phương Tiện
                                        </label>
                                        <select
                                            value={createForm.vehicle_type}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    vehicle_type: e.target.value as any,
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-800 transition-all cursor-pointer"
                                        >
                                            <option value="CAR">Ô tô (CAR)</option>
                                            <option value="MOTORCYCLE">Xe máy (MOTORCYCLE)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Tên Chương Trình Gói
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ví dụ: Gói VIP Cư Dân Hầm B1"
                                            value={createForm.package_name}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    package_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-300 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                                            Giá Định Kỳ Hàng Tháng
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <DollarSign size={15} />
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                placeholder="Nhập số tiền (Ví dụ: 300000)"
                                                value={createForm.price}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        price: e.target.value,
                                                    })
                                                }
                                                className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-300 transition-all"
                                            />
                                            <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                                                VNĐ
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                        >
                                            Khởi Tạo Gói
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {isEditOpen && selectedPackage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditOpen(false)}
                                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                                className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10"
                            >
                                <div className="px-6 py-4.5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">
                                            Cấu Hình Lại Gói Cước
                                        </h3>
                                        <p className="text-xs text-indigo-600 font-mono mt-0.5">
                                            Mã quản lý: {selectedPackage.id}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2 text-slate-500">
                                        <p>
                                            🏢 <strong>Bãi đỗ đính kèm:</strong>{" "}
                                            {selectedPackage.parking_lot_name}
                                        </p>
                                        <p>
                                            🚗 <strong>Nhóm phương tiện:</strong>{" "}
                                            {selectedPackage.vehicle_type === "CAR"
                                                ? "Ô tô"
                                                : "Xe máy"}
                                        </p>
                                    </div>

                                    {/* FIELD 1: Tên gói */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Tên Chương Trình Gói Mới
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.package_name}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    package_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Đơn Giá Điều Chỉnh
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <DollarSign size={15} />
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                value={editForm.price}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, price: e.target.value })
                                                }
                                                className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 transition-all"
                                            />
                                            <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                                                VNĐ
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditOpen(false)}
                                            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                        >
                                            Cập Nhật Ngay
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
