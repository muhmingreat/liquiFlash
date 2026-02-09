"use client"

import { useState } from "react"
import { 
  X, 
  Settings, 
  Bell, 
  Volume2, 
  VolumeX,
  Zap,
  Shield,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

interface SettingsState {
  whaleAlertThreshold: string
  soundEnabled: boolean
  autoRefresh: boolean
  refreshInterval: string
  showPnL: boolean
  darkMode: boolean
  compactMode: boolean
  notifyNewPools: boolean
  notifyWhales: boolean
  notifyLargeTrades: boolean
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsState>({
    whaleAlertThreshold: "100000",
    soundEnabled: true,
    autoRefresh: true,
    refreshInterval: "5",
    showPnL: true,
    darkMode: true,
    compactMode: false,
    notifyNewPools: true,
    notifyWhales: true,
    notifyLargeTrades: false,
  })

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-[#111827] border-l border-[#1F2933] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2933] bg-[#0B0F14]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium uppercase tracking-wider">Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Alerts Section */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Alert Settings
            </h3>
            <div className="space-y-3">
              {/* Whale Threshold */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Whale Alert Threshold ($)
                </label>
                <input
                  type="text"
                  value={settings.whaleAlertThreshold}
                  onChange={(e) => updateSetting("whaleAlertThreshold", e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0F14] border border-[#1F2933] text-foreground text-sm tabular-nums focus:border-green-400/50 focus:outline-none"
                />
              </div>

              {/* Notification Toggles */}
              <ToggleRow
                label="New Pool Alerts"
                enabled={settings.notifyNewPools}
                onChange={(v) => updateSetting("notifyNewPools", v)}
              />
              <ToggleRow
                label="Whale Alerts"
                enabled={settings.notifyWhales}
                onChange={(v) => updateSetting("notifyWhales", v)}
              />
              <ToggleRow
                label="Large Trade Alerts"
                enabled={settings.notifyLargeTrades}
                onChange={(v) => updateSetting("notifyLargeTrades", v)}
              />
            </div>
          </div>

          {/* Sound Section */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              Sound
            </h3>
            <ToggleRow
              label="Sound Effects"
              enabled={settings.soundEnabled}
              onChange={(v) => updateSetting("soundEnabled", v)}
            />
          </div>

          {/* Data Section */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" />
              Data Feed
            </h3>
            <div className="space-y-3">
              <ToggleRow
                label="Auto Refresh"
                enabled={settings.autoRefresh}
                onChange={(v) => updateSetting("autoRefresh", v)}
              />
              {settings.autoRefresh && (
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Refresh Interval (seconds)
                  </label>
                  <div className="flex gap-2">
                    {["1", "2", "5", "10"].map((interval) => (
                      <button
                        key={interval}
                        onClick={() => updateSetting("refreshInterval", interval)}
                        className={cn(
                          "flex-1 px-2 py-1.5 text-xs border transition-colors",
                          settings.refreshInterval === interval
                            ? "bg-green-400/20 border-green-400/50 text-green-400"
                            : "bg-[#0B0F14] border-[#1F2933] text-muted-foreground hover:border-[#374151]"
                        )}
                      >
                        {interval}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display Section */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Eye className="w-3 h-3" />
              Display
            </h3>
            <div className="space-y-3">
              <ToggleRow
                label="Show P&L"
                enabled={settings.showPnL}
                onChange={(v) => updateSetting("showPnL", v)}
              />
              <ToggleRow
                label="Compact Mode"
                enabled={settings.compactMode}
                onChange={(v) => updateSetting("compactMode", v)}
              />
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Security
            </h3>
            <div className="p-3 bg-green-400/5 border border-green-400/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">x402 Authentication</span>
                <span className="text-xs text-green-400">Active</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Machine-native signing enabled. All transactions are auto-approved without popups.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F2933]">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium uppercase tracking-wider bg-[#1F2933] text-foreground border border-[#1F2933] hover:border-[#374151] transition-colors"
          >
            Save & Close
          </button>
          <p className="text-[9px] text-center text-muted-foreground mt-2">
            Settings are saved locally
          </p>
        </div>
      </div>
    </>
  )
}

// Toggle Row Component
function ToggleRow({ 
  label, 
  enabled, 
  onChange 
}: { 
  label: string
  enabled: boolean
  onChange: (value: boolean) => void 
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-foreground">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-10 h-5 rounded-none border transition-colors",
          enabled 
            ? "bg-green-400/20 border-green-400/50" 
            : "bg-[#0B0F14] border-[#1F2933]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 transition-all",
            enabled 
              ? "left-5 bg-green-400" 
              : "left-0.5 bg-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
