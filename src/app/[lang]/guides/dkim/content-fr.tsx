import Link from "next/link";

export default function DkimContentFr({ lang }: { lang: string }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={`/${lang}/guides`} className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-zinc-300">DKIM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          DKIM (DomainKeys Identified Mail) : Le guide complet
        </h1>
        <p className="text-lg text-zinc-400">
          Tout comprendre sur la signature DKIM pour authentifier vos emails et garantir qu'ils n'ont pas été modifiés en transit.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Qu'est-ce que le DKIM ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> est un protocole d'authentification email défini dans la{" "}
            <strong className="text-zinc-100">RFC 6376</strong>. Il permet de signer cryptographiquement les emails sortants afin de prouver deux choses : que l'email provient bien du domaine revendiqué, et que son contenu n'a pas été altéré pendant le transport.
          </p>
          <p>
            Le DKIM utilise un système de <strong className="text-zinc-100">cryptographie asymétrique</strong> (clé publique / clé privée). Le serveur d'envoi signe chaque email avec une clé privée, et la clé publique correspondante est publiée dans un enregistrement DNS. Le serveur récepteur peut alors vérifier la signature en comparant les deux.
          </p>
          <p>
            Contrairement au{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>{" "}
            qui vérifie uniquement l'IP de l'expéditeur, le DKIM garantit l'<strong className="text-zinc-100">intégrité du message</strong> lui-même. Même si un email est relayé par plusieurs serveurs, la signature DKIM permet de prouver que le contenu n'a pas été modifié.
          </p>
          <p>
            Le DKIM est un composant essentiel de la sécurité email. Combiné avec{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>{" "}
            et{" "}
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DMARC
            </Link>
            , il constitue le triptyque de base pour protéger un domaine contre l'usurpation d'identité email.
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
            Le processus DKIM se déroule en deux phases : la signature à l'envoi et la vérification à la réception.
          </p>

          <h3 className="text-lg font-semibold text-zinc-100">Phase de signature (envoi)</h3>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Sélection des en-têtes</strong> — Le serveur d'envoi choisit les en-têtes à inclure dans la signature (From, To, Subject, Date, etc.).
            </li>
            <li>
              <strong className="text-zinc-100">Hachage du contenu</strong> — Le corps du message et les en-têtes sélectionnés sont hachés (généralement avec SHA-256).
            </li>
            <li>
              <strong className="text-zinc-100">Signature cryptographique</strong> — Le hash est chiffré avec la clé privée DKIM du domaine, créant la signature numérique.
            </li>
            <li>
              <strong className="text-zinc-100">Ajout de l'en-tête</strong> — La signature est ajoutée à l'email via l'en-tête <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code>.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-zinc-100 pt-2">Phase de vérification (réception)</h3>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Lecture de la signature</strong> — Le serveur récepteur extrait l'en-tête <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> et identifie le domaine et le sélecteur.
            </li>
            <li>
              <strong className="text-zinc-100">Requête DNS</strong> — Il interroge le DNS pour obtenir la clé publique à l'adresse <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">sélecteur._domainkey.domaine.com</code>.
            </li>
            <li>
              <strong className="text-zinc-100">Vérification</strong> — Il déchiffre la signature avec la clé publique et compare le résultat au hash recalculé du message reçu.
            </li>
            <li>
              <strong className="text-zinc-100">Verdict</strong> — Si les hash correspondent, la signature est valide : l'email est authentique et intact.
            </li>
          </ol>

          <p className="pt-2">
            Un en-tête DKIM-Signature ressemble à ceci :
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
            selector1._domainkey.exemple.fr IN TXT "v=DKIM1; k=rsa; p=clé_publique_base64"
          </div>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Comment configurer le DKIM étape par étape
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 1 : Générer les clés DKIM
            </h3>
            <p>
              La plupart des fournisseurs de messagerie (Google Workspace, Microsoft 365, etc.) génèrent automatiquement les clés DKIM. Vous n'avez qu'à activer la fonctionnalité dans l'interface d'administration. Si vous gérez votre propre serveur, vous pouvez générer les clés avec OpenSSL :
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`openssl genrsa -out dkim_private.pem 2048
openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem`}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 2 : Publier la clé publique dans le DNS
            </h3>
            <p>
              Créez un enregistrement TXT dans votre zone DNS avec le nom <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">sélecteur._domainkey.votredomaine.com</code>. Le sélecteur est un identifiant libre (ex: "google", "selector1", "mail") :
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type :</strong> TXT</li>
              <li><strong className="text-zinc-100">Nom :</strong> selector1._domainkey</li>
              <li><strong className="text-zinc-100">Valeur :</strong> v=DKIM1; k=rsa; p=votre_clé_publique_base64</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 3 : Configurer le serveur d'envoi
            </h3>
            <p>
              Configurez votre serveur de messagerie ou service d'envoi pour signer les emails sortants avec la clé privée. Chez les fournisseurs cloud, cette étape se résume généralement à un bouton "Activer DKIM" dans la console d'administration.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 4 : Vérifier la configuration
            </h3>
            <p>
              Envoyez un email de test et vérifiez les en-têtes pour confirmer la présence d'un en-tête <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> valide. Utilisez{" "}
              <Link href={`/${lang}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                notre outil de vérification gratuit
              </Link>{" "}
              pour valider que l'enregistrement DNS est correctement publié.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Étape 5 : Configurer DKIM pour chaque service d'envoi
            </h3>
            <p>
              Si vous utilisez plusieurs services (messagerie principale, newsletter, emails transactionnels), chacun doit avoir sa propre configuration DKIM avec un sélecteur distinct. Par exemple : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">google._domainkey</code> pour Google Workspace et <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">brevo._domainkey</code> pour Brevo.
            </p>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Erreurs courantes à éviter
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              1. Utiliser des clés RSA trop courtes
            </h3>
            <p>
              Les clés RSA de 1024 bits sont désormais considérées comme faibles. Utilisez des clés de <strong className="text-zinc-100">2048 bits minimum</strong>. La plupart des fournisseurs modernes utilisent déjà cette taille par défaut.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              2. Ne pas faire tourner les clés régulièrement
            </h3>
            <p>
              Les clés DKIM devraient être changées (rotation) au moins tous les 6 à 12 mois. Gardez l'ancienne clé publique dans le DNS pendant quelques jours après la rotation pour que les emails en transit puissent encore être vérifiés.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              3. Erreur de formatage de la clé publique
            </h3>
            <p>
              Certains registrars coupent les enregistrements TXT longs. Assurez-vous que votre clé publique est complète et correctement formatée. La valeur ne doit contenir aucun espace ni saut de ligne indésiré.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              4. Oublier de configurer DKIM pour les services tiers
            </h3>
            <p>
              Chaque service qui envoie des emails en votre nom (newsletter, CRM, support) doit avoir son propre enregistrement DKIM. Sans cela, leurs emails ne passeront pas la vérification{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              5. Ne pas tester après la configuration
            </h3>
            <p>
              Une erreur dans l'enregistrement DNS ou la configuration du serveur peut rendre le DKIM non fonctionnel sans que vous ne vous en rendiez compte. Testez systématiquement avec un email de vérification.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Questions fréquentes sur le DKIM
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Quelle est la différence entre SPF et DKIM ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              vérifie que le serveur d'envoi est autorisé à envoyer pour votre domaine (vérification de l'IP). DKIM vérifie que le contenu de l'email n'a pas été modifié et qu'il est bien signé par votre domaine (vérification cryptographique). Les deux sont complémentaires : SPF authentifie le serveur, DKIM authentifie le message.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Peut-on avoir plusieurs enregistrements DKIM ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Oui, contrairement au{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              qui n'accepte qu'un seul enregistrement, vous pouvez avoir autant d'enregistrements DKIM que nécessaire. Chaque service d'envoi utilise un sélecteur différent, ce qui crée des enregistrements DNS distincts. C'est la pratique recommandée.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Le DKIM ralentit-il l'envoi d'emails ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              L'impact sur les performances est négligeable. La signature cryptographique prend quelques millisecondes par email. Côté réception, la vérification DKIM ajoute une requête DNS et un calcul de hash, mais cela n'a aucun impact perceptible pour l'utilisateur final. Les bénéfices en termes de délivrabilité et de sécurité dépassent largement ce coût minimal.
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
          <Link
            href={`/${lang}/guides/mta-sts`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              Guide MTA-STS
            </h3>
            <p className="text-sm text-zinc-400">
              Apprenez comment MTA-STS impose le chiffrement TLS pour protéger vos emails en transit.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
