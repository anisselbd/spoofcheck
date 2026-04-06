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
          SPF vs DKIM vs DMARC : comprendre les differences
        </h1>
        <p className="text-lg text-zinc-400">
          Trois protocoles, un seul objectif : empecher l'usurpation de votre domaine email. Decouvrez ce qui les distingue et pourquoi vous avez besoin des trois.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Pourquoi trois protocoles ?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            L'email a ete concu dans les annees 1980 sans aucun mecanisme d'authentification. N'importe qui pouvait (et peut encore) envoyer un message en pretendant etre quelqu'un d'autre. Pour combler cette faille, trois protocoles complementaires ont ete crees au fil du temps :
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-zinc-100">SPF</strong> (2006) — verifie que le serveur expediteur est autorise par le domaine.
            </li>
            <li>
              <strong className="text-zinc-100">DKIM</strong> (2007) — ajoute une signature cryptographique au message pour garantir son integrite.
            </li>
            <li>
              <strong className="text-zinc-100">DMARC</strong> (2012) — orchestre SPF et DKIM, et indique aux serveurs recepteurs quoi faire en cas d'echec.
            </li>
          </ul>
          <p>
            Chacun couvre un angle different de l'authentification. Utilises separement, ils laissent des failles. Combines, ils forment une protection robuste contre le <strong className="text-zinc-100">spoofing</strong> et le <strong className="text-zinc-100">phishing</strong>.
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
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">Critere</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">SPF</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DKIM</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DMARC</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Objectif</td>
                <td className="p-3 border-t border-zinc-800">Verifier que le serveur expediteur est autorise</td>
                <td className="p-3 border-t border-zinc-800">Garantir l'integrite et l'authenticite du message</td>
                <td className="p-3 border-t border-zinc-800">Orchestrer SPF/DKIM et definir la politique en cas d'echec</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Ce qu'il verifie</td>
                <td className="p-3 border-t border-zinc-800">L'adresse IP du serveur d'envoi vs les IP autorisees dans le DNS</td>
                <td className="p-3 border-t border-zinc-800">La signature cryptographique dans l'en-tete du message</td>
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
                <td className="p-3 border-t border-zinc-800">Non — ne protege pas le header From visible</td>
                <td className="p-3 border-t border-zinc-800">Non — n'indique pas quoi faire en cas d'echec</td>
                <td className="p-3 border-t border-zinc-800">Non — necessite SPF et/ou DKIM pour fonctionner</td>
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
          SPF en resume
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">SPF (Sender Policy Framework)</strong> est le premier niveau de protection. Il permet de declarer dans le DNS la liste des serveurs autorises a envoyer des emails pour votre domaine.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Fonctionne en comparant l'IP du serveur expediteur avec les IP autorisees</li>
            <li>Protege contre l'envoi depuis des serveurs non autorises</li>
            <li>Limite : ne verifie que l'adresse d'enveloppe (MAIL FROM), pas le header From visible par le destinataire</li>
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
          DKIM en resume
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> ajoute une signature cryptographique a chaque email envoye. Le serveur recepteur peut verifier cette signature grace a la cle publique publiee dans le DNS du domaine expediteur.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Garantit que le contenu du message n'a pas ete modifie en transit</li>
            <li>Lie le message a un domaine specifique via une signature numerique</li>
            <li>Survit au transfert d'email (contrairement au SPF)</li>
            <li>Limite : ne dit pas au serveur recepteur quoi faire si la verification echoue</li>
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
          DMARC en resume
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Le <strong className="text-zinc-100">DMARC (Domain-based Message Authentication, Reporting & Conformance)</strong> est la piece maitresse qui fait fonctionner SPF et DKIM ensemble. Il verifie l'<strong className="text-zinc-100">alignement</strong> : le domaine du header From doit correspondre au domaine verifie par SPF et/ou DKIM.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Definit une politique claire : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (surveiller), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (spam), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (bloquer)</li>
            <li>Envoie des rapports sur les tentatives d'usurpation</li>
            <li>Protege le header From visible par le destinataire (la faille de SPF seul)</li>
            <li>Prerequis : au moins SPF ou DKIM doit etre configure</li>
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
            Voici ce qui se passe quand un serveur recoit un email pretendant venir de votre domaine :
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Verification SPF</strong> — Le serveur recepteur extrait le domaine du MAIL FROM et verifie si l'IP de l'expediteur est autorisee dans l'enregistrement SPF. Resultat : pass ou fail.
            </li>
            <li>
              <strong className="text-zinc-100">Verification DKIM</strong> — Le serveur recepteur cherche la signature DKIM dans les en-tetes du message, recupere la cle publique dans le DNS, et verifie que la signature est valide. Resultat : pass ou fail.
            </li>
            <li>
              <strong className="text-zinc-100">Verification DMARC</strong> — Le serveur recepteur verifie que le domaine du header From est <strong className="text-zinc-100">aligne</strong> avec le domaine verifie par SPF et/ou DKIM. Il suffit qu'un seul des deux soit aligne pour que DMARC passe.
            </li>
            <li>
              <strong className="text-zinc-100">Application de la politique</strong> — Si DMARC echoue, le serveur applique la politique definie : <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (aucune action, mais rapport envoye), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (envoi en spam) ou <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (rejet pur et simple).
            </li>
          </ol>
          <p>
            C'est cette combinaison qui rend l'usurpation extremement difficile : un attaquant devrait a la fois envoyer depuis un serveur autorise (SPF), signer le message avec votre cle privee (DKIM), et que tout soit aligne avec le header From (DMARC).
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
            Voici l'ordre d'implementation recommande pour proteger votre domaine progressivement :
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Configurer SPF</strong> — Listez vos serveurs d'envoi et creez votre enregistrement SPF. C'est le plus simple a mettre en place.{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide SPF
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Configurer DKIM</strong> — Activez la signature DKIM chez votre fournisseur de messagerie et publiez la cle publique dans votre DNS.{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide DKIM
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Deployer DMARC en mode surveillance</strong> — Commencez avec <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> pour collecter des rapports sans impacter la delivrabilite.{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Voir le guide DMARC
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Passer en quarantine</strong> — Une fois les rapports analyses et les sources legitimes identifiees, passez a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=quarantine</code> pour envoyer les emails non authentifies en spam.
            </li>
            <li>
              <strong className="text-zinc-100">Passer en reject</strong> — Quand tout est stable, activez <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> pour bloquer definitivement les emails non authentifies. C'est le niveau de protection maximal.
            </li>
          </ol>
          <p>
            Cette approche progressive evite de bloquer accidentellement des emails legitimes tout en renforçant progressivement votre securite.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Verifiez votre domaine gratuitement
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
