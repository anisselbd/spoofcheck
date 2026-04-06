import Link from "next/link";

interface FooterDict {
  footerHome: string;
  footerGuides: string;
  footerGuideSPF: string;
  footerGuideDKIM: string;
  footerGuideDMARC: string;
  footerGuideMtaSts: string;
  footerGuideComp: string;
  footerAbout: string;
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
  footerMadeBy: string;
  footerRights: string;
}

const defaults: Record<string, FooterDict> = {
  fr: {
    footerHome: "Accueil",
    footerGuides: "Guides",
    footerGuideSPF: "Guide SPF",
    footerGuideDKIM: "Guide DKIM",
    footerGuideDMARC: "Guide DMARC",
    footerGuideMtaSts: "Guide MTA-STS",
    footerGuideComp: "SPF vs DKIM vs DMARC",
    footerAbout: "À propos",
    footerContact: "Contact",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    footerMadeBy: "Fait par",
    footerRights: "Tous droits réservés.",
  },
  en: {
    footerHome: "Home",
    footerGuides: "Guides",
    footerGuideSPF: "SPF Guide",
    footerGuideDKIM: "DKIM Guide",
    footerGuideDMARC: "DMARC Guide",
    footerGuideMtaSts: "MTA-STS Guide",
    footerGuideComp: "SPF vs DKIM vs DMARC",
    footerAbout: "About",
    footerContact: "Contact",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerMadeBy: "Made by",
    footerRights: "All rights reserved.",
  },
};

interface FooterProps {
  lang: string;
  dict?: Partial<FooterDict>;
}

export default function Footer({ lang, dict }: FooterProps) {
  const t = { ...defaults[lang] ?? defaults.fr, ...dict };

  return (
    <footer className="relative z-10 border-t border-zinc-800/50 py-12 px-6 print:hidden">
      <div className="max-w-3xl mx-auto grid gap-10 sm:grid-cols-3">
        <div className="space-y-4">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {lang === "fr"
              ? "Outil gratuit de vérification de sécurité email."
              : "Free email security verification tool."}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/anisse-lebadi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/anisselbd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">{t.footerGuides}</h3>
          <nav className="flex flex-col gap-2">
            <Link href={`/${lang}/guides`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuides}
            </Link>
            <Link href={`/${lang}/guides/spf`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuideSPF}
            </Link>
            <Link href={`/${lang}/guides/dkim`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuideDKIM}
            </Link>
            <Link href={`/${lang}/guides/dmarc`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuideDMARC}
            </Link>
            <Link href={`/${lang}/guides/mta-sts`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuideMtaSts}
            </Link>
            <Link href={`/${lang}/guides/spf-vs-dkim-vs-dmarc`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerGuideComp}
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">Navigation</h3>
          <nav className="flex flex-col gap-2">
            <Link href={`/${lang}`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerHome}
            </Link>
            <Link href={`/${lang}/about`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerAbout}
            </Link>
            <Link href={`/${lang}/contact`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerContact}
            </Link>
            <Link href={`/${lang}/privacy`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerPrivacy}
            </Link>
            <Link href={`/${lang}/terms`} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              {t.footerTerms}
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} SpoofCheck. {t.footerMadeBy}{" "}
        <a
          href="https://www.linkedin.com/in/anisse-lebadi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Anisselbd
        </a>
        . {t.footerRights}
      </div>
    </footer>
  );
}
