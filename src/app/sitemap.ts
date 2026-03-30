import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://spoofchecker.online",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
{
      url: "https://spoofchecker.online/guides",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://spoofchecker.online/guides/spf",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://spoofchecker.online/guides/dkim",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://spoofchecker.online/guides/dmarc",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
