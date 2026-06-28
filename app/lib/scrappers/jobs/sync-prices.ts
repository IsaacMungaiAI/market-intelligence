import { ingestPrices } from '../ingestion/prices'
import { savePrices } from '../storage/prices'

export async function syncPricesJob(symbol?: string) {
    const prices = await ingestPrices(symbol ?? '')
    console.log(`syncPricesJob: fetched ${prices.length} price rows for ${symbol}`)

    const saved = await savePrices(prices)
    console.log(`syncPricesJob: saved ${saved} price rows for ${symbol}`)

    return { fetched: prices.length, saved }
}
