import Link from "next/link";
import HomeClient from "@/components/HomeClient";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/lib/faq-data";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SpoofCheck",
  url: "https://spoofchecker.online",
  description:
    "Vérifiez gratuitement si votre domaine est protégé contre le spoofing email. Analyse SPF, DKIM, DMARC en un clic.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Tout navigateur web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  inLanguage: "fr",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/guides"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Guides
            </Link>
            <span className="text-xs text-zinc-600">
              Analyse gratuite de sécurité email
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Votre domaine est-il{" "}
              <span className="text-red-400">usurpable</span> ?
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Vérifiez en un clic si votre domaine est protégé contre le
              spoofing email. Analyse SPF, DKIM et DMARC.
            </p>
          </div>

          <HomeClient />

          <section className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-center">
              Questions fréquentes
            </h2>
            <FaqAccordion />
          </section>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600">
          SpoofCheck — Outil de vérification de sécurité email. Les
          vérifications DNS sont publiques et non intrusives.
        </div>
      </footer>
    </div>
  );
}
