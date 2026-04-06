import type { MetadataRoute } from "next";

const BASE = "https://spoofchecker.online";
const locales = ["fr", "en"];

const popularDomains = [
  "gmail.com", "outlook.com", "yahoo.com", "protonmail.com", "icloud.com",
  "orange.fr", "free.fr", "sfr.fr", "laposte.net", "ovh.net",
  "hotmail.com", "aol.com", "zoho.com", "gmx.com", "fastmail.com",
];

function alternates(path: string) {
  return {
    languages: {
      "x-default": `${BASE}/en${path}`,
      ...Object.fromEntries(
        locales.map((lang) => [lang, `${BASE}/${lang}${path}`])
      ),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/guides", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/guides/spf", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/dkim", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/dmarc", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/spf-vs-dkim-vs-dmarc", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const staticPages = pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((lang) => ({
      url: `${BASE}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: alternates(path),
    }))
  );

  const domainPages = popularDomains.flatMap((domain) =>
    locales.map((lang) => ({
      url: `${BASE}/${lang}/email-security/${domain}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternates(`/email-security/${domain}`),
    }))
  );

  return [...staticPages, ...domainPages];
}
