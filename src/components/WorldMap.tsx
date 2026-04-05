"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO 3166-1 numeric -> alpha-2
const NUM_TO_ALPHA2: Record<string, string> = {
  "004": "AF", "008": "AL", "012": "DZ", "020": "AD", "024": "AO", "031": "AZ",
  "032": "AR", "036": "AU", "040": "AT", "044": "BS", "048": "BH", "050": "BD",
  "051": "AM", "056": "BE", "060": "BM", "064": "BT", "068": "BO", "070": "BA",
  "072": "BW", "076": "BR", "084": "BZ", "096": "BN", "100": "BG", "104": "MM",
  "108": "BI", "112": "BY", "116": "KH", "120": "CM", "124": "CA", "140": "CF",
  "144": "LK", "148": "TD", "152": "CL", "156": "CN", "170": "CO", "178": "CG",
  "180": "CD", "188": "CR", "191": "HR", "192": "CU", "196": "CY", "203": "CZ",
  "208": "DK", "214": "DO", "218": "EC", "222": "SV", "226": "GQ", "231": "ET",
  "232": "ER", "233": "EE", "242": "FJ", "246": "FI", "250": "FR", "262": "DJ",
  "266": "GA", "268": "GE", "270": "GM", "275": "PS", "276": "DE", "288": "GH",
  "300": "GR", "316": "GU", "320": "GT", "324": "GN", "328": "GY", "332": "HT",
  "340": "HN", "344": "HK", "348": "HU", "352": "IS", "356": "IN", "360": "ID",
  "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "388": "JM",
  "392": "JP", "398": "KZ", "400": "JO", "404": "KE", "408": "KP", "410": "KR",
  "414": "KW", "417": "KG", "418": "LA", "422": "LB", "426": "LS", "428": "LV",
  "430": "LR", "434": "LY", "438": "LI", "440": "LT", "442": "LU", "450": "MG",
  "454": "MW", "458": "MY", "466": "ML", "478": "MR", "484": "MX", "496": "MN",
  "498": "MD", "499": "ME", "504": "MA", "508": "MZ", "512": "OM", "516": "NA",
  "524": "NP", "528": "NL", "540": "NC", "548": "VU", "554": "NZ", "558": "NI",
  "562": "NE", "566": "NG", "578": "NO", "586": "PK", "591": "PA", "598": "PG",
  "600": "PY", "604": "PE", "608": "PH", "616": "PL", "620": "PT", "630": "PR",
  "634": "QA", "642": "RO", "643": "RU", "646": "RW", "682": "SA", "686": "SN",
  "688": "RS", "694": "SL", "702": "SG", "703": "SK", "704": "VN", "705": "SI",
  "706": "SO", "710": "ZA", "716": "ZW", "724": "ES", "728": "SS", "729": "SD",
  "740": "SR", "752": "SE", "756": "CH", "760": "SY", "762": "TJ", "764": "TH",
  "768": "TG", "780": "TT", "784": "AE", "788": "TN", "792": "TR", "795": "TM",
  "800": "UG", "804": "UA", "807": "MK", "818": "EG", "826": "GB", "834": "TZ",
  "840": "US", "854": "BF", "858": "UY", "860": "UZ", "862": "VE", "887": "YE",
  "894": "ZM",
};

export const COUNTRY_NAMES: Record<string, string> = {
  US: "USA", CA: "Canada", MX: "Mexique", BR: "Bresil", AR: "Argentine",
  GB: "Royaume-Uni", FR: "France", DE: "Allemagne", NL: "Pays-Bas",
  BE: "Belgique", CH: "Suisse", IT: "Italie", ES: "Espagne", PT: "Portugal",
  IE: "Irlande", PL: "Pologne", CZ: "Tchequie", AT: "Autriche",
  SE: "Suede", NO: "Norvege", DK: "Danemark", FI: "Finlande",
  RO: "Roumanie", HU: "Hongrie", BG: "Bulgarie", GR: "Grece",
  RU: "Russie", UA: "Ukraine", TR: "Turquie", IN: "Inde", JP: "Japon",
  CN: "Chine", KR: "Coree du Sud", AU: "Australie", NZ: "Nouvelle-Zelande",
  ZA: "Afrique du Sud", NG: "Nigeria", EG: "Egypte", IL: "Israel",
  AE: "Emirats", TN: "Tunisie", AL: "Albanie", BA: "Bosnie",
  IS: "Islande", EE: "Estonie", VN: "Vietnam", DO: "Rep. Dominicaine",
  GT: "Guatemala", LI: "Liechtenstein", HK: "Hong Kong", GU: "Guam",
  PA: "Panama", PR: "Porto Rico",
};

// Country center coordinates for fly-to zoom
const COUNTRY_CENTERS: Record<string, [number, number]> = {
  US: [-98, 39], CA: [-106, 56], MX: [-102, 23], BR: [-51, -14], AR: [-64, -34],
  CL: [-71, -35], CO: [-72, 4], GB: [-2, 54], FR: [2, 46], DE: [10, 51],
  NL: [5, 52], BE: [4, 50], CH: [8, 47], IT: [12, 42], ES: [-4, 40],
  PT: [-8, 39], IE: [-8, 53], PL: [20, 52], CZ: [15, 49], AT: [14, 47],
  SE: [15, 62], NO: [9, 61], DK: [10, 56], FI: [26, 64], RO: [25, 46],
  HU: [19, 47], BG: [25, 43], GR: [22, 39], RU: [105, 60], UA: [32, 49],
  TR: [35, 39], IN: [79, 21], JP: [138, 36], CN: [104, 35], KR: [128, 36],
  AU: [134, -25], NZ: [174, -41], ZA: [25, -29], NG: [8, 10], EG: [30, 27],
  IL: [35, 31], AE: [54, 24], SA: [45, 24], TN: [9, 34], AL: [20, 41],
  BA: [18, 44], IS: [-19, 65], EE: [25, 59], VN: [108, 14], DO: [-70, 19],
  GT: [-90, 15], PA: [-80, 9], PR: [-66, 18],
};

// Approximate city coordinates
const CITY_COORDS: Record<string, [number, number]> = {
  "West Palm Beach": [-80.05, 26.72], "Martins Ferry": [-80.73, 40.10],
  "Heilbronn": [9.22, 49.14], "Lille": [3.06, 50.63], "Zurich": [8.54, 47.38],
  "Paris": [2.35, 48.86], "Lyon": [4.83, 45.76], "Marseille": [5.37, 43.30],
  "London": [-0.12, 51.51], "Berlin": [13.41, 52.52], "Munich": [11.58, 48.14],
  "Amsterdam": [4.90, 52.37], "Toronto": [-79.38, 43.65], "Montreal": [-73.57, 45.50],
  "Vancouver": [-123.12, 49.28], "Sydney": [151.21, -33.87], "Melbourne": [144.96, -37.81],
  "New York": [-74.01, 40.71], "San Francisco": [-122.42, 37.77],
  "Los Angeles": [-118.24, 34.05], "Chicago": [-87.63, 41.88],
  "Madrid": [-3.70, 40.42], "Barcelona": [2.17, 41.39], "Rome": [12.50, 41.89],
  "Dublin": [-6.26, 53.35], "Brussels": [4.35, 50.85], "Vienna": [16.37, 48.21],
  "Prague": [14.42, 50.08], "Stockholm": [18.07, 59.33], "Oslo": [10.75, 59.91],
  "Copenhagen": [12.57, 55.68], "Helsinki": [24.94, 60.17], "Bucharest": [26.10, 44.43],
  "Lisbon": [-9.14, 38.74], "Warsaw": [21.01, 52.23],
};

interface WorldMapProps {
  countries: Record<string, number>;
  cities: Record<string, number>;
  hoveredCountry: string | null;
  selectedCountry: string | null;
  onHoverCountry: (code: string | null) => void;
  onSelectCountry: (code: string | null) => void;
}

export default function WorldMap({
  countries, cities, hoveredCountry, selectedCountry, onHoverCountry, onSelectCountry,
}: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const maxCount = Math.max(...Object.values(countries), 1);

  // Zoom state for fly-to
  const defaultCenter: [number, number] = [10, 30];
  const defaultZoom = 1;

  const center = selectedCountry && COUNTRY_CENTERS[selectedCountry]
    ? COUNTRY_CENTERS[selectedCountry]
    : defaultCenter;
  const zoom = selectedCountry ? 4 : defaultZoom;

  // Cities for the selected country
  const maxCityCount = Math.max(...Object.values(cities), 1);

  const getCityName = (cityKey: string) => cityKey.split(",")[0].trim();
  const getCityCountry = (cityKey: string) => cityKey.split(",")[1]?.trim() || "";

  const visibleCities = selectedCountry
    ? Object.entries(cities)
        .filter(([key]) => getCityCountry(key) === selectedCountry)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
    : Object.entries(cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

  const topCityCount = visibleCities.length > 0 ? visibleCities[0][1] : 1;

  function getCountryColor(alpha2: string | undefined): string {
    if (!alpha2 || !countries[alpha2]) return "#1c1c1f";
    if (alpha2 === selectedCountry) return "#059669";
    if (alpha2 === hoveredCountry) return "#34d399";
    const count = countries[alpha2];
    const intensity = count / maxCount;
    if (intensity > 0.5) return "#059669";
    if (intensity > 0.2) return "#047857";
    if (intensity > 0.1) return "#065f46";
    if (intensity > 0.05) return "#064e3b";
    return "#063b30";
  }

  const handleCountryClick = useCallback((alpha2: string | undefined) => {
    if (!alpha2 || !countries[alpha2]) return;
    onSelectCountry(selectedCountry === alpha2 ? null : alpha2);
  }, [countries, selectedCountry, onSelectCountry]);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [10, 30] }}
        className="w-full h-auto"
        style={{ maxHeight: 350 }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={1}
          maxZoom={8}
          translateExtent={[[-200, -100], [1200, 600]]}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const alpha2 = NUM_TO_ALPHA2[geo.id];
                const count = alpha2 ? countries[alpha2] || 0 : 0;
                const name = alpha2 ? (COUNTRY_NAMES[alpha2] || alpha2) : "";
                const isHovered = alpha2 === hoveredCountry;
                const isSelected = alpha2 === selectedCountry;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(alpha2)}
                    stroke={isSelected ? "#34d399" : isHovered ? "#52525b" : "#27272a"}
                    strokeWidth={isSelected ? 1 : 0.3}
                    onClick={() => handleCountryClick(alpha2)}
                    onMouseEnter={(e) => {
                      if (alpha2) onHoverCountry(alpha2);
                      if (count) setTooltip({ name, count, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      if (count) setTooltip({ name, count, x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      onHoverCountry(null);
                      setTooltip(null);
                    }}
                    style={{
                      default: { outline: "none", cursor: count ? "pointer" : "default", transition: "fill 0.2s" },
                      hover: { outline: "none", transition: "fill 0.2s" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* City circles */}
          {visibleCities.map(([cityKey, count]) => {
            const cityName = getCityName(cityKey);
            const coords = CITY_COORDS[cityName];
            if (!coords) return null;
            const radius = Math.max(2, Math.min(8, 2 + (count / topCityCount) * 6));
            const isTop = count === topCityCount;
            return (
              <Marker key={cityKey} coordinates={coords}>
                {isTop && (
                  <circle r={radius + 4} fill="none" stroke="#34d399" strokeWidth={0.5} opacity={0.6}>
                    <animate attributeName="r" from={radius + 2} to={radius + 6} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={radius}
                  fill="rgba(52, 211, 153, 0.8)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={0.5}
                />
                <title>{cityName}: {count} checks</title>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Back button when zoomed */}
      {selectedCountry && (
        <button
          onClick={() => onSelectCountry(null)}
          className="absolute top-2 left-2 px-3 py-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700 text-xs text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors backdrop-blur-sm"
        >
          ← Vue monde
        </button>
      )}

      {/* Tooltip */}
      {tooltip && !selectedCountry && (
        <div
          className="fixed z-50 pointer-events-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <div className="text-sm font-semibold text-zinc-100">{tooltip.name}</div>
          <div className="text-xs text-emerald-400">{tooltip.count} visiteurs</div>
        </div>
      )}
    </div>
  );
}
