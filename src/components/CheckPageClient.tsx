"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { DnsCheckResponse } from "@/lib/types";
import ResultsPanel from "./ResultsPanel";

interface CheckPageClientProps {
  data: DnsCheckResponse;
}

export default function CheckPageClient({ data }: CheckPageClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <span className="text-xs text-zinc-600">
            Analyse gratuite de sécurité email
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Résultats pour{" "}
              <span className="text-emerald-400">{data.domain}</span>
            </h2>
          </div>

          <ResultsPanel data={data} />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/"
              className="h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors inline-flex items-center"
            >
              Vérifier un autre domaine
            </Link>
            <button
              onClick={handleCopy}
              className="h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>
            <button
              onClick={handleRefresh}
              className="h-11 px-6 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              Relancer l'analyse
            </button>
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
