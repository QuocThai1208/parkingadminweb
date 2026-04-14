"use client";

import type { ParkingLot } from "@/lib/parking-lot-type";
import { MapPin, Car, Bike, ChevronRight, Bus, Truck } from "lucide-react";

interface ParkingLotCardProps {
  parkingLot: ParkingLot;
  handleSelect: (id: number) => void;
}

export const ParkingLotCard = ({
  parkingLot,
  handleSelect,
}: ParkingLotCardProps) => {
  return (
    <div
      key={parkingLot.id}
      onClick={() => handleSelect(parkingLot.id)}
      className="group relative bg-white rounded-[2rem] p-8 border border-[#F1F2F6] hover:border-[#6A5AE0] transition-all duration-300 cursor-pointer hover:shadow-[0_20px_50px_rgba(106,90,224,0.1)] overflow-hidden"
    >
      {/* Owner Tag */}
      <div className="absolute top-0 right-0 bg-[#F1F2F6] group-hover:bg-[#6A5AE0] text-[#B2BEC3] group-hover:text-white px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase transition-colors">
        Chủ: {parkingLot.owner_name}
      </div>
      {/* Thông tin chính */}
      <h3 className="text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#6A5AE0] transition-colors">
        {parkingLot.name}
      </h3>

      <div className="flex items-start gap-2 mb-8">
        <MapPin size={16} className="text-[#B2BEC3] mt-1 shrink-0" />
        <p className="text-[#808E9B] text-sm leading-relaxed leading-5">
          {parkingLot.address}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Moto Slots */}
        <div className="bg-[#FBFBFF] p-3 rounded-xl flex items-center gap-2 border border-[#F1F2F6]">
          <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
            <Bike size={14} className="text-[#0EA5E9]" />
          </div>
          <span className="text-[11px] font-bold text-[#2D3436]">
            {parkingLot.moto_slots} Xe máy
          </span>
        </div>

        {/* Car Slots */}
        <div className="bg-[#FBFBFF] p-3 rounded-xl flex items-center gap-2 border border-[#F1F2F6]">
          <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] flex items-center justify-center">
            <Car size={14} className="text-[#F97316]" />
          </div>
          <span className="text-[11px] font-bold text-[#2D3436]">
            {parkingLot.car_slots} Ô tô
          </span>
        </div>

        {/* Bus Slots */}
        <div className="bg-[#FBFBFF] p-3 rounded-xl flex items-center gap-2 border border-[#F1F2F6]">
          <div className="w-6 h-6 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
            <Bus size={14} className="text-[#22C55E]" />
          </div>
          <span className="text-[11px] font-bold text-[#2D3436]">
            {parkingLot.bus_slots} Xe buýt
          </span>
        </div>

        {/* Truck Slots */}
        <div className="bg-[#FBFBFF] p-3 rounded-xl flex items-center gap-2 border border-[#F1F2F6]">
          <div className="w-6 h-6 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
            <Truck size={14} className="text-[#EF4444]" />
          </div>
          <span className="text-[11px] font-bold text-[#2D3436]">
            {parkingLot.truck_slots} Xe tải
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F8F9FA]">
        <span className="text-[#6A5AE0] font-bold text-sm">Vào Dashboard</span>
        <div className="bg-[#6A5AE0] p-2 rounded-full text-white transform group-hover:translate-x-2 transition-transform">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};
