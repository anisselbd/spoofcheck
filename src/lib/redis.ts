import { createClient } from "redis";

const COUNTER_KEY = "domains_checked";
const DOMAINS_SET_KEY = "domains_tested";

function getClient() {
  return createClient({ url: process.env.KV_REDIS_URL })
    .on("error", (err) => console.error("[redis]", err.message))
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

export async function trackDomain(domain: string): Promise<void> {
  const client = await getClient();
  try {
    await client.sAdd(DOMAINS_SET_KEY, domain);
  } finally {
    await client.disconnect();
  }
}

export async function getTestedDomains(): Promise<string[]> {
  const client = await getClient();
  try {
    return await client.sMembers(DOMAINS_SET_KEY);
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
