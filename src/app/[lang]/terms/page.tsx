import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Footer from "@/components/Footer";

const meta = {
  fr: {
    title: "Conditions d'utilisation — SpoofCheck",
    description:
      "Conditions générales d'utilisation du service SpoofCheck.",
    h1: "Conditions d'utilisation",
    lastUpdated: "Dernière mise à jour : 5 avril 2026",
    sections: [
      {
        title: "Acceptation des conditions",
        content:
          "En accédant et en utilisant SpoofCheck (spoofchecker.online), vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.",
      },
      {
        title: "Description du service",
        content:
          "SpoofCheck est un outil gratuit qui analyse les enregistrements DNS publics (SPF, DKIM, DMARC) d'un domaine pour évaluer sa vulnérabilité au spoofing email. Le service effectue uniquement des requêtes DNS publiques et non intrusives.",
      },
      {
        title: "Utilisation autorisée",
        content:
          "Le service est destiné à un usage légitime de vérification de sécurité email. Vous pouvez analyser vos propres domaines ou des domaines pour lesquels vous avez une autorisation. L'utilisation abusive, automatisée à grande échelle ou malveillante du service est interdite.",
      },
      {
        title: "Limitation de responsabilité",
        content:
          "Les résultats fournis par SpoofCheck sont basés sur l'état actuel des enregistrements DNS au moment de l'analyse. Ils sont donnés à titre informatif et ne constituent pas un audit de sécurité complet. SpoofCheck ne garantit pas l'exactitude absolue des résultats et ne peut être tenu responsable des décisions prises sur la base de ces analyses.",
      },
      {
        title: "Disponibilité du service",
        content:
          "SpoofCheck s'efforce de maintenir le service disponible en permanence, mais ne peut garantir une disponibilité ininterrompue. Le service peut être temporairement suspendu pour maintenance ou mise à jour.",
      },
      {
        title: "Propriété intellectuelle",
        content:
          "Le contenu du site (textes, guides, design, code) est la propriété de SpoofCheck. Vous pouvez partager les résultats d'analyse mais la reproduction du contenu du site sans autorisation est interdite.",
      },
      {
        title: "Modifications",
        content:
          "SpoofCheck se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur cette page.",
      },
      {
        title: "Contact",
        content:
          "Pour toute question concernant ces conditions, contactez-nous à contact@spoofcheck.fr.",
      },
    ],
  },
  en: {
    title: "Terms of Service — SpoofCheck",
    description: "Terms of service for the SpoofCheck service.",
    h1: "Terms of Service",
    lastUpdated: "Last updated: April 5, 2026",
    sections: [
      {
        title: "Acceptance of terms",
        content:
          "By accessing and using SpoofCheck (spoofchecker.online), you agree to these terms of service. If you do not agree, please do not use the service.",
      },
      {
        title: "Service description",
        content:
          "SpoofCheck is a free tool that analyzes public DNS records (SPF, DKIM, DMARC) of a domain to assess its vulnerability to email spoofing. The service only performs public, non-intrusive DNS queries.",
      },
      {
        title: "Authorized use",
        content:
          "The service is intended for legitimate email security verification. You may analyze your own domains or domains for which you have authorization. Abusive, large-scale automated, or malicious use of the service is prohibited.",
      },
      {
        title: "Limitation of liability",
        content:
          "Results provided by SpoofCheck are based on the current state of DNS records at the time of analysis. They are provided for informational purposes only and do not constitute a comprehensive security audit. SpoofCheck does not guarantee absolute accuracy and cannot be held liable for decisions made based on these analyses.",
      },
      {
        title: "Service availability",
        content:
          "SpoofCheck strives to keep the service available at all times but cannot guarantee uninterrupted availability. The service may be temporarily suspended for maintenance or updates.",
      },
      {
        title: "Intellectual property",
        content:
          "Site content (text, guides, design, code) is the property of SpoofCheck. You may share analysis results, but reproducing site content without authorization is prohibited.",
      },
      {
        title: "Changes",
        content:
          "SpoofCheck reserves the right to modify these terms at any time. Changes take effect upon publication on this page.",
      },
      {
        title: "Contact",
        content:
          "For any questions about these terms, contact us at contact@spoofcheck.fr.",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = meta[lang as Locale];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/terms`,
      languages: {
        "x-default": "https://spoofchecker.online/en/terms",
        fr: "https://spoofchecker.online/fr/terms",
        en: "https://spoofchecker.online/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const m = meta[lang as Locale];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href={`/${lang}/guides`}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {dict.common.guides}
            </Link>
            <Link
              href={lang === "fr" ? "/en/terms" : "/fr/terms"}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === "fr" ? "\ud83c\uddec\ud83c\udde7" : "\ud83c\uddeb\ud83c\uddf7"}
            </Link>
            <Link
              href={`/${lang}`}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {dict.common.testMyDomain}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {m.h1}
            </h1>
            <p className="text-sm text-zinc-500">{m.lastUpdated}</p>
          </div>

          {m.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-xl font-bold text-emerald-400">
                {section.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </article>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
