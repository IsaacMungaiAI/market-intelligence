import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/app/lib/ai-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  try {
    const { modelId } = await params;
    const data = await getModel(modelId);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
