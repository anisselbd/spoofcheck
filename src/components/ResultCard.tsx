"use client";

import { useState } from "react";

type Status = "pass" | "warn" | "fail";

interface ResultCardProps {
  title: string;
  status: Status;
  record: string | null;
  details: string[];
  delay?: number;
}

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  pass: { label: "OK", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  warn: { label: "Attention", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  fail: { label: "Absent", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

export default function ResultCard({ title, status, record, details, delay = 0 }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[status];

  return (
    <div
      className="animate-fade-up rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
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
        <p className="text-sm text-zinc-500 italic">Aucun enregistrement trouvé</p>
      )}

      {details.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors print:hidden"
          >
            {expanded ? "Masquer" : "Voir"} les détails ({details.length})
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
    </div>
  );
}
