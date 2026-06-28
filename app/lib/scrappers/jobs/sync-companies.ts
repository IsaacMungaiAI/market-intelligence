import { ingestCompanies } from '../ingestion/companies'
import { upsertCompanies } from '../storage/companies'

export async function syncCompaniesJob() {
    const companies = await ingestCompanies()
    console.log(`syncCompaniesJob: found ${companies.length} companies`)

    const inserted = await upsertCompanies(companies)
    console.log(`syncCompaniesJob: persisted ${inserted} companies`)

    return { found: companies.length, persisted: inserted, companies }
}
