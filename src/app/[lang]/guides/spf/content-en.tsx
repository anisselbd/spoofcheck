import Link from "next/link";

export default function SpfContentEn({ lang }: { lang: string }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={`/${lang}/guides`} className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-zinc-300">SPF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          SPF (Sender Policy Framework): The Complete Guide
        </h1>
        <p className="text-lg text-zinc-400">
          Everything you need to know about SPF records to protect your domain against email spoofing.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          What is SPF?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">SPF (Sender Policy Framework)</strong> is an email authentication protocol defined in{" "}
            <strong className="text-zinc-100">RFC 7208</strong>. It allows a domain owner to specify which mail servers are authorized to send emails on behalf of their domain.
          </p>
          <p>
            In practice, SPF works through a DNS TXT record. When a mail server receives an email claiming to come from your domain, it checks this record to verify whether the sending server is authorized. If it is not, the email can be rejected or flagged as suspicious.
          </p>
          <p>
            Without SPF, anyone can send an email pretending to be from your domain. This is known as <strong className="text-zinc-100">email spoofing</strong>, a technique widely used in phishing attacks. SPF is therefore the first line of defense against this type of impersonation.
          </p>
          <p>
            SPF alone is not enough: it must be combined with{" "}
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DKIM (DomainKeys Identified Mail)
            </Link>{" "}
            and{" "}
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DMARC (Domain-based Message Authentication)
            </Link>{" "}
            for complete domain protection.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How does SPF work?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            SPF works through a multi-step verification process when an email is received:
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Email sending</strong> — A mail server sends an email with your domain in the sender address (the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">MAIL FROM</code> field of the SMTP envelope).
            </li>
            <li>
              <strong className="text-zinc-100">DNS query</strong> — The receiving server extracts the domain from the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">MAIL FROM</code> address and queries DNS to retrieve the associated SPF (TXT) record.
            </li>
            <li>
              <strong className="text-zinc-100">IP comparison</strong> — The receiving server compares the sending server's IP address against the list of authorized IPs and mechanisms in the SPF record.
            </li>
            <li>
              <strong className="text-zinc-100">Verdict</strong> — Based on the result, the receiving server takes action: accept (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pass</code>), reject (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">fail</code>), flag as suspicious (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">softfail</code>), or treat as neutral (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">neutral</code>).
            </li>
          </ol>
          <p>
            A typical SPF record looks like this:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            v=spf1 include:_spf.google.com include:sendgrid.net ip4:203.0.113.0/24 -all
          </div>
          <p>
            Each element has a specific meaning:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=spf1</code>
              <span>— Indicates this is an SPF version 1 record (required).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include:</code>
              <span>— Authorizes the servers defined in another domain's SPF record (e.g., Google, SendGrid).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">ip4:</code>
              <span>— Authorizes a specific IPv4 address or address block.</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code>
              <span>— Rejects all servers not explicitly authorized (hard fail).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code>
              <span>— Flags as suspicious without rejecting (soft fail) — less strict.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How to configure SPF step by step
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 1: Identify your sending servers
            </h3>
            <p>
              List all the services that send emails on behalf of your domain. This typically includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              <li>Your email provider (Google Workspace, Microsoft 365, etc.)</li>
              <li>Your email marketing tools (Mailchimp, Brevo, SendGrid, etc.)</li>
              <li>Your web application if it sends transactional emails</li>
              <li>Any other third-party services (CRM, helpdesk, etc.)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 2: Build your SPF record
            </h3>
            <p>
              Always start with <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=spf1</code> and end with a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> or <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code> mechanism. In between, add your authorized servers. Example for Google Workspace + Brevo:
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              v=spf1 include:_spf.google.com include:sendinblue.com -all
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 3: Add the record to your DNS
            </h3>
            <p>
              Log in to the DNS management interface of your registrar or hosting provider (Cloudflare, GoDaddy, Namecheap, etc.) and create a TXT record:
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type:</strong> TXT</li>
              <li><strong className="text-zinc-100">Name / Host:</strong> @ (or leave blank depending on the provider)</li>
              <li><strong className="text-zinc-100">Value:</strong> your complete SPF record</li>
              <li><strong className="text-zinc-100">TTL:</strong> 3600 (1 hour) or the default value</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 4: Verify your configuration
            </h3>
            <p>
              After DNS propagation (a few minutes to 48 hours), test your SPF record. You can use{" "}
              <Link href={`/${lang}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                our free verification tool
              </Link>{" "}
              to validate that everything is working correctly.
            </p>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Common mistakes to avoid
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              1. Exceeding the 10 DNS lookup limit
            </h3>
            <p>
              The SPF specification enforces a maximum of 10 DNS lookups (include, a, mx, redirect). Each <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include</code> can itself contain other includes. Exceed this limit and your SPF will automatically become invalid with a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">permerror</code> result.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              2. Having multiple SPF records
            </h3>
            <p>
              A domain must have only <strong className="text-zinc-100">one</strong> SPF record. If you have multiple records, verification will fail. Merge all your mechanisms into a single TXT record.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              3. Using +all instead of -all or ~all
            </h3>
            <p>
              The <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">+all</code> mechanism authorizes <strong className="text-zinc-100">all</strong> servers to send emails for your domain, which effectively provides no protection at all. Always use <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> (hard fail) for maximum protection.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              4. Forgetting a sending service
            </h3>
            <p>
              If you forget to include a legitimate service (for example, your newsletter tool), its emails will be rejected or sent to spam. Do a complete inventory before configuring your SPF.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              5. Not configuring DKIM and DMARC as well
            </h3>
            <p>
              SPF alone is insufficient. Without{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              and{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>
              , an attacker can still bypass SPF by using an envelope domain different from the visible domain in the "From" header.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Frequently asked questions about SPF
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Is SPF enough to protect my domain against spoofing?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              No. SPF only verifies the envelope address (MAIL FROM), not the address displayed to the recipient (the "From" header). An attacker can bypass SPF by using a different envelope domain. That is why you must combine SPF with{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              and{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>{" "}
              for complete protection.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              What happens if I exceed the 10 DNS lookups?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              If your SPF record requires more than 10 DNS lookups, the result will be a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">permerror</code> (permanent error). Receiving servers will then treat your SPF as if it did not exist. To stay under the limit, you can replace some <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">include</code> directives with direct IP addresses or use an SPF flattening service.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              What is the difference between -all and ~all?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> (hard fail) indicates that emails from unauthorized servers should be rejected. <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">~all</code> (soft fail) indicates they should be accepted but flagged as suspicious. In practice, with a proper{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>{" "}
              policy, the difference is minimal. However, <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">-all</code> is recommended for maximum security.
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
          Test your SPF, DKIM, and DMARC configuration in one click. Our tool analyzes your domain and tells you exactly what needs to be fixed.
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
              Discover how DMARC orchestrates SPF and DKIM for complete protection.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
