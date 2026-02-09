"use client"

import { History, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTerminalStore } from "@/lib/store"
import { useLiquiFlash } from "@/hooks/useLiquiFlash"

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  })
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return `${Math.floor(diff / 3600000)}h ago`
}

interface TradeHistoryProps {
  isMobile?: boolean
}

export function TradeHistory({ isMobile }: TradeHistoryProps) {
  const { events } = useTerminalStore()
  const { executorAddress } = useLiquiFlash()

  // Sort events by timestamp descending
  const trades = events.sort((a, b) => b.timestamp - a.timestamp)

  const statusConfig = {
    success: { icon: CheckCircle, className: "text-green-400" },
    failed: { icon: XCircle, className: "text-red-500" },
    pending: { icon: Clock, className: "text-yellow-400 animate-pulse" },
  }

  // Calculate totals
  const successCount = trades.length // Assuming all logged swaps are successes for now

  // Placeholder total PnL - To be implemented with real pricing data later
  const totalPnl = 0.00

  return (
    <div className="h-full flex flex-col bg-[#111827] border border-[#1F2933]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-[#1F2933] bg-[#0B0F14]">
        <div className="flex items-center gap-2 md:gap-3">
          <History className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
            {isMobile ? "History" : "Trade History"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {successCount}/{trades.length}
          </span>
          {isMobile && (
            <span className={cn(
              "text-[10px] tabular-nums font-medium",
              totalPnl >= 0 ? "text-green-400" : "text-red-500"
            )}>
              {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats - Mobile Only */}
      {isMobile && (
        <div className="grid grid-cols-3 gap-2 p-3 border-b border-[#1F2933] bg-[#0B0F14]/50">
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground uppercase">Trades</div>
            <div className="text-sm font-medium tabular-nums">{trades.length}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground uppercase">Win Rate</div>
            <div className="text-sm font-medium tabular-nums text-green-400">
              {trades.length > 0 ? Math.round((successCount / trades.length) * 100) : 0}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
            <div className={cn(
              "text-sm font-medium tabular-nums",
              totalPnl >= 0 ? "text-green-400" : "text-red-500"
            )}>
              ${Math.abs(totalPnl).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Trades List */}
      <div className="flex-1 overflow-auto">
        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <History className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">No trades yet</span>
            <span className="text-[10px]">Execute a trade to see history</span>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2933]">
            {trades.map((trade) => {
              const { icon: StatusIcon, className } = statusConfig["success"] // All events are success in stream currently
              const isPnlPositive = true // Placeholder

              return (
                <div
                  key={trade.id}
                  className={cn(
                    "px-3 md:px-4 py-3 transition-colors duration-75",
                    isMobile ? "active:bg-[#1F2933]" : "hover:bg-[#1F2933]"
                  )}
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("w-3.5 h-3.5", className)} />
                      <span className="text-sm font-medium">{trade.tokenPair}</span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums">
                        {isMobile ? formatRelativeTime(trade.timestamp) : formatTime(trade.timestamp)}
                      </span>
                      {!isMobile && trade.txHash && (
                        <span className="text-muted-foreground/50">{trade.txHash.slice(0, 6)}...{trade.txHash.slice(-4)}</span>
                      )}
                    </div>
                    <span className="tabular-nums">{trade.liquidity}</span>
                  </div>

                  {/* Status Message */}
                  {trade.eventType === "SWAP" && !isMobile && trade.blockNumber && (
                    <div className="text-[10px] text-green-400/70 mt-1 tabular-nums">
                      Executed Block: #{trade.blockNumber}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
