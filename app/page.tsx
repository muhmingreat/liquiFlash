"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Terminal, Zap, Shield, Activity, Lock, Cpu, Globe, Search } from "lucide-react"
import { LiquiFlashLogo } from "@/components/liquiflash/logo"
import { HeroVisual } from "@/components/liquiflash/hero-visual"

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E5E7EB] font-mono selection:bg-green-500/20 selection:text-green-500 overflow-x-hidden">

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 flex items-center justify-center rounded-sm group-hover:border-green-500/60 transition-colors">
              <LiquiFlashLogo className="w-5 h-5 text-green-500 group-hover:animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight group-hover:text-green-400 transition-colors">LiquiFlash</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-green-400 transition-colors hidden md:block">
              Live Demo
            </Link>
            {/* AppKit Connect Button would go here */}
            {/* <appkit-button balance="hide" /> */}

            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-green-500 text-[#05070A] hover:bg-green-400 transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] rounded-sm"
            >
              Launch Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Spotlight Source */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Column: Text Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-green-950/30 border border-green-500/30 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-bold text-green-400 tracking-wide">SYSTEM OPERATIONAL: v2.0</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] text-white">
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 animate-neon-flicker drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">0MS</span> <br />
                ADVANTAGE.
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground/80 mb-12 leading-relaxed border-l-2 border-green-500/20 pl-6">
                Institutional-grade aggregation for the decentralized web. <br />
                <span className="text-white font-medium">See events before the block is mined.</span>
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group w-full sm:w-auto px-8 py-5 text-sm font-bold uppercase tracking-wider bg-green-500 text-[#05070A] hover:bg-green-400 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] rounded-sm flex items-center justify-center gap-3"
                >
                  <Terminal className="w-5 h-5" />
                  Initialize Terminal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              
              </motion.div>

              {/* Metrics */}
              <motion.div variants={fadeInUp} className="mt-16 flex items-center gap-8 sm:gap-12 border-t border-white/5 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white tabular-nums">4<span className="text-green-500 text-lg">ms</span></div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Latency</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tabular-nums">$2.4<span className="text-green-500 text-lg">B+</span></div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Volume Indexed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tabular-nums">12<span className="text-green-500 text-lg">k</span></div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Active Snipers</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative h-full flex items-center justify-center lg:justify-end"
            >
              <HeroVisual />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Feature Grid (Bento) */}
      <section className="py-32 bg-[#05070A] relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">System Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">Built on the x402 Execution Standard. Optimized for HFT strategies.</p>
          </div>

          <div className="grid md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">

            {/* Main Feature - Large */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 md:row-span-2 group relative p-8 bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div>
                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">Liquify Indexer</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Direct mempool monitoring detects `PoolCreated` events 2-3 blocks faster than standard RPCs.
                  Our proprietary node infrastructure bypasses public gatekeepers.
                </p>
              </div>
              <div className="w-full h-32 mt-8 bg-black/50 rounded-lg border border-white/5 relative overflow-hidden">
                {/* Abstract Data Viz */}
                <div className="absolute top-1/2 left-4 w-[80%] h-1 bg-green-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-[40%] h-full bg-green-500"
                  />
                </div>
                <div className="absolute top-[60%] left-4 w-[60%] h-1 bg-green-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
                    className="w-[70%] h-full bg-green-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* Secondary Feature - Wide */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 group relative p-8 bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors rounded-xl overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">x402 Execution Engine</h3>
                  <p className="text-muted-foreground text-sm">Zero-latency signing via pre-approved session keys.</p>
                </div>
                <div className="hidden md:block">
                  <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-[10px] text-blue-400 font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.3)]">Secure Enclave</div>
                </div>
              </div>
            </motion.div>

            {/* Tertiary Feature - Small */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 group relative p-8 bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors rounded-xl overflow-hidden"
            >
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sniper Watch</h3>
              <p className="text-muted-foreground text-xs">Real-time rug check analysis.</p>
            </motion.div>

            {/* Tertiary Feature - Small */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 group relative p-8 bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors rounded-xl overflow-hidden"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Chain</h3>
              <p className="text-muted-foreground text-xs">ETH, ARB, OP, BASE supported.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#05070A]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <p className="text-sm font-mono tracking-tight">© 2024 LiquiFlash Terminal. System Status: <span className="text-green-500 animate-pulse">OPERATIONAL</span></p>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-green-500 transition-colors hover:underline decoration-green-500/50 underline-offset-4">Documentation</a>
            <a href="#" className="hover:text-green-500 transition-colors hover:underline decoration-green-500/50 underline-offset-4">API Keys</a>
            <a href="#" className="hover:text-green-500 transition-colors hover:underline decoration-green-500/50 underline-offset-4">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
