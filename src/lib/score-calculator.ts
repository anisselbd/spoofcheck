import type {
  SpfResult,
  DkimResult,
  DmarcResult,
  MxResult,
  DnsCheckResponse,
} from "./types";

function scoreSpf(spf: SpfResult, dmarc: DmarcResult): number {
  if (!spf.found) return 0;
  switch (spf.qualifier) {
    case "-all":
      return 25;
    case "~all":
      // ~all is fine when DMARC enforces the policy (RFC 7489 §10.1)
      return dmarc.policy === "reject" ? 25 : 15;
    case "?all":
      return 5;
    case "+all":
      return 0;
    default:
      return 10;
  }
}

function scoreDkim(dkim: DkimResult): number {
  if (!dkim.found) return 0;
  return 25;
}

function scoreDmarc(dmarc: DmarcResult): number {
  if (!dmarc.found) return 0;
  let score = 0;
  switch (dmarc.policy) {
    case "reject":
      score = 30;
      break;
    case "quarantine":
      score = 20;
      break;
    case "none":
      score = 10;
      break;
    default:
      score = 5;
  }
  if (dmarc.reportingConfigured) score += 5;
  return score;
}

function scoreMx(mx: MxResult): number {
  return mx.found ? 15 : 0;
}

function getGrade(score: number): DnsCheckResponse["grade"] {
  if (score >= 90) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}

function buildRecommendations(
  spf: SpfResult,
  dkim: DkimResult,
  dmarc: DmarcResult
): string[] {
  const recs: string[] = [];

  if (!dmarc.found) {
    recs.push("rec_add_dmarc");
  } else if (dmarc.policy === "none") {
    recs.push("rec_dmarc_none_to_reject");
  } else if (dmarc.policy === "quarantine") {
    recs.push("rec_dmarc_quarantine_to_reject");
  }

  if (!dmarc.reportingConfigured && dmarc.found) {
    recs.push("rec_add_rua");
  }

  if (!spf.found) {
    recs.push("rec_add_spf");
  } else if (!spf.isStrict && dmarc.policy !== "reject") {
    recs.push("rec_harden_spf");
  }

  if (!dkim.found) {
    recs.push("rec_add_dkim");
  }

  return recs;
}

export function calculateScore(
  domain: string,
  spf: SpfResult,
  dkim: DkimResult,
  dmarc: DmarcResult,
  mx: MxResult
): DnsCheckResponse {
  const score =
    scoreSpf(spf, dmarc) + scoreDkim(dkim) + scoreDmarc(dmarc) + scoreMx(mx);

  const spoofable =
    !dmarc.found || dmarc.policy === "none" || (!spf.found && !dkim.found);

  return {
    domain,
    score,
    grade: getGrade(score),
    spoofable,
    spf,
    dkim,
    dmarc,
    mx,
    recommendations: buildRecommendations(spf, dkim, dmarc),
    checkedAt: new Date().toISOString(),
  };
}
