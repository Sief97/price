import React from "react";
import { useCurrentPrices } from "@/hooks/use-prices";
import { PriceCard } from "@/components/shared/PriceCard";
import { AdSlot } from "@/components/shared/AdSlot";
import { Activity, TrendingUp, AlertCircle } from "lucide-react";

export default function Home() {
  const { currentPrices, isLoading } = useCurrentPrices();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-card rounded-2xl border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentPrices || currentPrices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Market Data</h2>
        <p className="text-muted-foreground max-w-md">
          Unable to load current market prices. Please ensure the API is connected and returning valid event data.
        </p>
      </div>
    );
  }

  // Determine key highlights (e.g., USD, Gold, Gasoline) for hero cards
  const heroKeywords = ["USD", "Gold 21k", "Gasoline 95", "Bitcoin"];
  const topHighlights = currentPrices
    .filter(p => heroKeywords.some(k => p.nameAr.includes(k)))
    .slice(0, 4);

  // Group rest by category for sectioned display
  const categorized = currentPrices.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof currentPrices>);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Market Pulse</h1>
            <p className="text-sm text-muted-foreground">Key indicators across the Egyptian economy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topHighlights.map(item => (
            <PriceCard key={item.item_id} item={item} featured />
          ))}
        </div>
      </section>

      <AdSlot variant="banner" className="my-8" />

      {/* Categories Grid Overview */}
      <section className="space-y-10">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">All Sectors Overview</h2>
        </div>

        {Object.entries(categorized).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground/80 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.slice(0, 4).map(item => (
                <PriceCard key={item.item_id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
