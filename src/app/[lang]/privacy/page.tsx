import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Footer from "@/components/Footer";

const meta = {
  fr: {
    title: "Politique de confidentialité — SpoofCheck",
    description:
      "Politique de confidentialité de SpoofCheck. Découvrez comment nous traitons vos données.",
    h1: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : 5 avril 2026",
    sections: [
      {
        title: "Données collectées",
        content:
          "SpoofCheck effectue des requêtes DNS publiques sur les domaines que vous analysez. Ces requêtes sont non intrusives et accessibles à quiconque. Nous ne collectons aucune donnée personnelle identifiable (nom, adresse email, adresse IP) lors de l'utilisation de l'outil d'analyse.",
      },
      {
        title: "Cookies",
        content:
          "SpoofCheck n'utilise aucun cookie de suivi ou publicitaire. Seuls des cookies strictement nécessaires au fonctionnement du site peuvent être utilisés (préférence de langue).",
      },
      {
        title: "Analyses et statistiques",
        content:
          "Nous utilisons Vercel Analytics pour collecter des données anonymisées sur l'utilisation du site (pages visitées, durée de visite). Ces données ne permettent pas d'identifier un utilisateur spécifique.",
      },
      {
        title: "Stockage des résultats",
        content:
          "Les résultats d'analyse sont générés en temps réel à partir de requêtes DNS et ne sont pas stockés de manière permanente sur nos serveurs.",
      },
      {
        title: "Partage des données",
        content:
          "Nous ne vendons, ne louons et ne partageons aucune donnée avec des tiers, à l'exception des services techniques nécessaires au fonctionnement du site (hébergement Vercel).",
      },
      {
        title: "Contact",
        content:
          "Pour toute question concernant cette politique de confidentialité, contactez-nous à contact@spoofcheck.fr.",
      },
    ],
  },
  en: {
    title: "Privacy Policy — SpoofCheck",
    description:
      "SpoofCheck privacy policy. Learn how we handle your data.",
    h1: "Privacy Policy",
    lastUpdated: "Last updated: April 5, 2026",
    sections: [
      {
        title: "Data collected",
        content:
          "SpoofCheck performs public DNS queries on the domains you analyze. These queries are non-intrusive and accessible to anyone. We do not collect any personally identifiable information (name, email address, IP address) when using the analysis tool.",
      },
      {
        title: "Cookies",
        content:
          "SpoofCheck does not use any tracking or advertising cookies. Only strictly necessary cookies may be used for site functionality (language preference).",
      },
      {
        title: "Analytics",
        content:
          "We use Vercel Analytics to collect anonymized usage data (pages visited, visit duration). This data cannot be used to identify a specific user.",
      },
      {
        title: "Results storage",
        content:
          "Analysis results are generated in real-time from DNS queries and are not permanently stored on our servers.",
      },
      {
        title: "Data sharing",
        content:
          "We do not sell, rent, or share any data with third parties, except for technical services required to operate the site (Vercel hosting).",
      },
      {
        title: "Contact",
        content:
          "For any questions about this privacy policy, contact us at contact@spoofcheck.fr.",
      },
    ],
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
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/privacy`,
      languages: {
        fr: "https://spoofchecker.online/fr/privacy",
        en: "https://spoofchecker.online/en/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
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
              href={lang === "fr" ? "/en/privacy" : "/fr/privacy"}
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
        <article className="max-w-3xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {m.h1}
            </h1>
            <p className="text-sm text-zinc-500">{m.lastUpdated}</p>
          </div>

          {m.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-xl font-bold text-emerald-400">
                {section.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </article>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
