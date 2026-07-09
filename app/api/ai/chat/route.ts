import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/app/lib/ai-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await chat(body);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
