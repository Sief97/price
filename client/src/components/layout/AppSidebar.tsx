import React from "react";
import { Link, useLocation } from "wouter";
import { useSidebar } from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/useLanguage";
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
  Globe2,
  Settings
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
  { id: "currencies", name: "💱 العملات", nameEn: "Currencies", icon: DollarSign },
  { id: "crypto", name: "₿ العملات الرقمية", nameEn: "Crypto", icon: Coins },
  { id: "metals", name: "🥇 المعادن", nameEn: "Metals", icon: Coins },
  { id: "fuel", name: "⛽ الوقود", nameEn: "Fuel", icon: Fuel },
  { id: "electricity", name: "💡 الكهرباء", nameEn: "Electricity", icon: Zap },
  { id: "vegetables", name: "🥬 الخضار", nameEn: "Vegetables", icon: Leaf },
  { id: "subscriptions", name: "📺 الاشتراكات", nameEn: "Subscriptions", icon: Ticket },
  { id: "transport", name: "🚇 المواصلات", nameEn: "Transport", icon: MapPin },
  { id: "tobacco", name: "🚬 التبغ", nameEn: "Tobacco", icon: Cigarette },
  { id: "commodities", name: "🛒 السلع الأساسية", nameEn: "Commodities", icon: ShoppingCart },
  { id: "automotive", name: "🚗 السيارات", nameEn: "Automotive", icon: TrendingUp },
  { id: "tech", name: "📱 التكنولوجيا", nameEn: "Technology", icon: Smartphone },
  { id: "govservices", name: "🏛️ الخدمات الحكومية", nameEn: "Government", icon: Building2 },
  { id: "stocks", name: "📈 البورصة", nameEn: "Stocks", icon: BarChart3 },
  { id: "bankrates", name: "🏦 أسعار الفائدة", nameEn: "Bank Rates", icon: TrendingUp },
  { id: "construction", name: "🏗️ البناء", nameEn: "Construction", icon: HardHat },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { setOpenMobile } = useSidebar();
  const { isArabic, language, setLanguage, t } = useLanguage();

  const handleNavigation = () => {
    setOpenMobile(false);
  };

  const toggleLanguage = () => {
    setLanguage(isArabic ? 'en' : 'ar');
  };

  return (
    <Sidebar variant="inset" className="border-r border-border bg-sidebar bg-opacity-100 backdrop-blur-0">
      <SidebarContent className="px-3 py-4 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-3">
            {isArabic ? 'القائمة الرئيسية' : 'Main Menu'}
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
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span>{t('home')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-3 border-t border-border mx-0" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70 font-bold mb-3">
            {isArabic ? 'القطاعات (16)' : 'Sectors (16)'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {CATEGORIES.map((cat) => {
                const path = `/category/${cat.id}`;
                const isActive = location === path;
                const displayName = isArabic ? cat.name : cat.nameEn;
                return (
                  <SidebarMenuItem key={cat.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      onClick={handleNavigation}
                      className="rounded-lg data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-muted transition-all text-sm"
                    >
                      <Link href={path}>
                        <cat.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{displayName}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Language Switcher */}
        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Globe2 className="w-4 h-4" />
            <span>{isArabic ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
