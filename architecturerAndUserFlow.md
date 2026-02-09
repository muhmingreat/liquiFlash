# LiquiFlash — Architecture & User Flow

## 1. High-Level System Architecture

LiquiFlash is composed of three primary layers:

1. **Presentation Layer (Frontend Terminal)**
2. **Data Indexing Layer (Liquify)**
3. **Execution & Payment Layer (x402 + Wallet Infrastructure)**

---

## 2. Frontend Architecture

### Framework

* Next.js 14 (App Router)
* Edge-first rendering strategy

### State Management

* Zustand for high-frequency event state
* Event batching to minimize re-renders

### Rendering Strategy

* Server Components for layout & shell
* Client Components for live data feeds

---

## 3. Data Flow (Liquify Integration)

### Event Sources

* Factory Contracts → PoolCreated
* Router Contracts → Swap

### Ingestion Flow

1. Liquify indexer detects on-chain event
2. Event exposed via Liquify API
3. Frontend polls or subscribes (webhook/stream)
4. Raw event normalized into internal TradeEvent object
5. Zustand store updates
6. UI renders within milliseconds

### Event Object Model (Conceptual)

* Event ID
* Timestamp
* Block Number
* Token Pair
* Liquidity Size
* Transaction Value
* Event Type

---

## 4. Execution Flow (x402 Integration)

### Conceptual Model

x402 introduces **HTTP-native payments** into the execution pipeline.

### Trade Execution Flow

1. User clicks "Buy" on an event row
2. Frontend sends HTTP request to execution endpoint
3. Server responds with `402 Payment Required`
4. Client automatically attaches payment authorization
5. Request retries with payment proof
6. Execution endpoint triggers smart contract call
7. Trade confirmation returned to UI

### Key UX Principle

* Payment is invisible to the user
* No modal interruptions
* No repeated approvals per action

---

## 5. User Flow — Primary Scenario (Sniping a New Pool)

1. User opens LiquiFlash terminal
2. Live Event Stream starts auto-scrolling
3. New PoolCreated event appears (highlighted)
4. User scans liquidity + token info
5. User clicks "Buy"
6. x402 payment + execution happen automatically
7. UI shows success state within seconds

---

## 6. User Flow — Whale Alert Scenario

1. Large Swap event detected
2. Event row pulses / highlights
3. User evaluates impact
4. User executes counter-trade or follow trade

---

## 7. Error & Edge Case Handling

* Duplicate events filtered by tx hash
* Failed execution surfaced inline
* Latency indicators shown per event

---

## 8. Scalability Considerations (Post-MVP)

* WebSocket streaming
* Multi-chain Liquify feeds
* Bot-accessible x402 endpoints

---

## 9. Architecture Principles

* Speed over completeness
* Deterministic flows
* Minimal UI friction
* Machine-first, human-assisted
