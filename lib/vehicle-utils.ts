import { Vehicle } from "@/components/vehicles/vehicle-table";

export function getStatusText(isApproved: boolean): string {
  return isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt';
}

export function filterVehicles(
  vehicles: Vehicle[],
  searchQuery: string,
): Vehicle[] {
  if (!searchQuery.trim()) {
    return vehicles;
  }

  const query = searchQuery.toLowerCase();
  return vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.license_plate.toLowerCase().includes(query) ||
      vehicle.user_name.toLowerCase().includes(query) ||
      vehicle.color.toLowerCase().includes(query),
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
