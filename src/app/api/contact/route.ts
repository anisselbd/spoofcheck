import { headers } from "next/headers";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter (max 5 per IP per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Trop de demandes. Veuillez réessayer dans une heure." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const nom = typeof body.nom === "string" ? body.nom.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const domaine = typeof body.domaine === "string" ? body.domaine.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!nom) return Response.json({ error: "Le nom est requis" }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Response.json({ error: "Email invalide" }, { status: 400 });
    if (!domaine) return Response.json({ error: "Le domaine est requis" }, { status: 400 });

    const { error } = await resend.emails.send({
      from: "SpoofCheck <onboarding@resend.dev>",
      to: "contact@spoofchecker.online",
      replyTo: email,
      subject: `[SpoofCheck] Demande de devis — ${domaine}`,
      html: `
<h2>Nouvelle demande de devis</h2>
<table style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td style="padding:6px 12px;font-weight:bold;">Nom</td><td style="padding:6px 12px;">${escapeHtml(nom)}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${escapeHtml(email)}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Domaine</td><td style="padding:6px 12px;">${escapeHtml(domaine)}</td></tr>
  ${message ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:6px 12px;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>` : ""}
</table>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: `Erreur d'envoi : ${error.message}` }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Erreur contact:", message);
    return Response.json({ error: `Erreur : ${message}` }, { status: 500 });
  }
}
