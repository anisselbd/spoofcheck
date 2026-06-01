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
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
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
        "x-default": "https://spoofchecker.online/en/guides/spf",
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (isFr
      ? [
          { q: "Le SPF suffit-il à protéger mon domaine contre le spoofing ?", a: "Non. Le SPF vérifie uniquement l'adresse d'enveloppe (MAIL FROM), pas l'adresse affichée au destinataire (le header From). Un attaquant peut contourner le SPF en utilisant un domaine d'enveloppe différent. C'est pourquoi vous devez obligatoirement combiner le SPF avec DKIM et DMARC pour une protection complète." },
          { q: "Que se passe-t-il si je dépasse les 10 lookups DNS ?", a: "Si votre enregistrement SPF nécessite plus de 10 résolutions DNS, le résultat sera un permerror (erreur permanente). Les serveurs récepteurs traiteront alors votre SPF comme s'il n'existait pas. Pour rester sous la limite, vous pouvez remplacer certains include par des adresses IP directes ou utiliser un service de flattening SPF." },
          { q: "Quelle est la différence entre -all et ~all ?", a: "-all (hard fail) indique que les emails provenant de serveurs non autorisés doivent être rejetés. ~all (soft fail) indique qu'ils doivent être acceptés mais marqués comme suspects. En pratique, avec une politique DMARC correcte, la différence est minime. Néanmoins, -all est recommandé pour une sécurité maximale." },
        ]
      : [
          { q: "Is SPF enough to protect my domain against spoofing?", a: "No. SPF only verifies the envelope address (MAIL FROM), not the address displayed to the recipient (the From header). An attacker can bypass SPF by using a different envelope domain. That is why you must combine SPF with DKIM and DMARC for complete protection." },
          { q: "What happens if I exceed the 10 DNS lookups?", a: "If your SPF record requires more than 10 DNS lookups, the result will be a permerror (permanent error). Receiving servers will then treat your SPF as if it did not exist. To stay under the limit, you can replace some include directives with direct IP addresses or use an SPF flattening service." },
          { q: "What is the difference between -all and ~all?", a: "-all (hard fail) indicates that emails from unauthorized servers should be rejected. ~all (soft fail) indicates they should be accepted but flagged as suspicious. In practice, with a proper DMARC policy, the difference is minimal. However, -all is recommended for maximum security." },
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
          {isFr ? <SpfContentFr lang={lang} /> : <SpfContentEn lang={lang} />}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
