import { fetchFromNSE, fetchJsonFromNSE } from '../nse/client'
import type { Company } from '../nse/types'

function splitCsvLine(line: string) {
    const result: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
            inQuotes = !inQuotes
            continue
        }
        if (ch === ',' && !inQuotes) {
            result.push(cur)
            cur = ''
            continue
        }
        cur += ch
    }
    result.push(cur)
    return result.map((s) => s.trim())
}

export async function ingestCompanies(): Promise<Company[]> {
    try {
        // Use the RapidAPI NSE `/stocks` endpoint to list securities.
        const limit = 1000
        let skip = 0
        const results: Company[] = []

        while (true) {
            const params = { limit: String(limit), skip: String(skip) }
            const res: any = await fetchJsonFromNSE('/stocks', params).catch((e) => {
                console.error('fetchJsonFromNSE /stocks error', e)
                return null
            })
            if (!res) {
                console.warn('No response from /stocks; check RAPIDAPI_KEY and connectivity')
                break
            }
            if (!res.success) {
                console.warn('/stocks returned success=false', res)
                break
            }

            const data = res.data || []
            for (const it of data) {
                if (!it.ticker) continue
                results.push({ symbol: it.ticker, name: it.name || it.company || it.ticker, isin: undefined, sector: undefined })
            }

            if (data.length < limit) break
            skip += limit
        }

        return results
    } catch (err) {
        console.error('ingestCompanies error', err)
        return []
    }
}
