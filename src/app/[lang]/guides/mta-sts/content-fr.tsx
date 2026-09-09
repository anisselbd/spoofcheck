import Link from "next/link";

export default function MtaStsContentFr({ lang }: { lang: string }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={`/${lang}/guides`} className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-zinc-300">MTA-STS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          MTA-STS : Imposer le chiffrement TLS sur vos emails
        </h1>
        <p className="text-lg text-zinc-400">
          Tout comprendre sur MTA-STS pour protéger vos emails en transit contre les attaques par interception.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Qu'est-ce que MTA-STS ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">MTA-STS (Mail Transfer Agent Strict Transport Security)</strong> est un protocole défini dans la{" "}
            <strong className="text-zinc-100">RFC 8461</strong>. Il permet à un domaine de déclarer que ses serveurs mail supportent le chiffrement TLS et d'exiger que les serveurs expéditeurs utilisent une connexion chiffrée avec un certificat valide.
          </p>
          <p>
            Sans MTA-STS, même si vos serveurs supportent TLS, un attaquant effectuant une attaque <strong className="text-zinc-100">man-in-the-middle (MITM)</strong> peut forcer une dégradation de la connexion vers du texte clair (attaque par downgrade). L'attaquant peut alors intercepter et lire vos emails en transit.
          </p>
          <p>
            MTA-STS résout ce problème en publiant une politique qui ordonne aux serveurs expéditeurs : "vous <strong className="text-zinc-100">devez</strong> utiliser TLS avec un certificat valide pour m'envoyer des emails, sinon ne les envoyez pas du tout."
          </p>
          <p>
            MTA-STS est complémentaire à{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>,{" "}
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DKIM
            </Link>{" "}
            et{" "}
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DMARC
            </Link>{" "}
            : ces derniers protègent contre l'usurpation d'identité, tandis que MTA-STS protège la <strong className="text-zinc-100">confidentialité</strong> des emails en transit.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Comment fonctionne MTA-STS ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            MTA-STS repose sur deux éléments : un enregistrement DNS et un fichier de politique servi en HTTPS.
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Enregistrement DNS TXT</strong> — Le domaine publie un enregistrement TXT à{" "}
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_mta-sts.votredomaine</code>{" "}
              pour signaler qu'il supporte MTA-STS.
            </li>
            <li>
              <strong className="text-zinc-100">Fichier de politique HTTPS</strong> — Le domaine héberge un fichier à{" "}
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">https://mta-sts.votredomaine/.well-known/mta-sts.txt</code>{" "}
              qui définit la politique (mode, serveurs MX autorisés, durée de validité).
            </li>
            <li>
              <strong className="text-zinc-100">Vérification par le serveur expéditeur</strong> — Avant d'envoyer un email, le serveur expéditeur vérifie l'enregistrement DNS et télécharge la politique. Si le mode est "enforce", il refuse d'envoyer l'email sans TLS valide.
            </li>
          </ol>
          <p>
            L'enregistrement DNS ressemble à ceci :
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            _mta-sts.votredomaine TXT "v=STSv1; id=20260406T000000;"
          </div>
          <p>
            Le fichier de politique ressemble à ceci :
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`version: STSv1
mode: enforce
mx: mail.votredomaine.com
mx: *.votredomaine.com
max_age: 86400`}
          </div>
          <p>
            Chaque champ a une signification précise :
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">version</code>
              <span>— Toujours STSv1 (obligatoire).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mode</code>
              <span>— <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code> (bloque sans TLS), <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">testing</code> (signale mais délivre) ou <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (désactivé).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mx</code>
              <span>— Les serveurs MX autorisés (wildcards acceptés).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">max_age</code>
              <span>— Durée de mise en cache de la politique en secondes (recommandé : 86400 soit 24h).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Comment configurer MTA-STS étape par étape
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 1 : Créer le sous-domaine mta-sts
            </h3>
            <p>
              Créez un sous-domaine <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mta-sts.votredomaine</code> qui pointe vers un serveur web capable de servir du contenu en HTTPS avec un certificat valide. Vous pouvez utiliser GitHub Pages, Cloudflare Pages, ou n'importe quel hébergement statique.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 2 : Créer le fichier de politique
            </h3>
            <p>
              Créez le fichier <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">/.well-known/mta-sts.txt</code> sur votre sous-domaine avec le contenu suivant (adaptez les lignes mx à vos serveurs) :
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`version: STSv1
mode: testing
mx: mail.votredomaine.com
max_age: 86400`}
            </div>
            <p className="text-sm text-zinc-500">
              Commencez en mode <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">testing</code> pour surveiller les problèmes avant de passer en <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 3 : Ajouter l'enregistrement DNS
            </h3>
            <p>
              Ajoutez un enregistrement TXT dans votre zone DNS :
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type :</strong> TXT</li>
              <li><strong className="text-zinc-100">Nom / Host :</strong> _mta-sts</li>
              <li><strong className="text-zinc-100">Valeur :</strong> v=STSv1; id=20260406T000000;</li>
              <li><strong className="text-zinc-100">TTL :</strong> 3600</li>
            </ul>
            <p className="text-sm text-zinc-500">
              L'identifiant (id) doit être change à chaque modification de la politique pour invalider le cache des serveurs expéditeurs.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 4 : Vérifier et passer en enforce
            </h3>
            <p>
              Testez votre configuration avec{" "}
              <Link href={`/${lang}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                notre outil de vérification gratuit
              </Link>
              . Une fois que tout fonctionne correctement en mode testing, changez le mode en <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code> et mettez à jour l'identifiant dans l'enregistrement DNS.
            </p>
          </div>
        </div>
      </section>

      {/* TLSRPT */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Bonus : TLSRPT pour recevoir des rapports
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">TLSRPT (TLS Reporting, RFC 8460)</strong> est le complément ideal de MTA-STS. Il permet de recevoir des rapports des serveurs expéditeurs lorsqu'ils rencontrent des problèmes TLS avec votre domaine.
          </p>
          <p>
            Ajoutez un enregistrement TXT à <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_smtp._tls.votredomaine</code> :
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            v=TLSRPTv1; rua=mailto:tls-reports@votredomaine
          </div>
          <p>
            Vous recevrez alors des rapports JSON quotidiens indiquant les échecs de négociation TLS, les certificats invalides et les tentatives de downgrade — exactement comme les rapports DMARC mais pour le chiffrement en transit.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Questions fréquentes sur MTA-STS
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Quelle est la différence entre MTA-STS et STARTTLS ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              STARTTLS est le mécanisme de négociation TLS entre serveurs mail. Le problème est qu'il est "opportuniste" : si un attaquant supprime l'annonce STARTTLS du serveur (attaque par stripping), la connexion se fait en clair sans que personne ne soit prévenu. MTA-STS résout ce problème en déclarant de manière indépendante (via HTTPS) que le TLS est obligatoire.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              MTA-STS protège-t-il contre le spoofing ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Non. MTA-STS protège la <strong className="text-zinc-100">confidentialité</strong> des emails en transit (chiffrement), pas l'<strong className="text-zinc-100">authenticité</strong> de l'expéditeur. Pour se protéger contre le spoofing, vous devez configurer{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>,{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              et{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Quels fournisseurs supportent MTA-STS ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Google (Gmail / Google Workspace), Microsoft (Outlook / Microsoft 365) et Yahoo supportent MTA-STS côté expéditeur. Cela signifie qu'ils respecteront votre politique MTA-STS lors de l'envoi d'emails vers votre domaine. Côté réception, vous devez le configurer vous-même sur votre domaine.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Vérifiez votre domaine gratuitement
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Testez votre configuration SPF, DKIM, DMARC et MTA-STS en un clic. Notre outil analyse votre domaine et vous indique exactement ce qu'il faut corriger.
        </p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
        >
          Tester mon domaine
        </Link>
      </section>

      {/* Related guides */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-400">
          Guides complémentaires
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/${lang}/guides/spf`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              Guide SPF
            </h3>
            <p className="text-sm text-zinc-400">
              Apprenez à configurer un enregistrement SPF pour autoriser vos serveurs d'envoi.
            </p>
          </Link>
          <Link
            href={`/${lang}/guides/dkim`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              Guide DKIM
            </h3>
            <p className="text-sm text-zinc-400">
              Apprenez à configurer la signature DKIM pour authentifier vos emails.
            </p>
          </Link>
          <Link
            href={`/${lang}/guides/dmarc`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              Guide DMARC
            </h3>
            <p className="text-sm text-zinc-400">
              Découvrez comment DMARC orchestre SPF et DKIM pour une protection complète.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
