import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides securite email : SPF, DKIM, DMARC — SpoofCheck",
  description:
    "Guides complets et gratuits pour configurer SPF, DKIM et DMARC. Protegez votre domaine contre le spoofing email et le phishing avec nos tutoriels etape par etape.",
  keywords: [
    "guide spf",
    "guide dkim",
    "guide dmarc",
    "securite email",
    "configurer spf dkim dmarc",
    "protection email",
    "anti-spoofing",
    "anti-phishing",
    "authentification email",
  ],
  openGraph: {
    title: "Guides securite email : SPF, DKIM, DMARC",
    description:
      "Guides complets et gratuits pour configurer SPF, DKIM et DMARC. Protegez votre domaine contre le spoofing et le phishing.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides securite email : SPF, DKIM, DMARC",
    description:
      "Guides complets et gratuits pour configurer SPF, DKIM et DMARC.",
  },
  alternates: {
    canonical: "https://spoofchecker.online/guides",
  },
};

const guides = [
  {
    href: "/guides/spf",
    title: "SPF (Sender Policy Framework)",
    description:
      "Le SPF permet de definir quels serveurs sont autorises a envoyer des emails pour votre domaine. C'est la premiere ligne de defense contre l'usurpation d'adresse email.",
    topics: [
      "Fonctionnement du SPF",
      "Configuration etape par etape",
      "Limite des 10 lookups DNS",
      "Difference entre -all et ~all",
    ],
  },
  {
    href: "/guides/dkim",
    title: "DKIM (DomainKeys Identified Mail)",
    description:
      "Le DKIM utilise la cryptographie asymetrique pour signer vos emails. Il garantit que le contenu n'a pas ete modifie en transit et que l'email provient bien de votre domaine.",
    topics: [
      "Cryptographie asymetrique appliquee",
      "Generation et publication des cles",
      "Selecteurs et rotation des cles",
      "Configuration multi-services",
    ],
  },
  {
    href: "/guides/dmarc",
    title: "DMARC (Domain-based Message Authentication)",
    description:
      "DMARC orchestre SPF et DKIM en definissant une politique claire pour les emails qui echouent aux verifications. Il ajoute aussi un systeme de rapports pour surveiller votre domaine.",
    topics: [
      "Politique none, quarantine, reject",
      "Alignement des domaines",
      "Rapports agreges et forensiques",
      "Deploiement progressif",
    ],
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-zinc-100 font-medium">
              Guides
            </span>
            <Link
              href="/"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Tester mon domaine
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Guides securite email
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              Tout comprendre sur SPF, DKIM et DMARC pour proteger votre domaine contre le spoofing email et le phishing.
            </p>
          </div>

          <div className="space-y-6">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4 hover:border-zinc-700 transition-colors group"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  {guide.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {guide.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-center gap-2 text-sm text-zinc-500"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  Lire le guide
                  <svg
                    className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Verifiez votre domaine gratuitement
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Testez votre configuration SPF, DKIM et DMARC en un clic. Notre outil analyse votre domaine et vous indique exactement ce qu'il faut corriger.
            </p>
            <Link
              href="/"
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              Tester mon domaine
            </Link>
          </section>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600">
          SpoofCheck — Outil de verification de securite email. Les
          verifications DNS sont publiques et non intrusives.
        </div>
      </footer>
    </div>
  );
}
