import React from "react";
import { useCurrentPrices } from "@/hooks/use-prices";
import { Link } from "wouter";
import { AlertCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const { currentPrices, isLoading } = useCurrentPrices();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-card rounded-lg border border-border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-lg border border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentPrices || currentPrices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-3" />
        <h2 className="text-lg md:text-2xl font-bold mb-2">لا توجد بيانات</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          لم نتمكن من تحميل بيانات السوق الحالية.
        </p>
      </div>
    );
  }

  // Select 6 key indicators
  const keyIndicators = [
    currentPrices.find(p => p.item_id === "cur_usd_bank"),
    currentPrices.find(p => p.item_id === "metal_gold21"),
    currentPrices.find(p => p.item_id === "fuel_95"),
    currentPrices.find(p => p.item_id === "crypto_btc"),
    currentPrices.find(p => p.item_id === "stock_egx30"),
    currentPrices.find(p => p.item_id === "bank_corridor"),
  ].filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary/10 rounded">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">أبرز المؤشرات</h1>
        </div>
        <p className="text-sm text-muted-foreground">أهم المؤشرات الاقتصادية المصرية</p>
      </div>

      {/* 6 Key Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {keyIndicators.map(item => item && (
          <Link key={item.item_id} href={`/product/${item.item_id}`}>
            <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{item.category}</p>
                  <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2">{item.nameAr}</h3>
                </div>
                <div className="mt-3">
                  <p className="text-lg md:text-2xl font-bold text-primary">{item.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.unit}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Browse by Category */}
      <div className="mt-8 border-t border-border pt-6">
        <h2 className="text-lg md:text-xl font-bold mb-4">جميع القطاعات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {Array.from(new Set(currentPrices.map(p => p.category))).slice(0, 8).map(category => (
            <Link key={category} href={`/category/${category.split(' ')[category.split(' ').length - 1].toLowerCase()}`}>
              <div className="p-3 bg-card border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all cursor-pointer text-center">
                <p className="text-sm md:text-base font-semibold text-foreground truncate">{category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
