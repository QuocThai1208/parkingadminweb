"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2, MapPin, Eye } from "lucide-react";
import type { ParkingLot } from "@/lib/parking-lot-type";

interface ParkingLotActionMenuProps {
  lot: ParkingLot;
  onEdit: (lot: ParkingLot) => void;
  onDelete: (id: string) => void;
  onView: (lot: ParkingLot) => void;
}

export function ParkingLotActionMenu({
  lot,
  onEdit,
  onDelete,
  onView,
}: ParkingLotActionMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(lot.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => {
            onView(lot);
          }}
          className=""
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            onEdit(lot);
          }}
          className=""
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Parking Lot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {lot.name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
