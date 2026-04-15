import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/*/check/"],
    },
    sitemap: "https://spoofchecker.online/sitemap.xml",
  };
}
