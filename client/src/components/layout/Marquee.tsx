import React from "react";
import { Link } from "wouter";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrentPrices } from "@/hooks/use-prices";
import { useLanguage } from "@/lib/useLanguage";

export function Marquee() {
  const { currentPrices, isLoading } = useCurrentPrices();
  const { isArabic } = useLanguage();

  if (isLoading || !currentPrices || currentPrices.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center px-4 border-l border-border">
        <div className="w-full h-4 bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  // Double the items to create a seamless loop
  const topMovers = [...currentPrices]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 12);
    
  const tickerItems = [...topMovers, ...topMovers];

  return (
    <div className="flex-1 h-full overflow-hidden flex items-center relative border-l border-border bg-card">
      <div className={`absolute ${isArabic ? 'right-0' : 'left-0'} top-0 bottom-0 w-12 ${isArabic ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-card to-transparent z-10 pointer-events-none`} />
      <div className={`absolute ${isArabic ? 'left-0' : 'right-0'} top-0 bottom-0 w-12 ${isArabic ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-card to-transparent z-10 pointer-events-none`} />
      
      <div className={`flex w-max animate-marquee hover:[animation-play-state:paused] ${isArabic ? 'flex-row-reverse' : ''}`}>
        {tickerItems.map((item, idx) => {
          const isUp = item.changePercent > 0;
          const isDown = item.changePercent < 0;
          const currency = item.isGlobal ? "$" : "E£";
          
          return (
            <Link 
              key={`${item.item_id}-${idx}`} 
              href={`/product/${encodeURIComponent(item.item_id)}`}
              className="flex items-center gap-3 px-6 border-l border-border hover:bg-muted/20 transition-colors py-2 cursor-pointer whitespace-nowrap"
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
