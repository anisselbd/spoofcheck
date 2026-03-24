import type {
  SpfResult,
  DkimResult,
  DmarcResult,
  MxResult,
  DnsCheckResponse,
} from "./types";

function scoreSpf(spf: SpfResult): number {
  if (!spf.found) return 0;
  switch (spf.qualifier) {
    case "-all":
      return 25;
    case "~all":
      return 15;
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
    recs.push(
      'Ajoutez un enregistrement DMARC : _dmarc.votredomaine TXT "v=DMARC1; p=reject; adkim=s; aspf=s; rua=mailto:dmarc@votredomaine"'
    );
  } else if (dmarc.policy === "none") {
    recs.push(
      "Changez votre politique DMARC de p=none à p=reject pour bloquer le spoofing"
    );
  } else if (dmarc.policy === "quarantine") {
    recs.push(
      "Passez votre politique DMARC de p=quarantine à p=reject pour un blocage total"
    );
  }

  if (!dmarc.reportingConfigured && dmarc.found) {
    recs.push(
      "Ajoutez rua=mailto:dmarc@votredomaine à votre DMARC pour recevoir les rapports"
    );
  }

  if (!spf.found) {
    recs.push(
      'Ajoutez un enregistrement SPF : votredomaine TXT "v=spf1 include:votrefournisseur -all"'
    );
  } else if (!spf.isStrict) {
    recs.push("Durcissez votre SPF en remplaçant ~all par -all (hardfail)");
  }

  if (!dkim.found) {
    recs.push(
      "Activez DKIM dans votre fournisseur mail et ajoutez la clé publique dans votre zone DNS"
    );
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
    scoreSpf(spf) + scoreDkim(dkim) + scoreDmarc(dmarc) + scoreMx(mx);

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
