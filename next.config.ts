import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    // Redirections sensibles à la casse en local (next start), comme l'ancien
    // proxy : sans ça, une requête /FR pouvait y faire servir un 404 à la
    // place de /fr. Sur Vercel l'option est sans effet : /FR répond
    // directement 404 (avant : 308 puis 404) avec sa propre entrée de cache,
    // sans toucher à /fr (vérifié sur un déploiement de prévisualisation).
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
