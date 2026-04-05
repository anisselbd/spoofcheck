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
      result.issues.push("spf_not_found");
      return result;
    }

    if (spfRecords.length > 1) {
      result.issues.push("spf_multiple");
    }

    const spf = spfRecords[0];
    result.found = true;
    result.record = spf;

    if (spf.includes("-all")) {
      result.qualifier = "-all";
      result.isStrict = true;
    } else if (spf.includes("~all")) {
      result.qualifier = "~all";
      result.issues.push("spf_softfail");
    } else if (spf.includes("?all")) {
      result.qualifier = "?all";
      result.issues.push("spf_neutral");
    } else if (spf.includes("+all")) {
      result.qualifier = "+all";
      result.issues.push("spf_pass_all");
    }
  } catch {
    result.issues.push("spf_resolve_error");
  }

  return result;
}

export async function checkDkim(
  domain: string,
  extraSelectors?: string[]
): Promise<DkimResult> {
  const allSelectors = [...DKIM_SELECTORS, ...(extraSelectors || [])];
  const result: DkimResult = {
    selectorsChecked: allSelectors,
    selectorsFound: [],
    records: {},
    found: false,
  };

  const checks = allSelectors.map(async (selector) => {
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

  // If no standard selectors found, try to discover via _domainkey CNAME
  if (!result.found) {
    try {
      const cnames = await resolver.resolveCname(`_domainkey.${domain}`);
      if (cnames.length > 0) {
        result.found = true;
        result.selectorsFound.push("dkim_cname_detected");
      }
    } catch {
      // No CNAME at _domainkey
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

  let record: string | null = null;
  try {
    const records = await resolver.resolveTxt(`_dmarc.${domain}`);
    const dmarc = records
      .map((r) => r.join(""))
      .find((r) => r.startsWith("v=DMARC1"));
    record = dmarc ?? null;
  } catch {
    // No TXT records
  }

  if (!record) {
    result.issues.push("dmarc_not_found");
    return result;
  }

  result.found = true;
  result.record = record;

  const policyMatch = record.match(/;\s*p=(\w+)/);
  if (policyMatch) {
    result.policy = policyMatch[1] as DmarcResult["policy"];
  }

  if (result.policy === "none") {
    result.issues.push("dmarc_none");
  } else if (result.policy === "quarantine") {
    result.issues.push("dmarc_quarantine");
  }

  if (record.includes("rua=")) {
    result.reportingConfigured = true;
  } else {
    result.issues.push("dmarc_no_reporting");
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
    } else if (primary.includes("securemail.pro")) {
      result.provider = "Amen / team.blue";
    }
  } catch {
    // No MX records
  }

  return result;
}

export async function checkDomain(domain: string, extraDkimSelectors?: string[]) {
  const [spf, dkim, dmarc, mx] = await Promise.all([
    checkSpf(domain),
    checkDkim(domain, extraDkimSelectors),
    checkDmarc(domain),
    checkMx(domain),
  ]);

  return { spf, dkim, dmarc, mx };
}
