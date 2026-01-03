"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Alert, Currency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '../ui/scroll-area';

interface AlertsManagerProps {
  alerts: Alert[];
  currencies: Currency[];
  onAddAlert: (alert: Omit<Alert, 'id'>) => void;
  onRemoveAlert: (alertId: string) => void;
}

const alertSchema = z.object({
  currencyId: z.string().min(1, 'Please select a currency.'),
  direction: z.enum(['up', 'down'], { required_error: 'Please select a direction.' }),
  targetPercentage: z.coerce.number().positive('Percentage must be a positive number.'),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export function AlertsManager({
  alerts,
  currencies,
  onAddAlert,
  onRemoveAlert,
}: AlertsManagerProps) {
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      direction: 'up',
      targetPercentage: 5,
    },
  });

  function onSubmit(data: AlertFormValues) {
    const currency = currencies.find((c) => c.id === data.currencyId);
    if (!currency) return;

    onAddAlert({
      currencyId: data.currencyId,
      currencySymbol: currency.symbol,
      direction: data.direction,
      targetPercentage: data.targetPercentage,
      initialPrice: currency.price,
    });
    form.reset();
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>Get notified on significant price changes.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="targetPercentage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Change %</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Direction</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-2 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="up" />
                          </FormControl>
                          <FormLabel className="font-normal">Up</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="down" />
                          </FormControl>
                          <FormLabel className="font-normal">Down</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Alert
            </Button>
          </form>
        </Form>
        <div className="flex-grow flex flex-col">
            <h3 className="text-sm font-medium mb-2">Active Alerts</h3>
            <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-2">
            {alerts.length > 0 ? (
                alerts.map((alert) => (
                <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                    <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        <span className="font-semibold">{alert.currencySymbol}</span> change{' '}
                        {alert.direction === 'up' ? '>=' : '<='} {alert.targetPercentage}%
                    </p>
                    </div>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemoveAlert(alert.id)}
                    aria-label={`Remove ${alert.currencySymbol} alert`}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No active alerts.</p>
            )}
            </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
