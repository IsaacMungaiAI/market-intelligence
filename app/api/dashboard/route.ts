import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { getDashboardData } from "@/app/services/dashboard.service";
import type { ApiResponse, DashboardData } from "@/lib/types";

export async function GET() {
  try {
    const data: DashboardData = await getDashboardData();
    return NextResponse.json({ data } satisfies ApiResponse<DashboardData>);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
