import type { LucideIcon } from 'lucide-react';

export type TimeRange = '24h' | '7d' | '1M' | '1Y';

export type HistoricalDataPoint = {
  time: number;
  price: number;
};

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: React.ComponentType<{ className?: string }> | LucideIcon;
  historicalData: Record<TimeRange, HistoricalDataPoint[]>;
}

export interface Alert {
  id: string;
  currencyId: string;
  currencySymbol: string;
  targetPercentage: number;
  initialPrice: number;
  direction: 'up' | 'down';
}
