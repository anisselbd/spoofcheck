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
      images: [{ url: "https://spoofchecker.online/IMG_6766.png", width: 1206, height: 630, alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS" }],
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
        "x-default": "https://spoofchecker.online/en/guides/spf-vs-dkim-vs-dmarc",
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
    datePublished: "2026-04-06",
    dateModified: "2026-09-09",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (isFr
      ? [
          { q: "Quelle est la différence entre SPF et DKIM ?", a: "SPF vérifie d'où part l'email : il compare l'adresse IP du serveur expéditeur à la liste des serveurs autorisés publiée dans votre DNS. DKIM vérifie ce que contient l'email : une signature cryptographique prouve que le message n'a pas été altéré en route et qu'il provient bien de votre domaine. SPF authentifie le serveur, DKIM authentifie le message. Ils sont complémentaires, pas interchangeables." },
          { q: "Quelle est la différence entre DKIM et DMARC ?", a: "DKIM signe vos emails, mais ne dit rien au serveur qui les reçoit : si la signature est invalide, rien n'indique s'il faut livrer le message, le mettre en spam ou le rejeter. DMARC comble ce vide. Il ajoute une politique (none, quarantine, reject) et une vérification d'alignement entre le domaine signé et le domaine affiché au destinataire. DKIM est un mécanisme d'authentification, DMARC est la règle de décision qui s'appuie dessus." },
          { q: "SPF, DKIM, DMARC : lequel est le plus important ?", a: "DMARC, mais il ne fonctionne pas seul. SPF et DKIM produisent chacun un verdict, et DMARC est le seul des trois à protéger l'adresse que votre destinataire voit réellement — le header From. Sans DMARC, un attaquant peut passer le SPF avec son propre domaine d'enveloppe tout en affichant le vôtre." },
          { q: "Dans quel ordre configurer SPF, DKIM et DMARC ?", a: "Toujours SPF, puis DKIM, puis DMARC. SPF est le plus rapide à publier et ne casse rien. DKIM demande d'activer la signature chez chaque service qui envoie en votre nom. DMARC arrive en dernier, en commençant impérativement par p=none : cette phase de surveillance vous montre qui envoie des emails avec votre domaine avant que vous ne bloquiez quoi que ce soit." },
          { q: "Peut-on mettre DMARC sans SPF ni DKIM ?", a: "Techniquement oui, mais c'est inutile et dangereux. DMARC n'a aucun verdict à exploiter si ni SPF ni DKIM ne sont configurés : tous vos emails échoueront l'alignement. Avec p=reject, vous bloqueriez votre propre courrier légitime. Publiez SPF et DKIM d'abord, vérifiez qu'ils passent, et seulement ensuite déployez DMARC." },
        ]
      : [
          { q: "What is the difference between SPF and DKIM?", a: "SPF checks where the email comes from: it compares the sending server's IP address against the list of authorized servers published in your DNS. DKIM checks what the email contains: a cryptographic signature proves the message was not altered in transit and genuinely comes from your domain. SPF authenticates the server, DKIM authenticates the message. They are complementary, not interchangeable." },
          { q: "What is the difference between DKIM and DMARC?", a: "DKIM signs your emails but tells the receiving server nothing: if the signature is invalid, nothing indicates whether to deliver the message, send it to spam, or reject it. DMARC fills that gap. It adds a policy (none, quarantine, reject) and an alignment check between the signing domain and the domain shown to the recipient. DKIM is an authentication mechanism; DMARC is the decision rule built on top of it." },
          { q: "SPF, DKIM or DMARC: which one matters most?", a: "DMARC, but it does not work alone. SPF and DKIM each produce a verdict, and DMARC is the only one of the three that protects the address your recipient actually sees — the From header. Without DMARC, an attacker can pass SPF using their own envelope domain while displaying yours." },
          { q: "In which order should I set up SPF, DKIM and DMARC?", a: "Always SPF, then DKIM, then DMARC. SPF is the fastest to publish and breaks nothing. DKIM requires enabling signing at every service that sends on your behalf. DMARC comes last, and must start at p=none: that monitoring phase shows you who is sending email with your domain before you block anything." },
          { q: "Can I use DMARC without SPF or DKIM?", a: "Technically yes, but it is pointless and dangerous. DMARC has no verdict to act on if neither SPF nor DKIM is configured: every one of your emails will fail alignment. With p=reject, you would block your own legitimate mail. Publish SPF and DKIM first, confirm they pass, and only then roll out DMARC." },
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
