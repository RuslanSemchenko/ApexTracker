import { Bitcoin, DollarSign, Euro, JapaneseYen, PoundSterling } from 'lucide-react';

import { DogecoinIcon, EthereumIcon } from '@/components/icons';
import type { Currency, HistoricalDataPoint, TimeRange } from '@/lib/types';

const generateHistoricalData = (
  basePrice: number,
  days: number,
  points: number
): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  for (let i = 0; i < points; i++) {
    const time = now - ((points - i - 1) * (days * 24 * 60 * 60 * 1000)) / points;
    const volatility = 0.1 * Math.sqrt(days / 365);
    const price = basePrice * (1 + (Math.random() - 0.5) * volatility * Math.sqrt(i / points));
    data.push({ time, price: parseFloat(price.toFixed(4)) });
  }
  return data;
};

// Placeholder icons for currencies not in lucide-react
const CurrencyIconPlaceholder = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8V16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const initialCurrencies: Omit<Currency, 'historicalData' | 'change24h'>[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 68123.45, icon: Bitcoin },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3542.89, icon: EthereumIcon },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 172.85, icon: CurrencyIconPlaceholder },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', price: 0.52, icon: CurrencyIconPlaceholder },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.45, icon: CurrencyIconPlaceholder },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.16, icon: DogecoinIcon },
  { id: 'usd', name: 'US Dollar', symbol: 'USD', price: 1.0, icon: DollarSign },
  { id: 'eur', name: 'Euro', symbol: 'EUR', price: 1.08, icon: Euro },
  { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY', price: 0.0064, icon: JapaneseYen },
  { id: 'gbp', name: 'British Pound', symbol: 'GBP', price: 1.27, icon: PoundSterling },
  { id: 'aud', name: 'Australian Dollar', symbol: 'AUD', price: 0.66, icon: CurrencyIconPlaceholder },
  { id: 'cad', name: 'Canadian Dollar', symbol: 'CAD', price: 0.73, icon: CurrencyIconPlaceholder },
];

const timeRanges: { key: TimeRange; days: number; points: number }[] = [
  { key: '24h', days: 1, points: 24 },
  { key: '7d', days: 7, points: 84 },
  { key: '1M', days: 30, points: 90 },
  { key: '1Y', days: 365, points: 120 },
];

export const getInitialCurrencies = (): Currency[] => {
  return initialCurrencies.map(c => {
    const historicalData = Object.fromEntries(
      timeRanges.map(({ key, days, points }) => [
        key,
        generateHistoricalData(c.price, days, points),
      ])
    ) as Record<TimeRange, HistoricalDataPoint[]>;

    const oldPrice24h = historicalData['24h'][0].price;
    const change24h = ((c.price - oldPrice24h) / oldPrice24h) * 100;

    return {
      ...c,
      historicalData,
      change24h,
    };
  });
};
