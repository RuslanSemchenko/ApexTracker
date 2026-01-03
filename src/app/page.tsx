"use client";

import * as React from 'react';

import { useToast } from '@/hooks/use-toast';
import { getInitialCurrencies } from '@/lib/data.tsx';
import type { Alert, Currency } from '@/lib/types';
import { AlertsManager } from '@/components/dashboard/alerts-manager';
import { Header } from '@/components/dashboard/header';
import { PriceChart } from '@/components/dashboard/price-chart';
import { Watchlist } from '@/components/dashboard/watchlist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMarketData } from '@/ai/flows/market-data-flow';

export default function DashboardPage() {
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [watchlist, setWatchlist] = React.useState<Currency[]>([]);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const alertsRef = React.useRef(alerts);
  alertsRef.current = alerts;

  React.useEffect(() => {
    const initialData = getInitialCurrencies();
    setCurrencies(initialData);
    setWatchlist(initialData.slice(0, 5));
    setSelectedCurrencyId(initialData[0].id);
  }, []);

  React.useEffect(() => {
    const updatePrices = async () => {
      const symbols = currencies.map(c => c.symbol);
      if (symbols.length === 0) return;

      try {
        const marketData = await getMarketData({ symbols });
        let triggeredAlerts: string[] = [];
        
        setCurrencies(prevCurrencies => {
          const updatedCurrencies = prevCurrencies.map(currency => {
            const newPriceData = marketData.find(d => d.symbol === currency.symbol);
            if (newPriceData) {
              const newPrice = newPriceData.price;
              const oldPrice24h = currency.historicalData['24h'][0].price;
              const newChange24h = ((newPrice - oldPrice24h) / oldPrice24h) * 100;

              const newHistoricalData = { ...currency.historicalData };
              const now = Date.now();
              newHistoricalData['24h'] = [...newHistoricalData['24h'].slice(1), { time: now, price: newPrice }];
              
              const updatedCurrency = { ...currency, price: newPrice, change24h: newChange24h, historicalData: newHistoricalData };

              alertsRef.current.forEach(alert => {
                if (alert.currencyId === updatedCurrency.id) {
                  const priceChangePercentage = ((updatedCurrency.price - alert.initialPrice) / alert.initialPrice) * 100;
                  
                  const hasTriggered = (alert.direction === 'up' && priceChangePercentage >= alert.targetPercentage) ||
                                       (alert.direction === 'down' && priceChangePercentage <= -alert.targetPercentage);
                  
                  if (hasTriggered) {
                    toast({
                      title: `🚨 Price Alert: ${updatedCurrency.symbol}`,
                      description: `${updatedCurrency.name} price changed by ${alert.direction === 'up' ? 'more than' : 'less than'} ${alert.targetPercentage}%. Current price: $${updatedCurrency.price.toFixed(2)}`,
                    });
                    triggeredAlerts.push(alert.id);
                  }
                }
              });

              return updatedCurrency;
            }
            return currency;
          });

          if (triggeredAlerts.length > 0) {
            setAlerts(prevAlerts => prevAlerts.filter(a => !triggeredAlerts.includes(a.id)));
          }

          return updatedCurrencies;
        });

      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };

    const interval = setInterval(updatePrices, 5000); // Update every 5 seconds
    
    // Initial fetch
    if (currencies.length > 0) {
      updatePrices();
    }

    return () => clearInterval(interval);
  }, [currencies, toast]);


  const handleSelectCurrency = (currencyId: string) => {
    setSelectedCurrencyId(currencyId);
  };

  const handleAddToWatchlist = (currencyId: string) => {
    const currencyToAdd = currencies.find(c => c.id === currencyId);
    if (currencyToAdd && !watchlist.find(w => w.id === currencyId)) {
      setWatchlist([...watchlist, currencyToAdd]);
    }
  };

  const handleRemoveFromWatchlist = (currencyId: string) => {
    setWatchlist(prevWatchlist => {
      const newWatchlist = prevWatchlist.filter(c => c.id !== currencyId);
      if (selectedCurrencyId === currencyId) {
        if (newWatchlist.length > 0) {
          setSelectedCurrencyId(newWatchlist[0].id);
        } else {
          const remainingCurrencies = currencies.filter(c => !newWatchlist.some(w => w.id === c.id));
          setSelectedCurrencyId(remainingCurrencies.length > 0 ? remainingCurrencies[0].id : null);
        }
      }
      return newWatchlist;
    });
  };

  const handleAddAlert = (alert: Omit<Alert, 'id'>) => {
    setAlerts([...alerts, { ...alert, id: `alert-${Date.now()}` }]);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };
  
  const selectedCurrency = currencies.find(c => c.id === selectedCurrencyId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PriceChart currency={selectedCurrency} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Tabs defaultValue="watchlist" className="flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="watchlist" className="flex-grow">
                <Watchlist
                  watchlist={watchlist.map(wc => currencies.find(c => c.id === wc.id)!)}
                  allCurrencies={currencies}
                  onRemove={handleRemoveFromWatchlist}
                  onAdd={handleAddToWatchlist}
                  onSelect={handleSelectCurrency}
                  selectedCurrencyId={selectedCurrencyId}
                />
              </TabsContent>
              <TabsContent value="alerts" className="flex-grow">
                <AlertsManager
                  alerts={alerts}
                  currencies={currencies}
                  onAddAlert={handleAddAlert}
                  onRemoveAlert={handleRemoveAlert}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
