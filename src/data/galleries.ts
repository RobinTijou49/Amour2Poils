/**
 * Galeries photo.
 * Les images sont importées depuis `src/assets` : Astro les optimise à la
 * compilation (AVIF/WebP, srcset responsive) et connaît leurs dimensions,
 * ce qui évite tout décalage de mise en page au chargement.
 *
 * Pour changer une photo : remplacez le fichier dans `src/assets/images/`
 * et mettez à jour son texte alternatif ci-dessous.
 */

import chiotCalin from "@/assets/images/galerie-chiot-calin.jpg";
import chienHerbe from "@/assets/images/galerie-chien-herbe.jpg";
import chienRegard from "@/assets/images/chien-regard.jpg";
import educationApprentissage from "@/assets/images/education-apprentissage.jpg";
import baladeGroupe from "@/assets/images/galerie-balade-groupe.jpg";
import chienRepos from "@/assets/images/galerie-chien-repos.jpg";
import pensionPromenade from "@/assets/images/pension-promenade.jpg";
import educationRappel from "@/assets/images/galerie-education-rappel.jpg";
import chiotAssis from "@/assets/images/galerie-chiot-assis.jpg";
import jeuExterieur from "@/assets/images/galerie-jeu-exterieur.jpg";

export type GalleryItem = {
  readonly src: ImageMetadata;
  /** Description de l'image pour les lecteurs d'écran. Jamais vide. */
  readonly alt: string;
  /** Occupation dans la grille en mosaïque. */
  readonly span?: "tall" | "wide";
};

export const pensionGallery: readonly GalleryItem[] = [
  {
    src: chiotCalin,
    alt: "Chiot blotti dans les bras de sa gardienne",
    span: "tall",
  },
  {
    src: chienHerbe,
    alt: "Chien allongé dans l'herbe au soleil",
    span: "wide",
  },
  { src: chienRegard, alt: "Chien attentif regardant vers l'objectif" },
  {
    src: educationApprentissage,
    alt: "Chien recevant une friandise pendant un exercice",
  },
  {
    src: baladeGroupe,
    alt: "Plusieurs chiens en balade sur un chemin de campagne",
    span: "wide",
  },
  { src: chienRepos, alt: "Chien assoupi sur son couchage" },
];

export const educationGallery: readonly GalleryItem[] = [
  {
    src: pensionPromenade,
    alt: "Éducatrice canine en promenade avec un chien en laisse",
    span: "wide",
  },
  {
    src: educationRappel,
    alt: "Chien revenant au rappel dans un pré",
    span: undefined,
  },
  {
    src: chiotAssis,
    alt: "Chiot assis attendant une consigne",
    span: "tall",
  },
  {
    src: educationApprentissage,
    alt: "Récompense donnée à un chien après un exercice réussi",
  },
  {
    src: jeuExterieur,
    alt: "Chien jouant en extérieur pendant une séance d'éducation",
    span: "wide",
  },
];
