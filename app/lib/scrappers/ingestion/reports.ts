import { fetchFromNSE } from '../nse/client'
import type { Report } from '../nse/types'

export async function ingestReports(symbol?: string): Promise<Report[]> {
    try {
        // candidate endpoints on Nairobi NSE for corporate reports
        const candidates = [
            `/corporate-reports/${symbol || ''}`,
            `/reports/${symbol || ''}`,
            '/reports',
            '/corporate-reports',
        ]

        const reports: Report[] = []

        for (const p of candidates) {
            try {
                const text = await fetchFromNSE(p).catch(() => null)
                if (!text) continue

                // If JSON
                if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
                    try {
                        const data = JSON.parse(text)
                        const items = Array.isArray(data) ? data : data.reports || data.items || []
                        for (const it of items) {
                            reports.push({
                                symbol: it.symbol || symbol,
                                period: it.period || it.date || undefined,
                                url: it.url || it.link || undefined,
                                title: it.title || it.name || undefined,
                                publishedAt: it.publishedAt || it.date || undefined,
                            })
                        }
                        if (reports.length) return reports
                    } catch (_) {
                        // not JSON
                    }
                }

                // Try to extract PDF/report links from HTML
                if (text.includes('<')) {
                    const linkRe = /href=["']([^"']+\.(pdf|docx?|xlsx?))["']/gi
                    let m
                    while ((m = linkRe.exec(text))) {
                        const url = m[1]
                        reports.push({ symbol: symbol ?? '', period: undefined, url, title: undefined, publishedAt: undefined })
                    }
                    if (reports.length) return reports
                }
            } catch (e) {
                continue
            }
        }

        return reports
    } catch (err) {
        console.error('ingestReports error', err)
        return []
    }
}
