"use client"

import { useState } from "react"
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Loader2 } from "lucide-react"
import { useLiquiFlash } from "@/hooks/useLiquiFlash"
import { formatEther, parseEther } from "viem"
import { toast } from "sonner"
import { useSendTransaction } from "wagmi"

export function FundManager() {
    const {
        hasExecutor,
        executorAddress,
        executorBalance,
        withdrawETH,
        isWithdrawing,
        networkConfig
    } = useLiquiFlash()

    const { sendTransaction, isPending: isDepositing } = useSendTransaction()
    const [depositAmount, setDepositAmount] = useState("")

    // Get Native Token Symbol (e.g. CELO, MATIC)
    // Basic heuristic or add to network config. For now, derived from chain usage.
    const nativeSymbol = networkConfig.name.includes("Celo") ? "CELO"
        : networkConfig.name.includes("Polygon") ? "MATIC"
            : networkConfig.name.includes("Avalanche") ? "AVAX"
                : networkConfig.name.includes("BSC") ? "BNB"
                    : "ETH";

    const handleDeposit = () => {
        if (!executorAddress || !depositAmount) return
        try {
            sendTransaction({
                to: executorAddress,
                value: parseEther(depositAmount)
            })
            setDepositAmount("")
        } catch (e) {
            toast.error("Deposit failed")
        }
    }

    if (!hasExecutor) return null

    return (
        <div className="p-4 border-t border-[#1F2933] bg-[#0B0F14]/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Trading Balance
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-medium tabular-nums text-foreground">
                        {executorBalance ? parseFloat(formatEther(executorBalance.value)).toFixed(4) : "0.0000"} <span className="text-sm text-muted-foreground">{nativeSymbol}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Deposit */}
                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full px-3 py-2 bg-[#111827] border border-[#1F2933] text-sm focus:border-green-400/50 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-xs text-muted-foreground">{nativeSymbol}</span>
                    </div>
                    <button
                        onClick={handleDeposit}
                        disabled={isDepositing || !depositAmount}
                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400/20 disabled:opacity-50 transition-colors"
                    >
                        {isDepositing ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                        DEPOSIT
                    </button>
                </div>

                {/* Withdraw */}
                <div className="space-y-2">
                    <div className="h-[38px] flex items-center justify-center text-xs text-muted-foreground bg-[#111827] border border-[#1F2933] opacity-50">
                        ALL FUNDS
                    </div>
                    <button
                        onClick={withdrawETH}
                        disabled={isWithdrawing || !executorBalance || executorBalance.value === 0n}
                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                    >
                        {isWithdrawing ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingDown className="w-3 h-3" />}
                        WITHDRAW
                    </button>
                </div>
            </div>
        </div>
    )
}
