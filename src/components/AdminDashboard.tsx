"use client";

import { useState, useMemo } from "react";
import type { DomainCheckData, CheckEvent } from "@/lib/redis";

type DomainEntry = { domain: string } & DomainCheckData;

interface GeoData {
  countries: Record<string, number>;
  cities: Record<string, number>;
}

interface Props {
  totalChecks: number;
  domains: DomainEntry[];
  timeline: CheckEvent[];
  geo: GeoData;
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

// Mercator projection: country code -> [x%, y%] on a 800x400 map
const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [18, 38], CA: [17, 28], MX: [15, 45], BR: [32, 62], AR: [28, 72],
  CL: [25, 72], CO: [24, 52], GB: [47, 27], FR: [48, 33], DE: [50, 29],
  NL: [49, 27], BE: [49, 29], CH: [49, 32], IT: [51, 35], ES: [46, 36],
  PT: [44, 36], IE: [45, 26], PL: [53, 28], CZ: [52, 30], AT: [51, 31],
  SE: [52, 20], NO: [50, 18], DK: [50, 24], FI: [55, 18], RO: [55, 33],
  HU: [53, 31], BG: [55, 34], GR: [54, 37], RU: [65, 22], UA: [57, 30],
  TR: [58, 36], IN: [72, 44], JP: [86, 36], CN: [78, 38], KR: [84, 37],
  AU: [84, 68], NZ: [90, 75], ZA: [55, 70], NG: [49, 50], EG: [56, 42],
  IL: [58, 40], AE: [64, 44], SA: [62, 44], SG: [78, 52], PH: [82, 48],
  ID: [80, 55], TH: [77, 48], VN: [78, 48], MY: [78, 52], PK: [68, 42],
  BD: [73, 44], LK: [72, 50], KE: [58, 54], MA: [44, 40], TN: [50, 38],
  DZ: [48, 40], PE: [23, 60], VE: [26, 50], EC: [22, 54],
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "USA", CA: "Canada", MX: "Mexique", BR: "Bresil", AR: "Argentine",
  GB: "Royaume-Uni", FR: "France", DE: "Allemagne", NL: "Pays-Bas",
  BE: "Belgique", CH: "Suisse", IT: "Italie", ES: "Espagne", PT: "Portugal",
  IE: "Irlande", PL: "Pologne", CZ: "Tchequie", AT: "Autriche",
  SE: "Suede", NO: "Norvege", DK: "Danemark", FI: "Finlande",
  RO: "Roumanie", HU: "Hongrie", BG: "Bulgarie", GR: "Grece",
  RU: "Russie", UA: "Ukraine", TR: "Turquie", IN: "Inde", JP: "Japon",
  CN: "Chine", KR: "Coree du Sud", AU: "Australie", NZ: "Nouvelle-Zelande",
  ZA: "Afrique du Sud", NG: "Nigeria", EG: "Egypte", IL: "Israel",
  AE: "Emirats", SA: "Arabie Saoudite", SG: "Singapour", PH: "Philippines",
  ID: "Indonesie", TH: "Thailande", VN: "Vietnam", MY: "Malaisie",
  PK: "Pakistan", BD: "Bangladesh", LK: "Sri Lanka", KE: "Kenya",
  MA: "Maroc", TN: "Tunisie", DZ: "Algerie", PE: "Perou",
  VE: "Venezuela", EC: "Equateur", CL: "Chili", CO: "Colombie",
};

type SortKey = "domain" | "score" | "grade" | "checkedAt" | "checkCount";

export default function AdminDashboard({ totalChecks, domains, timeline, geo, token }: Props) {
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

  // Geo data
  const totalVisitors = Object.values(geo.countries).reduce((a, b) => a + b, 0);
  const maxCountryCount = Math.max(...Object.values(geo.countries), 1);
  const sortedCountries = Object.entries(geo.countries).sort((a, b) => b[1] - a[1]);
  const sortedCities = Object.entries(geo.cities).sort((a, b) => b[1] - a[1]).slice(0, 15);

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

      {/* World Map */}
      {totalVisitors > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Visiteurs dans le monde</h2>
            <span className="text-xs text-zinc-500">{totalVisitors} checks geolocalisees</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Map */}
            <div className="lg:col-span-3 relative">
              <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ minHeight: 220 }}>
                <defs>
                  <radialGradient id="glow">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Simplified continent outlines */}
                <g fill="#27272a" stroke="#3f3f46" strokeWidth="0.5">
                  {/* North America */}
                  <path d="M50,120 L80,80 L120,60 L160,50 L200,55 L230,70 L250,90 L240,120 L220,140 L200,160 L180,180 L170,200 L160,220 L140,230 L130,210 L120,190 L100,180 L80,170 L60,160 L50,140 Z" />
                  {/* Greenland */}
                  <path d="M280,30 L320,25 L350,35 L360,55 L340,70 L310,65 L290,50 Z" />
                  {/* South America */}
                  <path d="M200,260 L220,250 L240,255 L260,270 L280,300 L300,330 L310,360 L300,390 L280,410 L260,400 L240,380 L220,350 L210,320 L200,290 Z" />
                  {/* Europe */}
                  <path d="M430,60 L450,55 L470,60 L490,70 L510,65 L530,70 L540,90 L530,100 L520,110 L500,120 L480,130 L460,125 L440,115 L430,100 L425,80 Z" />
                  {/* UK + Ireland */}
                  <path d="M420,75 L430,70 L435,80 L430,90 L420,85 Z" />
                  {/* Africa */}
                  <path d="M440,180 L460,170 L490,165 L520,170 L550,180 L570,200 L580,230 L575,260 L560,290 L540,320 L520,340 L500,350 L480,340 L460,310 L450,280 L440,250 L435,220 L435,200 Z" />
                  {/* Asia */}
                  <path d="M540,50 L580,40 L620,35 L670,40 L720,50 L760,60 L800,70 L830,90 L850,110 L860,140 L840,160 L810,170 L780,180 L750,190 L720,185 L690,170 L660,155 L630,140 L600,130 L570,120 L550,100 L540,80 Z" />
                  {/* India */}
                  <path d="M660,160 L680,155 L700,170 L710,200 L700,230 L680,245 L660,230 L650,200 L650,180 Z" />
                  {/* Southeast Asia */}
                  <path d="M730,190 L750,185 L770,195 L780,210 L770,225 L750,220 L740,210 Z" />
                  {/* Japan */}
                  <path d="M840,100 L850,90 L860,95 L858,110 L848,115 L840,108 Z" />
                  {/* Australia */}
                  <path d="M770,310 L810,295 L850,300 L880,310 L890,340 L880,370 L850,380 L820,375 L790,360 L775,340 L770,320 Z" />
                  {/* New Zealand */}
                  <path d="M910,370 L915,360 L920,365 L918,380 L912,378 Z" />
                </g>
                {/* Country dots */}
                {sortedCountries.map(([code, count]) => {
                  const coords = COUNTRY_COORDS[code];
                  if (!coords) return null;
                  const [xPct, yPct] = coords;
                  const x = xPct * 10;
                  const y = yPct * 10;
                  const intensity = Math.max(0.4, count / maxCountryCount);
                  const radius = Math.max(6, Math.min(25, 6 + (count / maxCountryCount) * 19));
                  return (
                    <g key={code}>
                      <circle cx={x} cy={y} r={radius * 2} fill="url(#glow)" opacity={intensity * 0.5} />
                      <circle
                        cx={x} cy={y} r={radius}
                        fill={`rgba(52, 211, 153, ${intensity})`}
                        stroke="rgba(52, 211, 153, 0.3)"
                        strokeWidth="1"
                        className="hover:brightness-150 transition-all cursor-pointer"
                      >
                        <title>{COUNTRY_NAMES[code] || code}: {count} checks</title>
                      </circle>
                      {radius >= 10 && (
                        <text x={x} y={y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{count}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Country + City list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                {sortedCountries.slice(0, 10).map(([code, count]) => (
                  <div key={code} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{COUNTRY_NAMES[code] || code}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / maxCountryCount) * 100}%` }} />
                      </div>
                      <span className="text-zinc-500 text-xs tabular-nums w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
              {sortedCities.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-zinc-500 mb-1.5">Top villes</h3>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {sortedCities.map(([city, count]) => (
                      <div key={city} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 truncate mr-2">{city}</span>
                        <span className="text-zinc-500 tabular-nums shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
