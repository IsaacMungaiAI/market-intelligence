"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowUpRight, Search, Trash2, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import type { PortfolioHolding } from "@/lib/types"

type HoldingsTableProps = {
  holdings: PortfolioHolding[]
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [deleting, setDeleting] = React.useState<string | null>(null)

  const filtered = query
    ? holdings.filter(
        (h) =>
          h.company.toLowerCase().includes(query.toLowerCase()) ||
          h.ticker.toLowerCase().includes(query.toLowerCase())
      )
    : holdings

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
        toast.success("Holding removed", {
          description: "The position has been removed from your portfolio.",
        })
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error("Failed to remove holding", {
          description: body.error ?? "Please try again.",
        })
      }
    } catch {
      toast.error("Failed to remove holding", {
        description: "Network error. Please try again.",
      })
    } finally {
      setDeleting(null)
    }
  }

  if (holdings.length === 0) return null

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Holdings</h3>
            <p className="text-sm text-muted-foreground">
              Your current investment positions.
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search holdings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg border">
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
                <TableHead className="text-right">Return %</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No holdings match your search.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((holding) => {
                const isPositive = holding.profitLoss >= 0
                return (
                  <TableRow key={holding.ticker}>
                    <TableCell className="font-medium">
                      {holding.company}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{holding.ticker}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {holding.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {holding.avgCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {holding.currentPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {holding.marketValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`tabular-nums font-medium ${
                          isPositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {holding.profitLoss.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`inline-flex items-center gap-1 tabular-nums font-medium ${
                              isPositive ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {isPositive ? "+" : ""}
                            {holding.returnPercent.toFixed(2)}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Cost basis: KES{" "}
                            {(holding.avgCost * holding.quantity).toLocaleString()}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive">
                              {deleting === holding.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove holding?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <strong>{holding.ticker}</strong> from your
                                portfolio? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(holding.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Showing {filtered.length} of {holdings.length} holdings.
        </p>
      </div>
    </TooltipProvider>
  )
}
