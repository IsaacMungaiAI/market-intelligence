const USER_AGENT = 'kmip-scraper/1.0 (+https://github.com)'

const DEFAULT_BASE = process.env.NSE_BASE_URL || 'https://nairobi-stock-exchange-nse.p.rapidapi.com'

function buildUrl(baseHost: string, path: string, params?: Record<string, string>) {
    const base = `${baseHost.replace(/\/$/, '')}${path}`
    const url = new URL(base)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return url.toString()
}

async function defaultFetch(url: string, opts: RequestInit = {}) {
    const rapidHostRaw = process.env.RAPIDAPI_HOST || ''
    const rapidHost = rapidHostRaw.replace(/^https?:\/\//, '').replace(/\/$/, '')

    const headers: Record<string, string> = {
        'User-Agent': USER_AGENT,
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: DEFAULT_BASE + '/',
        'X-Requested-With': 'XMLHttpRequest',
        // RapidAPI credentials (if provided via env) — typical headers
        ...(process.env.RAPIDAPI_KEY ? { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY } : {}),
        ...(rapidHost ? { 'X-RapidAPI-Host': rapidHost } : {}),
        ...(opts.headers as Record<string, string>),
    }

    const res = await fetch(url, { ...opts, headers })
    if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error('NSE fetch failed', res.status, res.statusText, body.slice(0, 400))
        throw new Error(`NSE fetch failed ${res.status} ${res.statusText} for ${url}`)
    }
    return res
}

/**
 * Fetch text from the configured NSE host (defaults to Nairobi NSE).
 * `baseHost` can override the host (useful for static subdomains).
 */
export async function fetchFromNSE(path: string, params?: Record<string, string>, baseHost?: string) {
    const host = baseHost || DEFAULT_BASE
    const url = buildUrl(host, path, params)
    const res = await defaultFetch(url)
    return res.text()
}

export async function fetchJsonFromNSE(path: string, params?: Record<string, string>, baseHost?: string) {
    const host = baseHost || DEFAULT_BASE
    const url = buildUrl(host, path, params)
    const res = await defaultFetch(url)
    const text = await res.text()
    try {
        return JSON.parse(text)
    } catch (e) {
        throw new Error('Failed to parse JSON from NSE response')
    }
}
