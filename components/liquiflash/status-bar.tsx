"use client"

import { useState, useEffect } from "react"
import { Database, Server, Cpu, HardDrive, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatusBar() {
  const [blockNumber, setBlockNumber] = useState(19847231)
  const [indexedBlock, setIndexedBlock] = useState(19847229)
  const [eventsProcessed, setEventsProcessed] = useState(124589)

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + (Math.random() > 0.6 ? 1 : 0))
      setIndexedBlock(prev => prev + (Math.random() > 0.7 ? 1 : 0))
      setEventsProcessed(prev => prev + Math.floor(Math.random() * 5))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const blockLag = blockNumber - indexedBlock

  return (
    <footer className="h-6 bg-[#0B0F14] border-t border-[#1F2933] px-2 lg:px-4 flex items-center justify-between text-[9px] lg:text-[10px] text-muted-foreground">
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Block Info */}
        <div className="flex items-center gap-1.5 lg:gap-2">
          <Database className="w-3 h-3" />
          <span className="hidden md:inline">Block:</span>
          <span className="tabular-nums text-foreground">{blockNumber.toLocaleString()}</span>
        </div>

        {/* Indexed Block - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <HardDrive className="w-3 h-3" />
          <span className="hidden lg:inline">Indexed:</span>
          <span className="tabular-nums text-foreground">{indexedBlock.toLocaleString()}</span>
          {blockLag > 0 && (
            <span className="text-yellow-400">(-{blockLag})</span>
          )}
        </div>

        {/* Events Processed */}
        <div className="flex items-center gap-1.5 lg:gap-2">
          <Cpu className="w-3 h-3" />
          <span className="hidden lg:inline">Events:</span>
          <span className="tabular-nums text-foreground">{eventsProcessed.toLocaleString()}</span>
        </div>

        {/* Block Lag indicator for tablet */}
        {blockLag > 0 && (
          <div className="flex md:hidden items-center gap-1">
            <span className="text-yellow-400">-{blockLag}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Connection Status - Compact on mobile */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-green-400 hidden md:inline">WS</span>
        </div>

        {/* Liquify Status */}
        <div className="flex items-center gap-1.5 lg:gap-2">
          <Server className="w-3 h-3 text-green-400" />
          <span className="hidden md:inline">Liquify:</span>
          <span className="text-green-400">Active</span>
        </div>

        {/* x402 Status */}
        <div className="hidden lg:flex items-center gap-2">
          <span>x402: <span className="text-green-400">Ready</span></span>
        </div>

        {/* Version */}
        <div className="text-muted-foreground hidden lg:block">
          v0.1.0-beta
        </div>
      </div>
    </footer>
  )
}
