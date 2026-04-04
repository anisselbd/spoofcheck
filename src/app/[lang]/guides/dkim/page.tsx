import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import DkimContentFr from "./content-fr";
import DkimContentEn from "./content-en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title =
    lang === "fr"
      ? "Guide DKIM : Configurer la signature DKIM email — SpoofCheck"
      : "DKIM Guide: Configure DKIM Email Signing — SpoofCheck";

  const description =
    lang === "fr"
      ? "Guide complet sur le DKIM (DomainKeys Identified Mail) : comment configurer une signature DKIM, authentifier vos emails et garantir leur integrite."
      : "Complete guide to DKIM (DomainKeys Identified Mail): how to configure a DKIM signature, authenticate your emails, and ensure their integrity.";

  const ogTitle =
    lang === "fr"
      ? "Guide DKIM : Configurer la signature DKIM email"
      : "DKIM Guide: Configure DKIM Email Signing";

  const ogDescription =
    lang === "fr"
      ? "Guide complet sur le DKIM : configuration, fonctionnement et bonnes pratiques pour authentifier vos emails."
      : "Complete guide to DKIM: configuration, how it works, and best practices to authenticate your emails.";

  const twitterDescription =
    lang === "fr"
      ? "Guide complet sur le DKIM : configuration, fonctionnement et bonnes pratiques."
      : "Complete guide to DKIM: configuration, how it works, and best practices.";

  const keywords =
    lang === "fr"
      ? [
          "dkim email",
          "configurer dkim",
          "signature dkim",
          "domainkeys identified mail",
          "dkim record",
          "cle dkim",
          "authentification email",
          "securite email",
          "dns dkim",
        ]
      : [
          "dkim email",
          "configure dkim",
          "dkim signature",
          "domainkeys identified mail",
          "dkim record",
          "dkim key",
          "email authentication",
          "email security",
          "dns dkim",
        ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: twitterDescription,
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/dkim`,
      languages: {
        fr: "https://spoofchecker.online/fr/guides/dkim",
        en: "https://spoofchecker.online/en/guides/dkim",
      },
    },
  };
}

function buildArticleJsonLd(lang: string) {
  const headline =
    lang === "fr"
      ? "Guide DKIM : Configurer la signature DKIM email"
      : "DKIM Guide: Configure DKIM Email Signing";

  const description =
    lang === "fr"
      ? "Guide complet sur le DKIM (DomainKeys Identified Mail) : comment configurer une signature DKIM, authentifier vos emails et garantir leur integrite."
      : "Complete guide to DKIM (DomainKeys Identified Mail): how to configure a DKIM signature, authenticate your emails, and ensure their integrity.";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
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
    mainEntityOfPage: `https://spoofchecker.online/${lang}/guides/dkim`,
    inLanguage: lang === "fr" ? "fr" : "en",
    datePublished: "2025-01-15",
    dateModified: "2025-06-01",
  };
}

export default async function DkimGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const articleJsonLd = buildArticleJsonLd(lang);

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
              {lang === "fr" ? "Tester mon domaine" : "Test my domain"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          {lang === "fr" ? <DkimContentFr lang={lang} /> : <DkimContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
