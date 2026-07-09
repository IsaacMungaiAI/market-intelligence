import { NextResponse } from "next/server";
import { db } from "@/app/index";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT 1 AS ok`);
    return NextResponse.json({ status: "ok", db: result });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : typeof error,
      },
      { status: 500 }
    );
  }
}
