#!/usr/bin/env node

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { syncCompaniesJob } from '../app/lib/scrappers/jobs/sync-companies'
import { syncPricesJob } from '../app/lib/scrappers/jobs/sync-prices'
import { syncDividendsJob } from '../app/lib/scrappers/jobs/sync-dividends'

const MAX_TICKERS = parseInt(process.env.SCRAPE_MAX_TICKERS || '10', 10)

async function runAll() {
    console.log('Starting scraper run...')

    if (!process.env.RAPIDAPI_KEY) {
        console.warn('Warning: RAPIDAPI_KEY is not set. Remote API calls will likely fail.')
    }

    try {
        const result = await syncCompaniesJob()
        console.log(`Companies found=${result.found} persisted=${result.persisted}`)

        const companies = (result as { companies?: Array<{ symbol?: string }> }).companies || []
        const tickers = companies.map((c) => c.symbol).filter(Boolean).slice(0, MAX_TICKERS)

        for (const t of tickers) {
            console.log(`Processing ticker ${t}`)
            const p = await syncPricesJob(t)
            console.log('Prices result:', p)
            const d = await syncDividendsJob(t)
            console.log('Dividends result:', d)
        }

        console.log('Scraper run complete')
    } catch (e) {
        console.error('Scraper run failed', e)
        process.exitCode = 1
    }
}

if (require.main === module) {
    runAll()
}
