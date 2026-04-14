'use client';

import { Button } from '@/components/ui/button';
import type { FloorMap } from '@/lib/parking-lot-type';

interface FloorSwitcherProps {
  floors: FloorMap[];
  activeFloor: FloorMap | null;
  onFloorChange: (floor: FloorMap) => void;
}

export function FloorSwitcher({ floors, activeFloor, onFloorChange }: FloorSwitcherProps) {
  if (!floors || floors.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Tầng:</span>
      <div className="flex gap-2 flex-wrap">
        {floors.map((floor) => (
          <Button
            key={floor.id}
            variant={activeFloor?.id === floor.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFloorChange(floor)}
            className={
              activeFloor?.id === floor.id
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                : 'border-white/10 hover:bg-white/10'
            }
          >
            {floor.floor_display}
          </Button>
        ))}
      </div>
    </div>
  );
}
