<div align="center">

# SpoofCheck

**Votre domaine est-il usurpable ?**

Vérifiez en un clic si votre domaine est protégé contre le spoofing email.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Qu'est-ce que c'est ?

SpoofCheck analyse la configuration DNS d'un domaine et détecte les failles qui permettent à n'importe qui d'envoyer des mails en se faisant passer pour vous.

Un domaine mal configuré = n'importe qui peut envoyer un mail depuis `contact@votredomaine.fr` sans y avoir accès.

## Ce qui est vérifié

| Check | Description |
|-------|-------------|
| **SPF** | Qui est autorisé à envoyer des mails pour votre domaine |
| **DKIM** | Signature cryptographique des mails (20 sélecteurs testés) |
| **DMARC** | Politique de rejet des mails non authentifiés |
| **MX** | Serveurs mail + détection du fournisseur (Google, Microsoft, OVH...) |

## Score de sécurité

Chaque domaine reçoit un score de **0 à 100** et une note de **A à F** :

- **A (90-100)** — Domaine bien protégé
- **B (70-89)** — Bonne base, quelques améliorations possibles
- **C (50-69)** — Protection partielle, vulnérable dans certains cas
- **D (30-49)** — Peu protégé, spoofing probable
- **F (0-29)** — Aucune protection, spoofing trivial

## Lancer en local

```bash
git clone https://github.com/anisselbd/spoofcheck.git
cd spoofcheck
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Déployer sur Vercel

```bash
vercel
```

## Stack technique

- **Next.js 16** — App Router, API Routes
- **TypeScript** — Typage strict
- **Tailwind CSS v4** — UI dark mode
- **Node.js DNS** — Résolution DNS native (pas de dépendance externe)
