import type { APIRoute } from "astro";
import {
  contactSchema,
  collectFieldErrors,
  type FieldErrors,
} from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Point d'entrée du formulaire de contact.
 * C'est la seule route rendue à la demande : tout le reste du site est
 * du HTML statique généré à la compilation.
 *
 * Deux modes de réponse, pour que le formulaire marche dans tous les cas :
 *  - JavaScript actif → JSON, affiché sans rechargement de page ;
 *  - JavaScript absent → redirection 303 vers /merci ou vers l'ancre d'erreur.
 */
export const prerender = false;

type ApiResponse =
  { ok: true } | { ok: false; message: string; errors?: FieldErrors };

const SUCCESS_URL = "/merci";
const ERROR_URL = "/contact#formulaire-erreur";

const wantsJson = (request: Request) =>
  (request.headers.get("accept") ?? "").includes("application/json");

function respond(
  request: Request,
  body: ApiResponse,
  status: number,
  headers?: HeadersInit,
): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    });
  }

  // Repli sans JavaScript : 303 pour que le rafraîchissement de la page
  // ne renvoie pas le formulaire une seconde fois.
  return new Response(null, {
    status: 303,
    headers: { Location: body.ok ? SUCCESS_URL : ERROR_URL, ...headers },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const limit = checkRateLimit(clientAddress);
  if (!limit.allowed) {
    return respond(
      request,
      {
        ok: false,
        message:
          "Trop de messages envoyés depuis cette connexion. Merci de réessayer dans quelques minutes.",
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  let payload: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    payload = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return respond(request, { ok: false, message: "Requête illisible." }, 400);
  }

  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return respond(
      request,
      {
        ok: false,
        message: "Merci de corriger les champs signalés.",
        errors: collectFieldErrors(result.error),
      },
      422,
    );
  }

  // Piège à robots rempli : on répond « succès » sans rien envoyer, pour ne
  // pas indiquer au script qu'il a été détecté.
  if (result.data.website?.trim()) {
    return respond(request, { ok: true }, 200);
  }

  try {
    await sendContactEmail(result.data);
  } catch (error) {
    console.error("[contact] échec de l'envoi :", error);
    return respond(
      request,
      {
        ok: false,
        message:
          "L'envoi a échoué. Merci de réessayer ou de nous joindre par téléphone.",
      },
      502,
    );
  }

  return respond(request, { ok: true }, 200);
};
