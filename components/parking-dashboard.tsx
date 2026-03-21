"use client";

import { useEffect, useState } from "react";
import { CameraFeed } from "./camera-feed";
import { ImageCaptureArea } from "./image-capture-area";
import { StatusBar } from "./status-bar";
import { MessageBox } from "./message-box";
import { ResultDetails } from "./result-details";
import { HistoryLog, type HistoryEntry } from "./history-log";
import { DashboardHeader } from "./dashborad-header";
import { useAdmin } from "@/src/hooks/useAdmin";
import { AdminService } from "@/src/services/adminService";
import { TestCameraUpload } from "./TestCameraUpload";

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

export function ParkingDashboard() {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    status: "idle",
    message: null,
    plate: null,
    type: null,
    brand: null,
    color: null,
    imageFront: null,
    imagePlate: null,
    faceImg: null,
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const loadLogsHistory = async () => {
    try {
      const data = await AdminService.get_logs_history();
      setHistory(data?.result);
    } catch (e) {
      console.log("error at loadLogsHistory", e);
    }
  };

  useEffect(() => {
    loadLogsHistory();
  }, []);


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <TestCameraUpload setDashboardState={setDashboardState} />

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Camera and Images */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Camera & Ảnh
                </h2>
                <CameraFeed isLoading={dashboardState.status === "loading"} />
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Ảnh Capture
                </h2>
                <ImageCaptureArea
                  imageFront={dashboardState.imageFront}
                  imagePlate={dashboardState.imagePlate}
                  faceImg={dashboardState.faceImg}
                />
              </div>
            </div>

            {/* Right Column - Status and Results */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Trạng Thái
                </h2>
                <StatusBar status={dashboardState.status} />
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông Báo
                </h2>
                <MessageBox
                  message={dashboardState.message}
                  type={dashboardState.status === "error" ? "error" : "info"}
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Kết Quả
                </h2>
                <ResultDetails
                  plate={dashboardState.plate}
                  type={dashboardState.type}
                  brand={dashboardState.brand}
                  color={dashboardState.color}
                />
              </div>
            </div>
          </div>

          {/* History Footer */}
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Lịch Sử Kiểm Tra
            </h2>
            <HistoryLog entries={history} />
          </div>
        </div>
      </main>
    </div>
  );
}
