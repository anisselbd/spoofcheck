import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: `${dict.guides.title} — SpoofCheck`,
    description: dict.guides.subtitle,
    openGraph: {
      title: dict.guides.title,
      description: dict.guides.subtitle,
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.guides.title,
      description: dict.guides.subtitle,
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides`,
    },
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const g = dict.guides;

  const guides = [
    {
      href: `/${lang}/guides/spf`,
      title: g.spfTitle,
      description: g.spfDescription,
      topics: g.spfTopics,
    },
    {
      href: `/${lang}/guides/dkim`,
      title: g.dkimTitle,
      description: g.dkimDescription,
      topics: g.dkimTopics,
    },
    {
      href: `/${lang}/guides/dmarc`,
      title: g.dmarcTitle,
      description: g.dmarcDescription,
      topics: g.dmarcTopics,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-zinc-100 font-medium">
              {dict.common.guides}
            </span>
            <Link
              href={lang === "fr" ? "/en/guides" : "/fr/guides"}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "🇬🇧" : "🇫🇷"}
            </Link>
            <Link
              href={`/${lang}`}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {dict.common.testMyDomain}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {g.title}
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              {g.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4 hover:border-zinc-700 transition-colors group"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  {guide.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {guide.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-center gap-2 text-sm text-zinc-500"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {g.readGuide}
                  <svg
                    className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {g.ctaTitle}
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">{g.ctaSubtitle}</p>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              {dict.common.testMyDomain}
            </Link>
          </section>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
