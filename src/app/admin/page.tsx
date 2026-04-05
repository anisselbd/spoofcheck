import { getDomainsChecked, getAllDomainData } from "@/lib/redis";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

type SortKey = "domain" | "score" | "grade" | "checkedAt" | "checkCount";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token, sort = "checkedAt", dir = "desc" } = await searchParams;

  if (token !== process.env.ADMIN_TOKEN) {
    return <AdminLogin />;
  }

  const [totalChecks, domains] = await Promise.all([
    getDomainsChecked(),
    getAllDomainData(),
  ]);

  const uniqueDomains = domains.length;
  const avgScore =
    uniqueDomains > 0
      ? Math.round(
          domains.reduce((s, d) => s + d.score, 0) / uniqueDomains
        )
      : 0;
  const spoofablePct =
    uniqueDomains > 0
      ? Math.round(
          (domains.filter((d) => d.spoofable).length / uniqueDomains) * 100
        )
      : 0;

  const grades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const d of domains) {
    grades[d.grade] = (grades[d.grade] || 0) + 1;
  }

  const sortKey = sort as SortKey;
  const sortDir = dir === "asc" ? 1 : -1;
  const sorted = [...domains].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "string" && typeof bv === "string")
      return av.localeCompare(bv) * sortDir;
    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * sortDir;
    if (typeof av === "boolean" && typeof bv === "boolean")
      return (Number(av) - Number(bv)) * sortDir;
    return 0;
  });

  function sortUrl(key: SortKey) {
    const newDir = sort === key && dir !== "asc" ? "asc" : "desc";
    return `/admin?token=${token}&sort=${key}&dir=${newDir}`;
  }

  function sortIndicator(key: SortKey) {
    if (sort !== key) return "";
    return dir === "asc" ? " \u25B4" : " \u25BE";
  }

  const metrics = [
    { label: "Total checks", value: totalChecks.toLocaleString() },
    { label: "Domaines uniques", value: uniqueDomains.toLocaleString() },
    { label: "Score moyen", value: `${avgScore}/100` },
    { label: "Spoofable", value: `${spoofablePct}%` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold">SpoofCheck Admin</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center"
          >
            <div className="text-2xl font-bold">{m.value}</div>
            <div className="text-sm text-zinc-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Grade distribution */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400">
          Distribution des grades
        </h2>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {Object.entries(grades).map(([grade, count]) => {
            const pct = uniqueDomains > 0 ? (count / uniqueDomains) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={grade}
                className={`${GRADE_COLORS[grade]} flex items-center justify-center text-xs font-bold text-white`}
                style={{ width: `${pct}%` }}
                title={`${grade}: ${count} (${Math.round(pct)}%)`}
              >
                {pct >= 8 ? `${grade} ${count}` : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-zinc-400">
          {Object.entries(grades).map(([grade, count]) => (
            <span key={grade}>
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${GRADE_COLORS[grade]} mr-1`}
              />
              {grade}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Domain table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                {(
                  [
                    ["domain", "Domaine"],
                    ["score", "Score"],
                    ["grade", "Grade"],
                    ["checkedAt", "Dernier check"],
                    ["checkCount", "Checks"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th key={key} className="px-4 py-3 font-medium">
                    <a
                      href={sortUrl(key)}
                      className="hover:text-zinc-200 transition-colors"
                    >
                      {label}
                      {sortIndicator(key)}
                    </a>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Spoofable</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr
                  key={d.domain}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-zinc-200">
                    {d.domain}
                  </td>
                  <td className="px-4 py-3">{d.score}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${GRADE_COLORS[d.grade]}`}
                    >
                      {d.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(d.checkedAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">{d.checkCount}</td>
                  <td className="px-4 py-3 text-center">
                    {d.spoofable ? (
                      <span className="text-red-400 font-semibold">Oui</span>
                    ) : (
                      <span className="text-emerald-400">Non</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
