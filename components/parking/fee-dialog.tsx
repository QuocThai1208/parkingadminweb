'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { FEE_TYPE_LABELS, FeeType, ParkingFee } from '@/lib/parking-fee-data';

interface FeeDialogProps {
  editingFee?: ParkingFee | null;
  onSave?: (fee: Omit<ParkingFee, 'id'> & { id?: string }) => void;
}

export function FeeDialog({ editingFee, onSave }: FeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fee_type: 'CAR' as FeeType,
    amount: 0,
    active: true,
    effective_from: '',
    effective_to: '',
  });

  useEffect(() => {
    console.log(formData)
  }, [formData]);

  useEffect(() => {
    if (editingFee) {
      setFormData({
        fee_type: editingFee.fee_type,
        amount: editingFee.amount,
        active: editingFee.active,
        effective_from: editingFee.effective_from,
        effective_to: editingFee.effective_to,
      });
      setOpen(true);
    }
  }, [editingFee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({
      id: editingFee?.id,
      ...formData,
    });
    setOpen(false);
    setFormData({
      fee_type: 'CAR',
      amount: 0,
      active: true,
      effective_from: '',
      effective_to: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : name === 'active' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editingFee && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4" />
            Thêm phí mới
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingFee ? 'Chỉnh sửa phí' : 'Tạo phí mới'}</DialogTitle>
          <DialogDescription>
            {editingFee ? 'Cập nhật thông tin phí' : 'Nhập thông tin chi tiết cho phí mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor="fee_type">Loại phương tiện</Label>
            <select
              id="fee_type"
              name="fee_type"
              value={formData.fee_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(FEE_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor="amount">Giá (VND)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="1000"
              value={formData.amount || ""}
              onChange={handleChange}
              placeholder="30000"
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="effective_from">Ngày bắt đầu</Label>
            <Input
              id="effective_from"
              name="effective_from"
              type="date"
              value={formData.effective_from || ""}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="effective_to">Ngày kết thúc</Label>
            <Input
              id="effective_to"
              name="effective_to"
              type="date"
              value={formData.effective_to || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="rounded border-input"
            />
            <Label htmlFor="active" className="cursor-pointer">
              Đang áp dụng
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1 ">
              {editingFee ? 'Cập nhật' : 'Tạo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
