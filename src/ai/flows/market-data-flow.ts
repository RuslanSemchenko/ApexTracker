'use server';
/**
 * @fileOverview An AI flow to get simulated real-time market data for currencies.
 *
 * - getMarketData - A function that returns simulated market prices for a list of currency symbols.
 */

import { ai } from '@/ai/genkit';
import {
  MarketDataInputSchema,
  type MarketDataInput,
  MarketDataOutputSchema,
  type MarketDataOutput,
} from '@/ai/schemas/market-data';
import { z } from 'zod';
import { getInitialCurrencies } from '@/lib/data.tsx';

// In a real app, this would fetch from a live API.
// For this demo, we simulate it by finding the base price and adding a small random fluctuation.
const allCurrencies = getInitialCurrencies();
const getLivePriceTool = ai.defineTool(
  {
    name: 'getLivePrice',
    description: 'Get the current market price for a single currency symbol.',
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ price: z.number() }),
  },
  async ({ symbol }) => {
    const currency = allCurrencies.find((c) => c.symbol === symbol);
    const basePrice = currency?.price || 0;
    // Simulate real-time fluctuation
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    return { price };
  }
);


export async function getMarketData(input: MarketDataInput): Promise<MarketDataOutput> {
  // To avoid hitting the API rate limit on the free tier, we will simulate the price updates
  // directly here instead of calling the AI.
  // In a real application with a paid plan, you would use the flow as intended.
  const marketData = input.symbols.map(symbol => {
    const currency = allCurrencies.find(c => c.symbol === symbol);
    const basePrice = currency?.price || 0;
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.01); // Simulate fluctuation
    return { symbol, price };
  });
  return Promise.resolve(marketData);
}

const prompt = ai.definePrompt({
  name: 'marketDataPrompt',
  input: { schema: MarketDataInputSchema },
  output: { schema: MarketDataOutputSchema },
  tools: [getLivePriceTool],
  prompt: `You are a financial data provider. Your task is to provide the current, real-world market prices in USD for the following currency symbols: {{{json symbols}}}.

Use the getLivePrice tool for each symbol to get the most accurate, up-to-the-minute price.

Return the data as a JSON array of objects, where each object contains the 'symbol' and its current 'price'.`,
});

// This flow is currently not used directly to avoid rate limiting issues on the free tier.
// The getMarketData function above simulates the behavior.
const getMarketDataFlow = ai.defineFlow(
  {
    name: 'getMarketDataFlow',
    inputSchema: MarketDataInputSchema,
    outputSchema: MarketDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
