# Piplet 💧

<img src="assets/piplet-logo-512.png" alt="Piplet" width="120" />

Take a sip, not a gulp. A tiny, friendly position size calculator for **forex pairs**, **gold / silver**, and **US indices (US30, NAS100, SP500)**.

White + blue theme. No backend, no dependencies, no API keys — pure HTML/CSS/JS. Works offline. Host free on GitHub Pages.

## Files

- `index.html` — UI (pair dropdown, account size, risk %/$, stop loss, conditional price)
- `styles.css` — white + blue theme
- `app.js` — instrument table + math
- `assets/` — Piplet logo, header mark and favicons (PNG + ICO)

## Math (USD account)

- `Risk$ = Account × Risk% ÷ 100` (or direct $ amount)
- **XXX/USD + Gold/Silver:** pip value fixed → `lots = Risk$ ÷ (SL × pipValue)`
  - Forex majors: $10 / pip / lot (100,000 × 0.0001)
  - Gold: 100 oz × 0.1 = $10 / pip / lot
  - Silver: 5,000 oz × 0.01 = $50 / pip / lot
- **USD/XXX + crosses:** `pipValue = (pip × 100,000) ÷ or × conversionRate` → `lots = Risk$ ÷ (SL × pipValue)`
  - Enter the one conversion price from your broker (e.g. USD/JPY for JPY pairs)
- **Indices (contract = 1):** `lots = Risk$ ÷ (SL_points × 1)` — $1 per point per 1.0 lot

Lots are rounded **down** to 2 decimals for safety.

## Run locally

Just open `index.html` in a browser. No build step.

## Broker note

Confirm contract sizes with your broker. This app assumes forex = 100,000 and indices = 1. If your broker uses different specs, edit the `INSTRUMENTS` table in `app.js` (one line per symbol).

## Disclaimer

Educational tool only — not financial advice.
