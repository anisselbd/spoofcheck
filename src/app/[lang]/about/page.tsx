import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Footer from "@/components/Footer";

const meta = {
  fr: {
    title: "À propos — SpoofCheck",
    description:
      "SpoofCheck est un outil gratuit et open-source qui vérifie si votre domaine est vulnérable au spoofing email via l'analyse SPF, DKIM et DMARC.",
    h1: "À propos de SpoofCheck",
    intro:
      "SpoofCheck est un outil gratuit qui permet de vérifier en un clic si un domaine est vulnérable au spoofing email. Il analyse les enregistrements DNS (SPF, DKIM, DMARC) et fournit un score de sécurité avec des recommandations concrètes.",
    whyTitle: "Pourquoi SpoofCheck ?",
    whyText:
      "Le spoofing email reste l'une des techniques de phishing les plus répandues. Pourtant, la plupart des entreprises et particuliers ne savent pas si leur domaine est protégé. SpoofCheck a été créé pour rendre cette vérification accessible à tous, sans inscription, sans limites et sans frais.",
    howTitle: "Comment ça fonctionne",
    howItems: [
      "Vous entrez un nom de domaine",
      "SpoofCheck interroge les serveurs DNS publics",
      "Les enregistrements SPF, DKIM et DMARC sont analysés",
      "Un score de sécurité et des recommandations sont générés",
    ],
    techTitle: "Techniquement",
    techText:
      "SpoofCheck effectue des requêtes DNS publiques et non intrusives. Aucune donnée personnelle n'est collectée, aucun email n'est envoyé. L'analyse est instantanée et les résultats peuvent être partagés ou téléchargés en PDF.",
    creatorTitle: "Créateur",
    creatorText:
      "SpoofCheck a été créé par Anisse Lebadi, développeur passionné par la cybersécurité et la protection des systèmes de messagerie.",
  },
  en: {
    title: "About — SpoofCheck",
    description:
      "SpoofCheck is a free, open-source tool that checks if your domain is vulnerable to email spoofing through SPF, DKIM, and DMARC analysis.",
    h1: "About SpoofCheck",
    intro:
      "SpoofCheck is a free tool that lets you check in one click whether a domain is vulnerable to email spoofing. It analyzes DNS records (SPF, DKIM, DMARC) and provides a security score with actionable recommendations.",
    whyTitle: "Why SpoofCheck?",
    whyText:
      "Email spoofing remains one of the most common phishing techniques. Yet most businesses and individuals don't know whether their domain is protected. SpoofCheck was created to make this check accessible to everyone — no signup, no limits, no cost.",
    howTitle: "How it works",
    howItems: [
      "You enter a domain name",
      "SpoofCheck queries public DNS servers",
      "SPF, DKIM, and DMARC records are analyzed",
      "A security score and recommendations are generated",
    ],
    techTitle: "Technical details",
    techText:
      "SpoofCheck performs public, non-intrusive DNS queries. No personal data is collected, no emails are sent. Analysis is instant and results can be shared or downloaded as PDF.",
    creatorTitle: "Creator",
    creatorText:
      "SpoofCheck was created by Anisse Lebadi, a developer passionate about cybersecurity and email system protection.",
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
          alt: "SpoofCheck — SPF, DKIM, DMARC",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/about`,
      languages: {
        fr: "https://spoofchecker.online/fr/about",
        en: "https://spoofchecker.online/en/about",
      },
    },
  };
}

export default async function AboutPage({
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
              href={lang === "fr" ? "/en/about" : "/fr/about"}
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
            <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {m.intro}
            </p>
          </div>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">{m.whyTitle}</h2>
            <p className="text-zinc-400 leading-relaxed">{m.whyText}</p>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">{m.howTitle}</h2>
            <ol className="space-y-3">
              {m.howItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">{m.techTitle}</h2>
            <p className="text-zinc-400 leading-relaxed">{m.techText}</p>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              {m.creatorTitle}
            </h2>
            <p className="text-zinc-400 leading-relaxed">{m.creatorText}</p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/anisse-lebadi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/anisselbd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
              >
                GitHub
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {dict.guides.ctaTitle}
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              {dict.guides.ctaSubtitle}
            </p>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              {dict.common.testMyDomain}
            </Link>
          </section>
        </article>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
