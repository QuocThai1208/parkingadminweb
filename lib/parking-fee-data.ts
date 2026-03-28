export type FeeType = 'MOTORCYCLE' | 'CAR' | 'TRUCK' | 'BUS';

export interface ParkingFee {
  id: string;
  fee_type: FeeType;
  amount: number;
  active: boolean;
  effective_from: string;
  effective_to: string;
}

export const FEE_TYPE_LABELS: Record<FeeType, string> = {
  MOTORCYCLE: 'Xe máy',
  CAR: 'Ô tô',
  TRUCK: 'Xe tải',
  BUS: 'Xe bus',
};

export const filterFeesByType = (fees: ParkingFee[], type: FeeType | 'ALL') => {
  if (type === 'ALL') return fees;
  return fees.filter(fee => fee.fee_type === type);
};

export const getActiveFees = (fees: ParkingFee[]) => {
  return fees.filter(fee => fee.active);
};

export const getInactiveFees = (fees: ParkingFee[]) => {
  return fees.filter(fee => !fee.active);
};

export const getMaxAmount = (fees: ParkingFee[]) => {
  if (fees.length === 0) return 0;
  return Math.max(...fees.map(fee => fee.amount));
};

export const getExpiringSoon = (fees: ParkingFee[]) => {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  return fees.filter(fee => {
    const expireDate = new Date(fee.effective_to);
    return expireDate <= thirtyDaysLater && expireDate >= today;
  });
};
