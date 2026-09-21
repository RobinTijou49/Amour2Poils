/** Contenu de la page Pension & Petsitting. */

export type PriceCard = {
  readonly title: string;
  readonly amount: string;
  readonly unit: string;
  readonly note: string;
  readonly features: readonly string[];
  /** Met la carte en avant visuellement (une seule à la fois). */
  readonly featured?: boolean;
  readonly badge?: string;
};

export const pricing: readonly PriceCard[] = [
  {
    title: "Promenade",
    amount: "15€",
    unit: "/ balade",
    note: "Idéal pour les journées chargées",
    features: [
      "Balade de 30 à 45 min",
      "Eau et gamelle si besoin",
      "Compte-rendu par message",
    ],
  },
  {
    title: "Garde à domicile",
    amount: "30€",
    unit: "/ jour",
    note: "Votre chien reste dans ses repères",
    features: [
      "2 à 3 visites par jour",
      "Promenades incluses",
      "Photos et nouvelles quotidiennes",
    ],
    featured: true,
    badge: "Le plus demandé",
  },
  {
    title: "Pension familiale",
    amount: "25€",
    unit: "/ nuit",
    note: "Accueil chez notre éducatrice",
    features: [
      "Hébergement en petit groupe",
      "Sorties et jeux quotidiens",
      "Encadrement continu",
    ],
  },
];

export const serviceFeatures = [
  {
    bullet: "✓",
    text: "Garde à domicile chez vous (le chien garde ses repères)",
  },
  {
    bullet: "✓",
    text: "Pension familiale chez notre éducatrice, en petit groupe",
  },
  {
    bullet: "✓",
    text: "Promenades ponctuelles ou quotidiennes (petsitting à la carte)",
  },
  { bullet: "✓", text: "Photos et nouvelles envoyées régulièrement" },
] as const;

export const settingFeatures = [
  { bullet: "🔒", text: "Jardin entièrement sécurisé et clôturé" },
  { bullet: "🛏️", text: "Couchages confortables et espace calme dédié" },
  {
    bullet: "🐕‍🦺",
    text: "Groupes de chiens compatibles, présentation progressive",
  },
  {
    bullet: "🩺",
    text: "Vaccins et antiparasitaires vérifiés avant l'accueil",
  },
] as const;
