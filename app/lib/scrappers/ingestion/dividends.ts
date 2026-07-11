import { fetchFromNSE, fetchJsonFromNSE } from '../nse/client'

import type { Dividend } from '../nse/types'

export async function ingestDividends(symbol?: string): Promise<Dividend[]> {
    try {
        const candidates = ['/api/corporate-announcements', '/corporate-announcements', '/announcements']
        const items: Dividend[] = []

        for (const p of candidates) {
            try {
                const data: Record<string, unknown> | unknown[] | null = await fetchJsonFromNSE(p).catch(() => null)
                if (!data) continue

                const announcements = Array.isArray(data) ? data : data.announcements || data.items || []
                for (const a of announcements) {
                    const title = (a.title || a.description || '').toString().toLowerCase()
                    if (!title.includes('dividend')) continue

                    const sym = a.symbol || a.ticker || symbol || undefined
                    items.push({
                        symbol: sym,
                        exDate: a.exDate || a.ex_date || undefined,
                        recordDate: a.recordDate || a.record_date || undefined,
                        amount: a.amount || a.dividend || undefined,
                        currency: a.currency || undefined,
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
