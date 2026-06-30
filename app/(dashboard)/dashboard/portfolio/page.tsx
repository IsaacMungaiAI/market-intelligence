import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getPortfolioDashboard } from "@/app/services/portfolio.service";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  DollarSign,
  PieChart,
  TrendingUp,
  Plus,
  Search,
} from "lucide-react";
import type { PortfolioDashboard } from "@/lib/types";

export default async function PortfolioPage() {
  const portfolio: PortfolioDashboard = await getPortfolioDashboard();

  if (portfolio.holdings.length === 0) {
    return (
      <div className="space-y-8 p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <BriefcaseBusiness className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-semibold">No holdings yet</div>
            <p className="text-center text-muted-foreground">
              Add your first stock to begin tracking your portfolio.
            </p>
            <Button>Add Holding</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Monitor holdings, allocation and portfolio performance.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Holding
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              KES {portfolio.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current market value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {portfolio.holdingsCount}
            </div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                portfolio.totalReturnPercent >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {portfolio.totalReturnPercent >= 0 ? "+" : ""}
              {portfolio.totalReturnPercent.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Since inception</p>
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
            <div className="text-3xl font-bold">
              {portfolio.largestHoldingWeight.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Largest holding weight
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Allocation visualization will appear here.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex h-72 items-center justify-center text-muted-foreground">
            Allocation Chart
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Historical performance chart.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex h-72 items-center justify-center text-muted-foreground">
            Performance Chart
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>
                Your current investment positions.
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search holdings..." />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Return</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {portfolio.holdings.map((holding) => (
                <TableRow key={holding.ticker}>
                  <TableCell className="font-medium">
                    {holding.company}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{holding.ticker}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.avgCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.marketValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        holding.profitLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {holding.profitLoss.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
