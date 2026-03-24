import { headers } from "next/headers";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limiter (en memoire, max 5 requetes par IP par heure)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 heure

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateBody(body: Record<string, unknown>): string | null {
  const nom = typeof body.nom === "string" ? body.nom.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const domaine = typeof body.domaine === "string" ? body.domaine.trim() : "";

  if (!nom) return "Le nom est requis";
  if (!email) return "L'email est requis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email invalide";
  if (!domaine) return "Le domaine est requis";

  return null;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
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

    // --- Parse & validate ---
    const body = await request.json();
    const validationError = validateBody(body);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const nom = (body.nom as string).trim();
    const email = (body.email as string).trim();
    const domaine = (body.domaine as string).trim();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // --- Send email via SMTP ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
<h2>Nouvelle demande de devis</h2>
<table style="border-collapse:collapse;font-family:sans-serif;">
  <tr>
    <td style="padding:6px 12px;font-weight:bold;">Nom</td>
    <td style="padding:6px 12px;">${escapeHtml(nom)}</td>
  </tr>
  <tr>
    <td style="padding:6px 12px;font-weight:bold;">Email</td>
    <td style="padding:6px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
  </tr>
  <tr>
    <td style="padding:6px 12px;font-weight:bold;">Domaine</td>
    <td style="padding:6px 12px;">${escapeHtml(domaine)}</td>
  </tr>
  ${
    message
      ? `<tr>
    <td style="padding:6px 12px;font-weight:bold;vertical-align:top;">Message</td>
    <td style="padding:6px 12px;white-space:pre-wrap;">${escapeHtml(message)}</td>
  </tr>`
      : ""
  }
</table>
`;

    const textBody = [
      `Nouvelle demande de devis`,
      ``,
      `Nom : ${nom}`,
      `Email : ${email}`,
      `Domaine : ${domaine}`,
      message ? `Message : ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: `"SpoofCheck" <${process.env.SMTP_USER}>`,
      to: "contact@spoofchecker.online",
      replyTo: email,
      subject: `[SpoofCheck] Demande de devis — ${domaine}`,
      text: textBody,
      html: htmlBody,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email contact:", err);
    return Response.json(
      { error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
