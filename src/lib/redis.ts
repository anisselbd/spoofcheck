import { createClient } from "redis";

const COUNTER_KEY = "domains_checked";
const DOMAINS_SET_KEY = "domains_tested";
const DOMAIN_PREFIX = "domain:";

function getClient() {
  return createClient({ url: process.env.KV_REDIS_URL })
    .on("error", (err) => console.error("[redis]", err.message))
    .connect();
}

export interface DomainCheckData {
  score: number;
  grade: string;
  spoofable: boolean;
  checkedAt: string;
  checkCount: number;
}

export async function incrementDomainsChecked(): Promise<number> {
  const client = await getClient();
  try {
    return await client.incr(COUNTER_KEY);
  } finally {
    await client.disconnect();
  }
}

export async function trackDomain(
  domain: string,
  data: { score: number; grade: string; spoofable: boolean }
): Promise<void> {
  const client = await getClient();
  try {
    const key = `${DOMAIN_PREFIX}${domain}`;
    await Promise.all([
      client.sAdd(DOMAINS_SET_KEY, domain),
      client.hSet(key, {
        score: data.score.toString(),
        grade: data.grade,
        spoofable: data.spoofable ? "1" : "0",
        checkedAt: new Date().toISOString(),
      }),
      client.hIncrBy(key, "checkCount", 1),
    ]);
  } finally {
    await client.disconnect();
  }
}

export async function getDomainData(domain: string): Promise<DomainCheckData | null> {
  const client = await getClient();
  try {
    const raw = await client.hGetAll(`${DOMAIN_PREFIX}${domain}`);
    if (!raw.score) return null;
    return {
      score: parseInt(raw.score, 10),
      grade: raw.grade,
      spoofable: raw.spoofable === "1",
      checkedAt: raw.checkedAt,
      checkCount: parseInt(raw.checkCount, 10) || 1,
    };
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
