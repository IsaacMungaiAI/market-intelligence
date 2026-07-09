# KMIP — Market Intelligence Platform

A full-stack portfolio tracking and market intelligence platform for the Nairobi Stock Exchange (NSE). Track holdings, watch stocks, receive intelligence signals, and explore company data — all powered by live scraped NSE data.

## Features

- **Dashboard** — Portfolio value, daily movement, risk exposure, sector allocation, watchlist movers, and market pulse
- **Portfolio Management** — Add/manage holdings with P&L tracking, return %, and diversification analysis
- **Watchlist Center** — Track priority counters with real-time price and change data
- **Companies** — Browse and search all companies listed on the NSE
- **Intelligence Signals** — Info, warning, and critical alerts related to your portfolio
- **Notifications** — In-app bell notifications with OneSignal push support
- **Data Scraper** — Automated daily scraper (GitHub Actions) that syncs company listings, price history, and dividends from the NSE
- **ML Experimentation** — Schema and infrastructure for price prediction, risk analysis, and revenue forecasting (XGBoost, LSTM, Prophet)
- **AI Analysis** — LLM-powered company summaries, risk analysis, and RAG on financial report embeddings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Radix UI (shadcn/ui), Lucide icons |
| Auth | NextAuth.js v4 (Google & GitHub OAuth, JWT sessions) |
| Database | PostgreSQL via Neon (serverless), Drizzle ORM |
| Scraping | Custom NSE scraper via RapidAPI gateway |
| CI | GitHub Actions (daily scrape at 02:00 UTC) |

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # configure DB URL, OAuth keys, API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google or GitHub.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run seed` | Seed the database with sample data |
| `npm run scrape` | Run the NSE data scraper manually |

## Scraping

See [README-SCRAPER.md](./README-SCRAPER.md) for scraper setup, GitHub Actions configuration, and required secrets.

## Project Structure

```
app/           Next.js App Router (routes, API endpoints, components)
├── (dashboard)/   Authenticated dashboard pages
├── api/           REST API routes
├── auth/          Sign-in pages
├── components/    App-specific components
├── db/            Drizzle schema, migrations, seed scripts
├── lib/           Auth utilities and scraper pipeline (NSE client → ingestion → storage)
├── services/      Business logic (portfolio, watchlist, signals, notifications)
components/ui/  Shared shadcn/ui primitives (button, card, dialog, table, etc.)
lib/            Shared utilities (cn helper, types)
scripts/        CLI entry point for the scraper
drizzle/        Database migrations
```
