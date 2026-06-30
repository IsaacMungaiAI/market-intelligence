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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getCompanies } from "@/app/services/company.service";
import type { Company } from "@/lib/types";

export default async function CompaniesPage() {
  const companies: Company[] = await getCompanies();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Company research
        </h1>
        <p className="text-muted-foreground">
          Explore listed companies, financial statements, price history, and key metrics.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Companies</CardTitle>
              <CardDescription>
                {companies.length} listed securities on the NSE.
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search companies..." />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Badge variant="secondary">{company.ticker}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.sector ?? "—"}</TableCell>
                  <TableCell>{company.industry ?? "—"}</TableCell>
                  <TableCell>{company.listingDate ?? "—"}</TableCell>
                  <TableCell>{company.currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
