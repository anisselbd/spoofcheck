const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/\/.*$/, "");
  domain = domain.replace(/^www\./, "");
  return domain;
}

export function isValidDomain(domain: string): boolean {
  return DOMAIN_REGEX.test(domain) && domain.length <= 253;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
