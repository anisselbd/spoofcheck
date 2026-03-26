import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spoofchecker.online"),
  title: "SpoofCheck — Votre domaine est-il usurpable ?",
  description:
    "Vérifiez gratuitement si votre domaine est protégé contre le spoofing email. Analyse SPF, DKIM, DMARC en un clic.",
  keywords: [
    "spoofing email",
    "SPF",
    "DKIM",
    "DMARC",
    "sécurité email",
    "vérification domaine",
    "anti-spoofing",
    "test email",
    "protection email",
    "usurpation email",
  ],
  openGraph: {
    title: "SpoofCheck — Votre domaine est-il usurpable ?",
    description:
      "Vérifiez gratuitement si votre domaine est protégé contre le spoofing email. Analyse SPF, DKIM, DMARC en un clic.",
    type: "website",
    locale: "fr_FR",
    url: "https://spoofchecker.online",
    siteName: "SpoofCheck",
    images: [
      {
        url: "https://spoofchecker.online/IMG_6766.png",
        width: 1206,
        height: 630,
        alt: "SpoofCheck — Vérification SPF, DKIM, DMARC",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpoofCheck — Votre domaine est-il usurpable ?",
    description:
      "Vérifiez gratuitement si votre domaine est protégé contre le spoofing email. Analyse SPF, DKIM, DMARC en un clic.",
    images: [
      {
        url: "https://spoofchecker.online/IMG_6766.png",
        width: 1206,
        height: 630,
        alt: "SpoofCheck — Vérification SPF, DKIM, DMARC",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
