import type { MetadataRoute } from "next";

const BASE = "https://spoofchecker.online";
const locales = ["fr", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/guides", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/guides/spf", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/dkim", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/dmarc", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides/spf-vs-dkim-vs-dmarc", changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  return pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((lang) => ({
      url: `${BASE}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );
}
