import Link from "next/link";

export default function MtaStsContentEn({ lang }: { lang: string }) {
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
          MTA-STS: Enforce TLS Encryption on Your Emails
        </h1>
        <p className="text-lg text-zinc-400">
          Everything you need to know about MTA-STS to protect your emails in transit against interception attacks.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          What is MTA-STS?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">MTA-STS (Mail Transfer Agent Strict Transport Security)</strong> is a protocol defined in{" "}
            <strong className="text-zinc-100">RFC 8461</strong>. It allows a domain to declare that its mail servers support TLS encryption and to require that sending servers use an encrypted connection with a valid certificate.
          </p>
          <p>
            Without MTA-STS, even if your servers support TLS, an attacker performing a <strong className="text-zinc-100">man-in-the-middle (MITM)</strong> attack can force a downgrade to plaintext. The attacker can then intercept and read your emails in transit.
          </p>
          <p>
            MTA-STS solves this by publishing a policy that tells sending servers: "you <strong className="text-zinc-100">must</strong> use TLS with a valid certificate to send me emails, otherwise don't send them at all."
          </p>
          <p>
            MTA-STS is complementary to{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>,{" "}
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DKIM
            </Link>{" "}
            and{" "}
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DMARC
            </Link>{" "}
            — those protect against identity spoofing, while MTA-STS protects the <strong className="text-zinc-100">confidentiality</strong> of emails in transit.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How does MTA-STS work?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            MTA-STS relies on two components: a DNS record and a policy file served over HTTPS.
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">DNS TXT record</strong> — The domain publishes a TXT record at{" "}
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_mta-sts.yourdomain</code>{" "}
              to signal MTA-STS support.
            </li>
            <li>
              <strong className="text-zinc-100">HTTPS policy file</strong> — The domain hosts a file at{" "}
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">https://mta-sts.yourdomain/.well-known/mta-sts.txt</code>{" "}
              that defines the policy (mode, authorized MX servers, validity period).
            </li>
            <li>
              <strong className="text-zinc-100">Sending server verification</strong> — Before sending an email, the sending server checks the DNS record and downloads the policy. If the mode is "enforce", it refuses to send the email without valid TLS.
            </li>
          </ol>
          <p>
            The DNS record looks like this:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            _mta-sts.yourdomain TXT "v=STSv1; id=20260406T000000;"
          </div>
          <p>
            The policy file looks like this:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`version: STSv1
mode: enforce
mx: mail.yourdomain.com
mx: *.yourdomain.com
max_age: 86400`}
          </div>
          <p>
            Each field has a specific meaning:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">version</code>
              <span>— Always STSv1 (required).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mode</code>
              <span>— <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code> (block without TLS), <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">testing</code> (report but deliver) or <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">none</code> (disabled).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mx</code>
              <span>— Authorized MX servers (wildcards supported).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">max_age</code>
              <span>— Policy cache duration in seconds (recommended: 86400 = 24h).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How to configure MTA-STS step by step
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 1: Create the mta-sts subdomain
            </h3>
            <p>
              Create a subdomain <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">mta-sts.yourdomain</code> pointing to a web server that can serve content over HTTPS with a valid certificate. You can use GitHub Pages, Cloudflare Pages, or any static hosting.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 2: Create the policy file
            </h3>
            <p>
              Create the file <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">/.well-known/mta-sts.txt</code> on your subdomain with the following content (adjust the mx lines to match your servers):
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`version: STSv1
mode: testing
mx: mail.yourdomain.com
max_age: 86400`}
            </div>
            <p className="text-sm text-zinc-500">
              Start in <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">testing</code> mode to monitor for issues before switching to <code className="px-1 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 3: Add the DNS record
            </h3>
            <p>
              Add a TXT record to your DNS zone:
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type:</strong> TXT</li>
              <li><strong className="text-zinc-100">Name / Host:</strong> _mta-sts</li>
              <li><strong className="text-zinc-100">Value:</strong> v=STSv1; id=20260406T000000;</li>
              <li><strong className="text-zinc-100">TTL:</strong> 3600</li>
            </ul>
            <p className="text-sm text-zinc-500">
              The identifier (id) must be changed each time you modify the policy to invalidate the cache of sending servers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 4: Verify and switch to enforce
            </h3>
            <p>
              Test your configuration with{" "}
              <Link href={`/${lang}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                our free verification tool
              </Link>
              . Once everything works correctly in testing mode, change the mode to <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">enforce</code> and update the identifier in the DNS record.
            </p>
          </div>
        </div>
      </section>

      {/* TLSRPT */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Bonus: TLSRPT for receiving reports
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">TLSRPT (TLS Reporting, RFC 8460)</strong> is the ideal companion to MTA-STS. It allows you to receive reports from sending servers when they encounter TLS issues with your domain.
          </p>
          <p>
            Add a TXT record at <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_smtp._tls.yourdomain</code>:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            v=TLSRPTv1; rua=mailto:tls-reports@yourdomain
          </div>
          <p>
            You'll then receive daily JSON reports indicating TLS negotiation failures, invalid certificates and downgrade attempts — just like DMARC reports but for in-transit encryption.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Frequently asked questions about MTA-STS
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              What's the difference between MTA-STS and STARTTLS?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              STARTTLS is the TLS negotiation mechanism between mail servers. The problem is that it's "opportunistic": if an attacker strips the STARTTLS announcement from the server (stripping attack), the connection falls back to plaintext without anyone being notified. MTA-STS solves this by independently declaring (via HTTPS) that TLS is mandatory.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Does MTA-STS protect against spoofing?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              No. MTA-STS protects the <strong className="text-zinc-100">confidentiality</strong> of emails in transit (encryption), not the <strong className="text-zinc-100">authenticity</strong> of the sender. To protect against spoofing, you need to configure{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>,{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              and{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Which providers support MTA-STS?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Google (Gmail / Google Workspace), Microsoft (Outlook / Microsoft 365), and Yahoo support MTA-STS on the sending side. This means they will respect your MTA-STS policy when sending emails to your domain. On the receiving side, you need to configure it yourself on your domain.
            </p>
          </div>
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

      {/* Related guides */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-400">
          Related guides
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/${lang}/guides/spf`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              SPF Guide
            </h3>
            <p className="text-sm text-zinc-400">
              Learn how to configure an SPF record to authorize your sending servers.
            </p>
          </Link>
          <Link
            href={`/${lang}/guides/dkim`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              DKIM Guide
            </h3>
            <p className="text-sm text-zinc-400">
              Learn how to configure DKIM signatures to authenticate your emails.
            </p>
          </Link>
          <Link
            href={`/${lang}/guides/dmarc`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              DMARC Guide
            </h3>
            <p className="text-sm text-zinc-400">
              Learn how DMARC orchestrates SPF and DKIM for complete protection.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
