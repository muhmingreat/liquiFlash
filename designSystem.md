# LiquiFlash — Design System (UI & UX Specification)

## 1. Design Philosophy

LiquiFlash follows a **"Terminal-First"** design philosophy:

* Information-dense
* High contrast
* Minimal decoration
* Immediate visual hierarchy

The UI should feel closer to **Bloomberg / TradingView Pro / Hacker terminals** than consumer apps.

---

## 2. Color System

### Base Palette

* Background: Near-black (#0B0F14)
* Surface Panels: Dark charcoal (#111827)
* Borders: Subtle gray (#1F2933)

### Semantic Colors

* Positive (Buy / Inflow): Neon green
* Negative (Sell / Outflow): Neon red
* Warning (Whale / New Pool): Amber / Electric yellow
* Neutral Data: Cool gray

### Accent Usage

* Accents used sparingly
* Only for actionable or urgent elements

---

## 3. Typography

### Primary Font

* Monospaced or mono-inspired font
* Examples: JetBrains Mono, IBM Plex Mono

### Hierarchy

* Small text dominates
* Large text only for critical values
* Numbers emphasized over labels

---

## 4. Layout System

### Grid

* Multi-column layout
* Resizable panels (future-ready)

### Core Panels

1. Event Stream (Primary)
2. Trade Execution Panel
3. System Status / Latency Indicators

---

## 5. Event Row Design

Each event row contains:

* Timestamp (relative time)
* Token Pair
* Event Type
* Liquidity / Swap Size
* Action Button (Buy)

### Visual Encoding

* Color-coded by event type
* Pulse animation for new events
* Subtle glow for whale events

---

## 6. Interaction Design

### Primary Actions

* One-click execution
* Hover reveals additional metadata

### Feedback States

* Loading: Inline spinner or shimmer
* Success: Green confirmation pulse
* Failure: Red inline error text

---

## 7. Motion & Animation

### Principles

* Fast
* Subtle
* Purpose-driven

### Examples

* New row slides in from top
* Whale alert pulses briefly
* No long easing curves

---

## 8. Accessibility & Usability

* High contrast ratios
* Keyboard navigable
* Tooltips for complex data

---

## 9. UX Tone

* Confident
* Technical
* Zero fluff

The interface should communicate:

> "This tool is built for speed and serious traders."

---

## 10. Do & Don’t

### Do

* Prioritize data density
* Highlight urgency
* Reduce clicks

### Don’t

* Use large empty spaces
* Add decorative illustrations
* Interrupt flow with modals
