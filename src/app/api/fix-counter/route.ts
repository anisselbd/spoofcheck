import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== "reset2026") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = createClient({ url: process.env.KV_REDIS_URL });
  await client.connect();

  const currentCounter = await client.get("domains_checked");

  if (searchParams.get("apply") === "1") {
    await client.set("domains_checked", "3246");
    await client.disconnect();
    return NextResponse.json({ done: true, oldCounter: currentCounter, newCounter: 3246 });
  }

  await client.disconnect();
  return NextResponse.json({ currentCounter });
}
