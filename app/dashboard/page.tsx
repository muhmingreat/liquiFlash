"use client"

import { useState } from "react"
import { Header } from "@/components/liquiflash/header"
import { EventStream } from "@/components/liquiflash/event-stream"
import { ExecutionConsole } from "@/components/liquiflash/execution-console"
import { TradeHistory } from "@/components/liquiflash/trade-history"
import { StatusBar } from "@/components/liquiflash/status-bar"
import { MobileExecutionDrawer } from "@/components/liquiflash/mobile-execution-drawer"
import { MobileNav } from "@/components/liquiflash/mobile-nav"
import { SettingsPanel } from "@/components/liquiflash/settings-panel"

interface SelectedEvent {
    tokenPair: string
    liquidity: string
    impact: string
}

export default function LiquiFlashDashboard() {
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const [mobileActiveTab, setMobileActiveTab] = useState<"stream" | "history">("stream")
    const [settingsOpen, setSettingsOpen] = useState(false)

    const handleSelectEvent = (event: { tokenPair: string; liquidity: string; impact: string }) => {
        setSelectedEvent({
            tokenPair: event.tokenPair,
            liquidity: event.liquidity,
            impact: event.impact,
        })
        // Auto-open drawer on mobile when selecting an event
        setMobileDrawerOpen(true)
    }

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0F14]">
            {/* Header */}
            <Header onSettingsClick={() => setSettingsOpen(true)} />

            {/* Main Content - Desktop/Tablet Layout */}
            <main className="flex-1 hidden md:flex overflow-hidden">
                {/* Left Panel - Event Stream (70% on desktop, 60% on tablet) */}
                <div className="w-full md:w-[60%] lg:w-[70%] h-full p-2 md:pr-1">
                    <EventStream onSelectEvent={handleSelectEvent} />
                </div>

                {/* Right Panel - Execution & History (40% on tablet, 30% on desktop) */}
                <div className="w-full md:w-[40%] lg:w-[30%] h-full p-2 md:pl-1 flex flex-col gap-2">
                    {/* Execution Console (60% of right panel) */}
                    <div className="h-[60%]">
                        <ExecutionConsole selectedEvent={selectedEvent} />
                    </div>

                    {/* Trade History (40% of right panel) */}
                    <div className="h-[40%]">
                        <TradeHistory />
                    </div>
                </div>
            </main>

            {/* Mobile Layout */}
            <main className="flex-1 flex flex-col md:hidden overflow-hidden">
                {/* Mobile Content Area */}
                <div className="flex-1 p-2 overflow-hidden">
                    {mobileActiveTab === "stream" ? (
                        <EventStream onSelectEvent={handleSelectEvent} isMobile />
                    ) : (
                        <TradeHistory isMobile />
                    )}
                </div>
            </main>

            {/* Mobile Bottom Navigation - Only on mobile */}
            <div className="md:hidden">
                <MobileNav
                    activeTab={mobileActiveTab}
                    onTabChange={setMobileActiveTab}
                    onExecuteClick={() => setMobileDrawerOpen(true)}
                    hasSelectedEvent={!!selectedEvent}
                />
            </div>

            {/* Mobile Execution Drawer */}
            <MobileExecutionDrawer
                open={mobileDrawerOpen}
                onOpenChange={setMobileDrawerOpen}
                selectedEvent={selectedEvent}
            />

            {/* Status Bar - Hidden on mobile */}
            <div className="hidden md:block">
                <StatusBar />
            </div>

            {/* Settings Panel */}
            <SettingsPanel
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    )
}
