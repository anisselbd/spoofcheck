import Link from "next/link";

export default function ContentFr({ lang }: { lang: string }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={`/${lang}/guides`} className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-zinc-300">SPF vs DKIM vs DMARC</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          SPF vs DKIM vs DMARC : comprendre les différences
        </h1>
        <p className="text-lg text-zinc-400">
          Trois protocoles, un seul objectif : empêcher l'usurpation de votre domaine email. Découvrez ce qui les distingue et pourquoi vous avez besoin des trois.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Pourquoi trois protocoles ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            L'email a été conçu dans les années 1980 sans aucun mécanisme d'authentification. N'importe qui pouvait (et peut encore) envoyer un message en prétendant être quelqu'un d'autre. Pour combler cette faille, trois protocoles complémentaires ont été créés au fil du temps :
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-zinc-100">SPF</strong> (2006) — vérifie que le serveur expéditeur est autorisé par le domaine.
            </li>
            <li>
              <strong className="text-zinc-100">DKIM</strong> (2007) — ajoute une signature cryptographique au message pour garantir son intégrité.
            </li>
            <li>
              <strong className="text-zinc-100">DMARC</strong> (2012) — orchestre SPF et DKIM, et indique aux serveurs récepteurs quoi faire en cas d'échec.
            </li>
          </ul>
          <p>
            Chacun couvre un angle différent de l'authentification. Utilisés séparément, ils laissent des failles. Combinés, ils forment une protection robuste contre le <strong className="text-zinc-100">spoofing</strong> et le <strong className="text-zinc-100">phishing</strong>.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Tableau comparatif
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">Critère</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">SPF</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DKIM</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DMARC</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Objectif</td>
                <td className="p-3 border-t border-zinc-800">Vérifier que le serveur expéditeur est autorisé</td>
                <td className="p-3 border-t border-zinc-800">Garantir l'intégrité et l'authenticité du message</td>
                <td className="p-3 border-t border-zinc-800">Orchestrer SPF/DKIM et définir la politique en cas d'échec</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Ce qu'il vérifie</td>
                <td className="p-3 border-t border-zinc-800">L'adresse IP du serveur d'envoi vs les IP autorisées dans le DNS</td>
                <td className="p-3 border-t border-zinc-800">La signature cryptographique dans l'en-tête du message</td>
                <td className="p-3 border-t border-zinc-800">L'alignement du domaine From avec SPF et/ou DKIM</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Type d'enregistrement DNS</td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code></td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code> (sous-domaine <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_domainkey</code>)</td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code> (sous-domaine <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_dmarc</code>)</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Suffisant seul ?</td>
                <td className="p-3 border-t border-zinc-800">Non — ne protège pas le header From visible</td>
                <td className="p-3 border-t border-zinc-800">Non — n'indique pas quoi faire en cas d'échec</td>
                <td className="p-3 border-t border-zinc-800">Non — nécessite SPF et/ou DKIM pour fonctionner</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">RFC</td>
                <td className="p-3 border-t border-zinc-800">RFC 7208</td>
                <td className="p-3 border-t border-zinc-800">RFC 6376</td>
                <td className="p-3 border-t border-zinc-800">RFC 7489</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SPF summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          SPF en résumé
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">SPF (Sender Policy Framework)</strong> est le premier niveau de protection. Il permet de déclarer dans le DNS la liste des serveurs autorisés à envoyer des emails pour votre domaine.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Fonctionne en comparant l'IP du serveur expéditeur avec les IP autorisées</li>
            <li>Protège contre l'envoi depuis des serveurs non autorisés</li>
            <li>Limite : ne vérifie que l'adresse d'enveloppe (MAIL FROM), pas le header From visible par le destinataire</li>
            <li>Maximum de 10 lookups DNS par enregistrement</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Lire le guide complet SPF →
            </Link>
          </p>
        </div>
      </section>

      {/* DKIM summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          DKIM en résumé
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> ajoute une signature cryptographique à chaque email envoyé. Le serveur récepteur peut vérifier cette signature grâce à la clé publique publiée dans le DNS du domaine expéditeur.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Garantit que le contenu du message n'a pas été modifié en transit</li>
            <li>Lie le message à un domaine spécifique via une signature numérique</li>
            <li>Survit au transfert d'email (contrairement au SPF)</li>
            <li>Limite : ne dit pas au serveur récepteur quoi faire si la vérification échoue</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Lire le guide complet DKIM →
            </Link>
          </p>
        </div>
      </section>

      {/* DMARC summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          DMARC en résumé
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">DMARC (Domain-based Message Authentication, Reporting & Conformance)</strong> est la pièce maîtresse qui fait fonctionner SPF et DKIM ensemble. Il vérifie l'<strong className="text-zinc-100">alignement</strong> : le domaine du header From doit correspondre au domaine vérifié par SPF et/ou DKIM.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Définit une politique claire : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (surveiller), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (spam), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (bloquer)</li>
            <li>Envoie des rapports sur les tentatives d'usurpation</li>
            <li>Protège le header From visible par le destinataire (la faille de SPF seul)</li>
            <li>Prérequis : au moins SPF ou DKIM doit être configure</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Lire le guide complet DMARC →
            </Link>
          </p>
        </div>
      </section>

      {/* How they work together */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Comment les 3 fonctionnent ensemble
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Voici ce qui se passe quand un serveur reçoit un email prétendant venir de votre domaine :
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Vérification SPF</strong> — Le serveur récepteur extrait le domaine du MAIL FROM et vérifie si l'IP de l'expéditeur est autorisée dans l'enregistrement SPF. Résultat : pass ou fail.
            </li>
            <li>
              <strong className="text-zinc-100">Vérification DKIM</strong> — Le serveur récepteur cherche la signature DKIM dans les en-têtes du message, récupère la clé publique dans le DNS, et vérifie que la signature est valide. Résultat : pass ou fail.
            </li>
            <li>
              <strong className="text-zinc-100">Vérification DMARC</strong> — Le serveur récepteur vérifie que le domaine du header From est <strong className="text-zinc-100">aligné</strong> avec le domaine vérifié par SPF et/ou DKIM. Il suffit qu'un seul des deux soit aligné pour que DMARC passe.
            </li>
            <li>
              <strong className="text-zinc-100">Application de la politique</strong> — Si DMARC échoue, le serveur applique la politique définie : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (aucune action, mais rapport envoyé), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (envoi en spam) ou <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (rejet pur et simple).
            </li>
          </ol>
          <p>
            C'est cette combinaison qui rend l'usurpation extrêmement difficile : un attaquant devrait à la fois envoyer depuis un serveur autorisé (SPF), signer le message avec votre clé privée (DKIM), et que tout soit aligné avec le header From (DMARC).
          </p>
        </div>
      </section>

      {/* Where to start */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Par quoi commencer ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Voici l'ordre d'implémentation recommandé pour protéger votre domaine progressivement :
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Configurer SPF</strong> — Listez vos serveurs d'envoi et créez votre enregistrement SPF. C'est le plus simple à mettre en place.{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide SPF
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Configurer DKIM</strong> — Activez la signature DKIM chez votre fournisseur de messagerie et publiez la clé publique dans votre DNS.{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide DKIM
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Déployer DMARC en mode surveillance</strong> — Commencez avec <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> pour collecter des rapports sans impacter la délivrabilité.{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide DMARC
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Passer en quarantine</strong> — Une fois les rapports analysés et les sources légitimes identifiées, passez à <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=quarantine</code> pour envoyer les emails non authentifiés en spam.
            </li>
            <li>
              <strong className="text-zinc-100">Passer en reject</strong> — Quand tout est stable, activez <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> pour bloquer définitivement les emails non authentifiés. C'est le niveau de protection maximal.
            </li>
          </ol>
          <p>
            Cette approche progressive évite de bloquer accidentellement des emails légitimes tout en renforçant progressivement votre sécurité.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Quelle est la différence entre SPF et DKIM ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              SPF vérifie <strong className="text-zinc-100">d&apos;où part</strong> l&apos;email : il compare l&apos;adresse IP du serveur expéditeur à la liste des serveurs autorisés publiée dans votre DNS. DKIM vérifie <strong className="text-zinc-100">ce que contient</strong> l&apos;email : une signature cryptographique prouve que le message n&apos;a pas été altéré en route et qu&apos;il provient bien de votre domaine. SPF authentifie le serveur, DKIM authentifie le message. Ils sont complémentaires, pas interchangeables.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Quelle est la différence entre DKIM et DMARC ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              DKIM signe vos emails, mais ne dit rien au serveur qui les reçoit : si la signature est invalide, rien n&apos;indique s&apos;il faut livrer le message, le mettre en spam ou le rejeter. DMARC comble ce vide. Il ajoute deux choses : une <strong className="text-zinc-100">politique</strong> (none, quarantine, reject) et une vérification d&apos;<strong className="text-zinc-100">alignement</strong> entre le domaine signé et le domaine affiché au destinataire. DKIM est un mécanisme d&apos;authentification, DMARC est la règle de décision qui s&apos;appuie dessus.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              SPF, DKIM, DMARC : lequel est le plus important ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              DMARC, mais il ne fonctionne pas seul. SPF et DKIM produisent chacun un verdict, et DMARC est le seul des trois à protéger l&apos;adresse que votre destinataire voit réellement — le header From. Sans DMARC, un attaquant peut passer le SPF avec son propre domaine d&apos;enveloppe tout en affichant le vôtre. Les trois forment un ensemble : deux mécanismes de preuve, une politique qui les exploite.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Dans quel ordre configurer SPF, DKIM et DMARC ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Toujours SPF, puis DKIM, puis DMARC. SPF est le plus rapide à publier et ne casse rien. DKIM demande d&apos;activer la signature chez chaque service qui envoie en votre nom. DMARC arrive en dernier, en commençant impérativement par <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> : cette phase de surveillance vous montre qui envoie des emails avec votre domaine avant que vous ne bloquiez quoi que ce soit.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Peut-on mettre DMARC sans SPF ni DKIM ?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Techniquement oui, mais c&apos;est inutile et dangereux. DMARC n&apos;a aucun verdict à exploiter si ni SPF ni DKIM ne sont configurés : tous vos emails échoueront l&apos;alignement. Avec <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>, vous bloqueriez votre propre courrier légitime. Publiez SPF et DKIM d&apos;abord, vérifiez qu&apos;ils passent, et seulement ensuite déployez DMARC.
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
    </>
  );
}
