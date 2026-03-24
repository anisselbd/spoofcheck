import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpoofCheck — Votre domaine est-il usurpable ?",
  description:
    "Vérifiez gratuitement si votre domaine est protégé contre le spoofing email. Analyse SPF, DKIM, DMARC en un clic.",
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
      </body>
    </html>
  );
}
