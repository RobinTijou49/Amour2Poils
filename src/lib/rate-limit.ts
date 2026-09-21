/**
 * Limitation de débit en mémoire : au plus N soumissions par IP et par
 * fenêtre glissante.
 *
 * Portée réelle sur l'hébergement actuel (Vercel, fonctions serverless) :
 * la mémoire n'est partagée ni entre instances, ni dans le temps, puisque
 * les instances sont recyclées. Le compteur freine donc les rafales qui
 * tombent sur une instance déjà chaude, mais il ne constitue pas une
 * barrière fiable — c'est le piège à robots du formulaire qui fait le
 * gros du travail anti-spam.
 *
 * Pour une vraie garantie, brancher un stockage partagé (Upstash Redis,
 * Vercel KV) : seule l'implémentation de `checkRateLimit` change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Purge opportuniste pour éviter que la Map ne grossisse indéfiniment.
    if (buckets.size > 1000) {
      for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= MAX_REQUESTS,
    retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}
