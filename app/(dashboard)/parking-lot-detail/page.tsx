"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MapSvgManager } from "@/components/parking-lots/map-svg-manager";
import { ArrowLeft, MapPin, Gauge } from "lucide-react";
import type { ParkingLot, FloorMap } from '@/lib/parking-lot-type';
import { ParkingLotsService } from "@/src/services/parkingLotsService";
import { ParkingSlot } from "@/lib/parking-slot-type";
import { toast } from "sonner";
import { FloorSwitcher } from "@/components/parking-lots/floor-switcher";
import { InteractiveSvgMap } from "@/components/parking-lots/interactive-svg-map";
import { MapLegend } from "@/components/parking-lots/map-legend";

export default function ParkingLotDetailPage() {
  const router = useRouter();
  const lotId = localStorage.getItem("selected_parking_id");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("maps");
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorMap | null>(null);


  const fetchParkingLotDetail = async () => {
    setIsLoading(true);
    try {
      const data = await ParkingLotsService.getParkingLotDetail(
        lotId as string,
      );
      setParkingLot(data);
    } catch (error) {
      console.error("Failed to fetch parking lot detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingLotDetail();
  }, []);

  useEffect(() => {
    if (parkingLot?.map_svgs && parkingLot.map_svgs.length > 0 && !activeFloor) {
      setActiveFloor(parkingLot.map_svgs[0]);
    }
  }, [parkingLot, activeFloor]);

  if (!parkingLot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Parking Lot Not Found</h1>
            <p className="text-muted-foreground mt-2">
              The parking lot you are looking for does not exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const handleSaveMap = async (mapData: any, slots: ParkingSlot[]) => {
    setIsLoading(true);
    console.log("mapInfo: ", mapData);
    console.log("slots: ", slots);
    try {
      const data = await ParkingLotsService.uploadFullMap(
        parkingLot.id,
        mapData,
        slots,
      );
      toast.success(data?.message);
    } catch (error:any) {
      toast.error(error?.error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <LoadingOverlay isLoading={isLoading} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Right: Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{parkingLot.name}</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </p>
                    <p className="text-base">{parkingLot.address}</p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Gauge className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vị trí xe máy
                      </p>
                      <p className="text-base font-semibold">
                        {parkingLot.moto_slots.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gauge className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vị trí ô tô
                      </p>
                      <p className="text-base font-semibold">
                        {parkingLot.car_slots.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gauge className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vị trí xe bus
                      </p>
                      <p className="text-base font-semibold">
                        {parkingLot.bus_slots.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gauge className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vị trí xe tải
                      </p>
                      <p className="text-base font-semibold">
                        {parkingLot.truck_slots.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Tọa độ
                  </p>
                  <div className="flex gap-4">
                    <Badge variant="secondary">
                      Lat: {parkingLot.latitude.toFixed(4)}
                    </Badge>
                    <Badge variant="secondary">
                      Lon: {parkingLot.longitude.toFixed(4)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col"
        >
          <TabsList className="">
            <TabsTrigger
              value="maps"
              className=" data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 "
            >
              Sơ đồ tầng
            </TabsTrigger>
            <TabsTrigger
              value="add-maps"
              className=" data-[state=active]:border-amber-500 data-[state=active]:text-amber-500 "
            >
              Thêm sơ đồ
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <div className="w-full">
            {/* maps Tab */}
            <TabsContent value="maps" className="p-6 space-y-6">
              {parkingLot.map_svgs && parkingLot.map_svgs.length > 0 ? (
                <>
                  <MapLegend />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Interactive Parking Map</h3>
                    <FloorSwitcher
                      floors={parkingLot.map_svgs}
                      activeFloor={activeFloor}
                      onFloorChange={setActiveFloor}
                    />

                    {activeFloor && parkingLot.slots && (
                      <InteractiveSvgMap mapSvgUrl={activeFloor.map_svg} slots={parkingLot.slots} />
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không có sơ đồ nào cho bãi đậu xe này.</p>
                  <p className="text-sm text-muted-foreground mt-2">Tải lên sơ đồ bằng cách sử dụng tab thêm sơ đồ.</p>
                </div>
              )}
            </TabsContent>

            {/* add maps Tab */}
            <TabsContent value="add-maps" className="p-6">
              <MapSvgManager
                onSave={handleSaveMap}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
