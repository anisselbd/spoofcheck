import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import DmarcContentFr from "./content-fr";
import DmarcContentEn from "./content-en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title =
    lang === "fr"
      ? "Guide DMARC : Configurer la politique DMARC email — SpoofCheck"
      : "DMARC Guide: Configure Your Email DMARC Policy — SpoofCheck";

  const description =
    lang === "fr"
      ? "Guide complet sur le DMARC (Domain-based Message Authentication) : comment configurer une politique DMARC, proteger votre domaine contre le phishing et recevoir des rapports."
      : "Complete guide to DMARC (Domain-based Message Authentication): how to configure a DMARC policy, protect your domain against phishing, and receive reports.";

  const ogTitle =
    lang === "fr"
      ? "Guide DMARC : Configurer la politique DMARC email"
      : "DMARC Guide: Configure Your Email DMARC Policy";

  const ogDescription =
    lang === "fr"
      ? "Guide complet sur le DMARC : configuration, politique et rapports pour proteger votre domaine contre le phishing."
      : "Complete guide to DMARC: configuration, policy, and reports to protect your domain against phishing.";

  const twitterTitle =
    lang === "fr"
      ? "Guide DMARC : Configurer la politique DMARC email"
      : "DMARC Guide: Configure Your Email DMARC Policy";

  const twitterDescription =
    lang === "fr"
      ? "Guide complet sur le DMARC : configuration, politique et rapports."
      : "Complete guide to DMARC: configuration, policy, and reports.";

  const keywords =
    lang === "fr"
      ? [
          "dmarc email",
          "configurer dmarc",
          "politique dmarc",
          "dmarc record",
          "dmarc reject",
          "dmarc quarantine",
          "rapport dmarc",
          "protection phishing",
          "securite email",
        ]
      : [
          "dmarc email",
          "configure dmarc",
          "dmarc policy",
          "dmarc record",
          "dmarc reject",
          "dmarc quarantine",
          "dmarc report",
          "phishing protection",
          "email security",
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
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/dmarc`,
      languages: {
        "x-default": "https://spoofchecker.online/en/guides/dmarc",
        fr: "https://spoofchecker.online/fr/guides/dmarc",
        en: "https://spoofchecker.online/en/guides/dmarc",
      },
    },
  };
}

function getArticleJsonLd(lang: string) {
  const headline =
    lang === "fr"
      ? "Guide DMARC : Configurer la politique DMARC email"
      : "DMARC Guide: Configure Your Email DMARC Policy";

  const description =
    lang === "fr"
      ? "Guide complet sur le DMARC (Domain-based Message Authentication) : comment configurer une politique DMARC, proteger votre domaine contre le phishing et recevoir des rapports."
      : "Complete guide to DMARC (Domain-based Message Authentication): how to configure a DMARC policy, protect your domain against phishing, and receive reports.";

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
    mainEntityOfPage: `https://spoofchecker.online/${lang}/guides/dmarc`,
    inLanguage: lang === "fr" ? "fr" : "en",
    datePublished: "2025-01-15",
    dateModified: "2025-06-01",
  };
}

export default async function DmarcGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const articleJsonLd = getArticleJsonLd(lang);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (lang === "fr"
      ? [
          { q: "Quelle politique DMARC choisir ?", a: "L'objectif final est toujours p=reject, qui offre la meilleure protection. Mais commencez par p=none pour collecter des rapports et identifier tous les services qui envoient des emails avec votre domaine. Passez ensuite à p=quarantine puis à p=reject progressivement." },
          { q: "Qu'est-ce que l'alignement DMARC ?", a: "L'alignement vérifie que le domaine utilisé dans le header From (visible par le destinataire) correspond au domaine vérifié par SPF (domaine de l'enveloppe) ou DKIM (domaine du tag d=). En mode relaxed (par défaut), les sous-domaines sont acceptés. En mode strict, les domaines doivent correspondre exactement." },
          { q: "DMARC est-il obligatoire en 2025 ?", a: "Techniquement non, mais en pratique oui. Depuis février 2024, Google et Yahoo exigent un enregistrement DMARC pour les expéditeurs envoyant plus de 5 000 emails par jour. Même pour les petits volumes, l'absence de DMARC dégrade sérieusement la délivrabilité de vos emails. C'est devenu un standard incontournable de la sécurité email." },
        ]
      : [
          { q: "Which DMARC policy should I choose?", a: "The ultimate goal is always p=reject, which provides the best protection. But start with p=none to collect reports and identify all services sending emails with your domain. Then gradually move to p=quarantine and finally p=reject." },
          { q: "What is DMARC alignment?", a: "Alignment verifies that the domain used in the From header (visible to the recipient) matches the domain verified by SPF (envelope domain) or DKIM (d= tag domain). In relaxed mode (default), subdomains are accepted. In strict mode, domains must match exactly." },
          { q: "Is DMARC mandatory in 2025?", a: "Technically no, but in practice yes. Since February 2024, Google and Yahoo require a DMARC record for senders sending more than 5,000 emails per day. Even for smaller volumes, the absence of DMARC seriously degrades your email deliverability. It has become an essential standard for email security." },
        ]
    ).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
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
          {lang === "fr" ? <DmarcContentFr lang={lang} /> : <DmarcContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
