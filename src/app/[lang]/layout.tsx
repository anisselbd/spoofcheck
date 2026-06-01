import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { hasLocale, getDictionary, locales } from "./dictionaries";
import type { Locale } from "./dictionaries";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL("https://spoofchecker.online"),
    title: dict.metadata.homeTitle,
    description: dict.metadata.homeDescription,
    keywords: [
      "spoofing email",
      "SPF",
      "DKIM",
      "DMARC",
      "MTA-STS",
      "email security",
      "domain check",
      "anti-spoofing",
      "email test",
      "email protection",
    ],
    alternates: {
      canonical: `https://spoofchecker.online/${lang}`,
      languages: {
        "x-default": "https://spoofchecker.online/en",
        fr: "https://spoofchecker.online/fr",
        en: "https://spoofchecker.online/en",
      },
    },
    openGraph: {
      title: dict.metadata.homeTitle,
      description: dict.metadata.homeDescription,
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      url: `https://spoofchecker.online/${lang}`,
      siteName: "SpoofCheck",
      images: [
        {
          url: "https://spoofchecker.online/IMG_6766.png",
          width: 1206,
          height: 630,
          alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.homeTitle,
      description: dict.metadata.homeDescription,
      images: [
        {
          url: "https://spoofchecker.online/IMG_6766.png",
          width: 1206,
          height: 630,
          alt: "SpoofCheck — SPF, DKIM, DMARC, MTA-STS",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
