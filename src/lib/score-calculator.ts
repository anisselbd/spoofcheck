import type {
  SpfResult,
  DkimResult,
  DmarcResult,
  MxResult,
  MtaStsResult,
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
      score = 25;
      break;
    case "quarantine":
      score = 17;
      break;
    case "none":
      score = 8;
      break;
    default:
      score = 5;
  }
  if (dmarc.reportingConfigured) score += 5;
  return score;
}

function scoreMx(mx: MxResult): number {
  return mx.found ? 10 : 0;
}

function scoreMtaSts(mtaSts: MtaStsResult): number {
  if (!mtaSts.found) return 0;
  if (mtaSts.policyError) return 2;
  switch (mtaSts.mode) {
    case "enforce":
      return 10;
    case "testing":
      return 5;
    default:
      return 2;
  }
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
  dmarc: DmarcResult,
  mtaSts: MtaStsResult
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

  if (!mtaSts.found) {
    recs.push("rec_add_mta_sts");
  } else if (mtaSts.mode === "testing") {
    recs.push("rec_mta_sts_enforce");
  } else if (mtaSts.policyError) {
    recs.push("rec_fix_mta_sts_policy");
  }

  return recs;
}

export function calculateScore(
  domain: string,
  spf: SpfResult,
  dkim: DkimResult,
  dmarc: DmarcResult,
  mx: MxResult,
  mtaSts: MtaStsResult
): DnsCheckResponse {
  const score =
    scoreSpf(spf, dmarc) + scoreDkim(dkim) + scoreDmarc(dmarc) + scoreMx(mx) + scoreMtaSts(mtaSts);

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
    mtaSts,
    recommendations: buildRecommendations(spf, dkim, dmarc, mtaSts),
    checkedAt: new Date().toISOString(),
  };
}
