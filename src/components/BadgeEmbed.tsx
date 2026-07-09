"use client";

import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface BadgeEmbedProps {
  domain: string;
  score: number;
  grade: string;
  spoofable: boolean;
  lang: string;
  t: Dictionary["check"];
}

export default function BadgeEmbed({ domain, score, grade, spoofable, lang, t }: BadgeEmbedProps) {
  const [format, setFormat] = useState<"html" | "markdown">("html");
  const [copied, setCopied] = useState(false);

  const badgeUrl = `https://spoofchecker.online/api/badge/${domain}?score=${score}&grade=${grade}`;
  const targetUrl = `https://spoofchecker.online/${lang}/email-security/${domain}`;

  const snippets = {
    html: `<a href="${targetUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Email security score for ${domain}" height="28"></a>`,
    markdown: `[![Email security score for ${domain}](${badgeUrl})](${targetUrl})`,
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(snippets[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const title = spoofable ? t.embedBadge : t.embedBadgeTitleProtected;
  const desc = spoofable
    ? t.embedBadgeDesc
    : t.embedBadgeDescProtected.replace("{domain}", domain);

  return (
    <div
      className={`rounded-xl border p-6 space-y-4 print:hidden ${
        spoofable
          ? "border-zinc-800 bg-zinc-900/50"
          : "border-emerald-500/20 bg-emerald-500/5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className={`text-sm font-semibold ${spoofable ? "text-zinc-300" : "text-emerald-400"}`}>
            {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={`SpoofCheck badge for ${domain}`} height={28} />
      </div>
      <div className="flex gap-2 text-xs">
        {(["html", "markdown"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              format === f
                ? "border-zinc-500 text-zinc-100 bg-zinc-800/50"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            {f === "html" ? "HTML" : "Markdown"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <code className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 overflow-x-auto whitespace-nowrap">
          {snippets[format]}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 h-9 px-4 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:border-zinc-500 hover:text-zinc-100 transition-colors"
        >
          {copied ? t.embedCopied : t.embedCopy}
        </button>
      </div>
    </div>
  );
}
