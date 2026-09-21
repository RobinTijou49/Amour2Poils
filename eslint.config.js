import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist/**", ".astro/**", ".vercel/**", "node_modules/**"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  astro.configs["flat/recommended"],
  // Règles d'accessibilité sur les composants .astro.
  astro.configs["flat/jsx-a11y-recommended"],
  {
    // TypeScript vérifie déjà l'existence des identifiants, et connaît les
    // types globaux d'Astro (ImageMetadata…) que `no-undef` ignore.
    files: ["**/*.{ts,tsx,astro}"],
    rules: { "no-undef": "off" },
  },
  {
    // Fichiers de configuration et scripts de build, exécutés par Node.
    files: ["*.config.{js,mjs,ts}", "eslint.config.js", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
