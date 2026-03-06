import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { useCurrentPrices } from "@/hooks/use-prices";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [, setLocation] = useLocation();
  const { currentPrices } = useCurrentPrices();
  const { toggleSidebar, isMobile } = useSidebar();

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo - Desktop only (Sidebar has it, but good for when sidebar is collapsed) */}
        <Link href="/" className="hidden md:flex items-center gap-2 mr-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-bold text-lg tracking-tight hidden lg:block">Price.eg</span>
        </Link>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl relative">
          <div className={`
            relative flex items-center w-full rounded-xl border transition-all duration-300
            ${isSearchFocused ? 'border-primary ring-4 ring-primary/10 bg-background' : 'border-white/10 bg-muted/30 hover:bg-muted/50'}
          `}>
            <Search className={`absolute left-3 w-4 h-4 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            <input
              type="text"
              className="w-full h-10 pl-10 pr-4 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
              placeholder="Search markets, metals, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 rounded-md text-muted-foreground hover:bg-white/10 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                    Markets
                  </div>
                  {searchResults.map(item => (
                    <button
                      key={item.item_id}
                      onClick={() => {
                        setLocation(`/product/${encodeURIComponent(item.item_id)}`);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.nameAr}</span>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">{item.isGlobal ? '$' : 'E£'}{item.price.toLocaleString()}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No markets found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
