import type { APIRoute } from "astro";

/**
 * robots.txt généré à la compilation.
 *
 * L'URL du sitemap est dérivée de `site` (astro.config.mjs) plutôt qu'écrite
 * en dur : elle reste juste que le site tourne sur un sous-domaine Vercel ou
 * sur le domaine définitif.
 *
 * Les déploiements de prévisualisation (branches, pull requests) sont
 * entièrement bloqués : sans cela, Google indexerait plusieurs copies du
 * site, qui se feraient concurrence dans les résultats de recherche.
 */

const isPreview = process.env.VERCEL_ENV === "preview";

export const GET: APIRoute = ({ site }) => {
  const body = isPreview
    ? ["User-agent: *", "Disallow: /"].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
        "Disallow: /merci",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", site).href}`,
      ].join("\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
