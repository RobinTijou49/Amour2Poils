import { z } from "zod";

/**
 * Schéma partagé entre le navigateur et le serveur.
 * Le serveur reste la seule source de vérité : la validation côté client
 * n'est qu'un confort, elle est systématiquement rejouée à la réception.
 */

export const SERVICES = {
  "pension-domicile": "Garde à domicile",
  "pension-familiale": "Pension familiale",
  petsitting: "Promenade / Petsitting",
  "cours-particulier": "Cours particulier d'éducation",
  "cours-collectif": "Cours collectif",
  "puppy-class": "Puppy class",
  reeducation: "Rééducation comportementale",
  autre: "Autre demande",
} as const;

export type ServiceKey = keyof typeof SERVICES;

/**
 * Accepte les formats français courants : 06 12 34 56 78, +33 6 12 34 56 78…
 * Exporté pour servir aussi d'attribut `pattern` sur le champ du formulaire,
 * afin que le navigateur applique exactement la même règle que le serveur.
 */
export const PHONE_PATTERN = /^(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

/** Bornes reprises telles quelles dans les attributs HTML du formulaire. */
export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 200,
  messageMin: 10,
  messageMax: 5000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.nameMin, "Merci d'indiquer votre nom (2 caractères minimum).")
    .max(LIMITS.nameMax, "Le nom est trop long."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Numéro de téléphone invalide (ex. 06 12 34 56 78)."),
  email: z
    .email("Adresse e-mail invalide.")
    .trim()
    .max(LIMITS.emailMax, "L'adresse e-mail est trop longue."),
  service: z.enum(
    Object.keys(SERVICES) as [ServiceKey, ...ServiceKey[]],
    "Merci de choisir un service.",
  ),
  message: z
    .string()
    .trim()
    .min(LIMITS.messageMin, "Votre message doit faire au moins 10 caractères.")
    .max(
      LIMITS.messageMax,
      "Votre message est trop long (5 000 caractères maximum).",
    ),
  /**
   * Piège à robots : champ invisible pour un humain. Le schéma l'accepte
   * tel quel — c'est la route qui décide quoi en faire. Le refuser ici
   * renverrait une erreur de validation nommant le champ, ce qui
   * indiquerait au robot exactement comment passer au travers.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Erreurs de validation indexées par nom de champ. */
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export function collectFieldErrors(
  error: z.ZodError<ContactInput>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof ContactInput | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
