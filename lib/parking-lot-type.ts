export interface FloorMap {
  id: string;
  map_svg: string; // URL or SVG content
  floor: number;
  floor_display: string; // e.g., "Tầng 1", "Floor 1"
}

export interface ParkingLot {
  id: number;
  owner_name: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  moto_slots: number;
  car_slots: number;
  bus_slots: number;
  truck_slots: number;
  map_svgs?: FloorMap[];
  slots?: ParkingSlot[];
}

export interface CreateParkingLotInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  moto_slots: number;
  car_slots: number;
  bus_slots: number;
  truck_slots: number;
  threshold_release: number;
  image?: string;
}

export interface UpdateParkingLotInput extends CreateParkingLotInput {
  id: string;
}


export interface ParkingSlot {
  id: string;
  slot_number: string; // e.g., "A01"
  vehicle_type: 'CAR' | 'MOTO' | 'TRUCK' | 'BUS';
  is_vip: boolean;
  is_occupied: boolean;
  is_look_up: boolean;
  is_force_released: boolean;
}