import { createClient } from "redis";

const COUNTER_KEY = "domains_checked";
const DOMAINS_SET_KEY = "domains_tested";
const DOMAIN_PREFIX = "domain:";
const CHECKS_LOG_KEY = "checks_log";
const COUNTRIES_KEY = "visitors_by_country";
const CITIES_KEY = "visitors_by_city";

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
  data: { score: number; grade: string; spoofable: boolean; country?: string; city?: string }
): Promise<void> {
  const client = await getClient();
  try {
    const key = `${DOMAIN_PREFIX}${domain}`;
    const now = Date.now();
    const ops: Promise<unknown>[] = [
      client.sAdd(DOMAINS_SET_KEY, domain),
      client.hSet(key, {
        score: data.score.toString(),
        grade: data.grade,
        spoofable: data.spoofable ? "1" : "0",
        checkedAt: new Date(now).toISOString(),
      }),
      client.hIncrBy(key, "checkCount", 1),
      client.zAdd(CHECKS_LOG_KEY, { score: now, value: `${now}:${domain}` }),
    ];
    if (data.country) {
      ops.push(client.hIncrBy(COUNTRIES_KEY, data.country, 1));
    }
    if (data.country && data.city) {
      ops.push(client.hIncrBy(CITIES_KEY, `${data.city}, ${data.country}`, 1));
    }
    await Promise.all(ops);
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

export async function getAllDomainData(): Promise<
  Array<{ domain: string } & DomainCheckData>
> {
  const client = await getClient();
  try {
    const domains = await client.sMembers(DOMAINS_SET_KEY);
    if (domains.length === 0) return [];

    const pipeline = client.multi();
    for (const domain of domains) {
      pipeline.hGetAll(`${DOMAIN_PREFIX}${domain}`);
    }
    const results = await pipeline.exec();

    return domains
      .map((domain, i) => {
        const raw = results[i] as unknown as Record<string, string> | null;
        if (!raw || !raw.score) return null;
        return {
          domain,
          score: parseInt(raw.score, 10),
          grade: raw.grade,
          spoofable: raw.spoofable === "1",
          checkedAt: raw.checkedAt,
          checkCount: parseInt(raw.checkCount, 10) || 1,
        };
      })
      .filter(Boolean) as Array<{ domain: string } & DomainCheckData>;
  } finally {
    await client.disconnect();
  }
}

export async function getGeoData(): Promise<{ countries: Record<string, number>; cities: Record<string, number> }> {
  const client = await getClient();
  try {
    const [countries, cities] = await Promise.all([
      client.hGetAll(COUNTRIES_KEY),
      client.hGetAll(CITIES_KEY),
    ]);
    const parseMap = (m: Record<string, string>) =>
      Object.fromEntries(Object.entries(m).map(([k, v]) => [k, parseInt(v, 10)]));
    return { countries: parseMap(countries), cities: parseMap(cities) };
  } finally {
    await client.disconnect();
  }
}

export interface CheckEvent {
  domain: string;
  timestamp: number;
}

export async function getChecksTimeline(since: number): Promise<CheckEvent[]> {
  const client = await getClient();
  try {
    const entries = await client.zRangeByScore(CHECKS_LOG_KEY, since, "+inf");
    return entries.map((entry) => {
      const colonIdx = entry.indexOf(":");
      return {
        timestamp: parseInt(entry.substring(0, colonIdx), 10),
        domain: entry.substring(colonIdx + 1),
      };
    });
  } finally {
    await client.disconnect();
  }
}

export interface HomeStats {
  grades: Record<string, number>;
  recentScans: Array<{ domain: string; grade: string; score: number }>;
  hallOfFame: Array<{ domain: string; grade: string; score: number }>;
  hallOfShame: Array<{ domain: string; grade: string; score: number }>;
}

export async function getHomeStats(): Promise<HomeStats> {
  const client = await getClient();
  try {
    const domains = await client.sMembers(DOMAINS_SET_KEY);
    if (domains.length === 0)
      return { grades: {}, recentScans: [], hallOfFame: [], hallOfShame: [] };

    const pipeline = client.multi();
    for (const d of domains) pipeline.hGetAll(`${DOMAIN_PREFIX}${d}`);
    const results = await pipeline.exec();

    const all: Array<{ domain: string; grade: string; score: number; checkedAt: string }> = [];
    const grades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    for (let i = 0; i < domains.length; i++) {
      const raw = results[i] as unknown as Record<string, string> | null;
      if (!raw?.score) continue;
      const grade = raw.grade;
      const score = parseInt(raw.score, 10);
      grades[grade] = (grades[grade] || 0) + 1;
      all.push({ domain: domains[i], grade, score, checkedAt: raw.checkedAt });
    }

    const byDate = [...all].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt));
    const byScore = [...all].sort((a, b) => b.score - a.score);

    const pick = (arr: typeof all) => arr.slice(0, 10).map(({ domain, grade, score }) => ({ domain, grade, score }));

    return {
      grades,
      recentScans: pick(byDate),
      hallOfFame: pick(byScore),
      hallOfShame: pick(byScore.reverse()),
    };
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
