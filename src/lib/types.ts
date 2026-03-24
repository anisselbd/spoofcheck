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

export interface DnsCheckResponse {
  domain: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  spoofable: boolean;
  spf: SpfResult;
  dkim: DkimResult;
  dmarc: DmarcResult;
  mx: MxResult;
  recommendations: string[];
  checkedAt: string;
}
