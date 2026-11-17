import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    // Redirections sensibles à la casse, comme l'ancien proxy : /FR doit
    // partir vers /en/FR (404) et non atteindre /[lang] avec lang="FR", ce
    // qui pouvait servir un 404 en cache à la place de /fr.
    caseSensitiveRoutes: true,
  },
  // Préfixe de langue manquant : redirection au niveau du CDN, sans invoquer
  // de fonction. Remplace l'ancien proxy.ts, qui s'exécutait à chaque page
  // vue et coûtait du CPU actif (Fluid) pour une simple redirection vers /en.
  // Exclus : les chemins déjà préfixés, l'API, /admin, les ressources internes
  // de Next et Vercel, et tout chemin contenant un point (fichiers statiques).
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      {
        source: "/:path((?!(?:fr|en)(?:/|$)|api|admin|_next|_vercel)[^.]*)",
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
