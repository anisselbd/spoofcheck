import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";
import HomeClient from "@/components/HomeClient";
import FaqAccordion from "@/components/FaqAccordion";
import MatrixRain from "@/components/MatrixRain";
import Footer from "@/components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

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
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-shimmer">Check</span>
          </h1>
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {dict.home.title}{" "}
              <span className="text-red-400 animate-glow-red">{dict.home.titleHighlight}</span> ?
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              {dict.home.subtitle}
            </p>
          </div>

          <HomeClient lang={lang} dict={{ domainInput: dict.domainInput }} />

          <section className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-center">
              {dict.home.testimonialsTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {dict.testimonials.map((t) => (
                <div
                  key={t.author}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 card-glow"
                >
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <img
                      src={t.avatar}
                      alt={t.author}
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
