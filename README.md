<div align="center">

# SpoofCheck

**Is your domain spoofable?**

Check in one click if your domain is protected against email spoofing.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## What is it?

SpoofCheck analyzes a domain's DNS configuration and detects vulnerabilities that allow anyone to send emails pretending to be you.

A misconfigured domain = anyone can send an email from `contact@yourdomain.com` without having access to it.

## What's checked

| Check | Description |
|-------|-------------|
| **SPF** | Who is authorized to send emails for your domain |
| **DKIM** | Cryptographic email signatures (20+ selectors tested) |
| **DMARC** | Policy for rejecting unauthenticated emails |
| **MTA-STS** | Enforced TLS for inbound mail delivery |
| **MX** | Mail servers + provider detection (Google, Microsoft, OVH...) |

## Security score

Each domain gets a score from **0 to 100** and a grade from **A to F**:

- **A (90-100)** — Well protected domain
- **B (70-89)** — Good foundation, minor improvements possible
- **C (50-69)** — Partial protection, vulnerable in some cases
- **D (30-49)** — Poorly protected, spoofing likely
- **F (0-29)** — No protection, trivial spoofing

## Run locally

```bash
git clone https://github.com/anisselbd/spoofcheck.git
cd spoofcheck
npm install
npm run dev
```

Open http://localhost:3000

## Deploy on Vercel

```bash
vercel
```

## Tech stack

- **Next.js 16** — App Router, API Routes
- **TypeScript** — Strict typing
- **Tailwind CSS v4** — Dark mode UI
- **Node.js DNS** — Native DNS resolution (no external dependencies)
