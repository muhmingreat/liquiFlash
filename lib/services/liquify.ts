import { TradeEvent, EventType } from "@/types"

export interface LiquifyConfig {
    apiKey?: string
    wsEndpoint: string
}

export class LiquifyService {
    private ws: WebSocket | null = null
    private subscribers: ((event: TradeEvent) => void)[] = []

    constructor(private config: LiquifyConfig = { wsEndpoint: "wss://api.liquiflash.io/v1/stream" }) { }

    connect() {
        console.log("[Liquify] Connecting to", this.config.wsEndpoint)
        // Mock connection for now
        this.ws = {
            send: (data: string) => console.log("[Liquify] Sent:", data),
            close: () => console.log("[Liquify] Closed"),
        } as unknown as WebSocket
    }

    subscribe(callback: (event: TradeEvent) => void) {
        this.subscribers.push(callback)
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== callback)
        }
    }

    // Helper to simulate incoming events (for dev/demo)
    simulateEvent(event: TradeEvent) {
        this.subscribers.forEach(cb => cb(event))
    }
}

export const liquify = new LiquifyService()
