import { ingestDividends } from '../ingestion/dividends'
import { saveDividends } from '../storage/dividends'

export async function syncDividendsJob(symbol?: string) {
    const divs = await ingestDividends(symbol)
    console.log(`syncDividendsJob: fetched ${divs.length} dividends for ${symbol}`)

    const saved = await saveDividends(divs)
    console.log(`syncDividendsJob: saved ${saved} dividends for ${symbol}`)

    return { fetched: divs.length, saved }
}
