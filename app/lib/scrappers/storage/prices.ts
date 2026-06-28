import { db } from '@/app/index'
import { stockPrices, companies } from '@/app/db/schema'

import type { Price } from '../nse/types'

export async function savePrices(prices: Price[], source = 'nse') {
    if (!prices || prices.length === 0) return 0

    // Attempt to resolve company ids by ticker first
    const rowsToInsert = [] as any[]

    for (const p of prices) {
        // Find company by ticker
        const [company] = await db.select().from(companies).where(companies.ticker.eq(p.symbol)).limit(1)
        if (!company) continue

        rowsToInsert.push({
            companyId: company.id,
            date: p.date,
            open: p.open ?? null,
            high: p.high ?? null,
            low: p.low ?? null,
            close: p.close,
            adjustedClose: p.close,
            volume: p.volume ?? null,
            source,
        })
    }

    if (rowsToInsert.length === 0) return 0

    // Bulk insert; conflicts are allowed to create duplicate rows unless unique constraint exists
    await db.insert(stockPrices).values(rowsToInsert)
    return rowsToInsert.length
}
