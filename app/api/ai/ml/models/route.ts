import { NextResponse } from "next/server";
import { listModels } from "@/app/lib/ai-client";

export async function GET() {
  try {
    const data = await listModels();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
