'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ParkingLot, CreateParkingLotInput } from '@/lib/parking-lot-type';
import { MapPreview } from './map-preview';

interface ParkingLotFormProps {
  initialData?: ParkingLot;
  onSubmit: (data: CreateParkingLotInput) => void;
  isLoading?: boolean;
}

export function ParkingLotForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ParkingLotFormProps) {
  const [formData, setFormData] = useState<CreateParkingLotInput>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    latitude: initialData?.latitude || 10.7769,
    longitude: initialData?.longitude || 106.7009,
    moto_slots: initialData?.moto_slots || 500,
    car_slots: initialData?.car_slots || 0,
    bus_slots: initialData?.bus_slots || 0,
    truck_slots: initialData?.truck_slots || 0,
    threshold_release: initialData?.threshold_release || 0.75,
    image: initialData?.image || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'latitude' || name === 'longitude' || name === 'total_slots'
          ? parseFloat(value) || 0
          : name === 'threshold_release'
          ? parseFloat(value) / 100
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) / 100;
    setFormData((prev) => ({
      ...prev,
      threshold_release: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    if (formData.moto_slots <= 0) newErrors.total_slots = 'Total slots must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Parking Lot Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Saigon Center Parking"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., 65 Lê Lợi, Quận 1, TP.HCM"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude *</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="10.7769"
              className={errors.latitude ? 'border-red-500' : ''}
            />
            {errors.latitude && (
              <p className="text-xs text-red-500">{errors.latitude}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude *</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="106.7009"
              className={errors.longitude ? 'border-red-500' : ''}
            />
            {errors.longitude && (
              <p className="text-xs text-red-500">{errors.longitude}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_slots">Total Slots *</Label>
          <Input
            id="total_slots"
            name="total_slots"
            type="number"
            min="1"
            value={formData.moto_slots}
            onChange={handleChange}
            placeholder="500"
            className={errors.total_slots ? 'border-red-500' : ''}
          />
          {errors.total_slots && (
            <p className="text-xs text-red-500">{errors.total_slots}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="threshold_release">
            Release Threshold: {Math.round(formData.threshold_release * 100)}%
          </Label>
          <input
            id="threshold_release"
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.threshold_release * 100}
            onChange={handleThresholdChange}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Release slots when occupancy drops below {Math.round(formData.threshold_release * 100)}%
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : initialData ? 'Update Parking Lot' : 'Create Parking Lot'}
          </Button>
        </div>
      </form>

      <MapPreview
        latitude={formData.latitude}
        longitude={formData.longitude}
        name={formData.name}
      />
    </div>
  );
}
