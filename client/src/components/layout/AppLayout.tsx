import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Marquee } from "./Marquee";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <Marquee />
          <Header />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-card/40 via-background to-background">
            <div className="max-w-7xl mx-auto p-4 md:p-8 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
