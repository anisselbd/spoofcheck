import Link from "next/link";

export default function DkimContentEn({ lang }: { lang: string }) {
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
          DKIM (DomainKeys Identified Mail): The Complete Guide
        </h1>
        <p className="text-lg text-zinc-400">
          Everything you need to know about DKIM signatures to authenticate your emails and ensure they haven't been tampered with in transit.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          What is DKIM?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-zinc-100">DKIM (DomainKeys Identified Mail)</strong> is an email authentication protocol defined in{" "}
            <strong className="text-zinc-100">RFC 6376</strong>. It allows you to cryptographically sign outgoing emails to prove two things: that the email genuinely comes from the claimed domain, and that its content has not been altered during transport.
          </p>
          <p>
            DKIM uses an <strong className="text-zinc-100">asymmetric cryptography</strong> system (public key / private key). The sending server signs each email with a private key, and the corresponding public key is published in a DNS record. The receiving server can then verify the signature by comparing the two.
          </p>
          <p>
            Unlike{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>{" "}
            which only verifies the sender's IP address, DKIM guarantees the <strong className="text-zinc-100">integrity of the message</strong> itself. Even if an email is relayed through multiple servers, the DKIM signature proves that the content has not been modified.
          </p>
          <p>
            DKIM is an essential component of email security. Combined with{" "}
            <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              SPF
            </Link>{" "}
            and{" "}
            <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              DMARC
            </Link>
            , it forms the foundational trio for protecting a domain against email spoofing.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How does DKIM work?
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-zinc-300 leading-relaxed">
          <p>
            The DKIM process unfolds in two phases: signing at sending time and verification at reception.
          </p>

          <h3 className="text-lg font-semibold text-zinc-100">Signing phase (sending)</h3>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Header selection</strong> — The sending server chooses which headers to include in the signature (From, To, Subject, Date, etc.).
            </li>
            <li>
              <strong className="text-zinc-100">Content hashing</strong> — The message body and selected headers are hashed (typically using SHA-256).
            </li>
            <li>
              <strong className="text-zinc-100">Cryptographic signing</strong> — The hash is encrypted with the domain's DKIM private key, creating the digital signature.
            </li>
            <li>
              <strong className="text-zinc-100">Header insertion</strong> — The signature is added to the email via the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> header.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-zinc-100 pt-2">Verification phase (receiving)</h3>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-zinc-100">Signature extraction</strong> — The receiving server extracts the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> header and identifies the domain and selector.
            </li>
            <li>
              <strong className="text-zinc-100">DNS lookup</strong> — It queries DNS to obtain the public key at <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">selector._domainkey.domain.com</code>.
            </li>
            <li>
              <strong className="text-zinc-100">Verification</strong> — It decrypts the signature with the public key and compares the result to the recalculated hash of the received message.
            </li>
            <li>
              <strong className="text-zinc-100">Verdict</strong> — If the hashes match, the signature is valid: the email is authentic and intact.
            </li>
          </ol>

          <p className="pt-2">
            A DKIM-Signature header looks like this:
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`DKIM-Signature: v=1; a=rsa-sha256; d=example.com;
  s=selector1; c=relaxed/relaxed;
  h=from:to:subject:date;
  bh=base64_body_hash;
  b=base64_signature`}
          </div>

          <p>
            And the corresponding DNS record (TXT type):
          </p>
          <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            selector1._domainkey.example.com IN TXT "v=DKIM1; k=rsa; p=base64_public_key"
          </div>
        </div>
      </section>

      {/* Configuration step by step */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          How to configure DKIM step by step
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 1: Generate DKIM keys
            </h3>
            <p>
              Most email providers (Google Workspace, Microsoft 365, etc.) automatically generate DKIM keys. You just need to enable the feature in the admin console. If you manage your own server, you can generate keys with OpenSSL:
            </p>
            <div className="rounded-lg bg-zinc-800 p-4 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre">
{`openssl genrsa -out dkim_private.pem 2048
openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem`}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 2: Publish the public key in DNS
            </h3>
            <p>
              Create a TXT record in your DNS zone with the name <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">selector._domainkey.yourdomain.com</code>. The selector is a free-form identifier (e.g., "google", "selector1", "mail"):
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li><strong className="text-zinc-100">Type:</strong> TXT</li>
              <li><strong className="text-zinc-100">Name:</strong> selector1._domainkey</li>
              <li><strong className="text-zinc-100">Value:</strong> v=DKIM1; k=rsa; p=your_base64_public_key</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 3: Configure the sending server
            </h3>
            <p>
              Configure your mail server or sending service to sign outgoing emails with the private key. With cloud providers, this step usually comes down to an "Enable DKIM" button in the admin console.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 4: Verify the configuration
            </h3>
            <p>
              Send a test email and check the headers to confirm the presence of a valid <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">DKIM-Signature</code> header. Use{" "}
              <Link href={`/${lang}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                our free verification tool
              </Link>{" "}
              to validate that the DNS record is correctly published.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Step 5: Configure DKIM for each sending service
            </h3>
            <p>
              If you use multiple services (main email, newsletter, transactional emails), each one must have its own DKIM configuration with a distinct selector. For example: <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">google._domainkey</code> for Google Workspace and <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm">brevo._domainkey</code> for Brevo.
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
              1. Using RSA keys that are too short
            </h3>
            <p>
              1024-bit RSA keys are now considered weak. Use keys of <strong className="text-zinc-100">2048 bits minimum</strong>. Most modern providers already use this size by default.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              2. Not rotating keys regularly
            </h3>
            <p>
              DKIM keys should be changed (rotated) at least every 6 to 12 months. Keep the old public key in DNS for a few days after rotation so that emails in transit can still be verified.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              3. Public key formatting errors
            </h3>
            <p>
              Some registrars truncate long TXT records. Make sure your public key is complete and properly formatted. The value must not contain any unwanted spaces or line breaks.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              4. Forgetting to configure DKIM for third-party services
            </h3>
            <p>
              Every service that sends emails on your behalf (newsletter, CRM, support) must have its own DKIM record. Without it, their emails will fail{" "}
              <Link href={`/${lang}/guides/dmarc`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                DMARC
              </Link>{" "}
              verification.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              5. Not testing after configuration
            </h3>
            <p>
              An error in the DNS record or server configuration can render DKIM non-functional without you noticing. Always test systematically with a verification email.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          Frequently asked questions about DKIM
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              What is the difference between SPF and DKIM?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              verifies that the sending server is authorized to send on behalf of your domain (IP verification). DKIM verifies that the email content has not been modified and that it is genuinely signed by your domain (cryptographic verification). The two are complementary: SPF authenticates the server, DKIM authenticates the message.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Can you have multiple DKIM records?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Yes, unlike{" "}
              <Link href={`/${lang}/guides/spf`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                SPF
              </Link>{" "}
              which only allows a single record, you can have as many DKIM records as needed. Each sending service uses a different selector, creating distinct DNS records. This is the recommended practice.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Does DKIM slow down email sending?
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              The performance impact is negligible. Cryptographic signing takes only a few milliseconds per email. On the receiving side, DKIM verification adds a DNS lookup and a hash calculation, but this has no perceptible impact for the end user. The benefits in terms of deliverability and security far outweigh this minimal cost.
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
