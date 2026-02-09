"use client"

import { useState } from "react"
import { X, Terminal, Zap, Shield, AlertTriangle, CheckCircle, Loader2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileExecutionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedEvent?: {
    tokenPair: string
    liquidity: string
    impact: string
  } | null
}

export function MobileExecutionDrawer({ open, onOpenChange, selectedEvent }: MobileExecutionDrawerProps) {
  const [snipeAmount, setSnipeAmount] = useState("0.1")
  const [slippage, setSlippage] = useState("1.0")
  const [priorityFee, setPriorityFee] = useState("2")
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastExecution, setLastExecution] = useState<{ success: boolean; message: string } | null>(null)

  const handleExecute = async () => {
    setIsExecuting(true)
    setLastExecution(null)
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
    
    const success = Math.random() > 0.2
    setLastExecution({
      success,
      message: success 
        ? `BUY executed @ ${snipeAmount} ETH` 
        : "Execution failed: Slippage exceeded"
    })
    setIsExecuting(false)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#111827] border-t border-[#1F2933] animate-in slide-in-from-bottom duration-200">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <button 
            onClick={() => onOpenChange(false)}
            className="w-12 h-1 bg-[#1F2933] rounded-full"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1F2933]">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium uppercase tracking-wider">Instant Execution</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-auto">
          {/* Selected Target */}
          {selectedEvent ? (
            <div className="p-3 bg-yellow-400/5 border border-yellow-400/20">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Target</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-yellow-400">{selectedEvent.tokenPair}</span>
                <span className="text-sm text-muted-foreground">{selectedEvent.liquidity}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#0B0F14] border border-[#1F2933] text-center">
              <span className="text-sm text-muted-foreground">Select an event from the stream</span>
            </div>
          )}

          {/* Snipe Amount */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Snipe Amount (ETH)
            </label>
            <input
              type="text"
              value={snipeAmount}
              onChange={(e) => setSnipeAmount(e.target.value)}
              className="w-full px-3 py-3 bg-[#0B0F14] border border-[#1F2933] text-foreground text-sm tabular-nums focus:border-green-400/50 focus:outline-none"
            />
            <div className="flex gap-2 mt-2">
              {["0.05", "0.1", "0.5", "1.0"].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSnipeAmount(amount)}
                  className={cn(
                    "flex-1 px-2 py-2 text-xs border transition-colors",
                    snipeAmount === amount
                      ? "bg-green-400/20 border-green-400/50 text-green-400"
                      : "bg-[#0B0F14] border-[#1F2933] text-muted-foreground"
                  )}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Slippage & Priority in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Slippage (%)
              </label>
              <input
                type="text"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-full px-3 py-3 bg-[#0B0F14] border border-[#1F2933] text-foreground text-sm tabular-nums focus:border-green-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Priority (Gwei)
              </label>
              <input
                type="text"
                value={priorityFee}
                onChange={(e) => setPriorityFee(e.target.value)}
                className="w-full px-3 py-3 bg-[#0B0F14] border border-[#1F2933] text-foreground text-sm tabular-nums focus:border-green-400/50 focus:outline-none"
              />
            </div>
          </div>

          {/* x402 Status */}
          <div className="p-3 bg-[#0B0F14] border border-[#1F2933]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs uppercase tracking-wider">x402 Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-400">GRANTED</span>
                <CheckCircle className="w-3 h-3 text-green-400" />
              </div>
            </div>
          </div>

          {/* Execution Feedback */}
          {lastExecution && (
            <div className={cn(
              "p-3 border text-sm",
              lastExecution.success 
                ? "bg-green-400/10 border-green-400/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            )}>
              <div className="flex items-center gap-2">
                {lastExecution.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>{lastExecution.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Execute Button */}
        <div className="p-4 border-t border-[#1F2933] pb-8">
          <button
            onClick={handleExecute}
            disabled={isExecuting || !selectedEvent}
            className={cn(
              "w-full py-4 text-sm font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              "border-2 border-green-400",
              isExecuting
                ? "bg-green-400/20 text-green-400 cursor-wait"
                : selectedEvent
                  ? "bg-green-400 text-[#0B0F14] active:bg-green-500"
                  : "bg-[#1F2933] text-muted-foreground border-[#1F2933] cursor-not-allowed"
            )}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Execute Buy
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
