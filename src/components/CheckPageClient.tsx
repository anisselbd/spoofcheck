"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { DnsCheckResponse } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ResultsPanel from "./ResultsPanel";
import Footer from "./Footer";

interface CheckPageClientProps {
  data: DnsCheckResponse;
  lang: string;
  dict: Dictionary;
}

export default function CheckPageClient({ data, lang, dict }: CheckPageClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRefresh() {
    router.refresh();
  }

  function handlePrint() {
    window.print();
  }

  const t = dict.check;
  const dateLocale = lang === "fr" ? "fr-FR" : "en-US";

  const shareText = data.spoofable
    ? (lang === "fr"
        ? `${data.domain} est vulnérable au spoofing email — Score ${data.score}/100. Vérifiez votre domaine gratuitement sur SpoofCheck :`
        : `${data.domain} is vulnerable to email spoofing — Score ${data.score}/100. Check your domain for free on SpoofCheck:`)
    : (lang === "fr"
        ? `${data.domain} est protégé contre le spoofing — Score ${data.score}/100 ✅ Vérifiez votre domaine sur SpoofCheck :`
        : `${data.domain} is protected against spoofing — Score ${data.score}/100 ✅ Check your domain on SpoofCheck:`);

  function shareTwitter() {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const badgeUrl = `https://spoofchecker.online/api/badge/${data.domain}?score=${data.score}&grade=${data.grade}`;
  const embedCode = `<a href="https://spoofchecker.online/en/email-security/${data.domain}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Email security score for ${data.domain}" height="28"></a>`;

  async function handleEmbedCopy() {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  }

  function shareLinkedin() {
    const title = data.spoofable
      ? `${data.domain} — ${data.score}/100`
      : `${data.domain} — ${data.score}/100 ✅`;
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={lang === "fr" ? `/en/check/${data.domain}` : `/fr/check/${data.domain}`}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "🇬🇧" : "🇫🇷"}
            </Link>
            <span className="text-xs text-zinc-600">
              {dict.common.tagline}
            </span>
          </div>
        </div>
      </header>

      {/* Print-only header */}
      <div className="hidden print:block print-header">
        <div className="print-header-logo">SpoofCheck</div>
        <div className="print-header-subtitle">{t.reportTitle}</div>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-16 print:py-4">
        <div className="max-w-3xl w-full space-y-8 print:space-y-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight print:text-2xl">
              {dict.results.resultsFor}{" "}
              <span className="text-emerald-400 print:text-black print:font-bold">{data.domain}</span>
            </h2>
            <p className="hidden print:block text-sm mt-2 print-url">
              {pageUrl}
            </p>
            <p className="hidden print:block text-sm mt-1 print-date">
              {t.analysisDate} {new Date(data.checkedAt).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <ResultsPanel data={data} lang={lang} dict={dict} />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 print:hidden">
            <Link
              href={`/${lang}`}
              className="h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors inline-flex items-center"
            >
              {t.checkAnother}
            </Link>
            <button
              onClick={handleCopy}
              className="h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              {copied ? t.linkCopied : t.copyLink}
            </button>
            <button
              onClick={handlePrint}
              className="h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              {t.downloadPdf}
            </button>
            <button
              onClick={handleRefresh}
              className="h-11 px-6 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              {t.rerun}
            </button>
          </div>

          {/* Embed badge */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-300">{t.embedBadge}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{t.embedBadgeDesc}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badgeUrl} alt={`SpoofCheck badge for ${data.domain}`} height={28} />
            </div>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 overflow-x-auto whitespace-nowrap">{embedCode}</code>
              <button
                onClick={handleEmbedCopy}
                className="shrink-0 h-9 px-4 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:border-zinc-500 hover:text-zinc-100 transition-colors"
              >
                {embedCopied ? t.embedCopied : t.embedCopy}
              </button>
            </div>
          </div>

          {pageUrl && (
            <div className="flex items-center justify-center gap-3 print:hidden">
              <button
                onClick={shareTwitter}
                className="h-10 px-5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {t.shareTwitter}
              </button>
              <button
                onClick={shareLinkedin}
                className="h-10 px-5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {t.shareLinkedin}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />

      {/* Print-only footer */}
      <div className="hidden print:block print-footer">
        <div className="print-footer-line"></div>
        <p>Report generated by SpoofCheck — spoofchecker.online</p>
      </div>
    </div>
  );
}
