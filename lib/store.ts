import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TradeEvent, TerminalSettings, WalletState, SelectedEvent } from '@/types'

interface TerminalState {
    // Data
    events: TradeEvent[]
    selectedEvent: SelectedEvent | null

    // Wallet
    wallet: WalletState

    // Settings
    settings: TerminalSettings

    // Actions
    addEvent: (event: TradeEvent) => void
    selectEvent: (event: SelectedEvent | null) => void
    setWallet: (wallet: WalletState) => void
    updateSettings: (settings: Partial<TerminalSettings>) => void
}

export const useTerminalStore = create<TerminalState>()(
    persist(
        (set) => ({
            events: [],
            selectedEvent: null,
            wallet: {
                isConnected: false,
                address: null,
                chainId: null,
            },
            settings: {
                slippage: "1.0",
                priorityFee: "2",
                rpcEndpoint: "https://alfajores-forno.celo-testnet.org",
            },

            addEvent: (event) => set((state) => {
                // Check if event with same ID already exists
                const exists = state.events.some(e => e.id === event.id);
                if (exists) {
                    // Option 1: Update existing (replace)
                    // Option 2: Ignore. 
                    // Let's replace it to ensure we have the latest data (e.g. real block number from stream vs optimistic)
                    return {
                        events: state.events.map(e => e.id === event.id ? event : e)
                    }
                }
                return {
                    events: [event, ...state.events].slice(0, 100)
                }
            }),

            selectEvent: (event) => set({ selectedEvent: event }),

            setWallet: (wallet) => set({ wallet }),

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            }))
        }),
        {
            name: 'terminal-storage',
            partialize: (state) => ({
                events: state.events,
                settings: state.settings
            })
        }
    )
)
