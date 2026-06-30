import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { getPortfolioDashboard } from "@/app/services/portfolio.service";
import type { ApiResponse, PortfolioDashboard } from "@/lib/types";

export async function GET() {
  try {
    const data: PortfolioDashboard = await getPortfolioDashboard();
    return NextResponse.json({ data } satisfies ApiResponse<PortfolioDashboard>);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch portfolio" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
