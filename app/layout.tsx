import React from "react"
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LiquiFlash | Pro-Grade DeFi Trading Terminal',
  description: 'Ultra-low-latency trading terminal for on-chain liquidity snipers. See it first. Buy it first.',
  generator: 'Next.js',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  colorScheme: 'dark',
}

import { headers } from "next/headers"
import { Web3Provider } from "@/components/web3-provider"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = (await headers()).get('cookie')

  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0B0F14] text-[#E5E7EB]`}>
        <Web3Provider cookies={cookies}>
          {children}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}

