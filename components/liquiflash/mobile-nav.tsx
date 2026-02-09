"use client"

import { Activity, History, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  activeTab: "stream" | "history"
  onTabChange: (tab: "stream" | "history") => void
  onExecuteClick: () => void
  hasSelectedEvent: boolean
}

export function MobileNav({ activeTab, onTabChange, onExecuteClick, hasSelectedEvent }: MobileNavProps) {
  return (
    <nav className="md:hidden h-14 bg-[#0B0F14] border-t border-[#1F2933] flex items-center justify-around px-2">
      {/* Stream Tab */}
      <button
        onClick={() => onTabChange("stream")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
          activeTab === "stream" 
            ? "text-green-400" 
            : "text-muted-foreground"
        )}
      >
        <Activity className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-wider">Stream</span>
      </button>

      {/* Execute Button - Center */}
      <button
        onClick={onExecuteClick}
        className={cn(
          "flex flex-col items-center justify-center gap-1 px-6 h-10 border-2 transition-colors mx-2",
          hasSelectedEvent
            ? "bg-green-400 border-green-400 text-[#0B0F14]"
            : "bg-[#1F2933] border-[#1F2933] text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-medium">Execute</span>
        </div>
      </button>

      {/* History Tab */}
      <button
        onClick={() => onTabChange("history")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
          activeTab === "history" 
            ? "text-green-400" 
            : "text-muted-foreground"
        )}
      >
        <History className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-wider">History</span>
      </button>
    </nav>
  )
}
