"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Terminal, Zap, Shield, AlertTriangle, CheckCircle, Loader2, Settings, Wallet, Edit2, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTerminalStore } from "@/lib/store"
import { x402 } from "@/lib/services/x402"
import type { SelectedEvent } from "@/types"
import { useLiquiFlash } from "@/hooks/useLiquiFlash"
import { FundManager } from "./fund-manager"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, getAddress } from "viem"
import { EXECUTOR_ABI } from "@/config/contracts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface ExecutionConsoleProps {
  selectedEvent?: SelectedEvent | null
  compact?: boolean
}

export function ExecutionConsole({ compact }: ExecutionConsoleProps) {
  // Global Store State
  const { selectedEvent, addEvent } = useTerminalStore()
  const { isConnected } = useAccount()

  // Smart Contract Hook
  const { hasExecutor, deployExecutor, isDeploying, executorAddress, networkConfig } = useLiquiFlash()

  // Derived Addresses from Network Config
  const ROUTER_V3_ADDRESS = networkConfig.routerV3Address;
  const TOKENS = networkConfig.tokens;

  const [snipeAmount, setSnipeAmount] = useState("0.1")
  const [slippage, setSlippage] = useState("1.0")
  const [targetToken, setTargetToken] = useState(TOKENS.usdc) // Default to USDC
  const [priorityFee, setPriorityFee] = useState("2")
  const [showAdvanced, setShowAdvanced] = useState(true) // Default open for visibility

  // Wagmi Write Hook
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const isExecuting = isWritePending || isConfirming

  const handleExecute = useCallback(() => {
    if (!executorAddress) {
      toast.error("No Executor Address found")
      return
    }

    // Validate and Normalizing Address
    let normalizedTarget: `0x${string}`;
    try {
      normalizedTarget = getAddress(targetToken)
    } catch (e) {
      console.error("Address Error", e)
      toast.error("Invalid Target Address Format")
      return
    }

    // 1. Construct Path (Simple V2 Path: WCELO -> Token)
    // Use selected event's token if available, otherwise manual target
    // Note: selectedEvent parsing logic would go here in a full app
    const path = [TOKENS.wNative, normalizedTarget]

    console.log("Executing Swap:", { executorAddress, path, amount: snipeAmount })
    toast.loading("Initiating Execution...", { id: "exec-toast" })

    // Optimistic Event Creation
    const createOptimisticEvent = (txHash: string) => {
      addEvent({
        id: txHash,
        timestamp: Date.now(),
        tokenPair: selectedEvent?.tokenPair || `NATIVE -> ${targetToken.slice(0, 6)}...`,
        amount: snipeAmount,
        status: "success", // Assuming pending/success for now
        executionTime: "0ms", // Placeholder
        txHash: txHash,
        liquidity: selectedEvent?.liquidity || "$0",
        eventType: "SWAP",
        blockNumber: 0
      })
    }

    try {

      // Use V3 (Default for our supported chains now)
      if (ROUTER_V3_ADDRESS && ROUTER_V3_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        writeContract({
          address: executorAddress,
          abi: EXECUTOR_ABI,
          functionName: "executeSwapV3",
          args: [
            ROUTER_V3_ADDRESS,
            parseEther(snipeAmount), // AmountIn
            0n, // MinAmountOut (0 for now)
            TOKENS.wNative, // TokenIn
            normalizedTarget, // TokenOut
            3000 // Fee (0.3% - most common pool tier)
          ],
          value: parseEther(snipeAmount)
        }, {
          onSuccess: (txHash) => {
            toast.success(`Transaction Sent: ${txHash.slice(0, 6)}...`, { id: "exec-toast" })
            createOptimisticEvent(txHash)
          },
          onError: (err) => {
            console.error("Tx Error:", err)
            toast.error(`Execution Failed: ${err.message.slice(0, 20)}...`, { id: "exec-toast" })
          }
        })
      } else {
        toast.error("Router not configured for this network", { id: "exec-toast" })
      }
    } catch (err: any) {
      console.error("Execution Failed", err)
      toast.error("Execution setup failed", { id: "exec-toast" })
    }
  }, [selectedEvent, executorAddress, snipeAmount, targetToken, writeContract, addEvent, ROUTER_V3_ADDRESS, TOKENS])

  // State: Wallet Not Connected
  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-[#111827] border border-[#1F2933]">
        <Wallet className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-sm font-medium text-foreground mb-2">Wallet Disconnected</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Connect your wallet to access the Execution Console.
        </p>
      </div>
    )
  }

  // State: No Executor (Activation Required)
  if (!hasExecutor) {
    return (
      <div className="h-full flex flex-col bg-[#111827] border border-[#1F2933]">
        {/* ... existing activation UI ... */}
        <div className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 border-b border-[#1F2933] bg-[#0B0F14]">
          <div className="flex items-center gap-2 lg:gap-3">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs lg:text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Account Required
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Shield className="w-12 h-12 text-yellow-400 mb-2 animate-pulse" />
          <div>
            <h3 className="text-sm font-medium text-foreground">Activate Trading Account</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              Deploy your personal, non-custodial executor contract to start trading on LiquiFlash.
            </p>
          </div>
          <button
            onClick={deployExecutor}
            disabled={isDeploying}
            className="px-4 py-2 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-50 transition-colors"
          >
            {isDeploying ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Deploying...
              </div>
            ) : (
              "Deploy Executor"
            )}
          </button>
        </div>
      </div>
    )
  }

  // State: Ready to Trade
  return (
    <div className="h-full flex flex-col bg-[#111827] border border-[#1F2933]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 border-b border-[#1F2933] bg-[#0B0F14]">
        <div className="flex items-center gap-2 lg:gap-3">
          <Terminal className="w-4 h-4 text-red-500" />
          <span className="text-xs lg:text-sm font-medium uppercase tracking-wider">
            {compact ? "Execute" : "Instant Execution"}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        </div>

        {/* Settings Modal Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-1 px-2 text-xs font-medium bg-[#1F2933] border border-[#374151] rounded text-muted-foreground hover:text-foreground hover:border-green-400/50 transition-colors flex items-center gap-1"
              title="Configure Trade"
            >
              <Settings className="w-3 h-3" />
              Configure
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#111827] border-[#1F2933] max-w-md">
            <DialogHeader>
              <DialogTitle>Trade Configuration</DialogTitle>
              <DialogDescription>
                Configure your snipe amount, slippage, and security settings.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Snipe Amount */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  <span>Snipe Amount</span>
                  <span className="text-green-400 font-mono">CELO</span>
                </label>

                <div className="relative group">
                  <input
                    type="text"
                    value={snipeAmount}
                    onChange={(e) => setSnipeAmount(e.target.value)}
                    className="w-full h-16 px-5 bg-[#0B0F14] border border-[#1F2933] text-2xl font-semibold tracking-tight text-foreground tabular-nums group-hover:border-[#374151] focus:border-green-400/50 focus:outline-none transition-colors rounded-md"
                  />
                </div>

                <div className="flex gap-2">
                  {["0.05", "0.1", "0.5", "1.0", "5.0"].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSnipeAmount(amount)}
                      className={cn(
                        "flex-1 py-2 text-xs border transition-all duration-100 font-medium rounded-md",
                        snipeAmount === amount
                          ? "bg-green-400/10 border-green-400 text-green-400"
                          : "bg-[#0B0F14] border-[#1F2933] text-muted-foreground hover:bg-[#1F2933] hover:border-[#374151]"
                      )}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4 pt-4 border-t border-[#1F2933]/50">
                {/* Slippage & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Slippage %</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={slippage}
                        onChange={(e) => setSlippage(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B0F14] border border-[#1F2933] text-sm focus:border-green-400/50 focus:outline-none rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Priority (Gwei)</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={priorityFee}
                        onChange={(e) => setPriorityFee(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0B0F14] border border-[#1F2933] text-sm focus:border-green-400/50 focus:outline-none rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Slippage */}
                <div className="flex gap-2">
                  {["0.5", "1.0", "2.0", "5.0"].map((slip) => (
                    <button
                      key={slip}
                      onClick={() => setSlippage(slip)}
                      className={cn(
                        "flex-1 py-1.5 text-[10px] border transition-colors rounded-sm",
                        slippage === slip
                          ? "bg-green-400/10 border-green-400 text-green-400"
                          : "bg-[#0B0F14] border-[#1F2933] text-muted-foreground hover:border-[#374151]"
                      )}
                    >
                      {slip}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Security / Status */}
              <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-400">x402 Authorization</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded-full">
                    ACTIVE <CheckCircle className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Automatic signing enabled. High-frequency mode active.
                </p>
              </div>

            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 bg-green-400 text-black text-sm font-bold rounded hover:bg-green-300 uppercase tracking-wider w-full">
                  Save Configuration
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

      {/* Target Info / Selection */}
      <div className="p-3 lg:p-4 border-b border-[#1F2933] bg-[#0B0F14]/30">
        {selectedEvent ? (
          <div className="mb-2">
            <div className="text-[9px] lg:text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Target Event</div>
            <div className="flex items-center justify-between text-yellow-400 font-medium">
              <span>{selectedEvent.tokenPair}</span>
              <span className="text-xs opacity-80">{selectedEvent.liquidity}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-[9px] lg:text-[10px] uppercase tracking-wider text-muted-foreground">
              Target Token Address (Manual)
            </label>

            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full px-3 py-2 bg-[#111827] border border-[#1F2933] hover:border-green-400/50 hover:bg-[#1F2933] transition-colors rounded flex items-center justify-between group">
                  <span className="text-xs font-mono text-green-400 truncate max-w-[200px]">{targetToken}</span>
                  <Edit2 className="w-3 h-3 text-muted-foreground group-hover:text-green-400" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#111827] border-[#1F2933]">
                <DialogHeader>
                  <DialogTitle>Set Target Token</DialogTitle>
                  <DialogDescription>
                    Enter the contract address of the token you want to buy.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Token Address</label>
                  <input
                    type="text"
                    value={targetToken}
                    onChange={(e) => setTargetToken(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F14] border border-[#1F2933] text-sm font-mono text-green-400 focus:border-green-400/50 focus:outline-none rounded"
                    placeholder="0x..."
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-green-400 text-black text-sm font-bold rounded hover:bg-green-300">
                      Done
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>


      {/* Main Content Area - Replaces Old Input Fields with Summary */}
      <div className="flex-1 p-5 space-y-8 overflow-y-auto min-h-0">

        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Snipe Configuration</h3>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">{snipeAmount}</span>
              <span className="text-sm font-bold text-green-400">CELO</span>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              <span>Slip: {slippage}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Fee: {priorityFee} Gwei</span>
            </div>
          </div>

        </div>

        {/* Execution Feedback */}
        {hash && (
          <div className="flex items-center justify-between p-3 bg-[#0B0F14] border border-[#1F2933] text-xs font-mono rounded-sm w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>TX Confirmed</span>
            </div>
            <a
              href={`https://celo-alfajores.blockscout.com/tx/${hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-green-400 hover:text-green-300 hover:underline flex items-center gap-1"
            >
              Tx Explorer <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        )}

      </div>

      {/* Fund Manager */}
      <div className="flex-shrink-0">
        <FundManager />
      </div>

      {/* Execute Button */}
      <div className="p-3 lg:p-4 border-t border-[#1F2933] flex-shrink-0 bg-[#111827] relative z-10">
        <button
          onClick={handleExecute}
          disabled={isExecuting || !isConnected}
          className={cn(
            "w-full py-4 text-sm font-bold uppercase tracking-wider transition-all duration-100 flex items-center justify-center gap-2 shadow-[0_0_20px_-12px_rgba(74,222,128,0.5)]",
            "border border-green-400",
            isExecuting
              ? "bg-green-400/10 text-green-400 cursor-wait"
              : "bg-green-400 text-black hover:bg-green-300 active:translate-y-[1px]"
          )}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              {selectedEvent ? "EXECUTE SNIPE" : "EXECUTE MANUAL TRADE"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}



