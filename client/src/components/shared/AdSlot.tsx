import React from "react";
import { Megaphone } from "lucide-react";

interface AdSlotProps {
  className?: string;
  variant?: "banner" | "sidebar";
}

export function AdSlot({ className = "", variant = "banner" }: AdSlotProps) {
  return (
    <div 
      className={`
        relative flex flex-col items-center justify-center 
        bg-card/30 border border-white/5 border-dashed rounded-xl 
        text-muted-foreground overflow-hidden group
        ${variant === "banner" ? "h-32 w-full" : "h-64 w-full"}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <Megaphone className="w-5 h-5 text-muted-foreground/50" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
          Advertisement
        </span>
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 rounded-br-sm" />
    </div>
  );
}
