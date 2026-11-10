import { isBotUserAgent } from "@/lib/bots";
import { parseCtaEvent } from "@/lib/cta-events";
import { rateLimitByIp } from "@/lib/rate-limit";
import { recordCtaEvent } from "@/lib/redis";

// Un visiteur réel envoie au plus quelques événements par page vue.
const LIMIT_PER_MINUTE = 30;

/** Origine absente : même site (cas courant). Origine "null" ou illisible : étrangère. */
function isForeignOrigin(origin: string | null, requestUrl: string): boolean {
  if (!origin) return false;
  try {
    return new URL(origin).host !== new URL(requestUrl).host;
  } catch {
    return true;
  }
}

/**
 * Reçoit les affichages et clics du CTA partenaire, envoyés par
 * navigator.sendBeacon (corps JSON en text/plain). Le lien du CTA reste
 * direct : cette route ne fait que compter.
 */
export async function POST(request: Request) {
  // Événements émis depuis une autre origine : ignorés.
  if (isForeignOrigin(request.headers.get("origin"), request.url)) {
    return new Response(null, { status: 403 });
  }

  // Les robots ne cliquent pas pour de vrai : réponse normale, rien n'est compté.
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || isBotUserAgent(userAgent)) {
    return new Response(null, { status: 204 });
  }

  let event;
  try {
    event = parseCtaEvent(JSON.parse(await request.text()));
  } catch {
    event = null;
  }
  if (!event) {
    return Response.json({ error: "Événement invalide" }, { status: 400 });
  }

  const verdict = await rateLimitByIp(request.headers, "api-cta", LIMIT_PER_MINUTE);
  if (!verdict.allowed) {
    return new Response(null, {
      status: 429,
      headers: { "Retry-After": String(verdict.retryAfterSeconds) },
    });
  }

  try {
    await recordCtaEvent(event);
  } catch (e) {
    // Mesure en fail-open : une panne Redis ne doit jamais remonter au visiteur.
    console.error("[cta]", e instanceof Error ? e.message : e);
  }

  return new Response(null, { status: 204 });
}
