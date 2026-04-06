import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Footer from "@/components/Footer";

const meta = {
  fr: {
    title: "Contact — SpoofCheck",
    description:
      "Contactez l'équipe SpoofCheck pour toute question sur la sécurité email, SPF, DKIM, DMARC ou MTA-STS.",
    h1: "Contactez-nous",
    subtitle:
      "Une question sur votre configuration email ? Besoin d'aide pour sécuriser votre domaine ? N'hésitez pas à nous écrire.",
    emailLabel: "Par email",
    emailText:
      "Envoyez-nous un message et nous vous répondrons dans les meilleurs délais.",
    guidesLabel: "Consultez nos guides",
    guidesText:
      "Avant de nous contacter, consultez nos guides qui répondent aux questions les plus fréquentes sur SPF, DKIM, DMARC et MTA-STS.",
    responseLabel: "Délai de réponse",
    responseText:
      "Nous répondons généralement sous 24 à 48 heures. Pour les questions techniques complexes, le délai peut être un peu plus long.",
  },
  en: {
    title: "Contact — SpoofCheck",
    description:
      "Contact the SpoofCheck team for any questions about email security, SPF, DKIM, DMARC, or MTA-STS.",
    h1: "Contact us",
    subtitle:
      "Have a question about your email configuration? Need help securing your domain? Feel free to reach out.",
    emailLabel: "By email",
    emailText:
      "Send us a message and we'll get back to you as soon as possible.",
    guidesLabel: "Check our guides",
    guidesText:
      "Before contacting us, check our guides that answer the most common questions about SPF, DKIM, DMARC, and MTA-STS.",
    responseLabel: "Response time",
    responseText:
      "We typically respond within 24 to 48 hours. For complex technical questions, it may take a bit longer.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = meta[lang as Locale];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: "https://spoofchecker.online/IMG_6766.png",
          width: 1206,
          height: 630,
          alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/contact`,
      languages: {
        "x-default": "https://spoofchecker.online/en/contact",
        fr: "https://spoofchecker.online/fr/contact",
        en: "https://spoofchecker.online/en/contact",
      },
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
  const m = meta[lang as Locale];

  return (
    <div className="flex flex-col min-h-screen">
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
              {dict.common.guides}
            </Link>
            <Link
              href={lang === "fr" ? "/en/contact" : "/fr/contact"}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "\ud83c\uddec\ud83c\udde7" : "\ud83c\uddeb\ud83c\uddf7"}
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
        <div className="max-w-3xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {m.h1}
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {m.subtitle}
            </p>
          </div>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              {m.emailLabel}
            </h2>
            <p className="text-zinc-400 leading-relaxed">{m.emailText}</p>
            <a
              href="mailto:contact@spoofcheck.fr"
              className="inline-flex items-center gap-2 h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contact@spoofcheck.fr
            </a>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              {m.guidesLabel}
            </h2>
            <p className="text-zinc-400 leading-relaxed">{m.guidesText}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  href: `/${lang}/guides/spf`,
                  label: dict.common.footerGuideSPF ?? "SPF Guide",
                },
                {
                  href: `/${lang}/guides/dkim`,
                  label: dict.common.footerGuideDKIM ?? "DKIM Guide",
                },
                {
                  href: `/${lang}/guides/dmarc`,
                  label: dict.common.footerGuideDMARC ?? "DMARC Guide",
                },
                {
                  href: `/${lang}/guides/spf-vs-dkim-vs-dmarc`,
                  label: "SPF vs DKIM vs DMARC",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              {m.responseLabel}
            </h2>
            <p className="text-zinc-400 leading-relaxed">{m.responseText}</p>
          </section>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
