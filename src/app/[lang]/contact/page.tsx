import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.metadata.contactTitle,
    description: dict.metadata.contactDescription,
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.contactTitle,
      description: dict.metadata.contactDescription,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const t = dict.contact;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={lang === "fr" ? "/en/contact" : "/fr/contact"}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "EN" : "FR"}
            </Link>
            <span className="text-xs text-zinc-600">{t.headerTag}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-2xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t.title}
            </h1>
            <p className="text-zinc-400 text-lg">
              {t.subtitle}
              <br />
              {t.subtitleLine2}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">{t.includedTitle}</h2>
              <span className="text-2xl font-bold text-emerald-400">
                {t.price}
              </span>
            </div>
            <ul className="space-y-3">
              {[t.included1, t.included2, t.included3, t.included4].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
                      &#10003;
                    </span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-semibold">{t.formTitle}</h2>
            <Suspense
              fallback={
                <div className="h-80 animate-pulse rounded-xl bg-zinc-800/50" />
              }
            >
              <ContactForm dict={t} />
            </Suspense>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">{t.callTitle}</h2>
            <p className="text-sm text-zinc-400">{t.callSubtitle}</p>
            <a
              href="mailto:contact@spoofcheck.fr"
              className="inline-flex items-center h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              contact@spoofcheck.fr
            </a>
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600">
          {dict.common.footer}
        </div>
      </footer>
    </div>
  );
}
