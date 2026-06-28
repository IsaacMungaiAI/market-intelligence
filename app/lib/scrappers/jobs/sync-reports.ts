import { ingestReports } from '../ingestion/reports'
import { saveReports } from '../storage/reports'

export async function syncReportsJob(symbol?: string) {
    const reports = await ingestReports(symbol)
    console.log(`syncReportsJob: found ${reports.length} reports for ${symbol}`)
    // simple persistence hook; implement saveReports to integrate with DB
    await saveReports(reports)
    return reports
}
