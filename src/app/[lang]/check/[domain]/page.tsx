export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { headers } from "next/headers";
import { incrementDomainsChecked, trackDomain } from "@/lib/redis";
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
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/check/${domain}`,
      languages: {
        "x-default": `https://spoofchecker.online/en/check/${domain}`,
        fr: `https://spoofchecker.online/fr/check/${domain}`,
        en: `https://spoofchecker.online/en/check/${domain}`,
      },
    },
    openGraph: { title, description, type: "website", images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC" }] },
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

  const hdrs = await headers();
  const country = hdrs.get("x-vercel-ip-country") ?? undefined;
  const city = hdrs.get("x-vercel-ip-city") ? decodeURIComponent(hdrs.get("x-vercel-ip-city")!) : undefined;

  await Promise.all([
    incrementDomainsChecked(),
    trackDomain(domain, { score: result.score, grade: result.grade, spoofable: result.spoofable, country, city }),
  ]).catch((e) =>
    console.error("[redis]", e instanceof Error ? e.message : e)
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SpoofCheck", item: `https://spoofchecker.online/${lang}` },
      { "@type": "ListItem", position: 2, name: domain, item: `https://spoofchecker.online/${lang}/check/${domain}` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: dict.metadata.checkTitle.replace("{domain}", domain),
    description: (result.spoofable ? dict.metadata.checkDescSpoofable : dict.metadata.checkDescProtected)
      .replace("{domain}", domain)
      .replace("{score}", String(result.score))
      .replace("{grade}", result.grade),
    url: `https://spoofchecker.online/${lang}/check/${domain}`,
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", name: "SpoofCheck", url: "https://spoofchecker.online" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <CheckPageClient data={result} lang={lang} dict={dict} />
    </>
  );
}
