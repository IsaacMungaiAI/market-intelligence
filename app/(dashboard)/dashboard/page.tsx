import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const portfolioStats = [
    {
        label: "Portfolio value",
        value: "KES 4.82M",
        change: "+8.4%",
        tone: "text-emerald-300",
    },
    {
        label: "Today's movement",
        value: "+KES 126.4K",
        change: "+2.7%",
        tone: "text-emerald-300",
    },
    {
        label: "Risk exposure",
        value: "Medium",
        change: "Balanced",
        tone: "text-amber-300",
    },
    {
        label: "Active positions",
        value: "18",
        change: "5 watched",
        tone: "text-sky-300",
    },
];

const watchlist = [
    { symbol: "SCOM", name: "Safaricom PLC", price: "18.45", change: "+1.9%" },
    { symbol: "EQTY", name: "Equity Group", price: "42.10", change: "+0.8%" },
    { symbol: "KCB", name: "KCB Group", price: "31.35", change: "-0.6%" },
    { symbol: "EABL", name: "East African Breweries", price: "168.00", change: "+2.2%" },
];

const signals = [
    {
        title: "Dividend watch",
        description: "Three holdings are approaching ex-dividend windows this quarter.",
        status: "Income",
    },
    {
        title: "Momentum shift",
        description: "Consumer and telecom counters are showing stronger relative performance.",
        status: "Market",
    },
    {
        title: "Concentration check",
        description: "Financial services allocation is above the target model by 6.2%.",
        status: "Risk",
    },
];

const allocation = [
    { sector: "Financials", weight: "38%", bar: "w-[38%]" },
    { sector: "Telecom", weight: "24%", bar: "w-[24%]" },
    { sector: "Consumer", weight: "21%", bar: "w-[21%]" },
    { sector: "Energy", weight: "17%", bar: "w-[17%]" },
];

export default function DashboardPage() {
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
                            Bullish
                        </p>
                        <p className="mt-2 text-sm leading-6 text-emerald-800 dark:text-emerald-100/80">
                            Broad market breadth improved, with defensive names holding steady.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {portfolioStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-5">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
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
                        {watchlist.map((stock) => {
                            const isPositive = stock.change.startsWith("+");

                            return (
                                <div
                                    key={stock.symbol}
                                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-5"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-bold text-emerald-700 dark:border-white/10 dark:bg-slate-950 dark:text-emerald-200">
                                        {stock.symbol.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-950 dark:text-white">
                                            {stock.symbol}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {stock.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-950 dark:text-white">
                                            {stock.price}
                                        </p>
                                        <p
                                            className={`text-sm font-semibold ${
                                                isPositive
                                                    ? "text-emerald-300"
                                                    : "text-rose-300"
                                            }`}
                                        >
                                            {stock.change}
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
                        {allocation.map((item) => (
                            <div key={item.sector}>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-slate-950 dark:text-white">
                                        {item.sector}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {item.weight}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div
                                        className={`h-2 rounded-full bg-emerald-400 ${item.bar}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

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
                            key={signal.title}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60"
                        >
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-white/10 dark:text-emerald-200">
                                {signal.status}
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
        </div>
    );
}
