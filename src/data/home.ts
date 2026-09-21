/** Contenu de la page d'accueil. */

export type Value = {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
};

export const values: readonly Value[] = [
  {
    icon: "💛",
    title: "Bienveillance",
    text: "Chaque chien est unique. Nous adaptons notre approche à sa personnalité, son histoire et ses besoins, sans jamais forcer ni brusquer.",
  },
  {
    icon: "🐕",
    title: "Respect de l'animal",
    text: "Aucune méthode coercitive. Nous privilégions l'écoute du langage canin et le renforcement positif à chaque instant.",
  },
  {
    icon: "🎓",
    title: "Professionnalisme",
    text: "Formation continue, expérience de terrain et suivi rigoureux pour vous offrir un accompagnement sérieux et rassurant.",
  },
];

export type Testimonial = {
  readonly author: string;
  readonly role: string;
  readonly quote: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
};

export const testimonials: readonly Testimonial[] = [
  {
    author: "Camille D.",
    role: "Propriétaire de Rex",
    rating: 5,
    quote:
      "Rex est revenu de pension épanoui et détendu. On sentait qu'il avait été chouchouté comme à la maison. Merci pour votre professionnalisme !",
  },
  {
    author: "Lucas M.",
    role: "Propriétaire de Nala",
    rating: 5,
    quote:
      "Grâce aux cours d'éducation positive, notre chiot a appris la propreté et le rappel sans aucun stress. Une approche douce et vraiment efficace.",
  },
  {
    author: "Sophie R.",
    role: "Propriétaire de Milo",
    rating: 5,
    quote:
      "Une équipe à l'écoute qui a su rassurer notre chien réactif en balade. Nous avons enfin retrouvé des promenades sereines.",
  },
];
