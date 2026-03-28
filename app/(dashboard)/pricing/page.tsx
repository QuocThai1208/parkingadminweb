'use client';

import { useEffect, useState } from 'react';
import { filterFeesByType, ParkingFee } from '@/lib/parking-fee-data';
import { FeeAnalytics } from '@/components/parking/fee-analytics';
import { FeeTable } from '@/components/parking/fee-table';
import { FeeFilterTabs } from '@/components/parking/fee-filter-tabs';
import { FeeDialog } from '@/components/parking/fee-dialog';
import { LoadingOverlay } from '@/components/loading-overlay';
import { DollarSign } from 'lucide-react';
import { ParkingService } from '@/src/services/parkingService';
import { toast } from 'sonner';

type FilterType = 'ALL' | 'MOTORCYCLE' | 'CAR' | 'TRUCK' | 'BUS';

export default function ParkingFeesPage() {
  const [fees, setFees] = useState<ParkingFee[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [editingFee, setEditingFee] = useState<ParkingFee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredFees = filterFeesByType(fees, selectedFilter);

  const handleAddFee = async (newFee: Omit<ParkingFee, 'id'> & { id?: string }) => {
    setIsLoading(true);
    try {
      const data = await ParkingService.createFee(newFee)
      const feeWithId: ParkingFee = {...data};
      setFees([...fees, feeWithId]);
    }catch(e:any){
      toast.error(e.fee_type || "Đã có lỗi vui lòng thử lại sau.")
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFee = async (updatedFee: Omit<ParkingFee, 'id'> & { id?: string }) => {
    setIsLoading(true);
    try {
      if (editingFee?.id) {
        await ParkingService.updateFee(editingFee?.id, updatedFee)
        setFees(fees.map(fee => (fee.id === editingFee.id ? { ...fee, ...updatedFee } : fee)));
      }
      setEditingFee(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFee = async (id: string) => {
    console.log("Chức năng này chưa hỗ trợ")
  };

  const handleToggleFee = async (id: string, active: boolean) => {
    setIsLoading(true);
    try {
      await ParkingService.updateFeeActive(id, active);
      setFees(fees.map(fee => (fee.id === id ? { ...fee, active: !fee.active } : fee)));
      toast.success("Cạp nhật thành công.")
    }catch(e:any){
      toast.error(e.fee_type || "Đã có lỗi vui lòng thử lại sau.")
    }finally {
      setIsLoading(false);
    }
  };

  const fetchFeeRule = async () => {
    setIsLoading(true);
    try{
      const data = await ParkingService.get_fee_rule();
      setFees(data)
    }catch(e){
      console.log("error at fetch fee role: ", e)
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFeeRule()
  },[])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <LoadingOverlay isLoading={isLoading} />

      {/* Header Section */}
      <div className="border-b border-white/20 dark:border-white/10 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-950/50 dark:to-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Quản lý phí đỗ xe
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Quản lý giá phí đỗ xe cho các loại phương tiện</p>
              </div>
            </div>
            <FeeDialog onSave={editingFee ? handleUpdateFee : handleAddFee} editingFee={editingFee} />
          </div>

          {/* Filter Tabs */}
          <FeeFilterTabs fees={fees} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Analytics Cards */}
        <FeeAnalytics fees={fees} />

        {/* Results Summary */}
        <div className="my-4">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-semibold text-foreground">{filteredFees.length}</span> phí
          </p>
        </div>

        {/* Fee Table */}
        <FeeTable
          fees={filteredFees}
          onEdit={setEditingFee}
          onDelete={handleDeleteFee}
          onToggle={handleToggleFee}
        />
      </div>
    </main>
  );
}
