"use client";

import * as React from 'react';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Currency, TimeRange } from '@/lib/types';

interface PriceChartProps {
  currency: Currency | undefined;
}

export function PriceChart({ currency }: PriceChartProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('24h');

  if (!currency) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = currency.historicalData[timeRange];
  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(var(--primary))',
    },
  };

  const yAxisDomain: [number, number] = [
    Math.min(...chartData.map((d) => d.price)) * 0.98,
    Math.max(...chartData.map((d) => d.price)) * 1.02,
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <currency.icon className="h-8 w-8" />
              <CardTitle className="text-2xl">
                {currency.name} ({currency.symbol})
              </CardTitle>
            </div>
            <CardDescription>
              Last price: ${currency.price.toFixed(2)}
            </CardDescription>
          </div>
          <div className={cn(
            'flex items-center gap-1 text-lg font-bold',
             currency.change24h >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {currency.change24h.toFixed(2)}% (24h)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h" onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="mb-4">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
          <TabsContent value={timeRange}>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => {
                    if (timeRange === '24h') return format(new Date(value), 'HH:mm');
                    if (timeRange === '7d' || timeRange === '1M') return format(new Date(value), 'MMM d');
                    return format(new Date(value), 'MMM yy');
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  orientation="right"
                  domain={yAxisDomain}
                  tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="price"
                  type="natural"
                  fill="url(#fillPrice)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
