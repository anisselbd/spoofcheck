"use client";

import type { DnsCheckResponse } from "@/lib/types";
import ScoreGauge from "./ScoreGauge";
import ResultCard from "./ResultCard";
import CtaBanner from "./CtaBanner";

interface ResultsPanelProps {
  data: DnsCheckResponse;
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

export default function ResultsPanel({ data }: ResultsPanelProps) {
  const mxDetails: string[] = [];
  if (data.mx.provider) mxDetails.push(`Fournisseur détecté : ${data.mx.provider}`);
  data.mx.records.forEach((r) => mxDetails.push(`${r.exchange} (priorité ${r.priority})`));

  const dkimDetails: string[] = [];
  if (data.dkim.found) {
    dkimDetails.push(`Sélecteurs trouvés : ${data.dkim.selectorsFound.join(", ")}`);
  } else {
    dkimDetails.push(`${data.dkim.selectorsChecked.length} sélecteurs vérifiés, aucun trouvé`);
  }

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
          {data.spoofable
            ? "Ce domaine est vulnérable au spoofing"
            : "Ce domaine est protégé contre le spoofing"}
        </div>
      </div>

      <CtaBanner domain={data.domain} spoofable={data.spoofable} score={data.score} />

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          title="SPF"
          status={spfStatus(data)}
          record={data.spf.record}
          details={data.spf.issues}
          delay={100}
        />
        <ResultCard
          title="DKIM"
          status={dkimStatus(data)}
          record={
            data.dkim.found
              ? `Sélecteurs : ${data.dkim.selectorsFound.join(", ")}`
              : null
          }
          details={dkimDetails}
          delay={200}
        />
        <ResultCard
          title="DMARC"
          status={dmarcStatus(data)}
          record={data.dmarc.record}
          details={data.dmarc.issues}
          delay={300}
        />
        <ResultCard
          title="MX"
          status={mxStatus(data)}
          record={
            data.mx.found
              ? data.mx.records.map((r) => r.exchange).join(", ")
              : null
          }
          details={mxDetails}
          delay={400}
        />
      </div>

      {data.recommendations.length > 0 && (
        <div className="animate-fade-up rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" style={{ animationDelay: "500ms" }}>
          <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
          <ol className="space-y-3">
            {data.recommendations.map((rec, i) => (
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
    </div>
  );
}
