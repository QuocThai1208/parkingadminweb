'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, AlertCircle, Trash2, Eye, X } from 'lucide-react';

interface ParkingSlot {
  id: string;
  slot_number: string;
  vehicle_type: 'CAR' | 'MOTO' | 'TRUCK' | 'BUS';
  skipped: boolean;
}

interface MapSvgManagerProps {
  onSave?: (
    mapInfo: { floor: number; floor_display: string; map_svg: File;},
    slots: ParkingSlot[]
  ) => void;
}

export function MapSvgManager({ onSave }: MapSvgManagerProps) {
  const [stage, setStage] = useState<'input' | 'preview'>('input');
  const [floor, setFloor] = useState<number | ''>('');
  const [floorDisplay, setFloorDisplay] = useState('');
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [svgPreview, setSvgPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileSvg, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vehicleTypeColors: Record<string, string> = {
    CAR: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    MOTO: 'bg-green-500/20 text-green-700 dark:text-green-300',
    TRUCK: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
    BUS: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  };

  const handleFileUpload = (file: File) => {
    setFile(file);
    setError('');
    if (!file.name.endsWith('.svg')) {
      setError('Please upload a valid SVG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const svgText = e.target?.result as string;
        setSvgPreview(svgText);

        // Phân tích cú pháp SVG bằng DOMParser
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        if (svgDoc.getElementsByTagName('parsererror').length > 0) {
          setError('Invalid SVG file. Please upload a valid SVG.');
          return;
        }

        // Trích xuất tất cả các phần tử có ID bắt đầu bằng "slot-"
        const elements = svgDoc.querySelectorAll('[id^="slot-"]');
        const parsedSlots: ParkingSlot[] = [];

        elements.forEach((element) => {
          const id = element.getAttribute('id');
          if (!id) return;

          const parts = id.split('-');
          if (parts.length < 3) return;

          const slotNumber = parts[1];
          const vehicleType = parts[2] as 'CAR' | 'MOTO' | 'TRUCK' | 'BUS';

          parsedSlots.push({
            id: `${slotNumber}-${vehicleType}`,
            slot_number: slotNumber,
            vehicle_type: vehicleType,
            skipped: false,
          });
        });

        if (parsedSlots.length === 0) {
          setError('No parking slots found in the SVG. Ensure elements have IDs formatted as: slot-[SlotNumber]-[VehicleType]');
          return;
        }

        setSlots(parsedSlots);
        setStage('preview');
      } catch (err) {
        setError('Failed to parse SVG file. Please ensure it is valid.');
      }
    };

    reader.readAsText(file);
  };

  const toggleSkipSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, skipped: !slot.skipped } : slot))
    );
  };

  const validation = () => {
    // Validation
    if (floor === '') {
      setError('Cần có số tầng..');
      return;
    }

    if (!floorDisplay.trim()) {
      setError('Tên hiển thị tầng là bắt buộc.');
      return;
    }

    if (slots.length === 0) {
      setError('Không tìm thấy vị trí đỗ xe.');
      return;
    }

    setError('');
    return true;
  }

  const handleSave = async () => {
    if (!validation()) return;

    const activeSlotsCount = slots.filter((s) => !s.skipped).length;
    if (activeSlotsCount === 0) {
      setError('Ít nhất một vị trí đỗ xe phải được chọn.');
      return;
    }

    setLoading(true);
    try {
      if (!fileSvg) return 

      const activeSlots = slots.filter((s) => !s.skipped);

      const mapInfo = {
        floor: floor as number,
        floor_display: floorDisplay,
        map_svg: fileSvg,
      };

      onSave?.(mapInfo, activeSlots);

      // Reset form
      resetForm();
    } catch (err) {
      setError('Failed to save map and slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStage('input');
    setFloor('');
    setFloorDisplay('');
    setSlots([]);
    setSvgPreview('');
    setError('');
  };

  const totalSlots = slots.length;
  const skippedSlots = slots.filter((s) => s.skipped).length;
  const activeSlots = totalSlots - skippedSlots;

  if (stage === 'preview') {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Sơ đồng bãi xe: {floorDisplay}</CardTitle>
              <CardDescription>Tầng {floor} </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setStage('input')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SVG Preview */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Xem trước SVG</h3>
            <div className="border rounded-lg bg-muted/50 p-4 max-h-64 overflow-auto">
              {svgPreview ? (
                <div
                  dangerouslySetInnerHTML={{ __html: svgPreview }}
                  className="w-full"
                />
              ) : (
                <p className="text-muted-foreground text-sm">Không thể xem trước file SVG.</p>
              )}
            </div>
          </div>

          {/* Slots Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Tổng số vị trí</p>
              <p className="text-2xl font-bold">{totalSlots}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Số vị trí tạo</p>
              <p className="text-2xl font-bold text-green-600">{activeSlots}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Bỏ qua</p>
              <p className="text-2xl font-bold text-amber-600">{skippedSlots}</p>
            </Card>
          </div>

          {/* Slots Table */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Chỗ đỗ xe</h3>
            <ScrollArea className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số vị trí</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-12">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot.id} className={slot.skipped ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">{slot.slot_number}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vehicleTypeColors[slot.vehicle_type]}>
                          {slot.vehicle_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {slot.skipped ? (
                          <Badge variant="destructive">Bỏ qua</Badge>
                        ) : (
                          <Badge variant="secondary">Sẵn sàng tạo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSkipSlot(slot.id)}
                          title={slot.skipped ? 'Include' : 'Skip'}
                        >
                          {slot.skipped ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-3">
          <Button variant="outline" onClick={() => setStage('input')}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu Bản đồ & Vị trí'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tải lên bản đồ bãi đậu xe (SVG)</CardTitle>
        <CardDescription>Thêm thông tin tầng và tải lên bản đồ SVG với các vị trí đỗ xe.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Floor Info Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Số tầng *</label>
            <Input
              type="number"
              placeholder="1, 2, ..."
              value={floor}
              onChange={(e) => setFloor(e.target.value === '' ? '' : parseInt(e.target.value))}
              min="-10"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên tầng hiển thị *</label>
            <Input
              type="text"
              placeholder="Tầng 1, Tầng hầm, ..."
              value={floorDisplay}
              onChange={(e) => setFloorDisplay(e.target.value)}
            />
          </div>
        </div>

        {/* File Upload Zone */}
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-muted');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-muted');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-muted');
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium mb-1">Kéo và thả tệp SVG của bạn</p>
          <p className="text-sm text-muted-foreground">hoặc nhấp để chọn tệp</p>
          <p className="text-xs text-muted-foreground mt-2">Chỉ hỗ trợ định dạng SVG</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">Yêu cầu định dạng SVG</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Mỗi phần tử vị trí đỗ xe (rect/path) phải có ID được định dạng như sau: <code className="bg-black/20 px-2 py-1 rounded text-xs">slot-[SlotNumber]-[VehicleType]-[IsVip]</code>
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
            Ví dụ: <code className="bg-black/20 px-2 py-1 rounded text-xs">slot-A01-CAR</code> or <code className="bg-black/20 px-2 py-1 rounded text-xs">slot-B05-MOTO</code>
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}