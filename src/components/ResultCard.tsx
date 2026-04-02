"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "pass" | "warn" | "fail";

interface ResultCardDict {
  statusPass: string;
  statusWarn: string;
  statusFail: string;
  noRecordFound: string;
  hideDetails: string;
  showDetails: string;
  detailsSuffix: string;
}

interface ResultCardProps {
  title: string;
  status: Status;
  record: string | null;
  details: string[];
  delay?: number;
  dict: ResultCardDict;
  guideHref?: string;
  guideLabel?: string;
}

export default function ResultCard({ title, status, record, details, delay = 0, dict, guideHref, guideLabel }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
    pass: { label: dict.statusPass, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
    warn: { label: dict.statusWarn, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
    fail: { label: dict.statusFail, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  };

  const config = statusConfig[status];

  return (
    <div
      className="animate-fade-up rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 card-glow"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {record ? (
        <code className="block text-sm bg-zinc-800/50 rounded-lg p-3 font-mono text-zinc-300 break-all">
          {record}
        </code>
      ) : (
        <p className="text-sm text-zinc-500 italic">{dict.noRecordFound}</p>
      )}

      {details.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors print:hidden"
          >
            {expanded ? dict.hideDetails : dict.showDetails} {dict.detailsSuffix} ({details.length})
          </button>
          <ul className={`mt-2 space-y-1 ${expanded ? "" : "hidden"} print:!block`}>
            {details.map((d, i) => (
              <li key={i} className="text-sm text-zinc-400 flex gap-2">
                <span className="text-zinc-600 shrink-0">-</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {guideHref && status !== "pass" && (
        <Link
          href={guideHref}
          className="mt-3 inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors print:hidden"
        >
          {guideLabel}
          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
