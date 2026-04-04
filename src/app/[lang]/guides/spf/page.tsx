import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SpfContentFr from "./content-fr";
import SpfContentEn from "./content-en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr
      ? "Guide SPF : Configurer et comprendre le SPF email — SpoofCheck"
      : "SPF Guide: Configure and Understand Email SPF — SpoofCheck",
    description: isFr
      ? "Guide complet sur le SPF (Sender Policy Framework) : comment configurer un enregistrement SPF, proteger votre domaine contre le spoofing email et eviter les erreurs courantes."
      : "Complete guide to SPF (Sender Policy Framework): how to configure an SPF record, protect your domain against email spoofing, and avoid common mistakes.",
    keywords: isFr
      ? [
          "spf email",
          "configurer spf",
          "enregistrement spf",
          "sender policy framework",
          "spf record",
          "protection email",
          "anti-spoofing",
          "securite email",
          "dns spf",
        ]
      : [
          "spf email",
          "configure spf",
          "spf record",
          "sender policy framework",
          "email protection",
          "anti-spoofing",
          "email security",
          "dns spf",
          "spf setup",
        ],
    openGraph: {
      title: isFr
        ? "Guide SPF : Configurer et comprendre le SPF email"
        : "SPF Guide: Configure and Understand Email SPF",
      description: isFr
        ? "Guide complet sur le SPF : configuration, fonctionnement et erreurs courantes. Protegez votre domaine contre le spoofing."
        : "Complete guide to SPF: configuration, how it works, and common mistakes. Protect your domain against spoofing.",
      type: "article",
      locale: isFr ? "fr_FR" : "en_US",
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr
        ? "Guide SPF : Configurer et comprendre le SPF email"
        : "SPF Guide: Configure and Understand Email SPF",
      description: isFr
        ? "Guide complet sur le SPF : configuration, fonctionnement et erreurs courantes."
        : "Complete guide to SPF: configuration, how it works, and common mistakes.",
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/spf`,
      languages: {
        fr: "https://spoofchecker.online/fr/guides/spf",
        en: "https://spoofchecker.online/en/guides/spf",
      },
    },
  };
}

export default async function SpfGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isFr
      ? "Guide SPF : Configurer et comprendre le SPF email"
      : "SPF Guide: Configure and Understand Email SPF",
    description: isFr
      ? "Guide complet sur le SPF (Sender Policy Framework) : comment configurer un enregistrement SPF, proteger votre domaine contre le spoofing email et eviter les erreurs courantes."
      : "Complete guide to SPF (Sender Policy Framework): how to configure an SPF record, protect your domain against email spoofing, and avoid common mistakes.",
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
    mainEntityOfPage: `https://spoofchecker.online/${lang}/guides/spf`,
    inLanguage: lang,
    datePublished: "2025-01-15",
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
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          {isFr ? <SpfContentFr lang={lang} /> : <SpfContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
