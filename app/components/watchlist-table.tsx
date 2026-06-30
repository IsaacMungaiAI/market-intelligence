"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Trash2, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import type { WatchlistItem } from "@/lib/types"

type WatchlistTableProps = {
  items: WatchlistItem[]
}

export function WatchlistTable({ items }: WatchlistTableProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [deleting, setDeleting] = React.useState<string | null>(null)

  const filtered = query
    ? items.filter(
        (item) =>
          item.company.toLowerCase().includes(query.toLowerCase()) ||
          item.ticker.toLowerCase().includes(query.toLowerCase()) ||
          (item.sector ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : items

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/watchlists?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setDeleting(null)
    }
  }

  if (items.length === 0) return null

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Watchlist</h3>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "company" : "companies"} being tracked.
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search watchlist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No watchlist items match your search.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((item) => {
                const isPositive = item.changePercent >= 0
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="secondary">{item.ticker}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.company}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.sector ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.price.toFixed(2)}
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
                            {item.changePercent.toFixed(2)}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isPositive ? "+" : ""}
                            {item.change.toFixed(2)} pts
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            {deleting === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from watchlist?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove{" "}
                              <strong>{item.ticker}</strong> from your watchlist?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Showing {filtered.length} of {items.length} watchlist items.
        </p>
      </div>
    </TooltipProvider>
  )
}
