/**
 * Informations de l'entreprise et navigation.
 * Point d'entrée unique : modifier une coordonnée ici la met à jour partout
 * (en-tête, pied de page, page contact, données structurées SEO).
 */

export const site = {
  name: "Amour 2 Poils",
  tagline: "Éducation canine positive & pension pour chiens",
  description:
    "Éducation canine positive et pension/petsitting pour chiens, dans la bienveillance et le respect de l'animal.",
  locale: "fr_FR",
  lang: "fr",
} as const;

export const contact = {
  email: "contact@amour2poils.fr",
  phone: "00 00 00 00 00",
  /** Format international, utilisé pour les liens `tel:` et les données structurées. */
  phoneHref: "+33000000000",
  address: {
    street: "7 rue du haut bourg",
    postalCode: "49320",
    city: "Coutures",
    country: "FR",
  },
  mapQuery: "49320 Coutures, France",
} as const;

export const openingHours = [
  { days: "Lundi - Vendredi", hours: "9h - 19h" },
  { days: "Samedi", hours: "9h - 13h" },
  { days: "Dimanche", hours: "Fermé" },
] as const;

export type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
};

/**
 * Remplacer les `#` par les vraies URL des profils.
 * Un lien laissé à `#` est rendu non cliquable pour éviter les liens morts.
 */
export const socialLinks: readonly SocialLink[] = [
  { label: "Facebook", href: "#", icon: "📘" },
  { label: "Instagram", href: "#", icon: "📷" },
  { label: "TikTok", href: "#", icon: "🎵" },
];

export type NavItem = {
  readonly label: string;
  readonly href: string;
};

export const mainNav: readonly NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Pension", href: "/pension" },
  { label: "Éducation positive", href: "/education" },
  { label: "Contact", href: "/contact" },
];

export const footerServiceLinks: readonly NavItem[] = [
  { label: "Garde à domicile", href: "/pension" },
  { label: "Pension familiale", href: "/pension" },
  { label: "Cours particuliers", href: "/education" },
  { label: "Puppy classes", href: "/education" },
];
