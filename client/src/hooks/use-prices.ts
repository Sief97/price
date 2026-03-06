import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// The schema is expected from the shared routes, but we define the type structure here based on context
export type PriceEvent = {
  item_id: string;
  nameAr: string;
  category: string;
  unit: string;
  date: string;
  price: number;
  description?: string;
};

export type CurrentPrice = PriceEvent & {
  previousPrice?: number;
  change: number;
  changePercent: number;
  isGlobal: boolean;
};

// Raw fetch hook
export function useRawPrices() {
  return useQuery({
    queryKey: [api.prices.list.path],
    queryFn: async () => {
      const res = await fetch(api.prices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();
      return api.prices.list.responses[200].parse(data) as PriceEvent[];
    },
  });
}

// Processed current prices
export function useCurrentPrices() {
  const { data: rawData, isLoading, error } = useRawPrices();

  const currentPrices = React.useMemo(() => {
    if (!rawData) return [];

    // Group by item_id
    const grouped = rawData.reduce((acc, curr) => {
      if (!acc[curr.item_id]) acc[curr.item_id] = [];
      acc[curr.item_id].push(curr);
      return acc;
    }, {} as Record<string, PriceEvent[]>);

    // Get latest and previous for each item
    const processed: CurrentPrice[] = Object.values(grouped).map((events) => {
      // Sort chronologically
      const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const latest = sorted[sorted.length - 1];
      const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;

      const change = latest.price - previous.price;
      const changePercent = previous.price !== 0 ? (change / previous.price) * 100 : 0;
      
      const isGlobal = latest.category.includes("Global") || latest.category === "🌍 Global Benchmarks" || latest.unit.includes("USD");

      return {
        ...latest,
        previousPrice: previous.price,
        change,
        changePercent,
        isGlobal,
      };
    });

    // Sort by name for consistency
    return processed.sort((a, b) => a.nameAr.localeCompare(b.nameAr));
  }, [rawData]);

  return { currentPrices, isLoading, error };
}

// Single item history hook
export function usePriceHistory(itemId: string) {
  const { data: rawData, isLoading } = useRawPrices();

  const history = React.useMemo(() => {
    if (!rawData) return null;
    
    const events = rawData.filter((e) => e.item_id === itemId);
    if (events.length === 0) return null;

    // Sort chronologically
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;
    
    const change = latest.price - previous.price;
    const changePercent = previous.price !== 0 ? (change / previous.price) * 100 : 0;
    const isGlobal = latest.category.includes("Global") || latest.category === "🌍 Global Benchmarks" || latest.unit.includes("USD");

    return {
      events: sorted,
      latest,
      change,
      changePercent,
      isGlobal,
    };
  }, [rawData, itemId]);

  return { history, isLoading };
}
