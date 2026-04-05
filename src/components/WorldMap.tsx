"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country code (ISO 3166-1 alpha-2) -> [longitude, latitude]
const COUNTRY_CENTERS: Record<string, [number, number]> = {
  US: [-98, 39], CA: [-106, 56], MX: [-102, 23], BR: [-51, -14], AR: [-64, -34],
  CL: [-71, -35], CO: [-72, 4], GB: [-2, 54], FR: [2, 46], DE: [10, 51],
  NL: [5, 52], BE: [4, 50], CH: [8, 47], IT: [12, 42], ES: [-4, 40],
  PT: [-8, 39], IE: [-8, 53], PL: [20, 52], CZ: [15, 49], AT: [14, 47],
  SE: [15, 62], NO: [9, 61], DK: [10, 56], FI: [26, 64], RO: [25, 46],
  HU: [19, 47], BG: [25, 43], GR: [22, 39], RU: [105, 60], UA: [32, 49],
  TR: [35, 39], IN: [79, 21], JP: [138, 36], CN: [104, 35], KR: [128, 36],
  AU: [134, -25], NZ: [174, -41], ZA: [25, -29], NG: [8, 10], EG: [30, 27],
  IL: [35, 31], AE: [54, 24], SA: [45, 24], SG: [104, 1], PH: [122, 13],
  ID: [120, -5], TH: [101, 15], VN: [108, 14], MY: [110, 4], PK: [70, 30],
  BD: [90, 24], KE: [38, 0], MA: [-6, 32], TN: [9, 34], DZ: [3, 28],
  PE: [-76, -10], VE: [-67, 7], EC: [-78, -2],
};

interface WorldMapProps {
  countries: Record<string, number>;
}

export default function WorldMap({ countries }: WorldMapProps) {
  const maxCount = Math.max(...Object.values(countries), 1);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 120, center: [10, 30] }}
      className="w-full h-auto"
      style={{ maxHeight: 300 }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#27272a"
              stroke="#3f3f46"
              strokeWidth={0.4}
              style={{
                default: { outline: "none" },
                hover: { outline: "none", fill: "#3f3f46" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
      {Object.entries(countries).map(([code, count]) => {
        const coords = COUNTRY_CENTERS[code];
        if (!coords) return null;
        const intensity = Math.max(0.4, count / maxCount);
        const radius = Math.max(4, Math.min(16, 4 + (count / maxCount) * 12));
        return (
          <Marker key={code} coordinates={coords}>
            <circle r={radius + 3} fill={`rgba(52, 211, 153, ${intensity * 0.15})`} />
            <circle
              r={radius}
              fill={`rgba(52, 211, 153, ${intensity})`}
              stroke="rgba(52, 211, 153, 0.3)"
              strokeWidth={0.5}
            />
            {radius >= 8 && (
              <text textAnchor="middle" y={3} fill="white" fontSize={8} fontWeight="bold">
                {count}
              </text>
            )}
            <title>{code}: {count} checks</title>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}
