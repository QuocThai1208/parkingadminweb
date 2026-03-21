'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface ParkingRecord {
  id: string
  plate: string
  vehicle_image: string | null
  vehicle_name: string
  owner_name: string | null
  check_in: string
  check_out: string | null
  duration_minutes: number
  fee: number
  status: 'in_garage' | 'completed'
}

interface ParkingLogsTableProps {
  records: ParkingRecord[]
}

const formatTime = (dateStr: string | null) => {
  if (!dateStr) return "--:--:--"
  return dateStr.split(' ')[0]
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "--/--/----"
  // Tách lấy phần thứ hai sau khoảng trắng (Ngày/Tháng/Năm)
  return dateStr.split(' ')[1]
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function ParkingLogsTable({ records }: ParkingLogsTableProps) {
  if (records?.length === 0) {
    return (
      <div className="w-full border border-border rounded-lg p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Không có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="w-full border border-border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">ID</TableHead>
            <TableHead className="text-foreground font-semibold">Biển Số</TableHead>
            <TableHead className="text-foreground font-semibold">Hình Ảnh</TableHead>
            <TableHead className="text-foreground font-semibold">Tên Xe</TableHead>
            <TableHead className="text-foreground font-semibold">Chủ Xe</TableHead>
            <TableHead className="text-foreground font-semibold">Vào Lúc</TableHead>
            <TableHead className="text-foreground font-semibold">Ra Lúc</TableHead>
            <TableHead className="text-foreground font-semibold">Thời Gian</TableHead>
            <TableHead className="text-foreground font-semibold">Phí</TableHead>
            <TableHead className="text-foreground font-semibold">Trạng Thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records?.map((record) => (
            <TableRow
              key={record.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-mono text-sm text-muted-foreground">{record.id}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono font-bold bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                  {record.plate}
                </Badge>
              </TableCell>
              <TableCell>
                {record.vehicle_image ? (
                  <img
                    src={record.vehicle_image}
                    alt={record.vehicle_name}
                    className="w-12 h-12 rounded object-cover border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground">{record.vehicle_name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.owner_name || '—'}</TableCell>
              <TableCell className="text-sm">
                <div className="text-foreground font-mono">{formatTime(record.check_in)}</div>
                <div className="text-xs text-muted-foreground">{formatDate(record.check_in)}</div>
              </TableCell>
              <TableCell className="text-sm">
                {record.check_out ? (
                  <>
                    <div className="text-foreground font-mono">{formatTime(record.check_out)}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(record.check_out)}</div>
                  </>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm font-mono text-foreground">{formatDuration(record.duration_minutes)}</TableCell>
              <TableCell className="font-bold text-green-600 dark:text-green-400">
                {record.fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </TableCell>
              <TableCell>
                <Badge
                  variant={record.status === 'in_garage' ? 'secondary' : 'default'}
                  className={record.status === 'in_garage' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' : 'bg-green-500/20 text-green-700 dark:text-green-400'}
                >
                  {record.status === 'in_garage' ? 'Đang Gửi' : 'Hoàn Tất'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
