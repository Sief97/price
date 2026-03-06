import React from "react";
import { useRoute } from "wouter";
import { useCurrentPrices } from "@/hooks/use-prices";
import { PriceCard } from "@/components/shared/PriceCard";
import { AdSlot } from "@/components/shared/AdSlot";
import { Coins, Globe2, Fuel, Lightbulb, ShoppingCart, Smartphone, HardHat, Ticket, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const CATEGORY_MAP: Record<string, { name: string; exactMatch?: string; icon: React.ElementType }> = {
  "metals-currency": { name: "Metals & Currency", exactMatch: "🪙 Metals & Currency", icon: Coins },
  "global-benchmarks": { name: "Global Benchmarks", exactMatch: "🌍 Global Benchmarks", icon: Globe2 },
  "energy-fuel": { name: "Energy & Fuel", exactMatch: "⛽ Energy & Fuel", icon: Fuel },
  "utilities-services": { name: "Utilities & Services", exactMatch: "💡 Utilities & Services", icon: Lightbulb },
  "basic-groceries": { name: "Basic Groceries", exactMatch: "🛒 Basic Groceries & Food", icon: ShoppingCart },
  "tech-electronics": { name: "Tech & Electronics", exactMatch: "📱 Tech & Electronics", icon: Smartphone },
  "construction-agriculture": { name: "Construction & Ag.", exactMatch: "🏗️ Construction & Agriculture", icon: HardHat },
  "digital-subscriptions": { name: "Digital Subscriptions", exactMatch: "🎟️ Digital Subscriptions & Entertainment", icon: Ticket },
};

export default function Category() {
  const [, params] = useRoute("/category/:id");
  const categoryId = params?.id || "";
  const catConfig = CATEGORY_MAP[categoryId];
  
  const { currentPrices, isLoading } = useCurrentPrices();

  if (!catConfig) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  const Icon = catConfig.icon;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-card rounded-xl border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  // Filter items. We check exactMatch or fallback to partial includes
  const filteredItems = currentPrices?.filter(item => 
    catConfig.exactMatch 
      ? item.category === catConfig.exactMatch 
      : item.category.includes(catConfig.name)
  ) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 bg-card/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        
        <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium w-fit mb-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="p-4 bg-background border border-white/5 rounded-xl shadow-lg">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{catConfig.name}</h1>
            <p className="text-muted-foreground mt-1">{filteredItems.length} markets tracked</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <PriceCard key={item.item_id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-white/5 rounded-2xl bg-card/30">
              <p className="text-muted-foreground">No data currently available for this category.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AdSlot variant="sidebar" />
          
          <div className="p-6 rounded-2xl border border-white/5 bg-card/50">
            <h3 className="font-semibold mb-4 text-foreground/90">Market Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Total Assets</span>
                <span className="font-mono font-medium">{filteredItems.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Advancing</span>
                <span className="font-mono font-medium text-success">
                  {filteredItems.filter(i => i.changePercent > 0).length}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Declining</span>
                <span className="font-mono font-medium text-destructive">
                  {filteredItems.filter(i => i.changePercent < 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
