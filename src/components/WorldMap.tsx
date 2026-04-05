"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

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
  AE: "Emirats", TN: "Tunisie", AL: "Albanie", BA: "Bosnie",
  IS: "Islande", EE: "Estonie", VN: "Vietnam", DO: "Rep. Dominicaine",
  GT: "Guatemala", LI: "Liechtenstein", HK: "Hong Kong", GU: "Guam",
  PA: "Panama", PR: "Porto Rico",
};

interface WorldMapProps {
  countries: Record<string, number>;
}

export default function WorldMap({ countries }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const maxCount = Math.max(...Object.values(countries), 1);

  function getCountryColor(alpha2: string | undefined): string {
    if (!alpha2 || !countries[alpha2]) return "#1c1c1f";
    const count = countries[alpha2];
    const intensity = count / maxCount;
    if (intensity > 0.5) return "#059669";
    if (intensity > 0.2) return "#047857";
    if (intensity > 0.1) return "#065f46";
    if (intensity > 0.05) return "#064e3b";
    return "#063b30";
  }

  function getCountryHover(alpha2: string | undefined): string {
    if (!alpha2 || !countries[alpha2]) return "#27272a";
    return "#34d399";
  }

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [10, 30] }}
        className="w-full h-auto"
        style={{ maxHeight: 320 }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const alpha2 = NUM_TO_ALPHA2[geo.id];
                const count = alpha2 ? countries[alpha2] : 0;
                const name = alpha2 ? (COUNTRY_NAMES[alpha2] || alpha2) : "";
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(alpha2)}
                    stroke="#27272a"
                    strokeWidth={0.3}
                    onMouseEnter={(e) => {
                      if (count) {
                        setTooltip({ name, count, x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (count) {
                        setTooltip({ name, count, x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: "none", cursor: count ? "pointer" : "default" },
                      hover: { outline: "none", fill: getCountryHover(alpha2), transition: "fill 0.2s" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltip && (
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
