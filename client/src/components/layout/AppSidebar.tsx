import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Coins, 
  Globe2, 
  Fuel, 
  Lightbulb, 
  ShoppingCart, 
  Smartphone, 
  HardHat, 
  Ticket
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const CATEGORIES = [
  { id: "metals-currency", name: "Metals & Currency", icon: Coins },
  { id: "global-benchmarks", name: "Global Benchmarks", icon: Globe2 },
  { id: "energy-fuel", name: "Energy & Fuel", icon: Fuel },
  { id: "utilities-services", name: "Utilities & Services", icon: Lightbulb },
  { id: "basic-groceries", name: "Basic Groceries", icon: ShoppingCart },
  { id: "tech-electronics", name: "Tech & Electronics", icon: Smartphone },
  { id: "construction-agriculture", name: "Construction", icon: HardHat },
  { id: "digital-subscriptions", name: "Subscriptions", icon: Ticket },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar variant="inset" className="border-r border-white/5 bg-sidebar">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 w-full px-4 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg group-hover:shadow-primary/20 transition-all">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none text-sidebar-foreground">Price.eg</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">Archive</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location === "/"}
                  className="rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium transition-all"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    <span>Market Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-4 border-t border-white/5 mx-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-2">
            Sectors
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {CATEGORIES.map((cat) => {
                const path = `/category/${cat.id}`;
                const isActive = location === path;
                return (
                  <SidebarMenuItem key={cat.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-white/5 transition-all"
                    >
                      <Link href={path}>
                        <cat.icon className="w-4 h-4" />
                        <span>{cat.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
