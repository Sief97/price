import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ArrowRight, Globe2 } from "lucide-react";
import { useCurrentPrices } from "@/hooks/use-prices";
import { useLanguage } from "@/lib/useLanguage";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [, setLocation] = useLocation();
  const { currentPrices } = useCurrentPrices();
  const { toggleSidebar, isMobile } = useSidebar();
  const { isArabic, setLanguage } = useLanguage();

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !currentPrices) return [];
    const query = searchQuery.toLowerCase();
    return currentPrices
      .filter(item => 
        item.nameAr.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, currentPrices]);

  const handleLanguageToggle = () => {
    setLanguage(isArabic ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-14 md:top-16 z-40 w-full border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl relative">
          <div className={`
            relative flex items-center w-full rounded-lg border transition-all duration-300
            ${isSearchFocused ? 'border-primary ring-4 ring-primary/10 bg-background' : 'border-border bg-muted/30 hover:bg-muted/50'}
          `}>
            <Search className={`${isArabic ? 'right-3' : 'left-3'} absolute w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              className={`w-full h-10 ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} bg-transparent outline-none text-sm placeholder:text-muted-foreground/70`}
              placeholder={isArabic ? "ابحث عن السلع..." : "Search markets..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              dir={isArabic ? 'rtl' : 'ltr'}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className={`absolute ${isArabic ? 'left-3' : 'right-3'} p-1 rounded-md text-muted-foreground hover:bg-white/10 hover:text-foreground`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className={`absolute ${isArabic ? 'right-0' : 'left-0'} top-full mt-2 w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50`}>
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                    {isArabic ? 'السلع' : 'Markets'}
                  </div>
                  {searchResults.map(item => (
                    <button
                      key={item.item_id}
                      onClick={() => {
                        setLocation(`/product/${encodeURIComponent(item.item_id)}`);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors text-left group"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.nameAr}</span>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">{item.isGlobal ? '$' : 'E£'}{item.price.toLocaleString()}</span>
                        <ArrowRight className={`w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-all ${isArabic ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {isArabic ? 'لم يتم العثور على نتائج' : 'No results found'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={handleLanguageToggle}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all text-sm font-medium hidden md:flex items-center gap-2"
          title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        >
          <Globe2 className="w-4 h-4" />
          <span className="text-xs">{isArabic ? 'EN' : 'AR'}</span>
        </button>
      </div>
    </header>
  );
}
