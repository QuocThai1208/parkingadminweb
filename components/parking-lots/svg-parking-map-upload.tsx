'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Upload, Trash2, Car, Crown, CheckCircle2 } from 'lucide-react';
import type { ParkingSlot, VehicleType } from '@/lib/parking-slot-type';

interface SVGParkingMapUploadProps {
  onSlotsConfirmed?: (slots: ParkingSlot[]) => void;
}

export function SVGParkingMapUpload({ onSlotsConfirmed }: SVGParkingMapUploadProps) {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVehicleTypeColor = (type: VehicleType): string => {
    const colors: Record<VehicleType, string> = {
      CAR: 'bg-blue-500/20 text-blue-700 border-blue-200',
      MOTO: 'bg-green-500/20 text-green-700 border-green-200',
      TRUCK: 'bg-orange-500/20 text-orange-700 border-orange-200',
      BUS: 'bg-purple-500/20 text-purple-700 border-purple-200',
    };
    return colors[type];
  };

  const getVehicleTypeIcon = (type: VehicleType) => {
    return <Car className="w-4 h-4" />;
  };

  const parseSVG = (svgText: string): ParkingSlot[] => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      if (svgDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid SVG file. Please check the file format.');
      }

      const elements = svgDoc.querySelectorAll('[id^="slot_"]');
      const parsedSlots: ParkingSlot[] = [];

      elements.forEach((element) => {
        const id = element.id;
        const parts = id.split('_');

        if (parts.length >= 4) {
          const slotNumber = parts[1];
          const vehicleType = (parts[2] as VehicleType).toUpperCase();
          const isVip = parts[3].toLowerCase() === 'true';

          if (['CAR', 'MOTO', 'TRUCK', 'BUS'].includes(vehicleType)) {
            parsedSlots.push({
              id: `${slotNumber}-${vehicleType}-${isVip}`,
              slot_number: slotNumber,
              vehicle_type: vehicleType as VehicleType,
              is_vip: isVip,
            });
          }
        }
      });

      return parsedSlots;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse SVG';
      setError(errorMessage);
      return [];
    }
  };

  const handleFileUpload = (file: File) => {
    setError(null);

    if (!file.name.endsWith('.svg')) {
      setError('Please upload an SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgText = e.target?.result as string;
      const parsedSlots = parseSVG(svgText);

      if (parsedSlots.length === 0 && !error) {
        setError('No parking slots found in SVG. Please check if the file contains elements with ids like "slot_A01_CAR_true"');
        return;
      }

      setSlots(parsedSlots);
    };

    reader.onerror = () => {
      setError('Failed to read the file');
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeSlot = (slotId: string) => {
    setSlots(slots.filter((slot) => slot.id !== slotId));
  };

  const handleConfirmAndCreate = () => {
    if (slots.length === 0) {
      setError('No slots to create. Please upload a valid SVG file first.');
      return;
    }

    const slotData = {
      total_slots: slots.length,
      slots: slots,
    };

    console.log('Final Parking Slots JSON:', JSON.stringify(slotData, null, 2));
    onSlotsConfirmed?.(slots);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Section */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload Parking Map (SVG)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your SVG file here or click to browse
          </p>
          <label htmlFor="svg-upload">
            <Button asChild variant="outline" className="cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </span>
            </Button>
          </label>
          <input
            id="svg-upload"
            type="file"
            accept=".svg"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-4">
            Expected slot ID format: slot_[SlotNumber]_[VehicleType]_[IsVip]
            <br />
            Example: slot_A01_CAR_true
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Slots Table */}
      {slots.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Parsed Parking Slots</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Found {slots.length} parking slot{slots.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="w-24">Slot Number</TableHead>
                  <TableHead className="w-32">Vehicle Type</TableHead>
                  <TableHead className="w-24">VIP Status</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{slot.slot_number}</TableCell>
                    <TableCell>
                      <Badge className={`gap-2 ${getVehicleTypeColor(slot.vehicle_type)}`}>
                        {getVehicleTypeIcon(slot.vehicle_type)}
                        {slot.vehicle_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {slot.is_vip ? (
                        <Badge className="bg-amber-500/20 text-amber-700 border-amber-200 gap-1">
                          <Crown className="w-3 h-3" />
                          VIP
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeSlot(slot.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSlots([]);
                setError(null);
              }}
            >
              Clear & Upload New
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmAndCreate}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Create All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}