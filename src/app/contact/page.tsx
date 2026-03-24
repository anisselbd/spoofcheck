import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "SpoofCheck — Sécurisez votre domaine",
  description:
    "Correction SPF, DKIM et DMARC par un expert. Protégez votre domaine contre le spoofing email à partir de 79€.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <span className="text-xs text-zinc-600">
            Service de sécurisation email
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-2xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Sécurisez votre domaine
            </h1>
            <p className="text-zinc-400 text-lg">
              Correction SPF, DKIM et DMARC par un expert.
              <br />
              Protégez vos emails contre l'usurpation d'identité.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Ce qui est inclus</h2>
              <span className="text-2xl font-bold text-emerald-400">
                À partir de 79€
              </span>
            </div>
            <ul className="space-y-3">
              {[
                "Audit complet de votre configuration email",
                "Configuration DNS (SPF, DKIM, DMARC)",
                "Vérification post-correction",
                "Support pendant 30 jours",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
                    &#10003;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-semibold">Demandez un devis</h2>
            <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-zinc-800/50" />}>
              <ContactForm />
            </Suspense>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">
              Ou réservez directement un appel
            </h2>
            <p className="text-sm text-zinc-400">
              Discutons de votre configuration en 15 minutes.
            </p>
            <a
              href="mailto:contact@spoofcheck.fr"
              className="inline-flex items-center h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              contact@spoofcheck.fr
            </a>
          </div>
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
