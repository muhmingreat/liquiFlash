"use client"

import { cn } from "@/lib/utils"

export function LiquiFlashLogo({ className }: { className?: string }) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-green-400"
            >
                <defs>
                    <clipPath id="bolt-clip">
                        {/* Sharp, aggressive geometric bolt design */}
                        <path d="M55 2L42 50H65L45 98L58 50H35L55 2Z" />
                    </clipPath>
                </defs>

                {/* Base Shape - Plain Color */}
                <path
                    d="M55 2L42 50H65L45 98L58 50H35L55 2Z"
                    fill="currentColor"
                    className="drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                />

                {/* Animation Layer: A scan line / energy pulse moving through the bolt */}
                <g clipPath="url(#bolt-clip)">
                    <rect
                        x="0"
                        y="-100"
                        width={100}
                        height={50}
                        fill="white"
                        fillOpacity="0.5"
                        className="animate-scan-fast"
                    />
                </g>
            </svg>
        </div>
    )
}
