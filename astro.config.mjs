// @ts-check
import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

/**
 * URL canonique du site.
 *
 * Ordre de priorité :
 *  1. `SITE_URL`, à définir quand le domaine définitif est branché ;
 *  2. le domaine de production fourni par Vercel, pour que les URL
 *     canoniques et le sitemap soient corrects dès le premier déploiement
 *     sans rien configurer ;
 *  3. localhost, en développement.
 */
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site =
  process.env.SITE_URL ??
  (productionUrl ? `https://${productionUrl}` : "http://localhost:4321");

/**
 * Le site est statique par défaut (`output: "static"`).
 * Seule la route `/api/contact` est rendue à la demande via
 * `export const prerender = false`, ce qui impose un adaptateur.
 *
 * Pour changer d'hébergeur, seul cet adaptateur est à remplacer
 * (@astrojs/netlify, @astrojs/cloudflare, @astrojs/node…).
 */
export default defineConfig({
  site,
  output: "static",
  adapter: vercel(),
  integrations: [
    sitemap({
      // Pages techniques : sans intérêt dans les résultats de recherche.
      filter: (page) => !/\/(merci|404)\/?$/.test(page),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  image: {
    // Formats modernes générés à la compilation par sharp.
    responsiveStyles: true,
  },
  env: {
    schema: {
      // Fournisseur d'envoi d'e-mails (https://resend.com). Absent => mode "dry run".
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CONTACT_TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "contact@amour2poils.fr",
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "Site Amour 2 Poils <site@amour2poils.fr>",
      }),
    },
  },
});
