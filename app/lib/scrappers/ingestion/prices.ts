import { fetchJsonFromNSE } from '../nse/client'
import type { Price } from '../nse/types'

// Cache to avoid multiple API calls
let cachedStocks: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 1 minute

export async function ingestPrices(symbol: string, from?: string, to?: string): Promise<Price[]> {
    if (!symbol) return []

    try {
        // Fetch all stocks from the API (this is the only working endpoint)
        const now = Date.now()
        if (!cachedStocks || (now - cacheTimestamp) > CACHE_DURATION) {
            const res: any = await fetchJsonFromNSE('/stocks', { limit: '1000' })
            if (res && res.success && res.data) {
                cachedStocks = res.data
                cacheTimestamp = now
            } else {
                return []
            }
        }

        // Find the specific stock by symbol
        const stock = cachedStocks?.find((s: any) => s.ticker === symbol)
        if (!stock) return []

        const price = parseFloat(String(stock.price || ''))
        const volRaw = stock.volume || ''
        const volume = typeof volRaw === 'string' ? parseInt(volRaw.replace(/[, ]/g, ''), 10) : volRaw
        const date = new Date().toISOString().split('T')[0]

        if (!isNaN(price)) {
            return [
                {
                    symbol,
                    date,
                    open: undefined,
                    high: undefined,
                    low: undefined,
                    close: price,
                    volume: Number.isFinite(volume) ? volume : undefined,
                },
            ]
        }

        return []
    } catch (err) {
        console.error('ingestPrices error', err)
        return []
    }
}
