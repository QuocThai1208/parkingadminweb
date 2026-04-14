'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ParkingLotForm } from './parking-lot-form';
import type { ParkingLot, CreateParkingLotInput } from '@/lib/parking-lot-type';

interface ParkingLotDialogProps {
  onSubmit: (data: CreateParkingLotInput) => void;
  onClose: () => void;
  editingLot?: ParkingLot | null;
  isLoading?: boolean;
}

export function ParkingLotDialog({
  onSubmit,
  onClose,
  editingLot,
  isLoading = false,
}: ParkingLotDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editingLot) {
      setOpen(true);
    }
  }, [editingLot]);

  const handleSubmit = (data: CreateParkingLotInput) => {
    onSubmit(data);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose(); // Gọi hàm xóa dữ liệu ở cha khi dialog đóng
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bãi xe
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingLot ? 'Edit Parking Lot' : 'Create New Parking Lot'}
          </DialogTitle>
          <DialogDescription>
            {editingLot
              ? 'Update the parking lot information below.'
              : 'Fill in the details to create a new parking lot.'}
          </DialogDescription>
        </DialogHeader>
        <ParkingLotForm
          initialData={editingLot || undefined}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
