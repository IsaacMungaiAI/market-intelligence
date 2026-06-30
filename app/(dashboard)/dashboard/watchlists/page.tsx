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
import { Eye, Plus, Trash2 } from "lucide-react";
import { getWatchlistWithPrices } from "@/app/services/watchlist.service";
import type { WatchlistItem } from "@/lib/types";

export default async function WatchlistsPage() {
  const watchlist: WatchlistItem[] = await getWatchlistWithPrices();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Watchlist center
          </h1>
          <p className="text-muted-foreground">
            Track priority counters, market movement, and companies you want to monitor closely.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add to Watchlist
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>
            {watchlist.length} {watchlist.length === 1 ? "company" : "companies"} being tracked.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <Eye className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Your watchlist is empty. Add companies to track their performance.
              </p>
            </div>
          ) : (
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
                {watchlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="secondary">{item.ticker}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.company}
                    </TableCell>
                    <TableCell>{item.sector ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.changePercent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.changePercent >= 0 ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
