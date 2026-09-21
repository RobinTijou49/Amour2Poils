/**
 * Limitation de débit en mémoire : au plus N soumissions par IP et par
 * fenêtre glissante. Suffisant pour freiner les robots sur un site vitrine
 * mono-instance. Derrière plusieurs instances ou en environnement
 * « serverless », remplacer par un stockage partagé (Redis, Upstash…).
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
