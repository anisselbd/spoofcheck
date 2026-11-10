/**
 * Mesure du CTA partenaire : affichages et clics, agrégés par jour, page et note.
 *
 * Module isomorphe (aucun import serveur) : le composant client l'utilise pour
 * construire l'événement, la route API pour le valider, l'admin pour le résumer.
 * Rien de personnel n'est stocké : uniquement des compteurs.
 */

export const CTA_EVENT_NAMES = ["view", "click"] as const;
export type CtaEventName = (typeof CTA_EVENT_NAMES)[number];

export const CTA_PLACEMENTS = ["check", "seo", "other"] as const;
export type CtaPlacement = (typeof CTA_PLACEMENTS)[number];

export const CTA_GRADES = ["A", "B", "C", "D", "F"] as const;
export type CtaGrade = (typeof CTA_GRADES)[number];

export interface CtaEvent {
  event: CtaEventName;
  placement: CtaPlacement;
  grade: CtaGrade;
}

const includes = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (list as readonly string[]).includes(value);

/** Page sur laquelle le CTA est affiché, déduite du chemin de l'URL. */
export function ctaPlacementFromPath(pathname: string): CtaPlacement {
  if (pathname.includes("/check/")) return "check";
  if (pathname.includes("/email-security/")) return "seo";
  return "other";
}

/** Valide un événement reçu du navigateur ; null s'il est incomplet ou inconnu. */
export function parseCtaEvent(payload: unknown): CtaEvent | null {
  if (typeof payload !== "object" || payload === null) return null;
  const { event, placement, grade } = payload as Record<string, unknown>;
  if (!includes(CTA_EVENT_NAMES, event)) return null;
  if (!includes(CTA_PLACEMENTS, placement)) return null;
  if (!includes(CTA_GRADES, grade)) return null;
  return { event, placement, grade };
}

/** Champ du hash Redis : `AAAA-MM-JJ|événement|page|note` (jour en UTC). */
export function ctaEventField(e: CtaEvent, now: number): string {
  const day = new Date(now).toISOString().slice(0, 10);
  return `${day}|${e.event}|${e.placement}|${e.grade}`;
}

export interface CtaCounts {
  views: number;
  clicks: number;
}

export interface CtaStats {
  /** Premier jour où un événement a été enregistré, null tant qu'il n'y en a aucun. */
  since: string | null;
  total: CtaCounts;
  last30Days: CtaCounts;
  byGrade: Record<CtaGrade, CtaCounts>;
  byPlacement: Record<CtaPlacement, CtaCounts>;
}

const emptyCounts = (): CtaCounts => ({ views: 0, clicks: 0 });

const countsByKey = <K extends string>(keys: readonly K[]) =>
  Object.fromEntries(keys.map((k) => [k, emptyCounts()])) as Record<K, CtaCounts>;

/** Agrège le contenu brut du hash Redis (champ -> compteur). */
export function summarizeCtaEvents(raw: Record<string, string>, now: number): CtaStats {
  // Fenêtre glissante de 30 jours, aujourd'hui inclus.
  const cutoff = new Date(now - 29 * 86_400_000).toISOString().slice(0, 10);
  const stats: CtaStats = {
    since: null,
    total: emptyCounts(),
    last30Days: emptyCounts(),
    byGrade: countsByKey(CTA_GRADES),
    byPlacement: countsByKey(CTA_PLACEMENTS),
  };

  for (const [field, value] of Object.entries(raw)) {
    const [day, event, placement, grade] = field.split("|");
    const count = Number.parseInt(value, 10);
    if (!day || !includes(CTA_EVENT_NAMES, event) || !Number.isFinite(count)) continue;

    const key = event === "view" ? "views" : "clicks";
    stats.total[key] += count;
    if (day >= cutoff) stats.last30Days[key] += count;
    if (includes(CTA_GRADES, grade)) stats.byGrade[grade][key] += count;
    if (includes(CTA_PLACEMENTS, placement)) stats.byPlacement[placement][key] += count;
    if (stats.since === null || day < stats.since) stats.since = day;
  }

  return stats;
}
