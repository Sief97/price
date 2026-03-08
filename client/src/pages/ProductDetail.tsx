import React, { useState, useMemo, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { usePriceHistory } from "@/hooks/use-prices";
import { useLanguage } from "@/lib/useLanguage";
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
  const { t, isArabic } = useLanguage();
  
  const { history, isLoading } = usePriceHistory(decodedId);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1Y');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [decodedId]);

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
        <div className="h-32 bg-card rounded-lg" />
        <div className="h-[400px] bg-card rounded-lg" />
      </div>
    );
  }

  if (!history || !history.latest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{t('product_not_found')}</h2>
        <Link href="/" className="text-primary hover:underline">{t('back_to_market')}</Link>
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
        <div className="bg-popover border border-border p-4 rounded-lg shadow-xl backdrop-blur-md">
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
      <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium w-fit transition-colors" dir={isArabic ? 'rtl' : 'ltr'}>
        {isArabic ? <ArrowLeft className="w-4 h-4 rotate-180" /> : <ArrowLeft className="w-4 h-4" />}
        {t('back_to_market')}
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Header Card with Price */}
          <div className="bg-card border border-border p-6 md:p-8 rounded-lg relative overflow-hidden">
            <div className={`absolute ${isArabic ? 'left-0' : 'right-0'} top-0 w-64 h-64 blur-3xl opacity-5 pointer-events-none rounded-full ${isUp ? 'bg-success' : isDown ? 'bg-destructive' : 'bg-primary'}`} />
            
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10" dir={isArabic ? 'rtl' : 'ltr'}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">{latest.category}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{latest.nameAr}</h1>
              </div>
              
              <div className="text-right md:text-left">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {currencySymbol}{latest.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                
                <div className={`flex items-center gap-2 font-semibold text-lg ${isUp ? 'text-success' : isDown ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {isUp ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : isDown ? (
                    <TrendingDown className="w-5 h-5" />
                  ) : (
                    <Minus className="w-5 h-5" />
                  )}
                  {isUp ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-card border border-border p-6 md:p-8 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Price Chart</h2>
              <div className="flex gap-2">
                {(['1Y', 'ALL'] as TimeFrame[]).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      timeframe === tf
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0084ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0084ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(0,0,0,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(0,0,0,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#0084ff" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                {isArabic ? 'لا توجد بيانات' : 'No data available'}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-card border border-border p-6 rounded-lg" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{isArabic ? 'المعلومات' : 'Information'}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{latest.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdSlot variant="sidebar" />
          
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-4 text-foreground">{t('market_summary')}</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">{isArabic ? 'أعلى سعر' : 'High'}</span>
                <span className="font-mono font-medium">{currencySymbol}{Math.max(...chartData.map(d => d.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">{isArabic ? 'أقل سعر' : 'Low'}</span>
                <span className="font-mono font-medium">{currencySymbol}{Math.min(...chartData.map(d => d.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'الوحدة' : 'Unit'}</span>
                <span className="font-mono font-medium">{latest.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
