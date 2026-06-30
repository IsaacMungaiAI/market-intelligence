export interface Company {
  id: string;
  ticker: string;
  name: string;
  sector: string | null;
  industry: string | null;
  listingDate: string | null;
  currency: string;
  createdAt: Date;
}

export interface StockPrice {
  id: string;
  companyId: string;
  date: string;
  open: string | null;
  high: string | null;
  low: string | null;
  close: string | null;
  adjustedClose: string | null;
  volume: number | null;
  source: string | null;
  createdAt: Date | null;
}

export interface PortfolioHolding {
  company: string;
  ticker: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  profitLoss: number;
  returnPercent: number;
}

export interface PortfolioDashboard {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  holdingsCount: number;
  largestHoldingWeight: number;
  holdings: PortfolioHolding[];
}

export interface WatchlistItem {
  id: string;
  companyId: string;
  company: string;
  ticker: string;
  sector: string | null;
  price: number;
  change: number;
  changePercent: number;
  createdAt: Date;
}

export interface Signal {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "info" | "warning" | "critical";
  createdAt: Date;
}

export interface SectorAllocation {
  sector: string;
  weight: number;
  value: number;
}

export interface DashboardStats {
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  holdingsCount: number;
  watchlistCount: number;
  signalsCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  watchlist: WatchlistItem[];
  signals: Signal[];
  sectorAllocation: SectorAllocation[];
}

export interface CompanyDashboard {
  company: Company;
  latestPrice: StockPrice | null;
  priceSeries: StockPrice[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
