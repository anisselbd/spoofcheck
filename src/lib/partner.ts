/**
 * Partner CTA shown on the results page.
 *
 * The destination is provided at build time through NEXT_PUBLIC_PARTNER_URL so
 * the partner can be swapped (or removed) without touching the components.
 * When the variable is unset, buildPartnerUrl returns null and the results page
 * falls back to the regular "contact us" banner.
 */

// Referenced literally so Next.js can inline it at build time (dynamic lookups
// such as process.env[name] are NOT inlined).
const PARTNER_URL = process.env.NEXT_PUBLIC_PARTNER_URL ?? "";

export type PartnerTier = "critical" | "warning" | "monitor";

/** Severity bucket driving the CTA wording. */
export function getPartnerTier(spoofable: boolean, score: number): PartnerTier {
  if (spoofable) return "critical";
  if (score < 70) return "warning";
  return "monitor";
}

/**
 * Appends attribution parameters to the partner link, carrying the grade over
 * so the partner's landing page can mirror the report the visitor just read.
 * Parameters already present in PARTNER_URL are never overwritten — affiliate
 * networks put their tracking token in the query string.
 */
export function buildPartnerUrl(grade: string): string | null {
  if (!PARTNER_URL) return null;

  let url: URL;
  try {
    url = new URL(PARTNER_URL);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const attribution: Record<string, string> = {
    utm_source: "spoofchecker.online",
    utm_medium: "referral",
    utm_campaign: "results-cta",
    utm_content: grade,
  };

  for (const [key, value] of Object.entries(attribution)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }

  return url.toString();
}
