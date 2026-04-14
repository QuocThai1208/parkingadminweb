export type VehicleType = 'CAR' | 'MOTO' | 'TRUCK' | 'BUS';

export interface ParkingSlot {
  id: string;
  slot_number: string;
  vehicle_type: VehicleType;
}

export interface ParkingSlotsImportData {
  total_slots: number;
  slots: ParkingSlot[];
}