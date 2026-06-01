import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import MtaStsContentFr from "./content-fr";
import MtaStsContentEn from "./content-en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr
      ? "Guide MTA-STS : Imposer le chiffrement TLS sur vos emails — SpoofCheck"
      : "MTA-STS Guide: Enforce TLS Encryption on Your Emails — SpoofCheck",
    description: isFr
      ? "Guide complet sur MTA-STS (Mail Transfer Agent Strict Transport Security) : comment configurer MTA-STS pour imposer le chiffrement TLS et proteger vos emails contre les attaques man-in-the-middle."
      : "Complete guide to MTA-STS (Mail Transfer Agent Strict Transport Security): how to configure MTA-STS to enforce TLS encryption and protect your emails against man-in-the-middle attacks.",
    keywords: isFr
      ? [
          "mta-sts",
          "mta-sts email",
          "configurer mta-sts",
          "chiffrement tls email",
          "securite email tls",
          "mail transfer agent strict transport security",
          "protection email transit",
          "anti mitm email",
        ]
      : [
          "mta-sts",
          "mta-sts email",
          "configure mta-sts",
          "tls email encryption",
          "email tls security",
          "mail transfer agent strict transport security",
          "email transit protection",
          "anti mitm email",
        ],
    openGraph: {
      title: isFr
        ? "Guide MTA-STS : Imposer le chiffrement TLS sur vos emails"
        : "MTA-STS Guide: Enforce TLS Encryption on Your Emails",
      description: isFr
        ? "Guide complet sur MTA-STS : configuration, fonctionnement et deploiement. Protegez vos emails en transit."
        : "Complete guide to MTA-STS: configuration, how it works, and deployment. Protect your emails in transit.",
      type: "article",
      locale: isFr ? "fr_FR" : "en_US",
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr
        ? "Guide MTA-STS : Imposer le chiffrement TLS sur vos emails"
        : "MTA-STS Guide: Enforce TLS Encryption on Your Emails",
      description: isFr
        ? "Guide complet sur MTA-STS : configuration, fonctionnement et deploiement."
        : "Complete guide to MTA-STS: configuration, how it works, and deployment.",
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/mta-sts`,
      languages: {
        "x-default": "https://spoofchecker.online/en/guides/mta-sts",
        fr: "https://spoofchecker.online/fr/guides/mta-sts",
        en: "https://spoofchecker.online/en/guides/mta-sts",
      },
    },
  };
}

export default async function MtaStsGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isFr
      ? "Guide MTA-STS : Imposer le chiffrement TLS sur vos emails"
      : "MTA-STS Guide: Enforce TLS Encryption on Your Emails",
    description: isFr
      ? "Guide complet sur MTA-STS (Mail Transfer Agent Strict Transport Security) : comment configurer MTA-STS pour imposer le chiffrement TLS et proteger vos emails contre les attaques man-in-the-middle."
      : "Complete guide to MTA-STS (Mail Transfer Agent Strict Transport Security): how to configure MTA-STS to enforce TLS encryption and protect your emails against man-in-the-middle attacks.",
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
    mainEntityOfPage: `https://spoofchecker.online/${lang}/guides/mta-sts`,
    inLanguage: lang,
    datePublished: "2026-04-06",
    dateModified: "2026-04-06",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (isFr
      ? [
          { q: "Quelle est la différence entre MTA-STS et STARTTLS ?", a: "STARTTLS est le mécanisme de négociation TLS entre serveurs mail. Le problème est qu'il est opportuniste : si un attaquant supprime l'annonce STARTTLS du serveur (attaque par stripping), la connexion se fait en clair sans que personne ne soit prévenu. MTA-STS résout ce problème en déclarant de manière indépendante (via HTTPS) que le TLS est obligatoire." },
          { q: "MTA-STS protège-t-il contre le spoofing ?", a: "Non. MTA-STS protège la confidentialité des emails en transit (chiffrement), pas l'authenticité de l'expéditeur. Pour se protéger contre le spoofing, vous devez configurer SPF, DKIM et DMARC." },
          { q: "Quels fournisseurs supportent MTA-STS ?", a: "Google (Gmail / Google Workspace), Microsoft (Outlook / Microsoft 365) et Yahoo supportent MTA-STS côté expéditeur. Cela signifie qu'ils respecteront votre politique MTA-STS lors de l'envoi d'emails vers votre domaine. Côté réception, vous devez le configurer vous-même sur votre domaine." },
        ]
      : [
          { q: "What's the difference between MTA-STS and STARTTLS?", a: "STARTTLS is the TLS negotiation mechanism between mail servers. The problem is that it's opportunistic: if an attacker strips the STARTTLS announcement from the server (stripping attack), the connection falls back to plaintext without anyone being notified. MTA-STS solves this by independently declaring (via HTTPS) that TLS is mandatory." },
          { q: "Does MTA-STS protect against spoofing?", a: "No. MTA-STS protects the confidentiality of emails in transit (encryption), not the authenticity of the sender. To protect against spoofing, you need to configure SPF, DKIM and DMARC." },
          { q: "Which providers support MTA-STS?", a: "Google (Gmail / Google Workspace), Microsoft (Outlook / Microsoft 365), and Yahoo support MTA-STS on the sending side. This means they will respect your MTA-STS policy when sending emails to your domain. On the receiving side, you need to configure it yourself on your domain." },
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
              {isFr ? "Tester mon domaine" : "Test my domain"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          {isFr ? <MtaStsContentFr lang={lang} /> : <MtaStsContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
