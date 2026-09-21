import {
  RESEND_API_KEY,
  CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL,
} from "astro:env/server";
import { SERVICES, type ContactInput } from "@/lib/contact-schema";

/**
 * Envoi du message de contact par e-mail.
 *
 * L'implémentation utilise l'API HTTP de Resend (https://resend.com), appelée
 * directement avec `fetch` — pas de SDK à maintenir. Pour changer de
 * prestataire (Brevo, Postmark, SMTP…), seule cette fonction est à réécrire :
 * le reste du site ne connaît que `sendContactEmail`.
 *
 * Sans `RESEND_API_KEY`, on bascule en mode « dry run » : le message est
 * journalisé et l'envoi est considéré comme réussi, ce qui permet de
 * développer et de tester le formulaire sans compte ni clé.
 */

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

function buildEmail(data: ContactInput) {
  const serviceLabel = SERVICES[data.service];

  const text = [
    `Nom      : ${data.name}`,
    `Email    : ${data.email}`,
    `Téléphone: ${data.phone}`,
    `Service  : ${serviceLabel}`,
    "",
    data.message,
  ].join("\n");

  const html = `
    <h2>Nouvelle demande depuis le site</h2>
    <ul>
      <li><strong>Nom :</strong> ${escapeHtml(data.name)}</li>
      <li><strong>Email :</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Téléphone :</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Service :</strong> ${escapeHtml(serviceLabel)}</li>
    </ul>
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `;

  return {
    subject: `[Site] ${serviceLabel} — ${data.name}`,
    text,
    html,
  };
}

export async function sendContactEmail(data: ContactInput): Promise<void> {
  const { subject, text, html } = buildEmail(data);

  if (!RESEND_API_KEY) {
    console.info(
      "[contact] RESEND_API_KEY absente — e-mail non envoyé (mode dry run).\n" +
        `Destinataire : ${CONTACT_TO_EMAIL}\nSujet : ${subject}\n${text}`,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      // Permet de répondre directement au visiteur depuis la boîte mail.
      reply_to: data.email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend a répondu ${response.status} ${response.statusText}. ${detail}`,
    );
  }
}
