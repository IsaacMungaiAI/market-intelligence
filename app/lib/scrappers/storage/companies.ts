import { db } from '@/app/index'
import { companies } from '@/app/db/schema'
import { eq } from 'drizzle-orm'

import type { Company } from '../nse/types'

export async function upsertCompanies(rows: Company[]) {
    if (!rows || rows.length === 0) return 0

    // Map incoming rows into DB shape and upsert by ticker
    const values = rows.map((r) => ({
        ticker: r.symbol,
        name: r.name ?? r.symbol,
        sector: r.sector ?? null,
        industry: null,
    }))

    // Insert many, ignore conflicts (existing companies), return count inserted
    await db.insert(companies).values(values).onConflictDoNothing()

    return values.length
}

export async function getCompanyByTicker(ticker: string) {
    const [c] = await db.select().from(companies).where(eq(companies.ticker, ticker)).limit(1)
    return c
}
