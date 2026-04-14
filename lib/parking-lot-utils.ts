import { ParkingLot } from './parking-lot-type';

export function formatThreshold(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatCapacity(slots: number): string {
  if (slots >= 1000) {
    return `${(slots / 1000).toFixed(1)}K`;
  }
  return slots.toString();
}

export function calculateThresholdColor(threshold: number): string {
  if (threshold >= 0.8) {
    return 'text-emerald-500';
  } else if (threshold >= 0.65) {
    return 'text-amber-500';
  } else {
    return 'text-red-500';
  }
}

export function generateMapUrl(lat: number, lon: number, zoom = 15): string {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=600x400&markers=color:blue%7C${lat},${lon}&key=YOUR_API_KEY`;
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function filterParkingLots(
  lots: ParkingLot[],
  search: string,
  thresholdMin: number,
  thresholdMax: number,
  sortBy: 'name' | 'capacity' | 'threshold' = 'name'
): ParkingLot[] {
  let filtered = lots.filter((lot) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      lot.name.toLowerCase().includes(searchLower) ||
      lot.address.toLowerCase().includes(searchLower);

    const matchesThreshold =
      lot.threshold_release >= thresholdMin &&
      lot.threshold_release <= thresholdMax;

    return matchesSearch && matchesThreshold;
  });

  if (sortBy === 'capacity') {
    filtered.sort((a, b) => b.moto_slots - a.moto_slots);
  } else if (sortBy === 'threshold') {
    filtered.sort((a, b) => b.threshold_release - a.threshold_release);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}
