
import { fetchJsonFromNSE } from './app/lib/scrappers/nse/client'

async function testEndpoints() {
    console.log('Testing NSE API endpoints...\n')

    // Test /stocks
    try {
        console.log('1. Testing /stocks:')
        const stocks = await fetchJsonFromNSE('/stocks', { limit: '5' })
        console.log('   Success:', JSON.stringify(stocks, null, 2))
    } catch (e) {
        console.log('   Failed:', e)
    }

    // Test /stocks/{symbol} with a known symbol
    try {
        console.log('\n2. Testing /stocks/SCOM:')
        const scom = await fetchJsonFromNSE('/stocks/SCOM')
        console.log('   Success:', JSON.stringify(scom, null, 2))
    } catch (e) {
        console.log('   Failed:', e)
    }

    // Test /stocks/{symbol} with another symbol
    try {
        console.log('\n3. Testing /stocks/ABSA:')
        const absa = await fetchJsonFromNSE('/stocks/ABSA')
        console.log('   Success:', JSON.stringify(absa, null, 2))
    } catch (e) {
        console.log('   Failed:', e)
    }

    // Try other possible endpoints
    const otherEndpoints = ['/prices', '/price', '/quotes', '/market', '/indices']
    for (const endpoint of otherEndpoints) {
        try {
            console.log(`\n4. Testing ${endpoint}:`)
            const result = await fetchJsonFromNSE(endpoint, { limit: '5' })
            console.log('   Success:', JSON.stringify(result, null, 2))
        } catch (e) {
            console.log('   Failed:', e)
        }
    }
}

testEndpoints().catch(console.error)
