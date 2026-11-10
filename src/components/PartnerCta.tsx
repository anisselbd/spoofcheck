"use client";

import { useEffect, useRef } from "react";
import { buildPartnerUrl, getPartnerTier, type PartnerTier } from "@/lib/partner";
import { ctaPlacementFromPath, type CtaEventName } from "@/lib/cta-events";

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

/**
 * Signale un affichage ou un clic au site. Le lien reste direct vers le
 * partenaire : sendBeacon part même si l'onglet change, sans retarder la
 * navigation. Toute erreur est ignorée, la mesure ne doit rien bloquer.
 */
function sendCtaEvent(event: CtaEventName, grade: string) {
  const body = JSON.stringify({
    event,
    grade,
    placement: ctaPlacementFromPath(window.location.pathname),
  });
  try {
    if (navigator.sendBeacon?.("/api/cta", body)) return;
  } catch {
    // sendBeacon indisponible ou refusé : repli sur fetch ci-dessous.
  }
  fetch("/api/cta", { method: "POST", body, keepalive: true }).catch(() => {});
}

export default function PartnerCta({ grade, score, spoofable, dict, delay = 600 }: PartnerCtaProps) {
  const href = buildPartnerUrl(grade);
  const frameRef = useRef<HTMLDivElement>(null);

  // Un affichage n'est compté que lorsque le CTA est réellement à l'écran
  // (au moins à moitié visible), une seule fois par résultat.
  useEffect(() => {
    const node = frameRef.current;
    if (!href || !node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          sendCtaEvent("view", grade);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [href, grade]);

  if (!href) return null;

  const tier = getPartnerTier(spoofable, score);
  const copy = dict[tier];
  const styles = tierStyles[tier];

  return (
    <div
      ref={frameRef}
      className={`animate-fade-up rounded-xl border p-6 text-center space-y-3 print:hidden ${styles.frame}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <p className="text-sm text-zinc-400">{copy.subtitle}</p>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => sendCtaEvent("click", grade)}
        onAuxClick={(e) => {
          // Clic molette : ouverture dans un nouvel onglet, à compter aussi.
          if (e.button === 1) sendCtaEvent("click", grade);
        }}
        className={`inline-flex items-center h-11 px-6 rounded-xl font-semibold text-sm transition-colors ${styles.button}`}
      >
        {copy.button}
      </a>
      <p className="text-xs text-zinc-500">{dict.disclosure}</p>
    </div>
  );
}
