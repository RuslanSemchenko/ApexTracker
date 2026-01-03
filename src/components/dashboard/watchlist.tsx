"use client";

import * as React from 'react';
import { MoreHorizontal, PlusCircle, TrendingDown, TrendingUp, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Currency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WatchlistProps {
  watchlist: Currency[];
  allCurrencies: Currency[];
  onRemove: (currencyId: string) => void;
  onAdd: (currencyId: string) => void;
  onSelect: (currencyId: string) => void;
  selectedCurrencyId: string | null;
}

const PriceChange = ({ change }: { change: number }) => {
  const isPositive = change >= 0;
  return (
    <span
      className={cn(
        'flex items-center gap-1 text-sm font-medium',
        isPositive ? 'text-green-500' : 'text-red-500'
      )}
    >
      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      {change.toFixed(2)}%
    </span>
  );
};

export function Watchlist({
  watchlist,
  allCurrencies,
  onRemove,
  onAdd,
  onSelect,
  selectedCurrencyId,
}: WatchlistProps) {
  const availableToAdd = allCurrencies.filter(
    (currency) => !watchlist.some((w) => w.id === currency.id)
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Your curated list of currencies.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow">
          <div className="space-y-2 px-6 pb-6">
            {watchlist.length > 0 ? (
              watchlist.map((currency) => (
                <div
                  key={currency.id}
                  onClick={() => onSelect(currency.id)}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                    selectedCurrencyId === currency.id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  )}
                >
                  <currency.icon className="h-8 w-8" />
                  <div className="flex-1">
                    <p className="font-semibold">{currency.symbol}</p>
                    <p className="text-sm text-muted-foreground">{currency.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${currency.price.toFixed(2)}</p>
                    <PriceChange change={currency.change24h} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(currency.id);
                    }}
                    aria-label={`Remove ${currency.name} from watchlist`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">Your watchlist is empty.</p>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Watchlist
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <ScrollArea className="h-64">
                <div className="p-2">
                  {availableToAdd.length > 0 ? (
                    availableToAdd.map((currency) => (
                      <Button
                        key={currency.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => onAdd(currency.id)}
                      >
                        <currency.icon className="h-5 w-5 mr-2" />
                        {currency.name} ({currency.symbol})
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center p-4">
                      All currencies are in your watchlist.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
