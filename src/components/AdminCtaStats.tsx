import {
  CTA_GRADES,
  CTA_PLACEMENTS,
  type CtaCounts,
  type CtaPlacement,
  type CtaStats,
} from "@/lib/cta-events";

const PLACEMENT_LABELS: Record<CtaPlacement, string> = {
  check: "Pages d’analyse",
  seo: "Pages SEO",
  other: "Autres pages",
};

// Formatage fait à la main : toLocaleString dépend de la version d'ICU et
// donnerait un rendu serveur différent du navigateur (erreur d'hydratation).
const formatCount = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function formatRate({ views, clicks }: CtaCounts): string {
  if (views === 0) return "—";
  return `${((clicks / views) * 100).toFixed(1).replace(".", ",")} %`;
}

/** "2026-11-10" -> "10/11/2026" */
const formatDay = (day: string) => day.split("-").reverse().join("/");

function Metric({ label, value, total }: { label: string; value: string; total: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold mt-1 text-zinc-100">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">Depuis le début : {total}</div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Array<[string, CtaCounts]> }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-zinc-500">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-zinc-500">
            <th className="text-left font-medium py-1" scope="col">
              <span className="sr-only">Segment</span>
            </th>
            <th className="text-right font-medium py-1" scope="col">Affichages</th>
            <th className="text-right font-medium py-1" scope="col">Clics</th>
            <th className="text-right font-medium py-1" scope="col">Taux</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, counts]) => (
            <tr key={label} className="border-t border-zinc-800/60 text-zinc-300">
              <th className="text-left font-normal py-1.5" scope="row">{label}</th>
              <td className="text-right tabular-nums">{formatCount(counts.views)}</td>
              <td className="text-right tabular-nums">{formatCount(counts.clicks)}</td>
              <td className="text-right tabular-nums text-zinc-400">{formatRate(counts)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Affichages et clics du CTA partenaire, pour mesurer le taux de clic réel. */
export default function AdminCtaStats({ stats }: { stats: CtaStats }) {
  const { total, last30Days } = stats;

  return (
    <section className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-300">CTA partenaire (30 derniers jours)</h2>
        <span className="text-xs text-zinc-500">
          {stats.since ? `Mesuré depuis le ${formatDay(stats.since)}` : "Aucun événement enregistré pour l’instant"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Affichages" value={formatCount(last30Days.views)} total={formatCount(total.views)} />
        <Metric label="Clics" value={formatCount(last30Days.clicks)} total={formatCount(total.clicks)} />
        <Metric label="Taux de clic" value={formatRate(last30Days)} total={formatRate(total)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Breakdown
          title="Par note du domaine (depuis le début)"
          rows={CTA_GRADES.map((grade) => [`Note ${grade}`, stats.byGrade[grade]])}
        />
        <Breakdown
          title="Par page (depuis le début)"
          rows={CTA_PLACEMENTS.map((placement) => [PLACEMENT_LABELS[placement], stats.byPlacement[placement]])}
        />
      </div>
    </section>
  );
}
