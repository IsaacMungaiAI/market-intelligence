// src/db/test.ts

import { sql } from "drizzle-orm";
import { db } from "@/app/index";

async function testConnection() {
  const result = await db.execute(sql`SELECT NOW()`);
  console.log(result);
}

testConnection()
  .then(() => {
    console.log("✅ Connected to Neon");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed");
    console.error(err);
    process.exit(1);
  });