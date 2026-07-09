import { checkRateLimit, type RateLimitVerdict } from "./redis";

/** Compatible avec Headers (route handlers) et ReadonlyHeaders (next/headers). */
type HeaderReader = { get(name: string): string | null };

export function getClientIp(headers: HeaderReader): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitByIp(
  headers: HeaderReader,
  scope: string,
  limit: number,
  windowSeconds = 60
): Promise<RateLimitVerdict> {
  return checkRateLimit(`${scope}:${getClientIp(headers)}`, limit, windowSeconds);
}
