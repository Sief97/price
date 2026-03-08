import React from "react";
import { Link, useLocation } from "wouter";
import { useSidebar } from "@/components/ui/sidebar";
import { 
  Home, 
  DollarSign,
  Coins,
  Fuel, 
  Zap,
  Leaf,
  BarChart3,
  Ticket,
  MapPin,
  Cigarette,
  ShoppingCart,
  TrendingUp,
  Smartphone,
  Building2,
  HardHat,
  Home as HomeLogo
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const CATEGORIES = [
  { id: "currencies", name: "💱 العملات", icon: DollarSign },
  { id: "crypto", name: "₿ العملات الرقمية", icon: Coins },
  { id: "metals", name: "🥇 المعادن", icon: Coins },
  { id: "fuel", name: "⛽ الوقود", icon: Fuel },
  { id: "electricity", name: "💡 الكهرباء", icon: Zap },
  { id: "vegetables", name: "🥬 الخضار", icon: Leaf },
  { id: "subscriptions", name: "📺 الاشتراكات", icon: Ticket },
  { id: "transport", name: "🚇 المواصلات", icon: MapPin },
  { id: "tobacco", name: "🚬 التبغ", icon: Cigarette },
  { id: "commodities", name: "🛒 السلع الأساسية", icon: ShoppingCart },
  { id: "automotive", name: "🚗 السيارات", icon: TrendingUp },
  { id: "tech", name: "📱 التكنولوجيا", icon: Smartphone },
  { id: "govservices", name: "🏛️ الخدمات الحكومية", icon: Building2 },
  { id: "stocks", name: "📈 البورصة", icon: BarChart3 },
  { id: "bankrates", name: "🏦 أسعار الفائدة", icon: TrendingUp },
  { id: "construction", name: "🏗️ البناء", icon: HardHat },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleNavigation = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar variant="inset" className="border-r border-border bg-sidebar">
      <SidebarContent className="px-3 py-4 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-3">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location === "/"}
                  onClick={handleNavigation}
                  className="rounded-lg data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium transition-all text-sm"
                >
                  <Link href="/">
                    <HomeLogo className="w-4 h-4" />
                    <span>الرئيسية</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-3 border-t border-border mx-0" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-3">
            القطاعات (16)
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
                      onClick={handleNavigation}
                      className="rounded-lg data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-muted transition-all text-sm"
                    >
                      <Link href={path}>
                        <cat.icon className="w-4 h-4" />
                        <span className="text-sm">{cat.name}</span>
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
