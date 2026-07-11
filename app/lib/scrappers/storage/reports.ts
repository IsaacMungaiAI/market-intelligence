import type { Report } from '../nse/types'

export async function saveReports(reports: Report[]) {
    if (!reports || reports.length === 0) return 0

    try {
        console.log(`saveReports: would persist ${reports.length} reports (persistence not implemented)`)
        return reports.length
    } catch (e) {
        console.error('saveReports error', e)
        return 0
    }
}
