import React from "react";
import { Link } from "wouter";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrentPrices } from "@/hooks/use-prices";

export function Marquee() {
  const { currentPrices, isLoading } = useCurrentPrices();

  if (isLoading || !currentPrices || currentPrices.length === 0) {
    return (
      <div className="h-10 w-full bg-card border-b border-border flex items-center px-4">
        <div className="w-full h-4 bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  // Double the items to create a seamless loop
  const topMovers = [...currentPrices]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 15);
    
  const tickerItems = [...topMovers, ...topMovers];

  return (
    <div className="h-10 w-full bg-card border-b border-border overflow-hidden flex items-center relative z-40 shadow-md">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {tickerItems.map((item, idx) => {
          const isUp = item.changePercent > 0;
          const isDown = item.changePercent < 0;
          const currency = item.isGlobal ? "$" : "E£";
          
          return (
            <Link 
              key={`${item.item_id}-${idx}`} 
              href={`/product/${encodeURIComponent(item.item_id)}`}
              className="flex items-center gap-3 px-6 border-r border-border hover:bg-muted/20 transition-colors py-2 cursor-pointer whitespace-nowrap"
            >
              <span className="font-medium text-sm text-foreground/90">{item.nameAr}</span>
              <span className="font-mono text-sm font-bold text-foreground">
                {currency}{item.price.toLocaleString()}
              </span>
              <span className={`flex items-center text-xs font-mono font-medium ${isUp ? 'text-success' : isDown ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : isDown ? <TrendingDown className="w-3 h-3 mr-0.5" /> : null}
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
