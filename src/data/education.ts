/** Contenu de la page Éducation positive. */

export type Prestation = {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
};

export const prestations: readonly Prestation[] = [
  {
    icon: "🐾",
    title: "Cours particuliers",
    text: "Séances individuelles à domicile ou en extérieur, entièrement adaptées aux objectifs de votre chien : obéissance, propreté, rappel, marche en laisse.",
  },
  {
    icon: "👥",
    title: "Cours collectifs",
    text: "Petits groupes de niveaux homogènes pour travailler la sociabilisation, la concentration et les ordres de base dans un cadre convivial.",
  },
  {
    icon: "🐶",
    title: "Puppy classes",
    text: "Ateliers dédiés aux chiots pour poser de bonnes bases dès le plus jeune âge : sociabilisation, gestion des morsures, propreté.",
  },
  {
    icon: "🧩",
    title: "Rééducation comportementale",
    text: "Accompagnement des chiens anxieux, réactifs ou peureux, avec un protocole progressif et individualisé pour restaurer la confiance.",
  },
  {
    icon: "🎯",
    title: "Préparation au CES/CEB",
    text: "Préparation aux évaluations comportementales pour les chiens de catégorie, dans un climat serein et sans pression.",
  },
  {
    icon: "📋",
    title: "Bilan comportemental",
    text: "Une séance d'observation approfondie pour identifier l'origine d'un comportement gênant et définir un plan d'action adapté.",
  },
];

export type Benefit = {
  readonly title: string;
  readonly text: string;
};

export const benefits: readonly Benefit[] = [
  {
    title: "Confiance renforcée",
    text: "Le chien apprend sans peur, ce qui consolide le lien avec son humain.",
  },
  {
    title: "Apprentissages durables",
    text: "Les comportements appris par le plaisir sont mieux mémorisés et plus stables.",
  },
  {
    title: "Moins de stress",
    text: "Une approche douce réduit l'anxiété, autant chez le chien que chez le maître.",
  },
  {
    title: "Quotidien plus serein",
    text: "Promenades, visites, voyages : une cohabitation apaisée au quotidien.",
  },
];

export const methodFeatures = [
  { bullet: "✓", text: "Renforcement positif exclusivement" },
  { bullet: "✓", text: "Respect du rythme et des émotions du chien" },
  { bullet: "✓", text: "Approche fondée sur l'éthologie canine" },
] as const;
