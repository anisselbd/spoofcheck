export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { incrementDomainsChecked } from "@/lib/redis";
import { getDictionary, hasLocale } from "../../dictionaries";
import type { Locale } from "../../dictionaries";
import CheckPageClient from "@/components/CheckPageClient";

type Props = {
  params: Promise<{ lang: string; domain: string }>;
  searchParams: Promise<{ dkim?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang, domain: rawDomain } = await params;
  const { dkim: dkimSelector } = await searchParams;

  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const domain = cleanDomain(decodeURIComponent(rawDomain));

  if (!isValidDomain(domain)) {
    return { title: "SpoofCheck" };
  }

  const extra = dkimSelector ? [dkimSelector.trim()] : undefined;
  const { spf, dkim, dmarc, mx } = await checkDomain(domain, extra);
  const result = calculateScore(domain, spf, dkim, dmarc, mx);

  const descTemplate = result.spoofable
    ? dict.metadata.checkDescSpoofable
    : dict.metadata.checkDescProtected;

  const description = descTemplate
    .replace("{domain}", domain)
    .replace("{score}", String(result.score))
    .replace("{grade}", result.grade);

  const title = dict.metadata.checkTitle.replace("{domain}", domain);

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CheckPage({ params, searchParams }: Props) {
  const { lang, domain: rawDomain } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const { dkim: dkimSelector } = await searchParams;
  const domain = cleanDomain(decodeURIComponent(rawDomain));

  if (!isValidDomain(domain)) {
    redirect(`/${lang}`);
  }

  const extra = dkimSelector ? [dkimSelector.trim()] : undefined;
  const { spf, dkim, dmarc, mx } = await checkDomain(domain, extra);
  const result = calculateScore(domain, spf, dkim, dmarc, mx);

  await incrementDomainsChecked().catch((e) =>
    console.error("[redis:incr]", e instanceof Error ? e.message : e)
  );

  return <CheckPageClient data={result} lang={lang} dict={dict} />;
}
