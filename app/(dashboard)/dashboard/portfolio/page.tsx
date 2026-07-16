import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseBusiness, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { getPortfolioDashboard } from "@/app/services/portfolio.service";
import { getCompanies } from "@/app/services/company.service";
import { AddHoldingDialog } from "@/app/components/add-holding-dialog";
import { HoldingsTable } from "@/app/components/holdings-table";

export default async function PortfolioPage() {
  const [portfolio, companies] = await Promise.all([
    getPortfolioDashboard(),
    getCompanies(),
  ]);

  const isEmpty = portfolio.holdings.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Monitor holdings, allocation and portfolio performance.
          </p>
        </div>
        <div data-tour="add-holding-btn">
          <AddHoldingDialog companies={companies} />
        </div>
      </div>

      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">No holdings yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Add your first stock to begin tracking your portfolio. We&apos;ll
                calculate market value, returns, and allocation automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Portfolio Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  KES {portfolio.totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current market value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Holdings
                </CardTitle>
                <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {portfolio.holdingsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active positions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Return
                </CardTitle>
                <TrendingUp
                  className={`h-4 w-4 ${
                    portfolio.totalReturnPercent >= 0
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold tabular-nums ${
                    portfolio.totalReturnPercent >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {portfolio.totalReturnPercent >= 0 ? "+" : ""}
                  {portfolio.totalReturnPercent.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Since inception (KES {portfolio.totalReturn.toLocaleString()})
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Diversification
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {portfolio.largestHoldingWeight.toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Largest holding weight
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="p-6 pb-0">
                <HoldingsTable holdings={portfolio.holdings} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
