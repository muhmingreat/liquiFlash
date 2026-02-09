"use client"

import { Activity, AlertTriangle, Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  type: "no-events" | "loading" | "error" | "disconnected"
  message?: string
  onRetry?: () => void
}

export function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const config = {
    "no-events": {
      icon: Activity,
      title: "Waiting for Events",
      description: message || "Monitoring blockchain for new liquidity events...",
      iconClass: "text-green-400 animate-pulse",
    },
    "loading": {
      icon: Loader2,
      title: "Connecting",
      description: message || "Establishing connection to Liquify indexer...",
      iconClass: "text-green-400 animate-spin",
    },
    "error": {
      icon: AlertTriangle,
      title: "Connection Error",
      description: message || "Failed to connect to the data feed. Please try again.",
      iconClass: "text-red-500",
    },
    "disconnected": {
      icon: WifiOff,
      title: "Disconnected",
      description: message || "Lost connection to WebSocket. Attempting to reconnect...",
      iconClass: "text-yellow-400",
    },
  }

  const { icon: Icon, title, description, iconClass } = config[type]

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className={cn(
        "w-16 h-16 flex items-center justify-center mb-4 border",
        type === "error" ? "border-red-500/30 bg-red-500/5" :
        type === "disconnected" ? "border-yellow-400/30 bg-yellow-400/5" :
        "border-green-400/30 bg-green-400/5"
      )}>
        <Icon className={cn("w-8 h-8", iconClass)} />
      </div>
      
      <h3 className="text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">{description}</p>
      
      {type === "loading" && (
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Indexer Active</span>
        </div>
      )}
      
      {(type === "error" || type === "disconnected") && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#1F2933] border border-[#1F2933] text-foreground hover:border-[#374151] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry Connection
        </button>
      )}

      {type === "disconnected" && (
        <div className="mt-4 flex items-center gap-2 text-[10px] text-yellow-400">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Auto-reconnecting...</span>
        </div>
      )}
    </div>
  )
}

// Skeleton Loading Component
export function EventStreamSkeleton() {
  return (
    <div className="h-full flex flex-col bg-[#111827] border border-[#1F2933]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2933] bg-[#0B0F14]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#1F2933] animate-shimmer" />
          <div className="w-32 h-4 bg-[#1F2933] animate-shimmer" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-4 bg-[#1F2933] animate-shimmer" />
          <div className="w-16 h-4 bg-[#1F2933] animate-shimmer" />
        </div>
      </div>
      
      {/* Table Header Skeleton */}
      <div className="flex items-center px-3 py-2 border-b border-[#1F2933] bg-[#0B0F14]">
        <div className="w-16 h-3 bg-[#1F2933] animate-shimmer mr-4" />
        <div className="w-20 h-3 bg-[#1F2933] animate-shimmer mr-4" />
        <div className="w-16 h-3 bg-[#1F2933] animate-shimmer mr-4" />
        <div className="flex-1" />
        <div className="w-12 h-3 bg-[#1F2933] animate-shimmer" />
      </div>
      
      {/* Row Skeletons */}
      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="flex items-center px-3 py-3 border-b border-[#1F2933]"
            style={{ opacity: 1 - (i * 0.1) }}
          >
            <div className="w-16 h-4 bg-[#1F2933] animate-shimmer mr-4" />
            <div className="w-24 h-5 bg-[#1F2933] animate-shimmer mr-4" />
            <div className="w-20 h-4 bg-[#1F2933] animate-shimmer mr-4" />
            <div className="flex-1" />
            <div className="w-14 h-6 bg-[#1F2933] animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
