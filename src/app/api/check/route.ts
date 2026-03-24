import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

    const { spf, dkim, dmarc, mx } = await checkDomain(domain, extraSelectors);
    const result = calculateScore(domain, spf, dkim, dmarc, mx);

    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
