import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { getWatchlistWithPrices } from "@/app/services/watchlist.service";
import { addToWatchlist, removeFromWatchlist } from "@/app/db/queries/watchlist";
import type { ApiResponse, WatchlistItem } from "@/lib/types";

export async function GET() {
  try {
    const data: WatchlistItem[] = await getWatchlistWithPrices();
    return NextResponse.json({ data } satisfies ApiResponse<WatchlistItem[]>);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch watchlist" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await addToWatchlist(companyId);
    return NextResponse.json(
      { data: { success: true } } satisfies ApiResponse<{ success: boolean }>,
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add to watchlist" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Watchlist item id is required" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await removeFromWatchlist(id);
    return NextResponse.json(
      { data: { success: true } } satisfies ApiResponse<{ success: boolean }>
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to remove from watchlist" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
