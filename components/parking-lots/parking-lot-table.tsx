'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatThreshold } from '@/lib/parking-lot-utils';
import { ParkingLotActionMenu } from './parking-lot-action-menu';
import type { ParkingLot } from '@/lib/parking-lot-type';
import { useRouter } from 'next/navigation';

interface ParkingLotTableProps {
  parkingLots: ParkingLot[];
  onEdit: (lot: ParkingLot) => void;
  onDelete: (id: string) => void;
  onView: (lot: ParkingLot) => void;
}

export function ParkingLotTable({
  parkingLots,
  onEdit,
  onDelete,
  onView,
}: ParkingLotTableProps) {
  const router = useRouter();

  const goToLotDetail = (id:string) => {
    router.push(`/parking-lots/${id}`);
  }
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-white/5 border-b border-white/10">
          <TableRow className="hover:bg-transparent border-b-white/10">
            <TableHead className="text-center">Tên</TableHead>
            <TableHead className="text-center">Địa chỉ</TableHead>
            <TableHead className="text-right">Xe máy</TableHead>
            <TableHead className="text-right">Xe hơi</TableHead>
            <TableHead className="text-right">Xe buýt</TableHead>
            <TableHead className="text-right">Xe tải</TableHead>
            <TableHead className="text-right">Hàng động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parkingLots.map((lot) => (
            <TableRow
              onClick={() => goToLotDetail(lot.id.toString())}
              key={lot.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <span>{lot.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {lot.address}
              </TableCell>
              <TableCell className="text-right font-medium">
                {lot.moto_slots.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {lot.car_slots.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {lot.bus_slots.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {lot.truck_slots.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <ParkingLotActionMenu
                  lot={lot}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
