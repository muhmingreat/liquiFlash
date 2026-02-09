"use client"

import { useEffect, useState } from "react"
import { Activity, Zap, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTerminalStore } from "@/lib/store"
import { useLiquiFlash } from "@/hooks/useLiquiFlash"
import { useWatchContractEvent } from "wagmi"
import { EXECUTOR_ABI } from "@/config/contracts"
import type { TradeEvent, EventType, SelectedEvent } from "@/types"

const EVENT_BADGES: Record<EventType, { label: string; className: string }> = {
  POOL_CREATED: {
    label: "POOL_CREATED",
    className: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
  },
  SWAP: {
    label: "SWAP",
    className: "bg-green-400/10 text-green-400 border border-green-400/30"
  },
  LIQUIDITY_ADD: {
    label: "LIQ_ADD",
    className: "bg-blue-400/10 text-blue-400 border border-blue-400/30"
  },
  LIQUIDITY_REMOVE: {
    label: "LIQ_REMOVE",
    className: "bg-red-400/10 text-red-400 border border-red-400/30"
  },
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 1000) return `${diff}ms ago`
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  return `${Math.floor(diff / 60000)}m ago`
}

interface EventRowProps {
  event: TradeEvent
  isNew: boolean
  onBuy: (event: SelectedEvent) => void
  isMobile?: boolean
}

function EventRow({ event, isNew, onBuy, isMobile }: EventRowProps) {
  const badge = EVENT_BADGES[event.eventType]

  const handleBuy = () => {
    onBuy({
      tokenPair: event.tokenPair,
      liquidity: event.liquidity,
      impact: event.impact
    })
  }

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div
        onClick={handleBuy}
        className={cn(
          "p-3 border-b border-[#1F2933] active:bg-[#1F2933] transition-colors cursor-pointer",
          isNew && "animate-slide-in",
          event.isWhale && "animate-whale-glow bg-yellow-400/5 border-l-2 border-l-yellow-400"
        )}
      >
        {/* Top Row: Pair + Badge + Whale indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {event.isWhale && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
              </span>
            )}
            <span className="text-sm font-medium text-foreground">{event.tokenPair}</span>
            <span className={cn("px-1.5 py-0.5 text-[9px] uppercase tracking-wider", badge.className)}>
              {badge.label}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>

        {/* Bottom Row: Liquidity + Impact + Buy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-sm tabular-nums",
              event.isWhale ? "text-yellow-400 font-medium" : "text-muted-foreground"
            )}>
              {event.liquidity}
            </span>
            <span className={cn(
              "flex items-center gap-1 text-sm tabular-nums",
              event.isPositive ? "text-green-400" : "text-red-500"
            )}>
              {event.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {event.impact}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleBuy()
            }}
            className="px-3 py-1.5 text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/30 active:bg-green-400/30 transition-colors"
          >
            BUY
          </button>
        </div>
      </div>
    )
  }

  // Desktop Table Row
  return (
    <tr
      className={cn(
        "border-b border-[#1F2933] hover:bg-[#1F2933] transition-colors duration-75 cursor-pointer",
        isNew && "animate-slide-in",
        event.isWhale && "animate-whale-glow bg-yellow-400/5 border-l-2 border-l-yellow-400"
      )}
      onClick={handleBuy}
    >
      {/* Time */}
      <td className="px-2 lg:px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
        <span className="tabular-nums">{formatRelativeTime(event.timestamp)}</span>
      </td>

      {/* Event Type */}
      <td className="px-2 lg:px-3 py-2">
        <div className="flex items-center gap-2">
          {event.isWhale && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
            </span>
          )}
          <span className={cn("px-1.5 lg:px-2 py-0.5 text-[9px] lg:text-[10px] uppercase tracking-wider", badge.className)}>
            {badge.label}
          </span>
        </div>
      </td>

      {/* Token Pair */}
      <td className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-foreground">
        {event.tokenPair}
      </td>

      {/* Liquidity */}
      <td className="px-2 lg:px-3 py-2 text-xs lg:text-sm tabular-nums text-right">
        <span className={event.isWhale ? "text-yellow-400 font-medium" : "text-muted-foreground"}>
          {event.liquidity}
        </span>
      </td>

      {/* Impact */}
      <td className="px-2 lg:px-3 py-2 text-xs lg:text-sm tabular-nums text-right">
        <span className={cn(
          "flex items-center justify-end gap-1",
          event.isPositive ? "text-green-400" : "text-red-500"
        )}>
          {event.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {event.impact}
        </span>
      </td>

      {/* Tx Hash - Hidden on tablet */}
      <td className="hidden lg:table-cell px-2 lg:px-3 py-2 text-xs text-muted-foreground font-mono">
        {event.txHash}
      </td>

      {/* Action */}
      <td className="px-2 lg:px-3 py-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleBuy()
          }}
          className="px-2 lg:px-3 py-1 text-[10px] lg:text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 active:bg-green-400/30 transition-colors duration-75"
        >
          BUY
        </button>
      </td>
    </tr>
  )
}

interface EventStreamProps {
  onSelectEvent?: (event: SelectedEvent) => void
  isMobile?: boolean
}

export function EventStream({ onSelectEvent, isMobile }: EventStreamProps) {
  // Use global store
  const { events, addEvent, selectEvent } = useTerminalStore()
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  // Handle event selection (updates both store and prop if provided)
  const handleSelect = (event: SelectedEvent) => {
    selectEvent(event)
    if (onSelectEvent) onSelectEvent(event)
  }

  // Connect to Real On-Chain Events
  const { executorAddress } = useLiquiFlash()

  useWatchContractEvent({
    address: executorAddress || undefined,
    abi: EXECUTOR_ABI,
    eventName: 'SwapExecuted',
    onLogs(logs) {
      logs.forEach(log => {
        // Parse log args
        // Cast to any to access args since we know the ABI matches
        const args = (log as any).args
        if (!args) return

        const tokenIn = args.tokenIn as string
        const tokenOut = args.tokenOut as string
        // Simple truncation for display
        const pairDisplay = `${tokenIn.slice(0, 6)}...${tokenIn.slice(-4)} / ${tokenOut.slice(0, 6)}...`

        // Approximate amount display (assuming 18 decimals for simplicity or raw)
        // We'll just show a raw-ish value or "Hash" it if needed. 
        // Best to just show it as "Active" if we can't format perfectly yet.
        const liquidityDisplay = "Traded" // Placeholder for complex formatting

        const newEvent: TradeEvent = {
          id: log.transactionHash,
          timestamp: Date.now(),
          eventType: "SWAP",
          tokenPair: pairDisplay,
          liquidity: liquidityDisplay,
          impact: "Live", // Dynamic calculation requires more data
          isPositive: true,
          isWhale: false,
          txHash: log.transactionHash,
          blockNumber: Number(log.blockNumber)
        }
        addEvent(newEvent)
        setNewEventIds(prev => new Set([...prev, newEvent.id]))

        // Clear animation
        setTimeout(() => {
          setNewEventIds(prev => {
            const next = new Set(prev)
            next.delete(newEvent.id)
            return next
          })
        }, 500)
      })
    },
    enabled: !!executorAddress
  })

  return (
    <div className="h-full flex flex-col bg-[#111827] border border-[#1F2933]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-[#1F2933] bg-[#0B0F14]">
        <div className="flex items-center gap-2 md:gap-3">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
            {isMobile ? "Events" : "Live Event Stream"}
          </span>
          <span className="px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] bg-green-400/10 text-green-400 border border-green-400/30">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="tabular-nums">{events.length}</span>
            <span className="hidden md:inline">events</span>
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span className="tabular-nums">{events.filter(e => e.isWhale).length}</span>
            <span className="hidden md:inline">whales</span>
          </span>
        </div>
      </div>

      {/* Mobile Card List */}
      {isMobile ? (
        <div className="flex-1 overflow-auto">
          {events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              isNew={newEventIds.has(event.id)}
              onBuy={handleSelect}
              isMobile
            />
          ))}
        </div>
      ) : (
        /* Desktop Table */
        <div className="flex-1 overflow-auto">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <Activity className="w-8 h-8 opacity-20" />
              <p className="text-xs text-center px-6">
                Waiting for trading activity... <br />
                <span className="text-green-400">Execute a manual trade</span> to initialize stream.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#0B0F14] border-b border-[#1F2933]">
                <tr className="text-[9px] lg:text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-2 lg:px-3 py-2 font-medium">Time</th>
                  <th className="px-2 lg:px-3 py-2 font-medium">Event</th>
                  <th className="px-2 lg:px-3 py-2 font-medium">Pair</th>
                  <th className="px-2 lg:px-3 py-2 font-medium text-right">Size</th>
                  <th className="px-2 lg:px-3 py-2 font-medium text-right">Impact</th>
                  <th className="hidden lg:table-cell px-2 lg:px-3 py-2 font-medium">Tx Hash</th>
                  <th className="px-2 lg:px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    isNew={newEventIds.has(event.id)}
                    onBuy={handleSelect}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}



