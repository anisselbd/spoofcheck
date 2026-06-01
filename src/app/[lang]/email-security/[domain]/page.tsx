import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";
import { refreshDomainScore } from "@/lib/redis";
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
    ? `${domain} est-il spoofable ? Analyse SPF, DKIM, DMARC | SpoofCheck`
    : `Is ${domain} spoofable? SPF, DKIM & DMARC check | SpoofCheck`;

  const description = isFr
    ? `Enregistrements SPF, DKIM, DMARC et MTA-STS de ${domain}. ${domain} est-il usurpable ? Découvrez son score de sécurité email, gratuitement et instantanément.`
    : `Check ${domain}'s SPF, DKIM, DMARC & MTA-STS records. Is ${domain} spoofable? See its email security score — free, instant, no signup.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://spoofchecker.online/${lang}/email-security/${domain}`,
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

  if (process.env.KV_REDIS_URL) {
    await refreshDomainScore(domain, { score: result.score, grade: result.grade, spoofable: result.spoofable }).catch(() => {});
  }

  const checkedDate = new Date(result.checkedAt).toLocaleDateString(
    isFr ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Dynamic FAQ — unique per domain, captures "is {domain} spoofable",
  // "{domain} dmarc record", "{domain} spf record" search patterns.
  const faqs = isFr
    ? [
        {
          q: `${domain} est-il usurpable (spoofable) ?`,
          a: result.spoofable
            ? `Oui. ${domain} n'applique pas de politique DMARC stricte : des attaquants peuvent potentiellement envoyer des emails qui semblent provenir de ${domain}. Score de sécurité email : ${result.score}/100 (note ${result.grade}).`
            : `Non. ${domain} est protégé contre l'usurpation d'identité grâce à une configuration email robuste. Score de sécurité email : ${result.score}/100 (note ${result.grade}).`,
        },
        {
          q: `${domain} a-t-il un enregistrement SPF ?`,
          a: result.spf.found
            ? `Oui, ${domain} publie un enregistrement SPF${result.spf.qualifier ? ` (qualificateur ${result.spf.qualifier})` : ""}.`
            : `Non, aucun enregistrement SPF n'a été trouvé pour ${domain}, ce qui facilite l'usurpation.`,
        },
        {
          q: `Quel est l'enregistrement DMARC de ${domain} ?`,
          a: result.dmarc.found
            ? `${domain} publie un enregistrement DMARC (_dmarc.${domain}) avec une politique p=${result.dmarc.policy ?? "non précisée"}.`
            : `Aucun enregistrement DMARC (_dmarc.${domain}) n'a été trouvé pour ${domain}.`,
        },
        {
          q: `${domain} utilise-t-il DKIM ?`,
          a: result.dkim.found
            ? `Oui, des signatures DKIM ont été détectées pour ${domain}.`
            : `Aucun sélecteur DKIM courant n'a été détecté pour ${domain} parmi ceux vérifiés.`,
        },
      ]
    : [
        {
          q: `Is ${domain} spoofable?`,
          a: result.spoofable
            ? `Yes. ${domain} does not enforce a strong DMARC policy, so attackers may be able to send emails that appear to come from ${domain}. Email security score: ${result.score}/100 (grade ${result.grade}).`
            : `No. ${domain} is protected against email spoofing with a robust configuration. Email security score: ${result.score}/100 (grade ${result.grade}).`,
        },
        {
          q: `Does ${domain} have an SPF record?`,
          a: result.spf.found
            ? `Yes, ${domain} publishes an SPF record${result.spf.qualifier ? ` (${result.spf.qualifier} qualifier)` : ""}.`
            : `No SPF record was found for ${domain}, which makes it easier to spoof.`,
        },
        {
          q: `What is ${domain}'s DMARC record?`,
          a: result.dmarc.found
            ? `${domain} publishes a DMARC record (_dmarc.${domain}) with a p=${result.dmarc.policy ?? "unspecified"} policy.`
            : `No DMARC record (_dmarc.${domain}) was found for ${domain}.`,
        },
        {
          q: `Does ${domain} use DKIM?`,
          a: result.dkim.found
            ? `Yes, DKIM signatures were detected for ${domain}.`
            : `No common DKIM selector was detected for ${domain} among those checked.`,
        },
      ];

  // Internal-link ring: each domain page links to the next ones in the list,
  // so all programmatic pages are discoverable and share crawl/link equity.
  const list = POPULAR_DOMAINS as readonly string[];
  const idx = list.indexOf(domain);
  const start = idx >= 0 ? idx : 0;
  const otherDomains = Array.from({ length: 6 }, (_, i) => list[(start + i + 1) % list.length]).filter(
    (d) => d !== domain
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isFr
      ? `Sécurité email de ${domain} : analyse SPF, DKIM, DMARC et MTA-STS`
      : `${domain} email security: SPF, DKIM, DMARC and MTA-STS analysis`,
    description: isFr
      ? `Analyse complète de la sécurité email de ${domain}. Configuration SPF, DKIM, DMARC et MTA-STS, et risque d'usurpation.`
      : `Complete email security analysis of ${domain}. SPF, DKIM, DMARC and MTA-STS configuration, and spoofing risk.`,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
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
                ? `Sécurité email de ${domain} : SPF, DKIM et DMARC`
                : `${domain} email security: SPF, DKIM & DMARC`}
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              {isFr
                ? `${domain} est-il usurpable ? Consultez les enregistrements SPF, DKIM, DMARC et MTA-STS de ${domain} et découvrez si ce domaine est protégé contre l'usurpation d'identité email.`
                : `Is ${domain} spoofable? See ${domain}'s SPF, DKIM, DMARC and MTA-STS records and find out if this domain is protected against email spoofing.`}
            </p>
            <p className="text-sm text-zinc-500">
              {isFr
                ? `Dernière mise à jour : ${checkedDate}`
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
                ? "Lancez une analyse en temps réel"
                : "Run a live analysis"}
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              {isFr
                ? `Les résultats ci-dessus sont mis à jour quotidiennement. Pour une vérification instantanée de ${domain}, lancez une analyse en direct.`
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

          {/* FAQ — dynamic, unique per domain */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              {isFr
                ? `Questions fréquentes sur ${domain}`
                : `Frequently asked questions about ${domain}`}
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
                >
                  <h3 className="font-semibold text-zinc-100">{f.q}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 text-center pt-2">
              {isFr ? (
                <>
                  Vous voulez tester un autre domaine ? Lancez un{" "}
                  <Link
                    href={`/${lang}`}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    test de spoofing email gratuit
                  </Link>
                  .
                </>
              ) : (
                <>
                  Want to test another domain? Run a free{" "}
                  <Link
                    href={`/${lang}`}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    email spoofing test
                  </Link>
                  .
                </>
              )}
            </p>
          </section>

          {/* Related guides */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              {isFr
                ? "Guides pour comprendre ces résultats"
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
                    ? "Comprenez comment le SPF définit les serveurs autorisés à envoyer des emails pour un domaine."
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
                    ? "Découvrez comment DKIM signe cryptographiquement vos emails pour en garantir l'authenticité."
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
                    ? "Apprenez comment DMARC orchestre SPF et DKIM pour protéger votre domaine."
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
                    ? "Apprenez comment MTA-STS impose le chiffrement TLS pour protéger vos emails en transit."
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

          {/* Cross-links to other domains */}
          {otherDomains.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
                {isFr ? "Vérifier d'autres domaines" : "Check other domains"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherDomains.map((d) => (
                  <Link
                    key={d}
                    href={`/${lang}/email-security/${d}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
                  >
                    {d}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
