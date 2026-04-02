import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Guide SPF : Configurer et comprendre le SPF email — SpoofCheck",
    description:
      "Guide complet sur le SPF (Sender Policy Framework) : comment configurer un enregistrement SPF, proteger votre domaine contre le spoofing email et eviter les erreurs courantes.",
    keywords: [
      "spf email",
      "configurer spf",
      "enregistrement spf",
      "sender policy framework",
      "spf record",
      "protection email",
      "anti-spoofing",
      "securite email",
      "dns spf",
    ],
    openGraph: {
      title: "Guide SPF : Configurer et comprendre le SPF email",
      description:
        "Guide complet sur le SPF : configuration, fonctionnement et erreurs courantes. Protegez votre domaine contre le spoofing.",
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Guide SPF : Configurer et comprendre le SPF email",
      description:
        "Guide complet sur le SPF : configuration, fonctionnement et erreurs courantes.",
    },
    alternates: {
      canonical: `https://spoofchecker.online/${lang}/guides/spf`,
      languages: {
        fr: "https://spoofchecker.online/fr/guides/spf",
        en: "https://spoofchecker.online/en/guides/spf",
      },
    },
  };
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide SPF : Configurer et comprendre le SPF email",
  description:
    "Guide complet sur le SPF (Sender Policy Framework) : comment configurer un enregistrement SPF, proteger votre domaine contre le spoofing email et eviter les erreurs courantes.",
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
  mainEntityOfPage: "https://spoofchecker.online/guides/spf",
  inLanguage: "fr",
  datePublished: "2025-01-15",
  dateModified: "2025-06-01",
};

export default async function SpfGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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
              <span className="text-zinc-300">SPF</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              SPF (Sender Policy Framework) : Le guide complet
            </h1>
            <p className="text-lg text-zinc-400">
              Tout comprendre sur l'enregistrement SPF pour proteger votre domaine contre l'usurpation d'email.
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Qu'est-ce que le SPF ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Le <strong className="text-zinc-100">SPF (Sender Policy Framework)</strong> est un protocole d'authentification email defini dans la{" "}
                <strong className="text-zinc-100">RFC 7208</strong>. Il permet au proprietaire d'un domaine de specifier quels serveurs de messagerie sont autorises a envoyer des emails en son nom.
              </p>
              <p>
                Concretement, le SPF fonctionne via un enregistrement DNS de type TXT. Quand un serveur de messagerie recoit un email pretendant venir de votre domaine, il consulte cet enregistrement pour verifier si le serveur expediteur est bien autorise. Si ce n'est pas le cas, l'email peut etre rejete ou marque comme suspect.
              </p>
              <p>
                Sans SPF, n'importe qui peut envoyer un email en se faisant passer pour votre domaine. C'est ce qu'on appelle le <strong className="text-zinc-100">spoofing email</strong>, une technique massivement utilisee dans les attaques de phishing. Le SPF est donc la premiere ligne de defense contre ce type d'usurpation.
              </p>
              <p>
                Le SPF seul ne suffit pas : il doit etre combine avec{" "}
                <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  DKIM (DomainKeys Identified Mail)
                </Link>{" "}
                et{" "}
                <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  DMARC (Domain-based Message Authentication)
                </Link>{" "}
                pour une protection complete de votre domaine.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment fonctionne le SPF ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Le fonctionnement du SPF repose sur une verification en plusieurs etapes lors de la reception d'un email :
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                  <strong className="text-zinc-100">Envoi de l'email</strong> — Un serveur de messagerie envoie un email avec votre domaine dans l'adresse de l'expediteur (le champ <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">MAIL FROM</code> de l'enveloppe SMTP).
                </li>
                <li>
                  <strong className="text-zinc-100">Requete DNS</strong> — Le serveur recepteur extrait le domaine de l'adresse <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">MAIL FROM</code> et interroge le DNS pour recuperer l'enregistrement SPF (TXT) associe.
                </li>
                <li>
                  <strong className="text-zinc-100">Comparaison de l'IP</strong> — Le serveur recepteur compare l'adresse IP du serveur expediteur avec la liste des IP et mecanismes autorises dans l'enregistrement SPF.
                </li>
                <li>
                  <strong className="text-zinc-100">Verdict</strong> — Selon le resultat, le serveur recepteur applique une action : accepter (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pass</code>), rejeter (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">fail</code>), marquer comme douteux (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">softfail</code>) ou considerer comme neutre (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">neutral</code>).
                </li>
              </ol>
              <p>
                Un enregistrement SPF typique ressemble a ceci :
              </p>
              <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                v=spf1 include:_spf.google.com include:sendgrid.net ip4:203.0.113.0/24 -all
              </div>
              <p>
                Chaque element a une signification precise :
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=spf1</code>
                  <span>— Indique qu'il s'agit d'un enregistrement SPF version 1 (obligatoire).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include:</code>
                  <span>— Autorise les serveurs definis dans le SPF d'un autre domaine (ex: Google, SendGrid).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">ip4:</code>
                  <span>— Autorise une adresse IPv4 ou un bloc d'adresses specifique.</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code>
                  <span>— Rejette tous les serveurs non explicitement autorises (hard fail).</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code>
                  <span>— Marque comme suspect sans rejeter (soft fail) — moins strict.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Configuration step by step */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment configurer le SPF etape par etape
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 1 : Identifier vos serveurs d'envoi
                </h3>
                <p>
                  Listez tous les services qui envoient des emails pour votre domaine. Cela inclut generalement :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                  <li>Votre fournisseur de messagerie (Google Workspace, Microsoft 365, OVH, etc.)</li>
                  <li>Vos outils d'email marketing (Mailchimp, Brevo, SendGrid, etc.)</li>
                  <li>Votre application web si elle envoie des emails transactionnels</li>
                  <li>Tout autre service tiers (CRM, helpdesk, etc.)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 2 : Construire votre enregistrement SPF
                </h3>
                <p>
                  Commencez toujours par <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=spf1</code> et terminez par un mecanisme <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> ou <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code>. Entre les deux, ajoutez vos serveurs autorises. Exemple pour Google Workspace + Brevo :
                </p>
                <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                  v=spf1 include:_spf.google.com include:sendinblue.com -all
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 3 : Ajouter l'enregistrement dans votre DNS
                </h3>
                <p>
                  Connectez-vous a l'interface de gestion DNS de votre registrar ou hebergeur (OVH, Cloudflare, Gandi, etc.) et creez un enregistrement TXT :
                </p>
                <ul className="space-y-2 pl-2 text-sm">
                  <li><strong className="text-zinc-100">Type :</strong> TXT</li>
                  <li><strong className="text-zinc-100">Nom / Host :</strong> @ (ou laissez vide selon le fournisseur)</li>
                  <li><strong className="text-zinc-100">Valeur :</strong> votre enregistrement SPF complet</li>
                  <li><strong className="text-zinc-100">TTL :</strong> 3600 (1 heure) ou la valeur par defaut</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 4 : Verifier votre configuration
                </h3>
                <p>
                  Apres la propagation DNS (quelques minutes a 48 heures), testez votre enregistrement SPF. Vous pouvez utiliser{" "}
                  <Link href="/fr" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    notre outil de verification gratuit
                  </Link>{" "}
                  pour valider que tout fonctionne correctement.
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
                  1. Depasser la limite de 10 lookups DNS
                </h3>
                <p>
                  La specification SPF impose un maximum de 10 resolutions DNS (include, a, mx, redirect). Chaque <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include</code> peut lui-meme contenir d'autres includes. Depassez cette limite et votre SPF sera automatiquement invalide avec un resultat <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">permerror</code>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  2. Avoir plusieurs enregistrements SPF
                </h3>
                <p>
                  Un domaine ne doit avoir qu'<strong className="text-zinc-100">un seul</strong> enregistrement SPF. Si vous en avez plusieurs, la verification echouera. Fusionnez tous vos mecanismes dans un seul enregistrement TXT.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  3. Utiliser +all au lieu de -all ou ~all
                </h3>
                <p>
                  Le mecanisme <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">+all</code> autorise <strong className="text-zinc-100">tous</strong> les serveurs a envoyer des emails pour votre domaine, ce qui revient a n'avoir aucune protection. Utilisez toujours <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> (hard fail) pour une protection maximale.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  4. Oublier un service d'envoi
                </h3>
                <p>
                  Si vous oubliez d'inclure un service legitime (par exemple votre outil de newsletter), ses emails seront rejetes ou classes en spam. Faites un inventaire complet avant de configurer votre SPF.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  5. Ne pas configurer DKIM et DMARC en complement
                </h3>
                <p>
                  Le SPF seul est insuffisant. Sans{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>{" "}
                  et{" "}
                  <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DMARC
                  </Link>
                  , un attaquant peut toujours contourner le SPF en utilisant un domaine d'enveloppe different du domaine visible dans le champ "From".
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Questions frequentes sur le SPF
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Le SPF suffit-il a proteger mon domaine contre le spoofing ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Non. Le SPF verifie uniquement l'adresse d'enveloppe (MAIL FROM), pas l'adresse affichee au destinataire (le header "From"). Un attaquant peut contourner le SPF en utilisant un domaine d'enveloppe different. C'est pourquoi vous devez obligatoirement combiner le SPF avec{" "}
                  <Link href="/fr/guides/dkim" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DKIM
                  </Link>{" "}
                  et{" "}
                  <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DMARC
                  </Link>{" "}
                  pour une protection complete.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Que se passe-t-il si je depasse les 10 lookups DNS ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Si votre enregistrement SPF necessite plus de 10 resolutions DNS, le resultat sera un <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">permerror</code> (erreur permanente). Les serveurs recepteurs traiteront alors votre SPF comme s'il n'existait pas. Pour rester sous la limite, vous pouvez remplacer certains <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include</code> par des adresses IP directes ou utiliser un service de "flattening" SPF.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Quelle est la difference entre -all et ~all ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> (hard fail) indique que les emails provenant de serveurs non autorises doivent etre rejetes. <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code> (soft fail) indique qu'ils doivent etre acceptes mais marques comme suspects. En pratique, avec une politique{" "}
                  <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DMARC
                  </Link>{" "}
                  correcte, la difference est minime. Neanmoins, <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> est recommande pour une securite maximale.
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
              <Link
                href="/fr/guides/dmarc"
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
              >
                <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  Guide DMARC
                </h3>
                <p className="text-sm text-zinc-400">
                  Decouvrez comment DMARC orchestre SPF et DKIM pour une protection complete.
                </p>
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
