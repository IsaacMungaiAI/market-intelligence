import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { getWatchlistWithPrices } from "@/app/services/watchlist.service";
import { getCompanies } from "@/app/services/company.service";
import { AddToWatchlistDialog } from "@/app/components/add-watchlist-dialog";
import { WatchlistTable } from "@/app/components/watchlist-table";
import type { WatchlistItem, Company } from "@/lib/types";

export default async function WatchlistsPage() {
  const [watchlist, companies] = await Promise.all([
    getWatchlistWithPrices(),
    getCompanies(),
  ]);

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
        <AddToWatchlistDialog companies={companies} />
      </div>

      {watchlist.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Eye className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Your watchlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Add companies to track their price movements and stay informed
                about market changes that matter to you.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <WatchlistTable items={watchlist} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
