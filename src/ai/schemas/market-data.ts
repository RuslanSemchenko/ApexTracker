/**
 * @fileOverview Zod schemas and TypeScript types for the market data AI flow.
 *
 * - MarketDataInputSchema - Zod schema for the input of the getMarketData function.
 * - MarketDataInput - The TypeScript type for the getMarketData function's input.
 * - MarketDataOutputSchema - Zod schema for the output of the getMarketData function.
 * - MarketDataOutput - The TypeScript type for the getMarketData function's return value.
 */

import { z } from 'zod';

export const MarketDataInputSchema = z.object({
  symbols: z.array(z.string()).describe('An array of currency ticker symbols (e.g., ["BTC", "USD", "EUR"]).'),
});
export type MarketDataInput = z.infer<typeof MarketDataInputSchema>;

export const MarketDataOutputSchema = z.array(
  z.object({
    symbol: z.string().describe('The currency ticker symbol.'),
    price: z.number().describe('The current price of the currency in USD.'),
  })
);
export type MarketDataOutput = z.infer<typeof MarketDataOutputSchema>;
