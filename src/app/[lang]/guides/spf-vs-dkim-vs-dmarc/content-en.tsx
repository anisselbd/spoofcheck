import Link from "next/link";

export default function ContentEn({ lang }: { lang: string }) {
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
          SPF vs DKIM vs DMARC: Understanding the Differences
        </h1>
        <p className="text-lg text-zinc-400">
          Three protocols, one goal: prevent your email domain from being spoofed. Learn what sets them apart and why you need all three.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Why three protocols?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Email was designed in the 1980s without any authentication mechanism. Anyone could (and still can) send a message pretending to be someone else. To address this flaw, three complementary protocols were created over time:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-zinc-100">SPF</strong> (2006) — verifies that the sending server is authorized by the domain.
            </li>
            <li>
              <strong className="text-zinc-100">DKIM</strong> (2007) — adds a cryptographic signature to the message to guarantee its integrity.
            </li>
            <li>
              <strong className="text-zinc-100">DMARC</strong> (2012) — orchestrates SPF and DKIM, and tells receiving servers what to do when checks fail.
            </li>
          </ul>
          <p>
            Each one covers a different aspect of authentication. Used separately, they leave gaps. Combined, they form a robust defense against <strong className="text-zinc-100">spoofing</strong> and <strong className="text-zinc-100">phishing</strong>.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Comparison Table
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">Criteria</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">SPF</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DKIM</th>
                <th className="text-left p-3 text-zinc-100 font-semibold bg-zinc-800/50">DMARC</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Purpose</td>
                <td className="p-3 border-t border-zinc-800">Verify that the sending server is authorized</td>
                <td className="p-3 border-t border-zinc-800">Guarantee message integrity and authenticity</td>
                <td className="p-3 border-t border-zinc-800">Orchestrate SPF/DKIM and define failure policy</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">What it checks</td>
                <td className="p-3 border-t border-zinc-800">Sending server IP address vs authorized IPs in DNS</td>
                <td className="p-3 border-t border-zinc-800">Cryptographic signature in the message headers</td>
                <td className="p-3 border-t border-zinc-800">Alignment of the From domain with SPF and/or DKIM</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">DNS record type</td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code></td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code> (under <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_domainkey</code> subdomain)</td>
                <td className="p-3 border-t border-zinc-800"><code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">TXT</code> (under <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_dmarc</code> subdomain)</td>
              </tr>
              <tr>
                <td className="p-3 border-t border-zinc-800 font-medium text-zinc-100">Sufficient alone?</td>
                <td className="p-3 border-t border-zinc-800">No — does not protect the visible From header</td>
                <td className="p-3 border-t border-zinc-800">No — does not tell the receiver what to do on failure</td>
                <td className="p-3 border-t border-zinc-800">No — requires SPF and/or DKIM to function</td>
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
          SPF at a Glance
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">SPF (Sender Policy Framework)</strong> is the first layer of protection. It lets you declare in DNS which servers are authorized to send emails on behalf of your domain.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Works by comparing the sending server's IP against authorized IPs</li>
            <li>Protects against sending from unauthorized servers</li>
            <li>Limitation: only checks the envelope address (MAIL FROM), not the visible From header</li>
            <li>Maximum of 10 DNS lookups per record</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Read the full SPF guide →
            </Link>
          </p>
        </div>
      </section>

      {/* DKIM summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          DKIM at a Glance
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> adds a cryptographic signature to every outgoing email. The receiving server can verify this signature using the public key published in the sender's DNS.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Ensures the message content has not been tampered with in transit</li>
            <li>Ties the message to a specific domain via a digital signature</li>
            <li>Survives email forwarding (unlike SPF)</li>
            <li>Limitation: does not tell the receiving server what to do if verification fails</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Read the full DKIM guide →
            </Link>
          </p>
        </div>
      </section>

      {/* DMARC summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          DMARC at a Glance
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">DMARC (Domain-based Message Authentication, Reporting & Conformance)</strong> is the keystone that makes SPF and DKIM work together. It checks <strong className="text-zinc-100">alignment</strong>: the From header domain must match the domain verified by SPF and/or DKIM.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Defines a clear policy: <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (monitor), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (spam), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (block)</li>
            <li>Sends reports on spoofing attempts</li>
            <li>Protects the visible From header (the gap SPF alone leaves open)</li>
            <li>Prerequisite: at least SPF or DKIM must be configured</li>
          </ul>
          <p>
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Read the full DMARC guide →
            </Link>
          </p>
        </div>
      </section>

      {/* How they work together */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How the 3 Work Together
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Here is what happens when a server receives an email claiming to come from your domain:
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">SPF check</strong> — The receiving server extracts the domain from the MAIL FROM address and checks whether the sender's IP is authorized in the SPF record. Result: pass or fail.
            </li>
            <li>
              <strong className="text-zinc-100">DKIM check</strong> — The receiving server looks for a DKIM signature in the message headers, retrieves the public key from DNS, and verifies that the signature is valid. Result: pass or fail.
            </li>
            <li>
              <strong className="text-zinc-100">DMARC check</strong> — The receiving server verifies that the From header domain is <strong className="text-zinc-100">aligned</strong> with the domain verified by SPF and/or DKIM. Only one of the two needs to be aligned for DMARC to pass.
            </li>
            <li>
              <strong className="text-zinc-100">Policy enforcement</strong> — If DMARC fails, the server applies the defined policy: <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (no action, but report sent), <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">quarantine</code> (send to spam), or <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">reject</code> (outright rejection).
            </li>
          </ol>
          <p>
            This combination makes spoofing extremely difficult: an attacker would need to send from an authorized server (SPF), sign the message with your private key (DKIM), and have everything aligned with the From header (DMARC).
          </p>
        </div>
      </section>

      {/* Where to start */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Where to Start?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            Here is the recommended implementation order to protect your domain progressively:
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Configure SPF</strong> — List your sending servers and create your SPF record. This is the simplest to set up.{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                See the SPF guide
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Configure DKIM</strong> — Enable DKIM signing with your email provider and publish the public key in your DNS.{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                See the DKIM guide
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Deploy DMARC in monitoring mode</strong> — Start with <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> to collect reports without impacting deliverability.{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                See the DMARC guide
              </Link>
            </li>
            <li>
              <strong className="text-zinc-100">Move to quarantine</strong> — Once you have analyzed reports and identified all legitimate sources, switch to <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=quarantine</code> to send unauthenticated emails to spam.
            </li>
            <li>
              <strong className="text-zinc-100">Move to reject</strong> — When everything is stable, enable <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> to permanently block unauthenticated emails. This is the maximum level of protection.
            </li>
          </ol>
          <p>
            This progressive approach avoids accidentally blocking legitimate emails while steadily strengthening your security.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Check your domain for free
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Test your SPF, DKIM, DMARC, and MTA-STS configuration in one click. Our tool analyzes your domain and tells you exactly what needs to be fixed.
        </p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
        >
          Test my domain
        </Link>
      </section>
    </>
  );
}
