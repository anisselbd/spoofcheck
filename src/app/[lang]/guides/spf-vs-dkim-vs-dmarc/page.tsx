import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import ContentFr from "./content-fr";
import ContentEn from "./content-en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr
      ? "SPF vs DKIM vs DMARC : Quelles différences ? — SpoofCheck"
      : "SPF vs DKIM vs DMARC: What's the Difference? — SpoofCheck",
    description: isFr
      ? "Comparatif complet SPF vs DKIM vs DMARC : comprendre les différences, le rôle de chaque protocole et comment les combiner pour protéger votre domaine contre le spoofing email."
      : "Complete comparison of SPF vs DKIM vs DMARC: understand the differences, the role of each protocol, and how to combine them to protect your domain against email spoofing.",
    keywords: isFr
      ? [
          "spf vs dkim vs dmarc",
          "difference spf dkim dmarc",
          "comparatif spf dkim dmarc",
          "spf dkim dmarc explication",
          "authentification email",
          "protection email",
          "anti-spoofing",
          "securite email",
        ]
      : [
          "spf vs dkim vs dmarc",
          "difference spf dkim dmarc",
          "spf dkim dmarc comparison",
          "spf dkim dmarc explained",
          "email authentication",
          "email protection",
          "anti-spoofing",
          "email security",
        ],
    openGraph: {
      title: isFr
        ? "SPF vs DKIM vs DMARC : Quelles différences ?"
        : "SPF vs DKIM vs DMARC: What's the Difference?",
      description: isFr
        ? "Comparatif complet des 3 protocoles d'authentification email. Découvrez leurs différences et comment les combiner."
        : "Complete comparison of the 3 email authentication protocols. Discover their differences and how to combine them.",
      type: "article",
      locale: isFr ? "fr_FR" : "en_US",
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr
        ? "SPF vs DKIM vs DMARC : Quelles différences ?"
        : "SPF vs DKIM vs DMARC: What's the Difference?",
      description: isFr
        ? "Comparatif complet des 3 protocoles d'authentification email."
        : "Complete comparison of the 3 email authentication protocols.",
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/spf-vs-dkim-vs-dmarc`,
      languages: {
        fr: "https://spoofchecker.online/fr/guides/spf-vs-dkim-vs-dmarc",
        en: "https://spoofchecker.online/en/guides/spf-vs-dkim-vs-dmarc",
      },
    },
  };
}

export default async function SpfVsDkimVsDmarcPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isFr
      ? "SPF vs DKIM vs DMARC : Quelles différences ?"
      : "SPF vs DKIM vs DMARC: What's the Difference?",
    description: isFr
      ? "Comparatif complet SPF vs DKIM vs DMARC : comprendre les différences, le rôle de chaque protocole et comment les combiner pour protéger votre domaine contre le spoofing email."
      : "Complete comparison of SPF vs DKIM vs DMARC: understand the differences, the role of each protocol, and how to combine them to protect your domain against email spoofing.",
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
    mainEntityOfPage: `https://spoofchecker.online/${lang}/guides/spf-vs-dkim-vs-dmarc`,
    inLanguage: lang,
    datePublished: "2025-01-20",
    dateModified: "2025-06-01",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
            <Link
              href={`/${isFr ? "en" : "fr"}/guides/spf-vs-dkim-vs-dmarc`}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {isFr ? "EN" : "FR"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          {isFr ? <ContentFr lang={lang} /> : <ContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
