"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Zap, Activity, Lock, Search, TrendingUp, Shield, Terminal, Globe, Cpu } from "lucide-react"

export function HeroVisual() {
    const controls = useAnimation()

    useEffect(() => {
        controls.start("visible")
    }, [controls])

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center perspective-[2000px] overflow-visible select-none">

            {/* Background Ambient Glow */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Main 3D Container - The "Terminal" */}
            <motion.div
                initial={{ rotateX: 20, rotateY: -20, opacity: 0, y: 50 }}
                animate={{ rotateX: 10, rotateY: -15, opacity: 1, y: 0 }}
                transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    rotateX: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    rotateY: { duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                className="relative w-[340px] md:w-[580px] h-[420px] bg-[#0B0F14]/90 border border-green-500/20 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.15)] backdrop-blur-xl flex flex-col overflow-hidden transform-style-3d"
                style={{ transformStyle: "preserve-3d" }}
            >

                {/* Terminal Header */}
                <div className="h-10 border-b border-green-500/20 bg-green-950/20 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-green-500/70 font-mono tracking-widest uppercase">
                        <Lock className="w-3 h-3" />
                        SECURE_SHA256
                    </div>
                </div>

                {/* Dashboard Content Grid */}
                <div className="flex-1 p-4 grid grid-cols-12 grid-rows-6 gap-3 font-mono">

                    {/* Main Chart Area (Top Left) */}
                    <div className="col-span-8 row-span-4 bg-green-500/5 rounded border border-green-500/10 relative overflow-hidden group">
                        <div className="absolute top-2 left-3 text-[10px] text-green-500/50 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> VOL_INDEX // LIVE
                        </div>

                        {/* Animated Chart Line simulation */}
                        <svg className="absolute bottom-0 left-0 w-full h-[70%] opacity-50" preserveAspectRatio="none">
                            <motion.path
                                d="M0 50 Q 50 40 100 60 T 200 40 T 300 50 T 400 30 T 500 60 V 100 H 0 Z"
                                fill="url(#gradient)"
                                stroke="rgba(74, 222, 128, 0.5)"
                                strokeWidth="1"
                                animate={{ d: "M0 50 Q 50 30 100 70 T 200 30 T 300 60 T 400 20 T 500 70 V 100 H 0 Z" }}
                                transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(74, 222, 128, 0.2)" />
                                    <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Scanning Line overlay */}
                        <motion.div
                            className="absolute top-0 bottom-0 w-[1px] bg-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.8)] z-10"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Right Panel: Event Feed (Top Right) */}
                    <div className="col-span-4 row-span-6 bg-black/40 rounded border border-white/5 p-2 flex flex-col gap-2 overflow-hidden relative">
                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Mempool Scan</div>
                        <div className="space-y-2 relative z-10">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.4, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                                    className="p-2 bg-green-500/5 border border-green-500/10 rounded"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] text-green-400 font-bold">SWAP</span>
                                        <span className="text-[8px] text-gray-500">Just now</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-white">ETH/USDC</span>
                                        <span className="text-[9px] text-green-500">+4.2%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Gradient fade at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0B0F14] to-transparent z-20" />
                    </div>

                    {/* Bottom Left: Metrics (Bottom Left) */}
                    <div className="col-span-8 row-span-2 grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded p-2 border border-white/5 flex flex-col justify-center">
                            <div className="text-[9px] text-muted-foreground uppercase">Gas Price</div>
                            <div className="text-xl text-white font-bold tabular-nums">15<span className="text-xs text-green-500 ml-1">gwei</span></div>
                        </div>
                        <div className="bg-white/5 rounded p-2 border border-white/5 flex flex-col justify-center">
                            <div className="text-[9px] text-muted-foreground uppercase">Block Height</div>
                            <div className="text-xl text-white font-bold tabular-nums">#19,421</div>
                        </div>
                    </div>

                </div>

                {/* Highlight Reflection */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Elements - Z-Depth */}

            {/* 1. Floating Badge Top Right */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-10 right-0 md:-right-10 bg-[#0B0F14] border border-green-500/40 p-3 rounded-lg shadow-xl backdrop-blur-md transform translate-z-10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-400">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase">Protection</div>
                        <div className="text-xs font-bold text-white">MEV Shield Active</div>
                    </div>
                </div>
            </motion.div>

            {/* 2. Floating Code Graphic Bottom Left */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-20 left-0 md:-left-12 bg-[#0B0F14]/90 border border-green-500/30 p-4 rounded-lg shadow-2xl backdrop-blur-md font-mono text-[10px]"
            >
                <div className="text-green-500 mb-1">$ liq flash --init</div>
                <div className="text-gray-400 space-y-1">
                    <div>{`> Connecting node...`}</div>
                    <div>{`> Verifying simple keys... [OK]`}</div>
                    <div className="text-green-400">{`> Sniper Ready.`}</div>
                </div>
            </motion.div>

            {/* 3. Floating Latency Pill */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-20 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            >
                0ms Latency
            </motion.div>

        </div>
    )
}

