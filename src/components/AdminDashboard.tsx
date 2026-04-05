"use client";

import { useState, useMemo } from "react";
import type { DomainCheckData, CheckEvent } from "@/lib/redis";

type DomainEntry = { domain: string } & DomainCheckData;

interface Props {
  totalChecks: number;
  domains: DomainEntry[];
  timeline: CheckEvent[];
  token: string;
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

const TLD_TO_COUNTRY: Record<string, string> = {
  fr: "France",
  com: "USA/Global",
  net: "USA/Global",
  org: "USA/Global",
  io: "Global",
  uk: "UK",
  de: "Allemagne",
  au: "Australie",
  br: "Bresil",
  nz: "Nouvelle-Zelande",
  eu: "Europe",
  je: "Jersey",
  gt: "Guatemala",
  jp: "Japon",
  xyz: "Global",
  me: "Montenegro",
  aero: "Aviation",
  gov: "USA Gov",
  network: "Global",
};

function getTld(domain: string): string {
  const parts = domain.split(".");
  if (parts.length >= 3) {
    const last2 = parts.slice(-2).join(".");
    if (["co.uk", "com.au", "org.uk", "co.nz", "com.br", "co.jp", "com.gt", "org.au"].includes(last2)) {
      return last2.split(".").pop()!;
    }
  }
  return parts.pop()!;
}

type SortKey = "domain" | "score" | "grade" | "checkedAt" | "checkCount";

export default function AdminDashboard({ totalChecks, domains, timeline, token }: Props) {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [spoofFilter, setSpoofFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("checkedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const uniqueDomains = domains.length;
  const avgScore = uniqueDomains > 0 ? Math.round(domains.reduce((s, d) => s + d.score, 0) / uniqueDomains) : 0;
  const spoofablePct = uniqueDomains > 0 ? Math.round((domains.filter((d) => d.spoofable).length / uniqueDomains) * 100) : 0;

  const grades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const d of domains) grades[d.grade] = (grades[d.grade] || 0) + 1;

  // Timeline: group by hour (last 48h)
  const timelineData = useMemo(() => {
    const now = Date.now();
    const hours: { label: string; count: number }[] = [];
    for (let i = 47; i >= 0; i--) {
      const start = now - (i + 1) * 3600000;
      const end = now - i * 3600000;
      const count = timeline.filter((e) => e.timestamp >= start && e.timestamp < end).length;
      const d = new Date(end);
      hours.push({
        label: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}h`,
        count,
      });
    }
    return hours;
  }, [timeline]);

  const maxTimelineCount = Math.max(...timelineData.map((h) => h.count), 1);

  // Top domains
  const topDomains = useMemo(
    () => [...domains].sort((a, b) => b.checkCount - a.checkCount).slice(0, 10),
    [domains]
  );

  // TLD distribution
  const tldDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of domains) {
      const tld = getTld(d.domain);
      map[tld] = (map[tld] || 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([tld, count]) => ({
        tld,
        country: TLD_TO_COUNTRY[tld] || tld.toUpperCase(),
        count,
        pct: Math.round((count / uniqueDomains) * 100),
      }));
  }, [domains, uniqueDomains]);

  // Filtered & sorted table
  const filtered = useMemo(() => {
    let list = domains;
    if (search) list = list.filter((d) => d.domain.toLowerCase().includes(search.toLowerCase()));
    if (gradeFilter) list = list.filter((d) => d.grade === gradeFilter);
    if (spoofFilter) list = list.filter((d) => (spoofFilter === "oui" ? d.spoofable : !d.spoofable));

    return [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      if (typeof av === "boolean" && typeof bv === "boolean") return (Number(av) - Number(bv)) * dir;
      return 0;
    });
  }, [domains, search, gradeFilter, spoofFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B4" : " \u25BE";
  }

  function exportCsv() {
    const header = "Domaine,Score,Grade,Spoofable,Dernier check,Checks\n";
    const rows = filtered
      .map((d) =>
        `${d.domain},${d.score},${d.grade},${d.spoofable ? "Oui" : "Non"},${d.checkedAt},${d.checkCount}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spoofcheck-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div key={m.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
            <div className="text-2xl font-bold">{m.value}</div>
            <div className="text-sm text-zinc-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400">Checks par heure (48h)</h2>
        <div className="flex items-end gap-px h-32">
          {timelineData.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full bg-emerald-500/80 rounded-t-sm min-h-[2px] transition-all hover:bg-emerald-400"
                style={{ height: h.count > 0 ? `${Math.max((h.count / maxTimelineCount) * 100, 4)}%` : "0%" }}
              />
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-800 text-xs text-zinc-200 px-2 py-1 rounded whitespace-nowrap z-10">
                {h.label}: {h.count} checks
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{timelineData[0]?.label}</span>
          <span>{timelineData[timelineData.length - 1]?.label}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Top domains */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400">Top domaines</h2>
          <div className="space-y-2">
            {topDomains.map((d, i) => (
              <div key={d.domain} className="flex items-center gap-3 text-sm">
                <span className="shrink-0 w-5 text-zinc-500 text-right">{i + 1}</span>
                <span className="flex-1 font-mono text-zinc-200 truncate">{d.domain}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center ${GRADE_COLORS[d.grade]}`}>
                  {d.grade}
                </span>
                <span className="shrink-0 text-zinc-400 w-16 text-right">{d.checkCount} checks</span>
              </div>
            ))}
          </div>
        </div>

        {/* TLD / Country distribution */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400">Distribution par pays/TLD</h2>
          <div className="space-y-2">
            {tldDistribution.map(({ tld, country, count, pct }) => (
              <div key={tld} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-200">.{tld} <span className="text-zinc-500">({country})</span></span>
                  <span className="text-zinc-400">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade distribution */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400">Distribution des grades</h2>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {Object.entries(grades).map(([grade, count]) => {
            const pct = uniqueDomains > 0 ? (count / uniqueDomains) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={grade}
                className={`${GRADE_COLORS[grade]} flex items-center justify-center text-xs font-bold text-white`}
                style={{ width: `${pct}%` }}
              >
                {pct >= 8 ? `${grade} ${count}` : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-zinc-400">
          {Object.entries(grades).map(([grade, count]) => (
            <span key={grade}>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${GRADE_COLORS[grade]} mr-1`} />
              {grade}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Filters + Export */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher un domaine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 text-sm"
        >
          <option value="">Tous grades</option>
          {["A", "B", "C", "D", "F"].map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
        <select
          value={spoofFilter}
          onChange={(e) => setSpoofFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 text-sm"
        >
          <option value="">Spoofable: tous</option>
          <option value="oui">Spoofable: Oui</option>
          <option value="non">Spoofable: Non</option>
        </select>
        <button
          onClick={exportCsv}
          className="h-10 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
        >
          Export CSV
        </button>
        <span className="text-xs text-zinc-500">{filtered.length} resultats</span>
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
                    <button
                      onClick={() => handleSort(key)}
                      className="hover:text-zinc-200 transition-colors"
                    >
                      {label}{sortIndicator(key)}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Spoofable</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.domain} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-zinc-200">{d.domain}</td>
                  <td className="px-4 py-3">{d.score}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${GRADE_COLORS[d.grade]}`}>
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
