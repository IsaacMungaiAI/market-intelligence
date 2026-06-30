import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioTower } from "lucide-react";
import { getSignals } from "@/app/services/signal.service";
import type { Signal } from "@/lib/types";

const severityStyles: Record<string, string> = {
  info: "bg-sky-100 text-sky-700 dark:bg-white/10 dark:text-sky-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-white/10 dark:text-amber-200",
  critical: "bg-rose-100 text-rose-700 dark:bg-white/10 dark:text-rose-200",
};

export default async function SignalsPage() {
  const signals: Signal[] = await getSignals();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Market intelligence signals
        </h1>
        <p className="text-muted-foreground">
          Surface dividend alerts, momentum changes, valuation shifts, and risk events.
        </p>
      </div>

      {signals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <RadioTower className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No signals at the moment. Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {signals.map((signal) => (
            <Card key={signal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={severityStyles[signal.severity] ?? severityStyles.info}>
                    {signal.category}
                  </Badge>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      signal.severity === "critical"
                        ? "text-rose-500"
                        : signal.severity === "warning"
                          ? "text-amber-500"
                          : "text-sky-500"
                    }`}
                  >
                    {signal.severity}
                  </span>
                </div>
                <CardTitle className="mt-2 text-lg">{signal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-6">
                  {signal.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
