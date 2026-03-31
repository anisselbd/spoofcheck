import { createClient } from "redis";

const COUNTER_KEY = "domains_checked";

function getClient() {
  return createClient({ url: process.env.KV_REDIS_URL })
    .on("error", () => {})
    .connect();
}

export async function incrementDomainsChecked(): Promise<number> {
  const client = await getClient();
  try {
    return await client.incr(COUNTER_KEY);
  } finally {
    await client.disconnect();
  }
}

export async function getDomainsChecked(): Promise<number> {
  const client = await getClient();
  try {
    const val = await client.get(COUNTER_KEY);
    return val ? parseInt(val, 10) : 0;
  } finally {
    await client.disconnect();
  }
}
