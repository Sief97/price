import React, { useEffect } from "react";
import { Link } from "wouter";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/useLanguage";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Marquee } from "./Marquee";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isArabic } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          {/* Logo + Ticker Bar */}
          <div className="h-14 md:h-16 bg-card border-b border-border flex items-center flex-shrink-0 sticky top-0 z-40">
            {/* Fixed Logo Section */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group px-4 md:px-6 flex-shrink-0">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm md:text-base">
                P
              </div>
              <div className="flex flex-col hidden sm:block">
                <span className="font-bold text-sm md:text-base leading-tight text-foreground">Price.eg</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  {isArabic ? 'أرشيف' : 'Archive'}
                </span>
              </div>
            </Link>

            {/* Scrolling Ticker */}
            <Marquee />
          </div>

          <Header />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-card/40 via-background to-background">
            <div className="max-w-7xl mx-auto p-3 md:p-6 lg:p-8 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
