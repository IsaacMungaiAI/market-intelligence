import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/app/services/dashboard.service";
import type { DashboardData, SectorAllocation } from "@/lib/types";

function formatKES(value: number): string {
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `KES ${(value / 1_000).toFixed(1)}K`;
  return `KES ${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}KES ${Math.abs(value).toLocaleString()}`;
}

export default async function DashboardPage() {
  const data: DashboardData = await getDashboardData();
  const { stats, watchlist, signals, sectorAllocation } = data;

  const portfolioStats = [
    {
      label: "Portfolio value",
      value: formatKES(stats.portfolioValue),
      change: formatPercent(stats.portfolioChangePercent),
      tone:
        stats.portfolioChangePercent >= 0
          ? "text-emerald-300"
          : "text-rose-300",
    },
    {
      label: "Today's movement",
      value: formatChange(stats.portfolioChange),
      change: formatPercent(stats.portfolioChangePercent),
      tone:
        stats.portfolioChangePercent >= 0
          ? "text-emerald-300"
          : "text-rose-300",
    },
    {
      label: "Risk exposure",
      value: "Medium",
      change: "Balanced",
      tone: "text-amber-300",
    },
    {
      label: "Active positions",
      value: `${stats.holdingsCount}`,
      change: `${stats.watchlistCount} watched`,
      tone: "text-sky-300",
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[1.4fr_0.6fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
              Overview
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 dark:text-white md:text-4xl">
              Investment intelligence for your portfolio, watchlists, and market signals.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Track performance, review exposure, and spot high-priority changes from a single dashboard.
            </p>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-300/20 dark:bg-emerald-400/10">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-100">
              Market pulse
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
              {stats.portfolioChangePercent >= 0 ? "Bullish" : "Bearish"}
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800 dark:text-emerald-100/80">
              Portfolio {stats.portfolioChangePercent >= 0 ? "up" : "down"}{" "}
              {formatPercent(Math.abs(stats.portfolioChangePercent))} overall.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {portfolioStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-sm font-semibold ${stat.tone}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Watchlist movers</CardTitle>
            <CardDescription>
              Priority counters from your active watchlists.
            </CardDescription>
          </CardHeader>

          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {watchlist.length === 0 && (
              <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
                No items in your watchlist yet.
              </div>
            )}
            {watchlist.map((stock) => {
              const isPositive = stock.changePercent >= 0;

              return (
                <div
                  key={stock.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-bold text-emerald-700 dark:border-white/10 dark:bg-slate-950 dark:text-emerald-200">
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {stock.ticker}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stock.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {stock.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isPositive ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {formatPercent(stock.changePercent)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector allocation</CardTitle>
            <CardDescription>
              Current exposure by sector weight.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {sectorAllocation.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No holdings to calculate allocation.
              </p>
            )}
            {sectorAllocation.map((item: SectorAllocation) => (
              <div key={item.sector}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-950 dark:text-white">
                    {item.sector}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.weight.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-2 rounded-full bg-emerald-400`}
                    style={{ width: `${item.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {signals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <CardTitle>Intelligence signals</CardTitle>
              <CardDescription className="mt-1">
                Items that may need attention before the next market close.
              </CardDescription>
            </div>
            <span className="w-fit rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:text-slate-300">
              Updated today
            </span>
          </CardHeader>

          <CardContent className="grid gap-4 lg:grid-cols-3">
            {signals.map((signal) => (
              <article
                key={signal.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60"
              >
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-white/10 dark:text-emerald-200">
                  {signal.category}
                </span>
                <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">
                  {signal.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {signal.description}
                </p>
              </article>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
