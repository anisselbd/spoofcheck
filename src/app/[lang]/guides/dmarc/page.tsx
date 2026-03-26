import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide DMARC : Configurer la politique DMARC email — SpoofCheck",
  description:
    "Guide complet sur le DMARC (Domain-based Message Authentication) : comment configurer une politique DMARC, proteger votre domaine contre le phishing et recevoir des rapports.",
  keywords: [
    "dmarc email",
    "configurer dmarc",
    "politique dmarc",
    "dmarc record",
    "dmarc reject",
    "dmarc quarantine",
    "rapport dmarc",
    "protection phishing",
    "securite email",
  ],
  openGraph: {
    title: "Guide DMARC : Configurer la politique DMARC email",
    description:
      "Guide complet sur le DMARC : configuration, politique et rapports pour proteger votre domaine contre le phishing.",
    type: "article",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guide DMARC : Configurer la politique DMARC email",
    description:
      "Guide complet sur le DMARC : configuration, politique et rapports.",
  },
  alternates: {
    canonical: "https://spoofchecker.online/guides/dmarc",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide DMARC : Configurer la politique DMARC email",
  description:
    "Guide complet sur le DMARC (Domain-based Message Authentication) : comment configurer une politique DMARC, proteger votre domaine contre le phishing et recevoir des rapports.",
  author: {
    "@type": "Organization",
    name: "SpoofCheck",
    url: "https://spoofchecker.online",
  },
  publisher: {
    "@type": "Organization",
    name: "SpoofCheck",
    url: "https://spoofchecker.online",
  },
  mainEntityOfPage: "https://spoofchecker.online/guides/dmarc",
  inLanguage: "fr",
  datePublished: "2025-01-15",
  dateModified: "2025-06-01",
};

export default function DmarcGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/fr" className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/fr/guides"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/fr"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Tester mon domaine
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <article className="max-w-3xl w-full space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/fr/guides" className="hover:text-zinc-300 transition-colors">
                Guides
              </Link>
              <span>/</span>
              <span className="text-zinc-300">DMARC</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              DMARC (Domain-based Message Authentication) : Le guide complet
            </h1>
            <p className="text-lg text-zinc-400">
              Tout comprendre sur la politique DMARC pour orchestrer SPF et DKIM et proteger votre domaine contre le phishing.
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Qu'est-ce que le DMARC ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Le <strong className="text-zinc-100">DMARC (Domain-based Message Authentication, Reporting and Conformance)</strong> est un protocole d'authentification email defini dans la{" "}
                <strong className="text-zinc-100">RFC 7489</strong>. Il a ete cree pour resoudre une faiblesse majeure de{" "}
                <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  SPF
                </Link>{" "}
                et{" "}
                <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  DKIM
                </Link>{" "}
                : ces protocoles, seuls, ne disent pas au serveur recepteur quoi faire en cas d'echec.
              </p>
              <p>
                DMARC agit comme un <strong className="text-zinc-100">chef d'orchestre</strong> qui definit une politique claire : que doit faire le serveur recepteur lorsqu'un email echoue aux verifications SPF et DKIM ? Le rejeter, le mettre en quarantaine ou ne rien faire ? DMARC apporte egalement un systeme de <strong className="text-zinc-100">rapports</strong> qui vous permet de voir exactement qui envoie des emails avec votre domaine.
              </p>
              <p>
                Le concept cle de DMARC est l'<strong className="text-zinc-100">alignement</strong> : le domaine utilise dans le header "From" (visible par le destinataire) doit correspondre au domaine verifie par SPF ou DKIM. Sans cet alignement, un attaquant pourrait passer le SPF avec son propre domaine d'enveloppe tout en affichant votre domaine dans le "From" visible.
              </p>
              <p>
                DMARC est aujourd'hui considere comme indispensable. De nombreux fournisseurs de messagerie (Google, Yahoo, Microsoft) exigent desormais un enregistrement DMARC valide pour accepter les emails en volume. Sans DMARC, vos emails risquent d'atterrir en spam ou d'etre rejetes.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment fonctionne le DMARC ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                DMARC combine les resultats de SPF et DKIM avec une verification supplementaire d'alignement :
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                  <strong className="text-zinc-100">Reception de l'email</strong> — Le serveur recepteur recoit un email et extrait le domaine du header "From".
                </li>
                <li>
                  <strong className="text-zinc-100">Requete DNS DMARC</strong> — Il interroge le DNS pour trouver un enregistrement DMARC a l'adresse <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_dmarc.domaine.com</code>.
                </li>
                <li>
                  <strong className="text-zinc-100">Verification SPF + alignement</strong> — Le serveur verifie si le{" "}
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  passe ET si le domaine de l'enveloppe (MAIL FROM) est aligne avec le domaine du header "From".
                </li>
                <li>
                  <strong className="text-zinc-100">Verification DKIM + alignement</strong> — Le serveur verifie si le{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>{" "}
                  passe ET si le domaine de la signature DKIM (tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">d=</code>) est aligne avec le domaine du header "From".
                </li>
                <li>
                  <strong className="text-zinc-100">Application de la politique</strong> — Si ni SPF ni DKIM ne passent avec alignement, le serveur applique la politique DMARC definie par le proprietaire du domaine.
                </li>
                <li>
                  <strong className="text-zinc-100">Envoi de rapports</strong> — Le serveur recepteur envoie des rapports agreges (et eventuellement forensiques) au proprietaire du domaine.
                </li>
              </ol>

              <p className="pt-2">
                Un enregistrement DMARC ressemble a ceci :
              </p>
              <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                v=DMARC1; p=reject; rua=mailto:dmarc-reports@exemple.fr; ruf=mailto:dmarc-forensic@exemple.fr; adkim=s; aspf=s; pct=100
              </div>

              <p>
                Chaque tag a une signification precise :
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=DMARC1</code>
                  <span>— Identifie l'enregistrement comme DMARC version 1 (obligatoire).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=</code>
                  <span>— La politique a appliquer : <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">none</code> (surveillance), <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">quarantine</code> (spam) ou <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">reject</code> (rejet).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">rua=</code>
                  <span>— Adresse de reception des rapports agreges (obligatoire en pratique).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">ruf=</code>
                  <span>— Adresse de reception des rapports forensiques (optionnel, peu supporte).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">adkim=</code>
                  <span>— Mode d'alignement DKIM : <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">s</code> (strict) ou <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">r</code> (relaxed, par defaut).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">aspf=</code>
                  <span>— Mode d'alignement SPF : <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">s</code> (strict) ou <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">r</code> (relaxed, par defaut).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pct=</code>
                  <span>— Pourcentage d'emails auxquels la politique s'applique (utile pour un deploiement progressif).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Configuration step by step */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment configurer le DMARC etape par etape
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 1 : Verifier SPF et DKIM
                </h3>
                <p>
                  Avant de configurer DMARC, assurez-vous que votre{" "}
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  et{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>{" "}
                  sont correctement configures. DMARC s'appuie sur ces deux protocoles — s'ils ne fonctionnent pas, DMARC ne pourra pas fonctionner efficacement.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 2 : Commencer en mode surveillance (p=none)
                </h3>
                <p>
                  Creez un enregistrement TXT dans votre DNS pour commencer a collecter des rapports sans impacter la delivrabilite :
                </p>
                <ul className="space-y-2 pl-2 text-sm">
                  <li><strong className="text-zinc-100">Type :</strong> TXT</li>
                  <li><strong className="text-zinc-100">Nom :</strong> _dmarc</li>
                  <li><strong className="text-zinc-100">Valeur :</strong></li>
                </ul>
                <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                  v=DMARC1; p=none; rua=mailto:dmarc-reports@votredomaine.com
                </div>
                <p>
                  Cette configuration ne bloque aucun email mais vous envoie des rapports quotidiens detaillant tous les emails envoyes avec votre domaine.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 3 : Analyser les rapports (2 a 4 semaines)
                </h3>
                <p>
                  Les rapports DMARC sont des fichiers XML. Vous pouvez les lire manuellement ou utiliser un service d'analyse (comme Postmark, dmarcian ou Valimail). Identifiez :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                  <li>Les services legitimes qui echouent (SPF ou DKIM manquant)</li>
                  <li>Les sources suspectes qui usurpent votre domaine</li>
                  <li>Le volume d'emails concernes</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 4 : Passer en mode quarantaine
                </h3>
                <p>
                  Une fois que tous vos services legitimes passent SPF et/ou DKIM avec alignement, passez a la politique quarantine :
                </p>
                <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                  v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@votredomaine.com; pct=50
                </div>
                <p>
                  Le tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pct=50</code> permet d'appliquer la politique a seulement 50% des emails dans un premier temps, pour limiter les risques.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 5 : Activer le rejet total (p=reject)
                </h3>
                <p>
                  La derniere etape est la politique la plus stricte :
                </p>
                <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                  v=DMARC1; p=reject; rua=mailto:dmarc-reports@votredomaine.com; adkim=s; aspf=s
                </div>
                <p>
                  Avec <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>, tout email qui echoue aux verifications DMARC est rejete par le serveur recepteur. C'est la protection maximale contre le spoofing et le phishing. L'alignement strict (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">adkim=s; aspf=s</code>) exige une correspondance exacte des domaines.
                </p>
              </div>
            </div>
          </section>

          {/* Common mistakes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Erreurs courantes a eviter
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  1. Passer directement a p=reject
                </h3>
                <p>
                  C'est l'erreur la plus dangereuse. Si vous passez directement a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> sans phase de surveillance, vous risquez de bloquer vos propres emails legitimes. Suivez toujours la progression : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">none</code> → <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">quarantine</code> → <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">reject</code>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  2. Rester indefiniment en p=none
                </h3>
                <p>
                  La politique <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> n'offre aucune protection reelle : elle collecte des rapports mais ne bloque rien. Beaucoup de domaines restent en mode surveillance pendant des annees. Fixez-vous un objectif de 1 a 3 mois maximum avant de passer a quarantine.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  3. Ne pas configurer d'adresse de rapports (rua)
                </h3>
                <p>
                  Sans le tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">rua</code>, vous ne recevrez aucun rapport. Vous serez aveugle sur ce qui se passe avec votre domaine. Les rapports sont essentiels pour detecter les problemes de configuration et les tentatives d'usurpation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  4. Ignorer les sous-domaines
                </h3>
                <p>
                  Par defaut, la politique DMARC du domaine principal ne s'applique pas aux sous-domaines. Utilisez le tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">sp=reject</code> pour definir explicitement une politique pour les sous-domaines, sinon un attaquant pourrait envoyer depuis <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">fake.votredomaine.com</code>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  5. Oublier de configurer SPF et DKIM au prealable
                </h3>
                <p>
                  DMARC ne fonctionne pas de maniere isolee. Il s'appuie sur les resultats de{" "}
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  et{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>
                  . Sans ces protocoles correctement configures, DMARC n'a rien a verifier et tous vos emails echoueront.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Questions frequentes sur le DMARC
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Quelle politique DMARC choisir ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  L'objectif final est toujours <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>, qui offre la meilleure protection. Mais commencez par <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> pour collecter des rapports et identifier tous les services qui envoient des emails avec votre domaine. Passez ensuite a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=quarantine</code> puis a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> progressivement.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Qu'est-ce que l'alignement DMARC ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  L'alignement verifie que le domaine utilise dans le header "From" (visible par le destinataire) correspond au domaine verifie par{" "}
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  (domaine de l'enveloppe) ou{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>{" "}
                  (domaine du tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">d=</code>). En mode "relaxed" (par defaut), les sous-domaines sont acceptes. En mode "strict", les domaines doivent correspondre exactement.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  DMARC est-il obligatoire en 2025 ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Techniquement non, mais en pratique oui. Depuis fevrier 2024, Google et Yahoo exigent un enregistrement DMARC pour les expediteurs envoyant plus de 5 000 emails par jour. Meme pour les petits volumes, l'absence de DMARC degrade serieusement la delivrabilite de vos emails. C'est devenu un standard incontournable de la securite email.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Verifiez votre domaine gratuitement
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Testez votre configuration SPF, DKIM et DMARC en un clic. Notre outil analyse votre domaine et vous indique exactement ce qu'il faut corriger.
            </p>
            <Link
              href="/fr"
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              Tester mon domaine
            </Link>
          </section>

          {/* Related guides */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-400">
              Guides complementaires
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/fr/guides/spf"
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  Guide SPF
                </h3>
                <p className="text-sm text-zinc-400">
                  Apprenez a configurer un enregistrement SPF pour autoriser vos serveurs d'envoi.
                </p>
              </Link>
              <Link
                href="/fr/guides/dkim"
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  Guide DKIM
                </h3>
                <p className="text-sm text-zinc-400">
                  Apprenez a configurer la signature DKIM pour authentifier vos emails.
                </p>
              </Link>
            </div>
          </section>
        </article>
      </main>

      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600">
          SpoofCheck — Outil de verification de securite email. Les
          verifications DNS sont publiques et non intrusives.
        </div>
      </footer>
    </div>
  );
}
