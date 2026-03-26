import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide DKIM : Configurer la signature DKIM email — SpoofCheck",
  description:
    "Guide complet sur le DKIM (DomainKeys Identified Mail) : comment configurer une signature DKIM, authentifier vos emails et garantir leur integrite.",
  keywords: [
    "dkim email",
    "configurer dkim",
    "signature dkim",
    "domainkeys identified mail",
    "dkim record",
    "cle dkim",
    "authentification email",
    "securite email",
    "dns dkim",
  ],
  openGraph: {
    title: "Guide DKIM : Configurer la signature DKIM email",
    description:
      "Guide complet sur le DKIM : configuration, fonctionnement et bonnes pratiques pour authentifier vos emails.",
    type: "article",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guide DKIM : Configurer la signature DKIM email",
    description:
      "Guide complet sur le DKIM : configuration, fonctionnement et bonnes pratiques.",
  },
  alternates: {
    canonical: "https://spoofchecker.online/guides/dkim",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide DKIM : Configurer la signature DKIM email",
  description:
    "Guide complet sur le DKIM (DomainKeys Identified Mail) : comment configurer une signature DKIM, authentifier vos emails et garantir leur integrite.",
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
  mainEntityOfPage: "https://spoofchecker.online/guides/dkim",
  inLanguage: "fr",
  datePublished: "2025-01-15",
  dateModified: "2025-06-01",
};

export default function DkimGuidePage() {
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
              <span className="text-zinc-300">DKIM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              DKIM (DomainKeys Identified Mail) : Le guide complet
            </h1>
            <p className="text-lg text-zinc-400">
              Tout comprendre sur la signature DKIM pour authentifier vos emails et garantir qu'ils n'ont pas ete modifies en transit.
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Qu'est-ce que le DKIM ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Le <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> est un protocole d'authentification email defini dans la{" "}
                <strong className="text-zinc-100">RFC 6376</strong>. Il permet de signer cryptographiquement les emails sortants afin de prouver deux choses : que l'email provient bien du domaine revendique, et que son contenu n'a pas ete altere pendant le transport.
              </p>
              <p>
                Le DKIM utilise un systeme de <strong className="text-zinc-100">cryptographie asymetrique</strong> (cle publique / cle privee). Le serveur d'envoi signe chaque email avec une cle privee, et la cle publique correspondante est publiee dans un enregistrement DNS. Le serveur recepteur peut alors verifier la signature en comparant les deux.
              </p>
              <p>
                Contrairement au{" "}
                <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  SPF
                </Link>{" "}
                qui verifie uniquement l'IP de l'expediteur, le DKIM garantit l'<strong className="text-zinc-100">integrite du message</strong> lui-meme. Meme si un email est relaie par plusieurs serveurs, la signature DKIM permet de prouver que le contenu n'a pas ete modifie.
              </p>
              <p>
                Le DKIM est un composant essentiel de la securite email. Combine avec{" "}
                <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  SPF
                </Link>{" "}
                et{" "}
                <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  DMARC
                </Link>
                , il constitue le triptyque de base pour proteger un domaine contre l'usurpation d'identite email.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment fonctionne le DKIM ?
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Le processus DKIM se deroule en deux phases : la signature a l'envoi et la verification a la reception.
              </p>

              <h3 className="text-lg font-semibold text-zinc-100">Phase de signature (envoi)</h3>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                  <strong className="text-zinc-100">Selection des en-tetes</strong> — Le serveur d'envoi choisit les en-tetes a inclure dans la signature (From, To, Subject, Date, etc.).
                </li>
                <li>
                  <strong className="text-zinc-100">Hachage du contenu</strong> — Le corps du message et les en-tetes selectionnes sont haches (generalement avec SHA-256).
                </li>
                <li>
                  <strong className="text-zinc-100">Signature cryptographique</strong> — Le hash est chiffre avec la cle privee DKIM du domaine, creant la signature numerique.
                </li>
                <li>
                  <strong className="text-zinc-100">Ajout de l'en-tete</strong> — La signature est ajoutee a l'email via l'en-tete <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code>.
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-zinc-100 pt-2">Phase de verification (reception)</h3>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                  <strong className="text-zinc-100">Lecture de la signature</strong> — Le serveur recepteur extrait l'en-tete <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> et identifie le domaine et le selecteur.
                </li>
                <li>
                  <strong className="text-zinc-100">Requete DNS</strong> — Il interroge le DNS pour obtenir la cle publique a l'adresse <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">selecteur._domainkey.domaine.com</code>.
                </li>
                <li>
                  <strong className="text-zinc-100">Verification</strong> — Il dechiffre la signature avec la cle publique et compare le resultat au hash recalcule du message recu.
                </li>
                <li>
                  <strong className="text-zinc-100">Verdict</strong> — Si les hash correspondent, la signature est valide : l'email est authentique et intact.
                </li>
              </ol>

              <p className="pt-2">
                Un en-tete DKIM-Signature ressemble a ceci :
              </p>
              <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`DKIM-Signature: v=1; a=rsa-sha256; d=exemple.fr;
  s=selector1; c=relaxed/relaxed;
  h=from:to:subject:date;
  bh=base64_hash_du_corps;
  b=base64_signature`}
              </div>

              <p>
                Et l'enregistrement DNS correspondant (de type TXT) :
              </p>
              <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
                selector1._domainkey.exemple.fr IN TXT "v=DKIM1; k=rsa; p=cle_publique_base64"
              </div>
            </div>
          </section>

          {/* Configuration step by step */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Comment configurer le DKIM etape par etape
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 1 : Generer les cles DKIM
                </h3>
                <p>
                  La plupart des fournisseurs de messagerie (Google Workspace, Microsoft 365, etc.) generent automatiquement les cles DKIM. Vous n'avez qu'a activer la fonctionnalite dans l'interface d'administration. Si vous gerez votre propre serveur, vous pouvez generer les cles avec OpenSSL :
                </p>
                <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`openssl genrsa -out dkim_private.pem 2048
openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem`}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 2 : Publier la cle publique dans le DNS
                </h3>
                <p>
                  Creez un enregistrement TXT dans votre zone DNS avec le nom <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">selecteur._domainkey.votredomaine.com</code>. Le selecteur est un identifiant libre (ex: "google", "selector1", "mail") :
                </p>
                <ul className="space-y-2 pl-2 text-sm">
                  <li><strong className="text-zinc-100">Type :</strong> TXT</li>
                  <li><strong className="text-zinc-100">Nom :</strong> selector1._domainkey</li>
                  <li><strong className="text-zinc-100">Valeur :</strong> v=DKIM1; k=rsa; p=votre_cle_publique_base64</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 3 : Configurer le serveur d'envoi
                </h3>
                <p>
                  Configurez votre serveur de messagerie ou service d'envoi pour signer les emails sortants avec la cle privee. Chez les fournisseurs cloud, cette etape se resume generalement a un bouton "Activer DKIM" dans la console d'administration.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 4 : Verifier la configuration
                </h3>
                <p>
                  Envoyez un email de test et verifiez les en-tetes pour confirmer la presence d'un en-tete <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> valide. Utilisez{" "}
                  <Link href="/fr" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    notre outil de verification gratuit
                  </Link>{" "}
                  pour valider que l'enregistrement DNS est correctement publie.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Etape 5 : Configurer DKIM pour chaque service d'envoi
                </h3>
                <p>
                  Si vous utilisez plusieurs services (messagerie principale, newsletter, emails transactionnels), chacun doit avoir sa propre configuration DKIM avec un selecteur distinct. Par exemple : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">google._domainkey</code> pour Google Workspace et <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">brevo._domainkey</code> pour Brevo.
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
                  1. Utiliser des cles RSA trop courtes
                </h3>
                <p>
                  Les cles RSA de 1024 bits sont desormais considerees comme faibles. Utilisez des cles de <strong className="text-zinc-100">2048 bits minimum</strong>. La plupart des fournisseurs modernes utilisent deja cette taille par defaut.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  2. Ne pas faire tourner les cles regulierement
                </h3>
                <p>
                  Les cles DKIM devraient etre changees (rotation) au moins tous les 6 a 12 mois. Gardez l'ancienne cle publique dans le DNS pendant quelques jours apres la rotation pour que les emails en transit puissent encore etre verifies.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  3. Erreur de formatage de la cle publique
                </h3>
                <p>
                  Certains registrars coupent les enregistrements TXT longs. Assurez-vous que votre cle publique est complete et correctement formatee. La valeur ne doit contenir aucun espace ni saut de ligne indesire.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  4. Oublier de configurer DKIM pour les services tiers
                </h3>
                <p>
                  Chaque service qui envoie des emails en votre nom (newsletter, CRM, support) doit avoir son propre enregistrement DKIM. Sans cela, leurs emails ne passeront pas la verification{" "}
                  <Link href="/fr/guides/dmarc" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    DMARC
                  </Link>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-400">
                  5. Ne pas tester apres la configuration
                </h3>
                <p>
                  Une erreur dans l'enregistrement DNS ou la configuration du serveur peut rendre le DKIM non fonctionnel sans que vous ne vous en rendiez compte. Testez systematiquement avec un email de verification.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              Questions frequentes sur le DKIM
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Quelle est la difference entre SPF et DKIM ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  verifie que le serveur d'envoi est autorise a envoyer pour votre domaine (verification de l'IP). DKIM verifie que le contenu de l'email n'a pas ete modifie et qu'il est bien signe par votre domaine (verification cryptographique). Les deux sont complementaires : SPF authentifie le serveur, DKIM authentifie le message.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Peut-on avoir plusieurs enregistrements DKIM ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Oui, contrairement au{" "}
                  <Link href="/fr/guides/spf" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                    SPF
                  </Link>{" "}
                  qui n'accepte qu'un seul enregistrement, vous pouvez avoir autant d'enregistrements DKIM que necessaire. Chaque service d'envoi utilise un selecteur different, ce qui cree des enregistrements DNS distincts. C'est la pratique recommandee.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Le DKIM ralentit-il l'envoi d'emails ?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  L'impact sur les performances est negligeable. La signature cryptographique prend quelques millisecondes par email. Cote reception, la verification DKIM ajoute une requete DNS et un calcul de hash, mais cela n'a aucun impact perceptible pour l'utilisateur final. Les benefices en termes de delivrabilite et de securite depassent largement ce cout minimal.
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

      <footer className="py-6 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600">
          SpoofCheck — Outil de verification de securite email. Les
          verifications DNS sont publiques et non intrusives.
        </div>
      </footer>
    </div>
  );
}
