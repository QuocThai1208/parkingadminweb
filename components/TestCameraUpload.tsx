"use client";

import { useEffect, useState } from "react";
import { Upload, X, Send, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ParkingService } from "@/src/services/parkingService";

interface UploadState {
  face: File | null;
  front: File | null;
  plate: File | null;
}

interface TestCameraUploadProps {
  setDashboardState: (data: any) => void; // Định nghĩa kiểu dữ liệu cho hàm
}

interface DashboardState {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  plate: string | null;
  type: string | null;
  brand: string | null;
  color: string | null;
  imageFront: string | null;
  imagePlate: string | null;
  faceImg: string | null;
}

export function TestCameraUpload({ setDashboardState }: TestCameraUploadProps) {
  const [images, setImages] = useState<UploadState>({
    face: null,
    front: null,
    plate: null,
  });
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSocket, setLoadingSocket] = useState(true);

  const cameraConfigs = [
    { id: "face", label: "CAMERA LÁI XE" },
    { id: "front", label: "CAMERA PHÍA TRƯỚC" },
    { id: "plate", label: "CAMERA BIỂN SỐ" },
  ];

  // Xử lý khi chọn file
  const handleFileChange = (id: string, file: File | null) => {
    if (!file) return;

    setImages((prev) => ({ ...prev, [id]: file }));

    // Tạo preview để hiển thị lên giao diện
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [id]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Gửi dữ liệu giả lập đến API
  const handleSendTest = async (statusCheck: string) => {
    if (!images.face || !images.front || !images.plate) {
      toast.error("Vui lòng chọn đủ 3 ảnh để giả lập dữ liệu camera!");
      return;
    }

    setLoading(true);
    setDashboardState((prev: DashboardState) => ({
      ...prev,
      status: "loading",
      message: "Đang xử lý dữ liệu...",
    }));
    const formData = new FormData();
    formData.append("face_img", images.face);
    formData.append("image_front", images.front);
    formData.append("image_plate", images.plate);

    try {
      const data =
        statusCheck === "check_in"
          ? await ParkingService.check_in(formData)
          : await ParkingService.check_out(formData);
      setDashboardState({
        ...data?.result, // Giải nén các trường plate, brand, color... từ API
        status: data?.status,
        message: data?.message,
      });

      toast.success("Đã gửi dữ liệu giả lập thành công!");
    } catch (error: any) {
      if (error.status === "error") {
        setDashboardState({
          ...error.result,
          status: error.status,
          message: error?.message || "Lỗi nghiệp vụ bãi xe",
        });

        toast.error(error.message);
      } else {
        // Các lỗi khác như 500, 404 hoặc mất mạng
        toast.error("Lỗi hệ thống hoặc Server không phản hồi");
        setDashboardState((prev: any) => ({ ...prev, status: "error" }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/analytics/");

    socket.onopen = () => {
      console.log("Kết nối websocket thành công.");
      setLoadingSocket(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ai_process_result") {
          console.log("data: ", data.result);
          setDashboardState({
            ...data.result,
            status: data.status,
            message: data.message,
          });
        }else if (data.type === "error") {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi xử lý tin nhắn từ WebSocket:", error);
      }
    };
  }, []);

  return (
    <div className="p-4 border border-dashed border-primary/30 rounded-xl bg-primary/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> BỘ GIẢ LẬP CAMERA (TEST API)
        </h3>
        <button
          onClick={() => handleSendTest("check_out")}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          GỬI CHECK-OUT
        </button>
        <button
          onClick={() => handleSendTest("check_in")}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          GỬI CHECK-IN
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cameraConfigs.map((cam) => (
          <div key={cam.id} className="relative group">
            <label
              className={`
              flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer
              ${previews[cam.id] ? "border-primary/50 bg-background" : "border-border bg-muted/50 hover:border-primary/50"}
            `}
            >
              {previews[cam.id] ? (
                <img
                  src={previews[cam.id]}
                  alt={cam.label}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-6 h-6" />
                  <span className="text-[10px] font-bold text-center">
                    {cam.label}
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(cam.id, e.target.files?.[0] || null)
                }
              />
            </label>

            {previews[cam.id] && (
              <button
                onClick={() => {
                  setPreviews((prev) => ({ ...prev, [cam.id]: "" }));
                  setImages((prev) => ({ ...prev, [cam.id]: null }));
                }}
                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
