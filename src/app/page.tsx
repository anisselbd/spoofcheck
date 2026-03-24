"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cleanDomain } from "@/lib/validators";
import DomainInput from "@/components/DomainInput";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck(domain: string) {
    setLoading(true);
    setError("");

    try {
      const clean = cleanDomain(domain);
      router.push(`/check/${encodeURIComponent(clean)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </h1>
          <span className="text-xs text-zinc-600">
            Analyse gratuite de sécurité email
          </span>
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

          <DomainInput onCheck={handleCheck} loading={loading} />

          {error && (
            <div className="text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}
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
