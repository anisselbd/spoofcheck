"use client";

import type { DnsCheckResponse } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ScoreGauge from "./ScoreGauge";
import ResultCard from "./ResultCard";

interface ResultsPanelProps {
  data: DnsCheckResponse;
  lang: string;
  dict: Dictionary;
}

function spfStatus(data: DnsCheckResponse) {
  if (!data.spf.found) return "fail";
  return data.spf.isStrict ? "pass" : "warn";
}

function dkimStatus(data: DnsCheckResponse) {
  if (!data.dkim.found) return "fail";
  return "pass";
}

function dmarcStatus(data: DnsCheckResponse) {
  if (!data.dmarc.found) return "fail";
  if (data.dmarc.policy === "reject") return "pass";
  return "warn";
}

function mxStatus(data: DnsCheckResponse) {
  return data.mx.found ? "pass" : "fail";
}

function t(dict: Dictionary, key: string): string {
  return (dict.dns as Record<string, string>)[key] ?? key;
}

export default function ResultsPanel({ data, lang, dict }: ResultsPanelProps) {
  const r = dict.results;

  const mxDetails: string[] = [];
  if (data.mx.provider) mxDetails.push(`${r.providerDetected} ${data.mx.provider}`);
  data.mx.records.forEach((rec) => mxDetails.push(`${rec.exchange} (${r.priority} ${rec.priority})`));

  const dkimDetails: string[] = [];
  if (data.dkim.found) {
    dkimDetails.push(`${r.selectorsFound} ${data.dkim.selectorsFound.join(", ")}`);
  } else {
    dkimDetails.push(`${data.dkim.selectorsChecked.length} ${r.selectorsChecked}`);
  }

  // Translate issue/recommendation keys
  const translateKeys = (keys: string[]) =>
    keys.map((key) => (dict.dns as Record<string, string>)[key] ?? key);

  return (
    <div className="w-full space-y-8 animate-fade-up">
      <div className="flex flex-col items-center gap-4">
        <ScoreGauge score={data.score} grade={data.grade} />
        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            data.spoofable
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {data.spoofable ? r.spoofable : r.protected}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          title="SPF"
          status={spfStatus(data)}
          record={data.spf.record}
          details={translateKeys(data.spf.issues)}
          delay={100}
          dict={r}
        />
        <ResultCard
          title="DKIM"
          status={dkimStatus(data)}
          record={
            data.dkim.found
              ? `${r.selectors} ${data.dkim.selectorsFound.join(", ")}`
              : null
          }
          details={dkimDetails}
          delay={200}
          dict={r}
        />
        <ResultCard
          title="DMARC"
          status={dmarcStatus(data)}
          record={data.dmarc.record}
          details={translateKeys(data.dmarc.issues)}
          delay={300}
          dict={r}
        />
        <ResultCard
          title="MX"
          status={mxStatus(data)}
          record={
            data.mx.found
              ? data.mx.records.map((rec) => rec.exchange).join(", ")
              : null
          }
          details={mxDetails}
          delay={400}
          dict={r}
        />
      </div>

      {data.recommendations.length > 0 && (
        <div className="animate-fade-up rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" style={{ animationDelay: "500ms" }}>
          <h3 className="text-lg font-semibold mb-4">{r.recommendations}</h3>
          <ol className="space-y-3">
            {translateKeys(data.recommendations).map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-300">
                <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {(data.spoofable || data.score < 70) && (
        <div className="animate-fade-up rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center space-y-3" style={{ animationDelay: "600ms" }}>
          <h3 className="text-lg font-semibold">{dict.helpBanner.title}</h3>
          <p className="text-sm text-zinc-400">{dict.helpBanner.subtitle}</p>
          <a
            href="mailto:contact@spoofcheck.fr"
            className="inline-flex items-center h-11 px-6 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
          >
            {dict.helpBanner.button}
          </a>
        </div>
      )}
    </div>
  );
}
