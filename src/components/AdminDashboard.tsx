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

const GRADE_TEXT: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const TLD_TO_COUNTRY: Record<string, string> = {
  fr: "France", com: "USA/Global", net: "USA/Global", org: "USA/Global",
  io: "Global", uk: "UK", de: "Allemagne", au: "Australie", br: "Bresil",
  nz: "Nouvelle-Zelande", eu: "Europe", je: "Jersey", gt: "Guatemala",
  jp: "Japon", xyz: "Global", me: "Montenegro", aero: "Aviation",
  gov: "USA Gov", network: "Global",
};

const TLD_FLAGS: Record<string, string> = {
  fr: "\uD83C\uDDEB\uD83C\uDDF7", uk: "\uD83C\uDDEC\uD83C\uDDE7", de: "\uD83C\uDDE9\uD83C\uDDEA", au: "\uD83C\uDDE6\uD83C\uDDFA",
  br: "\uD83C\uDDE7\uD83C\uDDF7", nz: "\uD83C\uDDF3\uD83C\uDDFF", eu: "\uD83C\uDDEA\uD83C\uDDFA", jp: "\uD83C\uDDEF\uD83C\uDDF5",
  gt: "\uD83C\uDDEC\uD83C\uDDF9", je: "\uD83C\uDDEF\uD83C\uDDEA", com: "\uD83C\uDF10", net: "\uD83C\uDF10", org: "\uD83C\uDF10",
  io: "\uD83C\uDF10", xyz: "\uD83C\uDF10", me: "\uD83C\uDDF2\uD83C\uDDEA", gov: "\uD83C\uDDFA\uD83C\uDDF8",
  aero: "\u2708\uFE0F", network: "\uD83C\uDF10",
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
  const protectedPct = 100 - spoofablePct;

  const grades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const d of domains) grades[d.grade] = (grades[d.grade] || 0) + 1;

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
  const totalTimelineChecks = timeline.length;

  const topDomains = useMemo(
    () => [...domains].sort((a, b) => b.checkCount - a.checkCount).slice(0, 10),
    [domains]
  );

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
        flag: TLD_FLAGS[tld] || "\uD83C\uDF10",
        count,
        pct: Math.round((count / uniqueDomains) * 100),
      }));
  }, [domains, uniqueDomains]);

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
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B4" : " \u25BE";
  }

  function exportCsv() {
    const header = "Domaine,Score,Grade,Spoofable,Dernier check,Checks\n";
    const rows = filtered
      .map((d) => `${d.domain},${d.score},${d.grade},${d.spoofable ? "Oui" : "Non"},${d.checkedAt},${d.checkCount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spoofcheck-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const scoreColor = avgScore >= 70 ? "text-emerald-400" : avgScore >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-zinc-100">Spoof</span>
            <span className="text-emerald-400">Check</span>
            <span className="text-zinc-500 text-lg font-medium ml-3">Admin</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Derniere mise a jour : {new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="h-9 px-4 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-200 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total checks</div>
          <div className="text-3xl font-bold mt-2 text-zinc-100">{totalChecks.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 mt-1">{totalTimelineChecks} ces 48h</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Domaines uniques</div>
          <div className="text-3xl font-bold mt-2 text-zinc-100">{uniqueDomains.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 mt-1">{tldDistribution.length} TLDs differents</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Score moyen</div>
          <div className={`text-3xl font-bold mt-2 ${scoreColor}`}>{avgScore}<span className="text-lg text-zinc-500">/100</span></div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${avgScore >= 70 ? "bg-emerald-500" : avgScore >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${avgScore}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Spoofable</div>
          <div className="text-3xl font-bold mt-2 text-red-400">{spoofablePct}<span className="text-lg">%</span></div>
          <div className="mt-2 flex h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${protectedPct}%` }} />
            <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${spoofablePct}%` }} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">Activite (48h)</h2>
          <span className="text-xs text-zinc-500">{totalTimelineChecks} checks</span>
        </div>
        <div className="flex items-end gap-[2px] h-36">
          {timelineData.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full rounded-t transition-all bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 hover:opacity-100"
                style={{ height: h.count > 0 ? `${Math.max((h.count / maxTimelineCount) * 100, 5)}%` : "0%" }}
              />
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                <div className="bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  <span className="font-semibold">{h.count}</span> checks
                  <div className="text-zinc-400">{h.label}</div>
                </div>
                <div className="w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45 -mt-1" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>{timelineData[0]?.label}</span>
          <span>{timelineData[Math.floor(timelineData.length / 2)]?.label}</span>
          <span>{timelineData[timelineData.length - 1]?.label}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top domains */}
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Top domaines</h2>
          <div className="space-y-2.5">
            {topDomains.map((d, i) => (
              <div key={d.domain} className="flex items-center gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                  {i + 1}
                </span>
                <span className="flex-1 font-mono text-sm text-zinc-200 truncate">{d.domain}</span>
                <span className={`shrink-0 w-7 h-7 rounded-lg text-xs font-bold text-white flex items-center justify-center ${GRADE_COLORS[d.grade]}`}>
                  {d.grade}
                </span>
                <span className="shrink-0 text-zinc-500 text-sm tabular-nums w-20 text-right">
                  {d.checkCount} <span className="text-zinc-600">checks</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TLD / Country distribution */}
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Repartition geographique</h2>
          <div className="space-y-3">
            {tldDistribution.map(({ tld, country, flag, count, pct }) => (
              <div key={tld} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-200">
                    <span className="mr-1.5">{flag}</span>
                    .{tld} <span className="text-zinc-500">({country})</span>
                  </span>
                  <span className="text-zinc-400 tabular-nums">{count} <span className="text-zinc-600">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade distribution */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300">Distribution des grades</h2>
        <div className="flex h-10 rounded-xl overflow-hidden gap-1">
          {Object.entries(grades).map(([grade, count]) => {
            const pct = uniqueDomains > 0 ? (count / uniqueDomains) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={grade}
                className={`${GRADE_COLORS[grade]} flex items-center justify-center text-xs font-bold text-white rounded-lg transition-all hover:opacity-90`}
                style={{ width: `${pct}%` }}
              >
                {pct >= 10 ? `${grade} (${count})` : pct >= 6 ? grade : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 text-sm">
          {Object.entries(grades).map(([grade, count]) => (
            <span key={grade} className="flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded ${GRADE_COLORS[grade]}`} />
              <span className={`font-semibold ${GRADE_TEXT[grade]}`}>{grade}</span>
              <span className="text-zinc-500">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filters + Export */}
      <div className="flex flex-wrap gap-3 items-center rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un domaine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm transition-all"
          />
        </div>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-sm cursor-pointer hover:border-zinc-600 transition-colors"
        >
          <option value="">Tous grades</option>
          {["A", "B", "C", "D", "F"].map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
        <select
          value={spoofFilter}
          onChange={(e) => setSpoofFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-sm cursor-pointer hover:border-zinc-600 transition-colors"
        >
          <option value="">Spoofable: tous</option>
          <option value="oui">Spoofable: Oui</option>
          <option value="non">Spoofable: Non</option>
        </select>
        <button
          onClick={exportCsv}
          className="h-10 px-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
        >
          Export CSV
        </button>
        <span className="text-xs text-zinc-500 tabular-nums">{filtered.length} resultats</span>
      </div>

      {/* Domain table */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                {(
                  [
                    ["domain", "Domaine"],
                    ["score", "Score"],
                    ["grade", "Grade"],
                    ["checkedAt", "Dernier check"],
                    ["checkCount", "Checks"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th key={key} className="px-4 py-3.5 font-medium text-zinc-400">
                    <button
                      onClick={() => handleSort(key)}
                      className="hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      {label}
                      <span className="text-emerald-400">{sortIndicator(key)}</span>
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3.5 font-medium text-zinc-400">Spoofable</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.domain} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-zinc-200">{d.domain}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold tabular-nums ${d.score >= 70 ? "text-emerald-400" : d.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                      {d.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-white ${GRADE_COLORS[d.grade]}`}>
                      {d.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 tabular-nums">
                    {new Date(d.checkedAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-400 tabular-nums">{d.checkCount}</td>
                  <td className="px-4 py-3 text-center">
                    {d.spoofable ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Oui</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Non</span>
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
