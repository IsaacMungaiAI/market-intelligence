export interface Company {
    symbol: string
    name: string
    isin?: string
    sector?: string
}

export interface Price {
    symbol: string
    date: string // ISO date
    open?: number
    high?: number
    low?: number
    close: number
    volume?: number
}

export interface Dividend {
    symbol: string
    exDate?: string
    recordDate?: string
    amount?: number
    currency?: string
}

export interface Report {
    symbol: string
    period: string
    url: string
    title?: string
    publishedAt?: string
}
