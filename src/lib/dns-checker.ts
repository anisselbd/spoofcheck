import dns from "dns";
import type { SpfResult, DkimResult, DmarcResult, MxResult } from "./types";

const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const DKIM_SELECTORS = [
  "google",
  "default",
  "selector1",
  "selector2",
  "k1",
  "mandrill",
  "dkim",
  "mail",
  "smtp",
  "s1",
  "s2",
  "protonmail",
  "protonmail2",
  "protonmail3",
  "zendesk1",
  "zendesk2",
  "resend",
  "everlytickey1",
  "cm",
  "mxvault",
];

async function resolveTxtSafe(hostname: string): Promise<string | null> {
  try {
    const records = await resolver.resolveTxt(hostname);
    return records.map((r) => r.join("")).join("");
  } catch {
    return null;
  }
}

export async function checkSpf(domain: string): Promise<SpfResult> {
  const result: SpfResult = {
    found: false,
    record: null,
    isStrict: false,
    qualifier: null,
    issues: [],
  };

  try {
    const records = await resolver.resolveTxt(domain);
    const spfRecords = records
      .map((r) => r.join(""))
      .filter((r) => r.startsWith("v=spf1"));

    if (spfRecords.length === 0) {
      result.issues.push("Aucun enregistrement SPF trouvé");
      return result;
    }

    if (spfRecords.length > 1) {
      result.issues.push("Plusieurs enregistrements SPF détectés (invalide)");
    }

    const spf = spfRecords[0];
    result.found = true;
    result.record = spf;

    if (spf.includes("-all")) {
      result.qualifier = "-all";
      result.isStrict = true;
    } else if (spf.includes("~all")) {
      result.qualifier = "~all";
      result.issues.push(
        "SPF en softfail (~all) — les mails non autorisés ne sont pas rejetés"
      );
    } else if (spf.includes("?all")) {
      result.qualifier = "?all";
      result.issues.push("SPF en mode neutre (?all) — aucune protection");
    } else if (spf.includes("+all")) {
      result.qualifier = "+all";
      result.issues.push(
        "SPF avec +all — DANGER : autorise n'importe qui à envoyer"
      );
    }
  } catch {
    result.issues.push("Impossible de résoudre les enregistrements TXT");
  }

  return result;
}

export async function checkDkim(domain: string): Promise<DkimResult> {
  const result: DkimResult = {
    selectorsChecked: [...DKIM_SELECTORS],
    selectorsFound: [],
    records: {},
    found: false,
  };

  const checks = DKIM_SELECTORS.map(async (selector) => {
    const hostname = `${selector}._domainkey.${domain}`;
    const record = await resolveTxtSafe(hostname);
    if (record && (record.includes("p=") || record.includes("v=DKIM1"))) {
      return { selector, record };
    }
    return null;
  });

  const results = await Promise.allSettled(checks);

  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      result.selectorsFound.push(r.value.selector);
      result.records[r.value.selector] = r.value.record;
      result.found = true;
    }
  }

  return result;
}

export async function checkDmarc(domain: string): Promise<DmarcResult> {
  const result: DmarcResult = {
    found: false,
    record: null,
    policy: null,
    reportingConfigured: false,
    issues: [],
  };

  const record = await resolveTxtSafe(`_dmarc.${domain}`);

  if (!record || !record.startsWith("v=DMARC1")) {
    result.issues.push("Aucun enregistrement DMARC trouvé");
    return result;
  }

  result.found = true;
  result.record = record;

  const policyMatch = record.match(/;\s*p=(\w+)/);
  if (policyMatch) {
    result.policy = policyMatch[1] as DmarcResult["policy"];
  }

  if (result.policy === "none") {
    result.issues.push(
      "DMARC en mode monitoring (p=none) — ne bloque pas le spoofing"
    );
  } else if (result.policy === "quarantine") {
    result.issues.push(
      "DMARC en quarantaine — les mails spoofés vont en spam mais ne sont pas rejetés"
    );
  }

  if (record.includes("rua=")) {
    result.reportingConfigured = true;
  } else {
    result.issues.push(
      "Pas de reporting DMARC configuré (rua=) — vous ne verrez pas les tentatives de spoofing"
    );
  }

  return result;
}

export async function checkMx(domain: string): Promise<MxResult> {
  const result: MxResult = {
    found: false,
    records: [],
    provider: null,
  };

  try {
    const records = await resolver.resolveMx(domain);
    if (records.length === 0) {
      return result;
    }

    result.found = true;
    result.records = records
      .sort((a, b) => a.priority - b.priority)
      .map((r) => ({ priority: r.priority, exchange: r.exchange }));

    const primary = result.records[0].exchange.toLowerCase();
    if (primary.includes("google") || primary.includes("googlemail")) {
      result.provider = "Google Workspace";
    } else if (
      primary.includes("outlook") ||
      primary.includes("protection.outlook")
    ) {
      result.provider = "Microsoft 365";
    } else if (primary.includes("ovh")) {
      result.provider = "OVH";
    } else if (primary.includes("pphosted")) {
      result.provider = "Proofpoint";
    } else if (primary.includes("mimecast")) {
      result.provider = "Mimecast";
    } else if (primary.includes("zoho")) {
      result.provider = "Zoho Mail";
    } else if (primary.includes("icloud") || primary.includes("apple")) {
      result.provider = "iCloud Mail";
    }
  } catch {
    // No MX records
  }

  return result;
}

export async function checkDomain(domain: string) {
  const [spf, dkim, dmarc, mx] = await Promise.all([
    checkSpf(domain),
    checkDkim(domain),
    checkDmarc(domain),
    checkMx(domain),
  ]);

  return { spf, dkim, dmarc, mx };
}
