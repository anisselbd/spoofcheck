"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

const t = {
  fr: {
    heading: "Page introuvable",
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    cta: "Tester un domaine",
  },
  en: {
    heading: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    cta: "Test a domain",
  },
};

export default function GlobalNotFound() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    if (window.location.pathname.startsWith("/en")) {
      setLang("en");
    }
  }, []);

  const d = t[lang];

  return (
    <html lang={lang} className="h-full antialiased">
      <head>
        <title>404 — SpoofCheck</title>
        <meta name="description" content="Page not found." />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="py-6 px-6 border-b border-zinc-800/50">
          <div className="max-w-3xl mx-auto">
            <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
              <span className="text-white">Spoof</span>
              <span className="text-emerald-400">Check</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-6xl font-bold text-emerald-400">404</h1>
            <p className="text-xl text-zinc-300">{d.heading}</p>
            <p className="text-zinc-500">{d.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
              >
                {d.cta}
              </Link>
              <Link
                href={`/${lang}/guides`}
                className="inline-flex items-center h-11 px-8 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
              >
                Guides
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
