import { fetchFromNSE, fetchJsonFromNSE } from '../nse/client'

import type { Dividend } from '../nse/types'

export async function ingestDividends(symbol?: string): Promise<Dividend[]> {
    try {
        const candidates = ['/api/corporate-announcements', '/corporate-announcements', '/announcements']
        const items: Dividend[] = []

        for (const p of candidates) {
            try {
                const data: Record<string, unknown> | null = await fetchJsonFromNSE(p).catch(() => null)
                if (!data) continue

                const announcements: unknown[] = Array.isArray(data) ? data : ((data.announcements || data.items) as unknown[] | undefined) ?? []
                for (const a of announcements) {
                    if (typeof a !== 'object' || a === null) continue
                    const record = a as Record<string, unknown>
                    const title = ((record.title || record.description || '') as string).toLowerCase()
                    if (!title.includes('dividend')) continue

                    const sym = (record.symbol || record.ticker || symbol) as string | undefined
                    if (!sym) continue
                    items.push({
                        symbol: sym,
                        exDate: (record.exDate || record.ex_date) as string | undefined,
                        recordDate: (record.recordDate || record.record_date) as string | undefined,
                        amount: (record.amount || record.dividend) as number | undefined,
                        currency: record.currency as string | undefined,
                    })
                }
            } catch {
                continue
            }
        }

        // Fallback: try to fetch an HTML announcements page and search for 'dividend'
        try {
            const html = await fetchFromNSE('/corporate-announcements.html').catch(() => null)
            if (html && html.includes('dividend')) {
                const re = /([A-Z\.\-]{1,8})[^<]{0,60}dividend/gi
                let m
                while ((m = re.exec(html))) {
                    items.push({ symbol: m[1], amount: undefined })
                }
            }
        } catch {
            // ignore
        }

        return items
    } catch (err) {
        console.error('ingestDividends error', err)
        return []
    }
}
