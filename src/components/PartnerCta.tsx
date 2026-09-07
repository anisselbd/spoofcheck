"use client";

import { buildPartnerUrl, getPartnerTier, type PartnerTier } from "@/lib/partner";

interface PartnerCtaCopy {
  title: string;
  subtitle: string;
  button: string;
}

export interface PartnerCtaDict {
  critical: PartnerCtaCopy;
  warning: PartnerCtaCopy;
  monitor: PartnerCtaCopy;
  disclosure: string;
}

interface PartnerCtaProps {
  grade: string;
  score: number;
  spoofable: boolean;
  dict: PartnerCtaDict;
  delay?: number;
}

const tierStyles: Record<PartnerTier, { frame: string; button: string }> = {
  critical: {
    frame: "border-red-500/20 bg-red-500/5",
    button: "bg-white text-zinc-900 hover:bg-zinc-200",
  },
  warning: {
    frame: "border-amber-400/20 bg-amber-400/5",
    button: "bg-white text-zinc-900 hover:bg-zinc-200",
  },
  monitor: {
    frame: "border-zinc-800 bg-zinc-900/50",
    button: "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
  },
};

export default function PartnerCta({ grade, score, spoofable, dict, delay = 600 }: PartnerCtaProps) {
  const href = buildPartnerUrl(grade);
  if (!href) return null;

  const tier = getPartnerTier(spoofable, score);
  const copy = dict[tier];
  const styles = tierStyles[tier];

  return (
    <div
      className={`animate-fade-up rounded-xl border p-6 text-center space-y-3 print:hidden ${styles.frame}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <p className="text-sm text-zinc-400">{copy.subtitle}</p>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`inline-flex items-center h-11 px-6 rounded-xl font-semibold text-sm transition-colors ${styles.button}`}
      >
        {copy.button}
      </a>
      <p className="text-xs text-zinc-500">{dict.disclosure}</p>
    </div>
  );
}
