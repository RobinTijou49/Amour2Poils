// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

/**
 * Le site est statique par défaut (`output: "static"`).
 * Seule la route `/api/contact` est rendue à la demande via `export const prerender = false`,
 * ce qui impose un adaptateur. `@astrojs/node` est volontairement neutre : pour déployer
 * ailleurs, remplacez-le par @astrojs/netlify, @astrojs/vercel ou @astrojs/cloudflare.
 */
export default defineConfig({
  site: process.env.SITE_URL ?? "https://www.amour2poils.fr",
  output: "static",
  adapter: node({ mode: "standalone" }),
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
