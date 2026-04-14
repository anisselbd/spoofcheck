import { NextRequest, NextResponse } from "next/server";
import { cleanDomain, isValidDomain } from "@/lib/validators";
import { checkDomain } from "@/lib/dns-checker";
import { calculateScore } from "@/lib/score-calculator";

const GRADE_COLORS: Record<string, string> = {
  A: "#10b981",
  B: "#34d399",
  C: "#facc15",
  D: "#f97316",
  F: "#ef4444",
};

function buildSvg(domain: string, grade: string, score: number): string {
  const color = GRADE_COLORS[grade] || "#6b7280";
  const labelWidth = 90;
  const valueWidth = 80;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="28" role="img" aria-label="SpoofCheck: ${grade} ${score}/100">
  <title>SpoofCheck: ${grade} ${score}/100</title>
  <defs>
    <linearGradient id="g" x2="0" y2="100%">
      <stop offset="0" stop-color="#fff" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r">
      <rect width="${totalWidth}" height="28" rx="6" fill="#fff"/>
    </clipPath>
  </defs>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="28" fill="#18181b"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="28" fill="${color}"/>
    <rect width="${totalWidth}" height="28" fill="url(#g)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12">
    <text x="${labelWidth / 2}" y="18" fill="#e4e4e7" font-weight="600">SpoofCheck</text>
    <text x="${labelWidth + valueWidth / 2}" y="18" font-weight="700">${grade} — ${score}/100</text>
  </g>
</svg>`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain: raw } = await params;
  const domain = cleanDomain(decodeURIComponent(raw));

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  const { spf, dkim, dmarc, mx, mtaSts } = await checkDomain(domain);
  const { grade, score } = calculateScore(domain, spf, dkim, dmarc, mx, mtaSts);

  return new NextResponse(buildSvg(domain, grade, score), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
