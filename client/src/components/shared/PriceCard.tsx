import React from "react";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CurrentPrice } from "@/hooks/use-prices";

interface PriceCardProps {
  item: CurrentPrice;
  featured?: boolean;
}

export function PriceCard({ item, featured = false }: PriceCardProps) {
  const isUp = item.changePercent > 0;
  const isDown = item.changePercent < 0;
  const isFlat = item.changePercent === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: price < 10 ? 2 : 0,
      maximumFractionDigits: price < 10 ? 4 : 2,
    }).format(price);
  };

  const formattedPrice = formatPrice(item.price);
  const currencySymbol = item.isGlobal ? "$" : "E£";

  return (
    <Link 
      href={`/product/${encodeURIComponent(item.item_id)}`}
      className={`
        block relative overflow-hidden rounded-2xl border border-white/5 
        bg-card hover-elevate group cursor-pointer transition-colors
        ${featured ? 'p-6 bg-gradient-to-br from-card to-card/50' : 'p-5'}
      `}
    >
      {/* Subtle background glow based on trend */}
      <div className={`
        absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none
        ${isUp ? 'bg-success' : isDown ? 'bg-destructive' : 'bg-muted'}
      `} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-foreground font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {item.nameAr}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            {item.category}
            {item.isGlobal && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                USD
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-muted-foreground font-mono text-sm">{currencySymbol}</span>
            <span className={`font-mono font-bold tracking-tight ${featured ? 'text-4xl' : 'text-2xl'}`}>
              {formattedPrice}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono mt-1 block">
            per {item.unit}
          </span>
        </div>

        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-lg font-mono text-sm font-medium
          ${isUp ? 'bg-success/10 text-success' : isDown ? 'bg-destructive/10 text-destructive' : 'bg-muted/30 text-muted-foreground'}
        `}>
          {isUp && <TrendingUp className="w-4 h-4" />}
          {isDown && <TrendingDown className="w-4 h-4" />}
          {isFlat && <Minus className="w-4 h-4" />}
          {Math.abs(item.changePercent).toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}
