import { NextRequest, NextResponse } from "next/server";
import { getPortfolioDashboard, createHolding, deleteHolding } from "@/app/services/portfolio.service";
import type { ApiResponse, PortfolioDashboard, AddHoldingInput } from "@/lib/types";

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

export async function POST(req: NextRequest) {
  try {
    const body: AddHoldingInput = await req.json();

    if (!body.companyId || !body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        { error: "companyId and a positive quantity are required" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const result = await createHolding({
      companyId: body.companyId,
      quantity: body.quantity,
      avgCost: body.avgCost ?? 0,
    });

    return NextResponse.json(
      { data: result } satisfies ApiResponse<typeof result>,
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
      { error: "Failed to add holding" } satisfies ApiResponse<never>,
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
        { error: "Holding id is required" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await deleteHolding(id);
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
      { error: "Failed to remove holding" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
