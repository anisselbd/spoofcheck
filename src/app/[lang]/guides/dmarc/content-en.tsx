import Link from "next/link";

export default function DmarcContentEn({ lang }: { lang: string }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={`/${lang}/guides`} className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-zinc-300">DMARC</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          DMARC (Domain-based Message Authentication): The Complete Guide
        </h1>
        <p className="text-lg text-zinc-400">
          Everything you need to know about DMARC policy to orchestrate SPF and DKIM and protect your domain against phishing.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          What is DMARC?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">DMARC (Domain-based Message Authentication, Reporting and Conformance)</strong> is an email authentication protocol defined in{" "}
            <strong className="text-zinc-100">RFC 7489</strong>. It was created to address a major weakness of{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>{" "}
            and{" "}
            <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DKIM
            </Link>
            : these protocols, on their own, do not tell the receiving server what to do when authentication fails.
          </p>
          <p>
            DMARC acts as a <strong className="text-zinc-100">conductor</strong> that defines a clear policy: what should the receiving server do when an email fails SPF and DKIM checks? Reject it, quarantine it, or do nothing? DMARC also provides a <strong className="text-zinc-100">reporting</strong> system that lets you see exactly who is sending emails using your domain.
          </p>
          <p>
            The key concept of DMARC is <strong className="text-zinc-100">alignment</strong>: the domain used in the "From" header (visible to the recipient) must match the domain verified by SPF or DKIM. Without this alignment, an attacker could pass SPF with their own envelope domain while displaying your domain in the visible "From" header.
          </p>
          <p>
            DMARC is now considered essential. Many email providers (Google, Yahoo, Microsoft) now require a valid DMARC record to accept bulk email. Without DMARC, your emails risk landing in spam or being rejected entirely.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How does DMARC work?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            DMARC combines the results of SPF and DKIM with an additional alignment check:
          </p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Email reception</strong> — The receiving server receives an email and extracts the domain from the "From" header.
            </li>
            <li>
              <strong className="text-zinc-100">DMARC DNS query</strong> — It queries DNS to find a DMARC record at <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">_dmarc.domain.com</code>.
            </li>
            <li>
              <strong className="text-zinc-100">SPF check + alignment</strong> — The server verifies whether{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              passes AND whether the envelope domain (MAIL FROM) is aligned with the "From" header domain.
            </li>
            <li>
              <strong className="text-zinc-100">DKIM check + alignment</strong> — The server verifies whether{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              passes AND whether the DKIM signature domain (tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">d=</code>) is aligned with the "From" header domain.
            </li>
            <li>
              <strong className="text-zinc-100">Policy enforcement</strong> — If neither SPF nor DKIM pass with alignment, the server applies the DMARC policy defined by the domain owner.
            </li>
            <li>
              <strong className="text-zinc-100">Report delivery</strong> — The receiving server sends aggregate (and optionally forensic) reports to the domain owner.
            </li>
          </ol>

          <p className="pt-2">
            A DMARC record looks like this:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; ruf=mailto:dmarc-forensic@example.com; adkim=s; aspf=s; pct=100
          </div>

          <p>
            Each tag has a specific meaning:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">v=DMARC1</code>
              <span>— Identifies the record as DMARC version 1 (required).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=</code>
              <span>— The policy to apply: <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">none</code> (monitoring), <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">quarantine</code> (spam), or <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">reject</code> (reject).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">rua=</code>
              <span>— Address for receiving aggregate reports (required in practice).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">ruf=</code>
              <span>— Address for receiving forensic reports (optional, poorly supported).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">adkim=</code>
              <span>— DKIM alignment mode: <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">s</code> (strict) or <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">r</code> (relaxed, default).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">aspf=</code>
              <span>— SPF alignment mode: <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">s</code> (strict) or <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">r</code> (relaxed, default).</span>
            </li>
            <li className="flex gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pct=</code>
              <span>— Percentage of emails to which the policy applies (useful for gradual rollout).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How to configure DMARC step by step
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 1: Verify SPF and DKIM
            </h3>
            <p>
              Before configuring DMARC, make sure your{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              and{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              are correctly configured. DMARC relies on both of these protocols — if they are not working, DMARC cannot function effectively.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 2: Start in monitoring mode (p=none)
            </h3>
            <p>
              Create a TXT record in your DNS to start collecting reports without impacting deliverability:
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type:</strong> TXT</li>
              <li><strong className="text-zinc-100">Name:</strong> _dmarc</li>
              <li><strong className="text-zinc-100">Value:</strong></li>
            </ul>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com
            </div>
            <p>
              This configuration does not block any email but sends you daily reports detailing all emails sent using your domain.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 3: Analyze the reports (2 to 4 weeks)
            </h3>
            <p>
              DMARC reports are XML files. You can read them manually or use an analysis service (such as Postmark, dmarcian, or Valimail). Identify:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              <li>Legitimate services that are failing (missing SPF or DKIM)</li>
              <li>Suspicious sources spoofing your domain</li>
              <li>The volume of affected emails</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 4: Switch to quarantine mode
            </h3>
            <p>
              Once all your legitimate services pass SPF and/or DKIM with alignment, switch to the quarantine policy:
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=50
            </div>
            <p>
              The <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">pct=50</code> tag applies the policy to only 50% of emails initially, to limit risk.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 5: Enable full reject (p=reject)
            </h3>
            <p>
              The final step is the strictest policy:
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.com; adkim=s; aspf=s
            </div>
            <p>
              With <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>, any email that fails DMARC checks is rejected by the receiving server. This provides maximum protection against spoofing and phishing. Strict alignment (<code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">adkim=s; aspf=s</code>) requires an exact domain match.
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
              1. Jumping straight to p=reject
            </h3>
            <p>
              This is the most dangerous mistake. If you switch directly to <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code> without a monitoring phase, you risk blocking your own legitimate emails. Always follow the progression: <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">none</code> → <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">quarantine</code> → <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">reject</code>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              2. Staying on p=none indefinitely
            </h3>
            <p>
              The <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> policy offers no real protection: it collects reports but blocks nothing. Many domains remain in monitoring mode for years. Set a goal of 1 to 3 months maximum before moving to quarantine.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              3. Not configuring a report address (rua)
            </h3>
            <p>
              Without the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">rua</code> tag, you will not receive any reports. You will be blind to what is happening with your domain. Reports are essential for detecting configuration issues and spoofing attempts.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              4. Ignoring subdomains
            </h3>
            <p>
              By default, the DMARC policy for the main domain does not apply to subdomains. Use the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">sp=reject</code> tag to explicitly set a policy for subdomains, otherwise an attacker could send from <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm">fake.yourdomain.com</code>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              5. Forgetting to configure SPF and DKIM first
            </h3>
            <p>
              DMARC does not work in isolation. It relies on the results of{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              and{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>
              . Without these protocols correctly configured, DMARC has nothing to verify and all your emails will fail.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Frequently asked questions about DMARC
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Which DMARC policy should I choose?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              The ultimate goal is always <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>, which provides the best protection. But start with <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=none</code> to collect reports and identify all services sending emails with your domain. Then gradually move to <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=quarantine</code> and finally <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">p=reject</code>.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              What is DMARC alignment?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Alignment verifies that the domain used in the "From" header (visible to the recipient) matches the domain verified by{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              (envelope domain) or{" "}
              <Link href={`/${lang}/guides/dkim`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DKIM
              </Link>{" "}
              (tag <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">d=</code> domain). In "relaxed" mode (default), subdomains are accepted. In "strict" mode, domains must match exactly.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Is DMARC mandatory in 2025?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Technically no, but in practice yes. Since February 2024, Google and Yahoo require a DMARC record for senders sending more than 5,000 emails per day. Even for smaller volumes, the absence of DMARC seriously degrades your email deliverability. It has become an essential standard for email security.
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
            href={`/${lang}/guides/mta-sts`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 hover:border-zinc-700 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              MTA-STS Guide
            </h3>
            <p className="text-sm text-zinc-400">
              Learn how MTA-STS enforces TLS encryption to protect your emails in transit.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
