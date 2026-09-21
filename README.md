# Amour 2 Poils — site vitrine

Site vitrine de l'entreprise **Amour 2 Poils** : éducation canine positive,
pension et petsitting à Coutures (49).

Construit avec [Astro](https://astro.build) : les pages sont générées en HTML
statique à la compilation, sans framework JavaScript côté client. Seul le
traitement du formulaire de contact tourne côté serveur.

---

## Démarrer

Prérequis : **Node.js 22.12 ou plus récent**.

```bash
npm install
npm run dev
```

Le site est alors disponible sur <http://localhost:4321>.

Copiez `.env.example` vers `.env` pour configurer l'envoi d'e-mails. Sans clé
API, le formulaire fonctionne quand même : le message est validé puis affiché
dans la console au lieu d'être envoyé.

```bash
cp .env.example .env
```

## Commandes

| Commande            | Effet                                                  |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Serveur de développement avec rechargement à chaud     |
| `npm run build`     | Vérification des types puis génération dans `dist/`    |
| `npm run preview`   | Prévisualise le résultat du build                      |
| `npm start`         | Lance le serveur de production (après `npm run build`) |
| `npm run typecheck` | Vérifie les types sans construire                      |
| `npm run lint`      | ESLint + Prettier en mode vérification                 |
| `npm run lint:fix`  | Corrige automatiquement ce qui peut l'être             |

## Organisation du code

```
src/
├── assets/images/    Photos sources, optimisées à la compilation
├── components/       Composants réutilisables (.astro)
├── data/             Contenu éditable : textes, tarifs, témoignages…
├── layouts/          Gabarit commun à toutes les pages
├── lib/              Logique métier : validation, envoi d'e-mail, anti-spam
├── pages/            Une page = un fichier ; `api/` contient les routes serveur
└── styles/           Jetons de design et styles de base
public/               Fichiers servis tels quels (favicon, robots.txt)
```

Deux principes guident cette organisation :

- **Le contenu est séparé de la présentation.** Les textes, tarifs et
  témoignages vivent dans `src/data/`. Modifier un tarif ou ajouter un
  témoignage ne demande de toucher à aucun composant.
- **Les styles suivent leur composant.** `src/styles/global.css` ne contient
  que les fondations partagées (couleurs, typographie, boutons, grilles) ; tout
  le reste est dans le bloc `<style>` du composant concerné, où Astro l'isole
  automatiquement.

## Modifier le contenu courant

| Ce que vous voulez changer | Fichier                 |
| -------------------------- | ----------------------- |
| Adresse, téléphone, e-mail | `src/data/site.ts`      |
| Liens des réseaux sociaux  | `src/data/site.ts`      |
| Horaires d'ouverture       | `src/data/site.ts`      |
| Entrées du menu            | `src/data/site.ts`      |
| Tarifs de la pension       | `src/data/pension.ts`   |
| Témoignages clients        | `src/data/home.ts`      |
| Prestations d'éducation    | `src/data/education.ts` |
| Photos des galeries        | `src/data/galleries.ts` |
| Couleurs et polices        | `src/styles/global.css` |

### Remplacer une photo

1. Déposez la nouvelle image dans `src/assets/images/`.
2. Mettez à jour l'import correspondant (dans `src/data/galleries.ts` pour une
   galerie, ou directement dans la page pour une photo de section).
3. Adaptez le texte alternatif : il décrit l'image aux personnes qui ne la
   voient pas, et Google s'en sert aussi.

Fournissez des images d'au moins 1200 px de large. Astro se charge du
redimensionnement, de la conversion en WebP et du chargement paresseux.

## Formulaire de contact

Le parcours complet :

1. Le visiteur remplit le formulaire (`src/components/ContactForm.astro`).
2. Les données sont validées une première fois dans le navigateur, avec le
   schéma Zod de `src/lib/contact-schema.ts`.
3. Elles sont envoyées à `POST /api/contact`, qui **rejoue la même validation** —
   le contrôle côté navigateur est un confort, jamais une garantie.
4. La route vérifie le débit par IP (`src/lib/rate-limit.ts`) et le piège à
   robots, puis appelle `sendContactEmail` (`src/lib/mailer.ts`).

Le formulaire fonctionne **sans JavaScript** : c'est un `<form method="post">`
ordinaire. Dans ce cas l'API répond par une redirection vers `/merci` en cas de
succès, ou vers l'ancre d'erreur de la page contact.

### Brancher l'envoi réel

Le prestataire par défaut est [Resend](https://resend.com) :

1. Créez un compte et vérifiez le domaine `amour2poils.fr`.
2. Générez une clé API et renseignez `RESEND_API_KEY` dans `.env`.
3. Ajustez `CONTACT_TO_EMAIL` et `CONTACT_FROM_EMAIL`.

Pour un autre prestataire (Brevo, Postmark, SMTP…), seule la fonction
`sendContactEmail` de `src/lib/mailer.ts` est à réécrire.

> La limitation de débit est conservée en mémoire du processus. Elle convient à
> un déploiement sur une seule instance. Derrière plusieurs instances ou en
> « serverless », remplacez-la par un stockage partagé (Redis, Upstash…).

## Déploiement

`npm run build` produit deux dossiers :

- `dist/client/` — les pages statiques et les images optimisées ;
- `dist/server/` — le serveur Node qui traite `/api/contact`.

Le projet utilise l'adaptateur `@astrojs/node` en mode `standalone`, qui
fonctionne sur n'importe quel hébergement Node :

```bash
npm run build
SITE_URL="https://www.amour2poils.fr" RESEND_API_KEY="..." npm start
```

Pour déployer sur une plateforme dédiée, remplacez l'adaptateur dans
`astro.config.mjs` par `@astrojs/netlify`, `@astrojs/vercel` ou
`@astrojs/cloudflare`. Rien d'autre ne change.

Pensez à définir `SITE_URL` : cette variable alimente l'URL canonique, les
balises de partage et le sitemap.

### Hébergement 100 % statique

Si l'hébergement ne permet pas d'exécuter Node, il reste possible de servir
uniquement `dist/client/` et de confier le formulaire à un service externe
(Formspree, Netlify Forms…). Il faut alors changer l'attribut `action` du
formulaire et retirer l'adaptateur de `astro.config.mjs`.

## Choix techniques

Quelques décisions qui méritent une explication :

- **Polices auto-hébergées.** Les fichiers Quicksand et Nunito sont servis
  depuis le site (paquets `@fontsource-variable`) plutôt que depuis le CDN
  Google Fonts. Aucune requête vers un tiers, donc aucune transmission de
  l'adresse IP des visiteurs — et une page plus rapide.
- **Carte en « clic pour charger ».** L'iframe Google Maps n'est insérée
  qu'après un clic explicite : l'afficher d'office enverrait l'adresse IP du
  visiteur à Google sans son accord.
- **Images en `<img>`, pas en `background-image`.** Astro peut alors générer
  les formats modernes et les tailles adaptées, et les lecteurs d'écran ont
  accès à une description.
- **Le serveur valide toujours.** Le schéma Zod est partagé entre le navigateur
  et l'API, mais seule la validation serveur fait foi.

## Reste à faire

- Remplacer les photos Unsplash par les vraies photos de l'entreprise.
- Renseigner le vrai numéro de téléphone dans `src/data/site.ts`.
- Renseigner les URL des réseaux sociaux (elles pointent encore sur `#`).
- Ajouter une image de partage `public/og-image.jpg` (1200 × 630 px).
- Ajouter les mentions légales et la politique de confidentialité, obligatoires
  pour un site professionnel français.
