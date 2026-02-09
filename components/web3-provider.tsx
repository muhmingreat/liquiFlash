"use client"

import React, { type ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/config/index"

import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

export function Web3Provider({
    children,
    cookies
}: {
    children: ReactNode;
    cookies?: string | null
}) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#4ade80', // Green-400
                        accentColorForeground: 'black',
                        borderRadius: 'small',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                    initialChain={11142220} // Celo Sepolia ID
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
