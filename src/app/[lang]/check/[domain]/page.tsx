export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { cache } from "react";
import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { headers } from "next/headers";
import { incrementDomainsChecked, trackDomain } from "@/lib/redis";
import { rateLimitByIp } from "@/lib/rate-limit";
import { getDictionary, hasLocale } from "../../dictionaries";
import type { Dictionary, Locale } from "../../dictionaries";
import CheckPageClient from "@/components/CheckPageClient";

type Props = {
  params: Promise<{ lang: string; domain: string }>;
  searchParams: Promise<{ dkim?: string }>;
};

const CHECKS_PER_MINUTE = 15;

// cache() : un seul verdict et une seule analyse DNS par requête,
// partagés entre generateMetadata et la page.
const getRateLimitVerdict = cache(async () => {
  const hdrs = await headers();
  return rateLimitByIp(hdrs, "check-page", CHECKS_PER_MINUTE);
});

const runCheck = cache(async (domain: string, dkimSelector?: string) => {
  const extra = dkimSelector ? [dkimSelector.trim()] : undefined;
  const { spf, dkim, dmarc, mx, mtaSts } = await checkDomain(domain, extra);
  return calculateScore(domain, spf, dkim, dmarc, mx, mtaSts);
});

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang, domain: rawDomain } = await params;
  const { dkim: dkimSelector } = await searchParams;

  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const domain = cleanDomain(decodeURIComponent(rawDomain));

  if (!isValidDomain(domain)) {
    return { title: "SpoofCheck" };
  }

  const { allowed } = await getRateLimitVerdict();
  if (!allowed) {
    return { title: dict.metadata.checkTitle.replace("{domain}", domain) };
  }

  const result = await runCheck(domain, dkimSelector);

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
    openGraph: { title, description, type: "website", images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }] },
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

  const { allowed } = await getRateLimitVerdict();
  if (!allowed) {
    return <RateLimitedPage lang={lang} dict={dict} />;
  }

  const result = await runCheck(domain, dkimSelector);

  const hdrs = await headers();
  const ua = hdrs.get("user-agent") ?? "";
  const isBot = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|googlebot|yandex|baidu|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider/i.test(ua);

  if (!isBot) {
    const country = hdrs.get("x-vercel-ip-country") ?? undefined;
    const city = hdrs.get("x-vercel-ip-city") ? decodeURIComponent(hdrs.get("x-vercel-ip-city")!) : undefined;

    await Promise.all([
      incrementDomainsChecked(),
      trackDomain(domain, { score: result.score, grade: result.grade, spoofable: result.spoofable, country, city }),
    ]).catch((e) =>
      console.error("[redis]", e instanceof Error ? e.message : e)
    );
  }

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

function RateLimitedPage({ lang, dict }: { lang: string; dict: Dictionary }) {
  const t = dict.rateLimit;
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      <p className="mt-3 text-zinc-400 max-w-md">{t.message}</p>
      <Link
        href={`/${lang}`}
        className="mt-8 h-11 px-6 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center"
      >
        {t.backHome}
      </Link>
    </div>
  );
}
