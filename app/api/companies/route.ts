import { NextRequest, NextResponse } from "next/server";
import { getCompanies, getCompanyDashboard } from "@/app/services/company.service";
import type { ApiResponse, Company, CompanyDashboard } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get("ticker");

    if (ticker) {
      const data = await getCompanyDashboard(ticker);

      if (!data) {
        return NextResponse.json(
          { error: "Company not found" } satisfies ApiResponse<never>,
          { status: 404 }
        );
      }

      return NextResponse.json({ data } satisfies ApiResponse<CompanyDashboard>);
    }

    const data: Company[] = await getCompanies();
    return NextResponse.json({ data } satisfies ApiResponse<Company[]>);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch companies" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
