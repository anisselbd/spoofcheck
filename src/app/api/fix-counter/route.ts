import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== "reset2026") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = createClient({ url: process.env.KV_REDIS_URL });
  await client.connect();

  const uniqueDomains = await client.sCard("domains_tested");
  const currentCounter = await client.get("domains_checked");

  await client.disconnect();
  return NextResponse.json({ currentCounter, uniqueDomains });
}
