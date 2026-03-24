# SpoofCheck

Outil de vérification de vulnérabilité email. Analyse la configuration DNS d'un domaine (SPF, DKIM, DMARC, MX) et donne un score de sécurité avec des recommandations.

## Fonctionnalités

- Analyse SPF (politique, strictness)
- Analyse DKIM (20 sélecteurs courants testés en parallèle)
- Analyse DMARC (politique, reporting)
- Détection du fournisseur mail (Google, Microsoft, OVH...)
- Score de sécurité 0-100 avec grade A-F
- Recommandations actionnables

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Déployer

```bash
vercel
```
