import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import CheckPageClient from "@/components/CheckPageClient";

type Props = {
  params: Promise<{ domain: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain: rawDomain } = await params;
  const domain = cleanDomain(decodeURIComponent(rawDomain));

  if (!isValidDomain(domain)) {
    return { title: "SpoofCheck" };
  }

  const { spf, dkim, dmarc, mx } = await checkDomain(domain);
  const result = calculateScore(domain, spf, dkim, dmarc, mx);

  const description = result.spoofable
    ? `${domain} est vulnérable au spoofing email — Score ${result.score}/100 (${result.grade}). Vérifiez votre domaine gratuitement.`
    : `${domain} est protégé contre le spoofing — Score ${result.score}/100 (${result.grade}). Vérifiez votre domaine gratuitement.`;

  return {
    title: `Analyse email de ${domain} — SpoofCheck`,
    description,
    openGraph: {
      title: `Analyse email de ${domain} — SpoofCheck`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Analyse email de ${domain} — SpoofCheck`,
      description,
    },
  };
}

export default async function CheckPage({ params }: Props) {
  const { domain: rawDomain } = await params;
  const domain = cleanDomain(decodeURIComponent(rawDomain));

  if (!isValidDomain(domain)) {
    redirect("/");
  }

  const { spf, dkim, dmarc, mx } = await checkDomain(domain);
  const result = calculateScore(domain, spf, dkim, dmarc, mx);

  return <CheckPageClient data={result} />;
}
