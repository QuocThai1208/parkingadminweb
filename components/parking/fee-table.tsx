'use client';

import { ParkingFee, FEE_TYPE_LABELS } from '@/lib/parking-fee-data';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getFeeTypeIcon } from '@/lib/parking-fee-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, MoreVertical, Check, X } from 'lucide-react';
import { useState } from 'react';

interface FeeTableProps {
  fees: ParkingFee[];
  onEdit?: (fee: ParkingFee) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, active:boolean) => void;
}

export function FeeTable({ fees, onEdit, onDelete, onToggle }: FeeTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (fees.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Không có dữ liệu phí</p>
          <p className="text-sm text-muted-foreground/70">Thêm phí mới bằng cách nhấn nút "Thêm phí mới"</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {fees.map((fee) => {
        const Icon = getFeeTypeIcon(fee.fee_type);
        const isExpanded = expandedId === fee.id;

        return (
          <Card
            key={fee.id}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] overflow-hidden"
          >
            <div className="px-6">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : fee.id)}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{FEE_TYPE_LABELS[fee.fee_type]}</h3>
                      <div
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                          fee.active
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        } ${fee.active && 'animate-pulse'}`}
                      >
                        {getStatusLabel(fee.active)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {fee.effective_from ? formatDate(fee.effective_from) : "---"} - {fee.effective_to ? formatDate(fee.effective_to) : "---"}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-foreground">{formatCurrency(fee.amount)}</div>
                  <p className="text-xs text-muted-foreground">Giá</p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Loại phương tiện</p>
                      <p className="font-medium text-foreground">{FEE_TYPE_LABELS[fee.fee_type]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Giá</p>
                      <p className="font-medium text-foreground">{formatCurrency(fee.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Từ ngày</p>
                      <p className="font-medium text-foreground">{fee.effective_from ? formatDate(fee.effective_from) : "---"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Đến ngày</p>
                      <p className="font-medium text-foreground">{fee.effective_to ? formatDate(fee.effective_to) : "---"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEdit?.(fee)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${fee.active ? "text-destructive hover:text-destructive" : "text-emerald-700 hover:text-emerald-700"}`}
                      onClick={() => onToggle?.(fee.id, !fee.active)}
                    >
                      
                      {fee.active ? <X className="w-4 h-4 mr-2" />: <Check className="w-4 h-4 mr-2" /> }
                      {fee.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={true}
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete?.(fee.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
