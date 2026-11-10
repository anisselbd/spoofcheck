// Robots d'indexation et outils SEO : leurs visites ne doivent gonfler ni le
// compteur d'analyses ni les statistiques du CTA partenaire.
const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|googlebot|yandex|baidu|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider/i;

export function isBotUserAgent(userAgent: string): boolean {
  return BOT_USER_AGENT.test(userAgent);
}
