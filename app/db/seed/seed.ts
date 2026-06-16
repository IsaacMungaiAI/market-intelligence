import { db } from "@/app/index";
import { companies, stockPrices, dividends } from "../schema";
import { companiesSeed } from "./data";
import { generatePriceSeries, generateFinancials } from "../seed/generators";

export async function seedDatabase() {
    console.log("🌱 Seeding KMIP database...");

    for (const c of companiesSeed) {
        // 1. Insert company
        const [company] = await db
            .insert(companies)
            .values({
                ticker: c.ticker,
                name: c.name,
                sector: c.sector,
                currency: "KES",
            })
            .returning();

        console.log(`Inserted company: ${company.ticker}`);

        // 2. Generate stock prices
        const prices = generatePriceSeries({
            basePrice: c.basePrice,
            volatility: c.volatility,
            days: 180,
        });

        await db.insert(stockPrices).values(
            prices.map((p) => ({
                companyId: company.id,
                date: p.date,
                open: p.open.toFixed(2),
                high: p.high.toFixed(2),
                low: p.low.toFixed(2),
                close: p.close.toFixed(2),
                volume: p.volume,
                source: "seed",
            }))
        );

        // 3. Generate dividend (realistic interval)
        const financials = generateFinancials(c.basePrice * 1000000);

        await db.insert(dividends).values({
            companyId: company.id,
            exDate: new Date().toISOString().split("T")[0],
            amountPerShare: (financials.dividend / 1000000).toFixed(4),
            type: "final",
            source: "seed",
        });
    }

    console.log("✅ Seeding complete");
}

seedDatabase()
    .then(() => {
        console.log("🎯 Seed finished successfully");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    });