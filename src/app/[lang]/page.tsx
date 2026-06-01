export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";
import HomeClient from "@/components/HomeClient";
import FaqAccordion from "@/components/FaqAccordion";
import MatrixRain from "@/components/MatrixRain";
import Footer from "@/components/Footer";
import { getDomainsChecked, getHomeStats } from "@/lib/redis";
import type { HomeStats } from "@/lib/redis";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const [domainsChecked, homeStats] = await Promise.all([
    getDomainsChecked().catch((e) => {
      console.error("[redis:get]", e instanceof Error ? e.message : e);
      return 0;
    }),
    getHomeStats().catch((e) => {
      console.error("[redis:stats]", e instanceof Error ? e.message : e);
      return null as HomeStats | null;
    }),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SpoofCheck",
    url: "https://spoofchecker.online",
    description: dict.metadata.homeDescription,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any web browser",
    browserRequirements: "Requires JavaScript",
    featureList: [
      "SPF record check",
      "DKIM record check",
      "DMARC record check",
      "MTA-STS check",
      "Email spoofing test",
      "Email security score",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: lang,
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <MatrixRain />
      <div className="orb z-0 w-[500px] h-[500px] bg-emerald-500/[0.03] top-[-100px] left-[-200px]" />
      <div className="orb z-0 w-[400px] h-[400px] bg-red-500/[0.03] bottom-[10%] right-[-150px]" style={{ animationDelay: "-7s" }} />
      <div className="orb z-0 w-[300px] h-[300px] bg-emerald-500/[0.02] top-[50%] left-[30%]" style={{ animationDelay: "-13s" }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <header className="relative z-10 py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-shimmer">Check</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href={`/${lang}/guides`}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {dict.common.guides}
            </Link>
            <Link
              href={lang === "fr" ? "/en" : "/fr"}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "🇬🇧" : "🇫🇷"}
            </Link>
            <span className="text-xs text-zinc-600">
              {dict.common.tagline}
            </span>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {dict.home.title}{" "}
              <span className="text-red-400 animate-glow-red">{dict.home.titleHighlight}</span> ?
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              {dict.home.subtitle}
            </p>
            {domainsChecked > 0 && (
              <p className="text-lg text-zinc-400 pt-2">
                <span className="text-2xl text-emerald-400 font-bold tabular-nums">
                  {domainsChecked.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
                </span>{" "}
                {dict.home.domainsChecked}
              </p>
            )}
          </div>

          <HomeClient lang={lang} dict={{ domainInput: dict.domainInput }} />

          {/* Stats section */}
          {homeStats && (homeStats.recentScans.length > 0 || homeStats.hallOfFame.length > 0) && (
            <section className="pt-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Grand Totals */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-300">{dict.home.statsTitle}</h3>
                  <div className="space-y-1.5">
                    {(["A", "B", "C", "D", "F"] as const).map((g) => {
                      const count = homeStats.grades[g] || 0;
                      const colors: Record<string, string> = { A: "text-emerald-400", B: "text-green-400", C: "text-yellow-400", D: "text-orange-400", F: "text-red-400" };
                      return (
                        <div key={g} className="flex items-center justify-between text-sm">
                          <span className={`font-bold ${colors[g]}`}>{g}</span>
                          <span className="text-zinc-500 tabular-nums">{count.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Scans */}
                {homeStats.recentScans.length > 0 && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-300">{dict.home.recentScans}</h3>
                  <div className="space-y-1.5">
                    {homeStats.recentScans.map((d) => (
                      <Link key={d.domain} href={`/${lang}/email-security/${d.domain}`} className="flex items-center justify-between text-sm group">
                        <span className="text-zinc-400 group-hover:text-zinc-100 transition-colors truncate mr-2">{d.domain}</span>
                        <span className={`shrink-0 text-xs font-bold ${d.grade === "A" ? "text-emerald-400" : d.grade === "B" ? "text-green-400" : d.grade === "C" ? "text-yellow-400" : d.grade === "D" ? "text-orange-400" : "text-red-400"}`}>{d.grade}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                )}

                {/* Hall of Fame */}
                <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/10 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-emerald-400">{dict.home.hallOfFame}</h3>
                  <div className="space-y-1.5">
                    {homeStats.hallOfFame.map((d) => (
                      <Link key={d.domain} href={`/${lang}/email-security/${d.domain}`} className="flex items-center justify-between text-sm group">
                        <span className="text-zinc-400 group-hover:text-zinc-100 transition-colors truncate mr-2">{d.domain}</span>
                        <span className="shrink-0 text-xs text-emerald-400 tabular-nums">{d.score}/100</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Hall of Shame */}
                <div className="rounded-xl border border-red-800/30 bg-red-950/10 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-red-400">{dict.home.hallOfShame}</h3>
                  <div className="space-y-1.5">
                    {homeStats.hallOfShame.map((d) => (
                      <Link key={d.domain} href={`/${lang}/email-security/${d.domain}`} className="flex items-center justify-between text-sm group">
                        <span className="text-zinc-400 group-hover:text-zinc-100 transition-colors truncate mr-2">{d.domain}</span>
                        <span className="shrink-0 text-xs text-red-400 tabular-nums">{d.score}/100</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-center">
              {dict.home.testimonialsTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dict.testimonials.map((t) => (
                <div
                  key={t.author}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 card-glow"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="shrink-0 w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="block font-medium text-zinc-400">
                        {t.author}
                      </span>
                      <span>{t.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-center">
              {dict.home.faqTitle}
            </h2>
            <FaqAccordion items={dict.faq} />
          </section>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
