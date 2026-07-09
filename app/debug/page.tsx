import { db } from "@/app/index";
import { sql } from "drizzle-orm";

export default async function DebugPage() {
  const results: string[] = [];

  try {
    const r1 = await db.execute(sql`SELECT 1 AS ok`);
    results.push(`SELECT 1: ${JSON.stringify(r1.rows)}`);
  } catch (e: any) {
    results.push(`SELECT 1 FAILED: ${e.message}`);
  }

  try {
    const r2 = await db.execute(sql`SELECT count(*) as cnt FROM companies`);
    results.push(`companies count: ${JSON.stringify(r2.rows)}`);
  } catch (e: any) {
    results.push(`companies FAILED: ${e.message}`);
  }

  try {
    const r3 = await db.execute(sql`SELECT count(*) as cnt FROM portfolios`);
    results.push(`portfolios count: ${JSON.stringify(r3.rows)}`);
  } catch (e: any) {
    results.push(`portfolios FAILED: ${e.message}`);
  }

  try {
    const r4 = await db.execute(sql`SELECT count(*) as cnt FROM watchlists`);
    results.push(`watchlists count: ${JSON.stringify(r4.rows)}`);
  } catch (e: any) {
    results.push(`watchlists FAILED: ${e.message}`);
  }

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Debug</h1>
      <pre>{results.join("\n")}</pre>
    </div>
  );
}
