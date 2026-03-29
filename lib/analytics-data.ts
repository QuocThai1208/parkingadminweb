export interface RevenueMetric {
  amount: number;
}

export interface OccupancyMetric {
  occupied: number;
  available: number;
  total: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface RevenueChartData {
  daily: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface LeaderboardEntry {
  full_name: string;
  email: string;
  revenue: number;
}

export const revenueData: RevenueMetric = {
  amount: 487250000,
};

export const revenueCompareData = {
  revenue: 425300000,
  change: 14.6,
  period: 'so với tháng trước'
};

export const parkingLogsData = {
  total: 12847,
  change: 8.2,
  period: 'vs Yesterday'
};

export const totalCustomersData = {
  total: 3284,
  change: 5.4,
  period: 'vs Last Month'
};

export const occupancyData: OccupancyMetric = {
  occupied: 156,
  available: 144,
  total: 300
};

export const revenueChartData = {
  daily: [
    { name: 'Mon', value: 4200000, value2: 3800000 },
    { name: 'Tue', value: 4500000, value2: 4100000 },
    { name: 'Wed', value: 5100000, value2: 4600000 },
    { name: 'Thu', value: 4800000, value2: 4200000 },
    { name: 'Fri', value: 5800000, value2: 5300000 },
    { name: 'Sat', value: 6200000, value2: 5700000 },
    { name: 'Sun', value: 5900000, value2: 5400000 },
  ],
  monthly: [
    { name: 'Jan', value: 45200000, value2: 38500000 },
    { name: 'Feb', value: 48700000, value2: 41200000 },
    { name: 'Mar', value: 52100000, value2: 44600000 },
    { name: 'Apr', value: 51800000, value2: 43200000 },
    { name: 'May', value: 58200000, value2: 50300000 },
    { name: 'Jun', value: 62300000, value2: 54100000 },
    { name: 'Jul', value: 59800000, value2: 51400000 },
    { name: 'Aug', value: 61500000, value2: 52800000 },
    { name: 'Sep', value: 58900000, value2: 50200000 },
    { name: 'Oct', value: 63200000, value2: 54900000 },
    { name: 'Nov', value: 62800000, value2: 53400000 },
    { name: 'Dec', value: 68100000, value2: 58700000 },
  ]
};

export const vehicleTypeData = [
  { name: 'Motorcycle', value: 45, revenue: 219400000 },
  { name: 'Car', value: 38, revenue: 185300000 },
  { name: 'Truck', value: 17, revenue: 82550000 },
];

export const peakHoursData = [
  { name: '00:00', value: 12 },
  { name: '01:00', value: 8 },
  { name: '02:00', value: 5 },
  { name: '03:00', value: 4 },
  { name: '04:00', value: 6 },
  { name: '05:00', value: 15 },
  { name: '06:00', value: 35 },
  { name: '07:00', value: 68 },
  { name: '08:00', value: 92 },
  { name: '09:00', value: 88 },
  { name: '10:00', value: 85 },
  { name: '11:00', value: 78 },
  { name: '12:00', value: 95 },
  { name: '13:00', value: 82 },
  { name: '14:00', value: 75 },
  { name: '15:00', value: 88 },
  { name: '16:00', value: 92 },
  { name: '17:00', value: 98 },
  { name: '18:00', value: 102 },
  { name: '19:00', value: 95 },
  { name: '20:00', value: 78 },
  { name: '21:00', value: 65 },
  { name: '22:00', value: 48 },
  { name: '23:00', value: 32 },
];
