"use client"

import type { ParkingLot } from '@/lib/parking-lot-type';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/stores/useUserStore';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from '@/components/loading-overlay';
import { ParkingLotCard } from '@/components/parking-lots/parking-lot-card';
import { ParkingLotsService } from '@/src/services/parkingLotsService';


export default function SelectParkingPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(false);



  const handleSelect = (id: number) => {
    localStorage.setItem('selected_parking_id', id.toString());
    router.push('/dashboard');
  };

    const fetchParkingLots = async () => {
      setIsLoading(true);
      try {
        const data = await ParkingLotsService.getParkingLots();
        setParkingLots(data?.result);
      }catch(error) {
        console.error("Error fetching parking lots:", error);
      } finally {
        setIsLoading(false);
      }
    }


  useEffect(() => {
    if (hasHydrated) {
      if (!isLoggedIn || !user) {
        router.push("/login");
      }
    }
  }, [hasHydrated, isLoggedIn, user, router]);

  useEffect(() => {
    fetchParkingLots();
  }, []);

  if(!hasHydrated || isLoading) {
    return (
      <LoadingOverlay isLoading={!hasHydrated || isLoading} />
    )
  }
  

  return (
    <div className="min-h-screen bg-[#FBFBFF] py-12 px-6 sm:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-[#2D3436] tracking-tight">
          Xin chào {user?.username || 'Người dùng'}! 👋
        </h1>
        <p className="text-[#B2BEC3] mt-2 text-lg">
          Vui lòng chọn bãi xe bạn đang quản lý để tiếp tục
        </p>
      </div>

      {/* Grid Danh sách bãi xe */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parkingLots?.map((parking) => (
          <ParkingLotCard key={parking.id} parkingLot={parking} handleSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}