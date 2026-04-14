'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParkingLotEmptyStateProps {
  onCreateNew?: () => void;
}

export function ParkingLotEmptyState({
  onCreateNew,
}: ParkingLotEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-4">
        <Search className="h-16 w-16 text-muted-foreground/40 mx-auto" />
        <h3 className="text-xl font-semibold">No parking lots found</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Try adjusting your search filters or create a new parking lot to get started.
        </p>
        <Button onClick={onCreateNew} className="mt-4">
          Create Parking Lot
        </Button>
      </div>
    </div>
  );
}
