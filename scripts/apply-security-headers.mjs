// @ts-check
import { readFile, writeFile } from "node:fs/promises";

/**
 * Ajoute les en-têtes de sécurité à la sortie de l'adaptateur Vercel.
 *
 * Pourquoi un script post-build plutôt qu'un `vercel.json` : l'adaptateur
 * produit un dossier `.vercel/output` (Build Output API v3), et Vercel lit
 * alors le `config.json` qui s'y trouve. Les en-têtes déclarés dans
 * `vercel.json` seraient ignorés sans le moindre avertissement.
 *
 * Pourquoi pas une intégration Astro : le hook `astro:build:done` se déclenche
 * avant que l'adaptateur n'ait écrit `config.json`. Ce script tourne après.
 *
 * Une route `continue: true` applique ses en-têtes puis laisse la requête
 * suivre son chemin : les règles de routage de l'adaptateur restent intactes.
 */

const CONFIG_PATH = ".vercel/output/config.json";
const MARKER = "amour2poils-security-headers";

const SECURITY_HEADERS = {
  // Empêche le navigateur de deviner un type MIME différent de celui annoncé.
  "X-Content-Type-Options": "nosniff",
  // Ne transmet l'URL complète qu'aux pages du même site.
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Interdit l'affichage du site dans une iframe tierce (clickjacking).
  "X-Frame-Options": "SAMEORIGIN",
  // Le site n'a besoin d'aucune de ces API.
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

let raw;
try {
  raw = await readFile(CONFIG_PATH, "utf-8");
} catch {
  // Build hors Vercel (autre adaptateur, ou simple `astro check`) : rien à faire.
  process.exit(0);
}

/** @type {{ routes?: Record<string, unknown>[] }} */
const config = JSON.parse(raw);

if (!Array.isArray(config.routes)) {
  console.error(
    `[security-headers] ${CONFIG_PATH} ne contient pas de tableau "routes". ` +
      `La sortie de l'adaptateur a changé de forme : script à mettre à jour.`,
  );
  process.exit(1);
}

// Idempotent : un second passage ne doit pas empiler la même règle.
if (!config.routes.some((route) => route?.[MARKER])) {
  config.routes.unshift({
    [MARKER]: true,
    src: "/(.*)",
    headers: SECURITY_HEADERS,
    continue: true,
  });
  await writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

console.log("[security-headers] en-têtes appliqués à la sortie Vercel.");
