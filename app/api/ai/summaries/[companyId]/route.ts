import { NextRequest, NextResponse } from "next/server";
import { getSummaries } from "@/app/lib/ai-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const data = await getSummaries(companyId);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
