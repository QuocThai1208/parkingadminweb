"use client";

import { Badge } from "@/components/ui/badge";
import {
  getStatusText,
} from "@/lib/vehicle-utils";
import { CheckCircle, Clock, Lock } from "lucide-react";
import { Button } from "../ui/button";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onApprove: (id: string, value: string) => void;
}

export interface Vehicle {
  id: string;
  image: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  license_plate: string;
  user_name: string;
  is_approved: boolean;
  active: boolean;
  created_at: string;
}

export function VehicleTable({ vehicles, onApprove }: VehicleTableProps) {
  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="group rounded-xl backdrop-blur-md bg-white/10 border border-white/20 p-4 hover:bg-white/20 hover:border-white/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Vehicle Image & Info */}
            <div className="flex items-center gap-4 flex-1  min-w-0">
              <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/20 group-hover:border-blue-400/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-sm lg:text-base truncate">
                  {vehicle.name}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {vehicle.brand}
                </p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2 lg:w-40">
              <div className="min-w-0">
                <p className="text-xs lg:text-sm font-medium text-foreground truncate">
                  {vehicle.user_name}
                </p>
              </div>
            </div>

            {/* License Plate */}
            <div className="lg:w-32">
              <div className="inline-block rounded px-2 py-1 font-bold text-xs lg:text-sm bg-yellow-300 text-yellow-900 border-2 border-yellow-400 font-mono tracking-wider">
                {vehicle.license_plate}
              </div>
            </div>

            {/* Specs */}
            <div className="flex gap-2 flex-wrap lg:w-40">
              <Badge
                variant="outline"
                className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-400/20"
              >
                {vehicle.type}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-400/20"
              >
                {vehicle.color}
              </Badge>
            </div>

            {/* Status Badge */}
            <div className="lg:w-32 mr-20">
              {vehicle.is_approved ? (
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-400/30 hover:bg-emerald-500/30">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {getStatusText(vehicle.is_approved)}
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-400/30 hover:bg-amber-500/30 animate-pulse">
                  <Clock className="mr-1 h-3 w-3" />
                  {getStatusText(vehicle.is_approved)}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="lg:w-12 flex justify-end">
              {!vehicle.is_approved ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => onApprove(vehicle.id, "1")}
                    className="text-emerald-600 dark:text-emerald-400 bg-emerald-100"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Phê duyệt</span>
                  </Button>
                  
                </>
              ) : (
                <>
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => onApprove(vehicle.id, "0")}
                      className="text-destructive dark:text-destructive bg-red-100"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Khóa</span>
                    </Button>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
