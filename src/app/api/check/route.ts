import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { rateLimitByIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const LIMIT_PER_MINUTE = 10;

export async function POST(request: Request) {
  const verdict = await rateLimitByIp(request.headers, "api-check", LIMIT_PER_MINUTE);
  if (!verdict.allowed) {
    return Response.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      {
        status: 429,
        headers: { "Retry-After": String(verdict.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const domain = cleanDomain(body.domain || "");
    const dkimSelector = body.dkimSelector?.trim() || undefined;
    const extraSelectors = dkimSelector ? [dkimSelector] : undefined;

    if (!isValidDomain(domain)) {
      return Response.json(
        { error: "Domaine invalide" },
        { status: 400 }
      );
    }

    const { spf, dkim, dmarc, mx, mtaSts } = await checkDomain(domain, extraSelectors);
    const result = calculateScore(domain, spf, dkim, dmarc, mx, mtaSts);

    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
