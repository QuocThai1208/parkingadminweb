"use client";

import { useEffect, useState } from "react";
import { ImageCaptureArea } from "./image-capture-area";
import { StatusBar } from "./status-bar";
import { MessageBox } from "./message-box";
import { ResultDetails } from "./result-details";
import { DashboardHeader } from "./dashborad-header";
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
  face_detect: string | null;
  vehicle_detect: string | null;
  plate_detect: string | null;
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
    face_detect: null,
    vehicle_detect: null,
    plate_detect: null,
  });


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Camera and Images */}
            <div className="space-y-4">
              <TestCameraUpload setDashboardState={setDashboardState} />

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Ảnh Capture
                </h2>
                <ImageCaptureArea
                  imageFront={dashboardState.vehicle_detect}
                  imagePlate={dashboardState.plate_detect}
                  faceImg={dashboardState.face_detect}
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
        </div>
      </main>
    </div>
  );
}
