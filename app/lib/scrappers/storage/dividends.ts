import { db } from '@/app/index'
import { dividends, companies } from '@/app/db/schema'
import { eq } from 'drizzle-orm'

import type { Dividend } from '../nse/types'

export async function saveDividends(items: Dividend[], source = 'nse') {
    if (!items || items.length === 0) return 0

    const rows: any[] = []

    for (const d of items) {
        const [company] = await db.select().from(companies).where(eq(companies.ticker, d.symbol)).limit(1)
        if (!company) continue

        rows.push({
            companyId: company.id,
            exDate: d.exDate ?? null,
            paymentDate: d.recordDate ?? null,
            amountPerShare: d.amount ?? null,
            currency: d.currency ?? 'KES',
            type: null,
            source,
        })
    }

    if (rows.length === 0) return 0

    await db.insert(dividends).values(rows)
    return rows.length
}
