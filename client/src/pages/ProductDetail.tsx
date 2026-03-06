import React, { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { usePriceHistory } from "@/hooks/use-prices";
import { AdSlot } from "@/components/shared/AdSlot";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Info, Calendar, Activity } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { format, subYears, isAfter } from "date-fns";

type TimeFrame = '1Y' | 'ALL';

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const decodedId = params?.id ? decodeURIComponent(params.id) : "";
  
  const { history, isLoading } = usePriceHistory(decodedId);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1Y');

  const chartData = useMemo(() => {
    if (!history?.events) return [];
    
    let filtered = history.events;
    
    if (timeframe === '1Y') {
      const oneYearAgo = subYears(new Date(), 1);
      filtered = filtered.filter(event => isAfter(new Date(event.date), oneYearAgo));
    }

    return filtered.map(e => ({
      date: e.date,
      formattedDate: format(new Date(e.date), "MMM dd, yyyy"),
      price: e.price,
    }));
  }, [history, timeframe]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-card rounded-2xl" />
        <div className="h-[400px] bg-card rounded-2xl" />
      </div>
    );
  }

  if (!history || !history.latest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  const { latest, change, changePercent, isGlobal } = history;
  const isUp = change > 0;
  const isDown = change < 0;
  const isFlat = change === 0;
  const currencySymbol = isGlobal ? "$" : "E£";
  
  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-4 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-muted-foreground text-xs mb-2 font-medium">{payload[0].payload.formattedDate}</p>
          <p className="text-2xl font-mono font-bold text-foreground">
            {currencySymbol}{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Back nav */}
      <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Market
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Header Card */}
          <div className="bg-card border border-border p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className={`absolute right-0 top-0 w-64 h-64 blur-3xl opacity-5 pointer-events-none rounded-full ${isUp ? 'bg-success' : isDown ? 'bg-destructive' : 'bg-primary'}`} />
            
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-white/5 text-muted-foreground border border-white/10">
                    {latest.category}
                  </span>
                  {isGlobal && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Global Asset
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                  {latest.nameAr}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> per {latest.unit}
                </p>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-muted-foreground font-mono text-xl">{currencySymbol}</span>
                  <span className="text-4xl md:text-5xl font-mono font-bold tracking-tighter">
                    {latest.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                </div>
                
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold
                  ${isUp ? 'bg-success/15 text-success' : isDown ? 'bg-destructive/15 text-destructive' : 'bg-muted text-muted-foreground'}
                `}>
                  {isUp && <TrendingUp className="w-4 h-4" />}
                  {isDown && <TrendingDown className="w-4 h-4" />}
                  {isFlat && <Minus className="w-4 h-4" />}
                  <span>{currencySymbol}{Math.abs(change).toLocaleString()}</span>
                  <span className="mx-1 opacity-50">•</span>
                  <span>{Math.abs(changePercent).toFixed(2)}%</span>
                  <span className="ml-1 text-[10px] uppercase opacity-70">(Latest)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-card border border-border p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Historical Performance
              </h2>
              
              <div className="flex p-1 bg-background border border-border rounded-lg">
                {(['1Y', 'ALL'] as TimeFrame[]).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`
                      px-4 py-1.5 rounded-md text-xs font-bold transition-all
                      ${timeframe === tf ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}
                    `}
                  >
                    {tf === '1Y' ? '1 Year' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? 'hsl(var(--success))' : isDown ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isUp ? 'hsl(var(--success))' : isDown ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => format(new Date(val), "MMM yy")}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      minTickGap={40}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isUp ? 'hsl(var(--success))' : isDown ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                  Not enough historical data for this timeframe.
                </div>
              )}
            </div>
          </div>

          <AdSlot variant="banner" className="h-24" />

        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Asset Information
            </h3>
            
            <div className="space-y-4">
              {latest.description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {latest.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">
                  No detailed description provided for this market asset.
                </p>
              )}

              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Last Updated</span>
                  <span className="font-mono">{format(new Date(latest.date), "dd MMM yyyy")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Points</span>
                  <span className="font-mono font-medium">{history.events.length}</span>
                </div>
              </div>
            </div>
          </div>

          <AdSlot variant="sidebar" className="h-80" />
        </div>
      </div>
    </div>
  );
}
