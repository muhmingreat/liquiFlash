"use client"

import { useState, useEffect } from "react"
import { 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  BarChart3,
  Users,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TokenDetailsProps {
  tokenPair: string
  liquidity: string
  impact: string
  open: boolean
  onClose: () => void
  onBuy: () => void
}

interface TokenData {
  name: string
  symbol: string
  address: string
  price: string
  priceChange24h: number
  volume24h: string
  liquidity: string
  holders: number
  poolAge: string
  marketCap: string
}

// Mock token data
function getMockTokenData(tokenPair: string): TokenData {
  const [token] = tokenPair.split("/")
  const priceChange = (Math.random() * 40 - 20).toFixed(2)
  
  return {
    name: token === "ETH" ? "Ethereum" : token === "PEPE" ? "Pepe" : token,
    symbol: token,
    address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
    price: `$${(Math.random() * 1000).toFixed(4)}`,
    priceChange24h: parseFloat(priceChange),
    volume24h: `$${(Math.floor(Math.random() * 10000000)).toLocaleString()}`,
    liquidity: `$${(Math.floor(Math.random() * 5000000)).toLocaleString()}`,
    holders: Math.floor(Math.random() * 50000),
    poolAge: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 24)}h`,
    marketCap: `$${(Math.floor(Math.random() * 100000000)).toLocaleString()}`,
  }
}

export function TokenDetails({ tokenPair, liquidity, impact, open, onClose, onBuy }: TokenDetailsProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open && tokenPair) {
      setTokenData(getMockTokenData(tokenPair))
    }
  }, [open, tokenPair])

  const handleCopy = () => {
    if (tokenData?.address) {
      navigator.clipboard.writeText(tokenData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!open || !tokenData) return null

  const isPositive = tokenData.priceChange24h >= 0

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      
      {/* Panel - Full screen on mobile, slide-in on desktop */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-[#111827] border-l border-[#1F2933] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2933] bg-[#0B0F14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-[#0B0F14]">
              {tokenData.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-sm font-medium">{tokenPair}</h2>
              <p className="text-[10px] text-muted-foreground">{tokenData.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Price Section */}
          <div className="p-4 bg-[#0B0F14] border border-[#1F2933]">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Price</div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold tabular-nums">{tokenData.price}</span>
              <span className={cn(
                "flex items-center gap-1 text-sm font-medium tabular-nums",
                isPositive ? "text-green-400" : "text-red-500"
              )}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? "+" : ""}{tokenData.priceChange24h}%
              </span>
            </div>
          </div>

          {/* Contract Address */}
          <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Contract</div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-muted-foreground truncate">{tokenData.address}</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleCopy}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a 
                  href="#"
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <BarChart3 className="w-3 h-3" />
                Volume 24h
              </div>
              <span className="text-sm font-medium tabular-nums">{tokenData.volume24h}</span>
            </div>
            <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Activity className="w-3 h-3" />
                Liquidity
              </div>
              <span className="text-sm font-medium tabular-nums">{tokenData.liquidity}</span>
            </div>
            <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Users className="w-3 h-3" />
                Holders
              </div>
              <span className="text-sm font-medium tabular-nums">{tokenData.holders.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                Pool Age
              </div>
              <span className="text-sm font-medium tabular-nums">{tokenData.poolAge}</span>
            </div>
          </div>

          {/* Market Cap */}
          <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Market Cap</div>
            <span className="text-lg font-medium tabular-nums">{tokenData.marketCap}</span>
          </div>

          {/* Event Impact */}
          <div className="p-3 bg-yellow-400/5 border border-yellow-400/20">
            <div className="text-[10px] uppercase tracking-wider text-yellow-400 mb-1">Current Event Impact</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Liquidity Added</span>
              <span className="text-sm font-medium text-yellow-400">{liquidity}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Price Impact</span>
              <span className={cn(
                "text-sm font-medium",
                impact.startsWith("+") ? "text-green-400" : "text-red-500"
              )}>{impact}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#1F2933] space-y-2">
          <button
            onClick={() => {
              onBuy()
              onClose()
            }}
            className="w-full py-3 text-sm font-medium uppercase tracking-wider bg-green-400 text-[#0B0F14] border-2 border-green-400 hover:bg-green-300 active:bg-green-500 transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Quick Buy
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium uppercase tracking-wider bg-[#1F2933] text-muted-foreground border border-[#1F2933] hover:border-[#374151] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
