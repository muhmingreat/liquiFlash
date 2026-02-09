export type EventType = "POOL_CREATED" | "SWAP" | "LIQUIDITY_ADD" | "LIQUIDITY_REMOVE"

export interface TradeEvent {
    id: string
    timestamp: number
    eventType: EventType
    tokenPair: string
    liquidity: string
    impact: string
    isPositive: boolean
    isWhale: boolean
    txHash: string
    blockNumber: number
}

export interface SelectedEvent {
    tokenPair: string
    liquidity: string
    impact: string
}

export interface WalletState {
    isConnected: boolean
    address: string | null
    chainId: number | null
}

export interface TerminalSettings {
    slippage: string
    priorityFee: string
    rpcEndpoint: string
}
