import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import type { Locale } from "../../dictionaries";
import ResultsPanel from "@/components/ResultsPanel";
import Footer from "@/components/Footer";

import { POPULAR_DOMAINS } from "@/lib/popular-domains";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    POPULAR_DOMAINS.map((domain) => ({ lang, domain }))
  );
}

type Props = {
  params: Promise<{ lang: string; domain: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, domain } = await params;
  if (!hasLocale(lang)) return {};

  const isFr = lang === "fr";

  const title = isFr
    ? `Securite email de ${domain} — Analyse SPF, DKIM, DMARC, MTA-STS | SpoofCheck`
    : `Email Security of ${domain} — SPF, DKIM, DMARC, MTA-STS Analysis | SpoofCheck`;

  const description = isFr
    ? `Analyse complete de la securite email de ${domain}. Verifiez la configuration SPF, DKIM, DMARC et MTA-STS de ${domain} et decouvrez si ce domaine est vulnerable au spoofing.`
    : `Complete email security analysis of ${domain}. Check ${domain}'s SPF, DKIM, DMARC, and MTA-STS configuration and find out if this domain is vulnerable to spoofing.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: isFr ? "fr_FR" : "en_US",
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/email-security/${domain}`,
      languages: {
        "x-default": `https://spoofchecker.online/en/email-security/${domain}`,
        fr: `https://spoofchecker.online/fr/email-security/${domain}`,
        en: `https://spoofchecker.online/en/email-security/${domain}`,
      },
    },
  };
}

export default async function EmailSecurityPage({ params }: Props) {
  const { lang, domain } = await params;
  if (!hasLocale(lang)) notFound();
  if (!/^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}$/i.test(domain)) notFound();

  const dict = await getDictionary(lang as Locale);
  const isFr = lang === "fr";

  const { spf, dkim, dmarc, mx, mtaSts } = await checkDomain(domain);
  const result = calculateScore(domain, spf, dkim, dmarc, mx, mtaSts);

  const checkedDate = new Date(result.checkedAt).toLocaleDateString(
    isFr ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isFr
      ? `Analyse de securite email de ${domain}`
      : `Email Security Analysis of ${domain}`,
    description: isFr
      ? `Analyse complete de la securite email de ${domain}. Configuration SPF, DKIM, DMARC et MTA-STS.`
      : `Complete email security analysis of ${domain}. SPF, DKIM, DMARC, and MTA-STS configuration.`,
    author: {
      "@type": "Organization",
      name: "SpoofCheck",
      url: "https://spoofchecker.online",
    },
    publisher: {
      "@type": "Organization",
      name: "SpoofCheck",
      url: "https://spoofchecker.online",
    },
    mainEntityOfPage: `https://spoofchecker.online/${lang}/email-security/${domain}`,
    inLanguage: lang,
    datePublished: "2025-01-15",
    dateModified: result.checkedAt,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href={`/${lang}/guides`}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Guides
            </Link>
            <Link
              href={`/${lang}`}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isFr ? "Tester mon domaine" : "Test my domain"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-12">
          {/* SEO intro section */}
          <section className="space-y-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {isFr
                ? `Analyse de securite email de ${domain}`
                : `Email Security Analysis of ${domain}`}
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              {isFr
                ? `Verification complete des enregistrements SPF, DKIM, DMARC et MTA-STS de ${domain}. Decouvrez si ce domaine est protege contre l'usurpation d'identite email.`
                : `Complete verification of ${domain}'s SPF, DKIM, DMARC, and MTA-STS records. Find out if this domain is protected against email spoofing.`}
            </p>
            <p className="text-sm text-zinc-500">
              {isFr
                ? `Derniere mise a jour : ${checkedDate}`
                : `Last updated: ${checkedDate}`}
            </p>
          </section>

          {/* Results */}
          <section className="space-y-4">
            <ResultsPanel data={result} lang={lang} dict={dict} />
          </section>

          {/* CTA section */}
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              {isFr
                ? "Lancez une analyse en temps reel"
                : "Run a live analysis"}
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              {isFr
                ? `Les resultats ci-dessus sont mis a jour quotidiennement. Pour une verification instantanee de ${domain}, lancez une analyse en direct.`
                : `The results above are updated daily. For an instant check of ${domain}, run a live analysis.`}
            </p>
            <Link
              href={`/${lang}/check/${domain}`}
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              {isFr
                ? `Analyser ${domain} en direct`
                : `Analyze ${domain} live`}
            </Link>
          </section>

          {/* Related guides */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              {isFr
                ? "Guides pour comprendre ces resultats"
                : "Guides to understand these results"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={`/${lang}/guides/spf`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                  {isFr ? "Guide SPF" : "SPF Guide"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? "Comprenez comment le SPF definit les serveurs autorises a envoyer des emails pour un domaine."
                    : "Understand how SPF defines which servers are authorized to send emails for a domain."}
                </p>
              </Link>
              <Link
                href={`/${lang}/guides/dkim`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                  {isFr ? "Guide DKIM" : "DKIM Guide"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? "Decouvrez comment DKIM signe cryptographiquement vos emails pour en garantir l'authenticite."
                    : "Discover how DKIM cryptographically signs your emails to guarantee their authenticity."}
                </p>
              </Link>
              <Link
                href={`/${lang}/guides/dmarc`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                  {isFr ? "Guide DMARC" : "DMARC Guide"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? "Apprenez comment DMARC orchestre SPF et DKIM pour proteger votre domaine."
                    : "Learn how DMARC orchestrates SPF and DKIM to protect your domain."}
                </p>
              </Link>
              <Link
                href={`/${lang}/guides/mta-sts`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                  {isFr ? "Guide MTA-STS" : "MTA-STS Guide"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? "Apprenez comment MTA-STS impose le chiffrement TLS pour proteger vos emails en transit."
                    : "Learn how MTA-STS enforces TLS encryption to protect your emails in transit."}
                </p>
              </Link>
              <Link
                href={`/${lang}/guides/spf-vs-dkim-vs-dmarc`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                  SPF vs DKIM vs DMARC
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? "Comparez les trois protocoles et comprenez comment ils fonctionnent ensemble."
                    : "Compare the three protocols and understand how they work together."}
                </p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
