export interface SpfResult {
  found: boolean;
  record: string | null;
  isStrict: boolean;
  qualifier: "-all" | "~all" | "?all" | "+all" | null;
  issues: string[];
}

export interface DkimResult {
  selectorsChecked: string[];
  selectorsFound: string[];
  records: Record<string, string>;
  found: boolean;
}

export interface DmarcResult {
  found: boolean;
  record: string | null;
  policy: "none" | "quarantine" | "reject" | null;
  reportingConfigured: boolean;
  issues: string[];
}

export interface MxResult {
  found: boolean;
  records: Array<{ priority: number; exchange: string }>;
  provider: string | null;
}

export interface MtaStsResult {
  found: boolean;
  record: string | null;
  mode: "enforce" | "testing" | "none" | null;
  mxPatterns: string[];
  maxAge: number | null;
  policyError: boolean;
  issues: string[];
}

export interface DnsCheckResponse {
  domain: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  spoofable: boolean;
  spf: SpfResult;
  dkim: DkimResult;
  dmarc: DmarcResult;
  mx: MxResult;
  mtaSts: MtaStsResult;
  recommendations: string[];
  checkedAt: string;
}
