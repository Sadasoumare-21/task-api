import axios, { AxiosError } from 'axios';

// 🟢 MODE DE TEST SANS BASE DE DONNÉES / SANS BACKEND
// Change à true pour tester le Frontend de façon 100% autonome via localStorage.
// Change à false pour connecter l'application à l'API NestJS réelle et sa base de données MySQL.
export const USE_MOCK = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  // ⏱️ 60s : laisse le temps au cold start de Render (plan Free ~30-60s)
  timeout: 60_000,
});

// ─── Intercepteur REQUEST : injection automatique du token ────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Intercepteur RESPONSE : gestion 401 (token invalide / expiré) ───────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl: string = error.config?.url ?? '';
      const isAuthRoute =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register');

      if (!isAuthRoute) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Retry avec Exponential Backoff ──────────────────────────────────────────
/**
 * Codes HTTP qui sont des erreurs "légitimes" → on ne réessaie PAS.
 * Seules les erreurs réseau pures (pas de réponse du tout) déclenchent le retry.
 */
const NO_RETRY_STATUSES = [400, 401, 403, 404, 409, 422];

/**
 * Détermine si une erreur Axios est une erreur réseau pure (cold start, timeout,
 * connexion refusée) et mérite d'être réessayée.
 */
function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const axiosError = error as AxiosError;

  // Si on a une réponse HTTP → c'est une erreur légitimedu serveur, pas un pb réseau
  if (axiosError.response) {
    return !NO_RETRY_STATUSES.includes(axiosError.response.status);
  }

  // Pas de réponse = erreur réseau pure (timeout, DNS, connexion refusée)
  return true;
}

/**
 * Enveloppe n'importe quelle fonction async avec un retry automatique.
 *
 * @param fn          La fonction à exécuter (ex: () => AuthService.login(...))
 * @param maxRetries  Nombre max de tentatives supplémentaires (défaut: 3)
 * @param onRetry     Callback appelé avant chaque réessai avec le numéro de tentative
 *
 * @example
 * const data = await withRetry(
 *   () => AuthService.login(credentials),
 *   3,
 *   (attempt) => setRetryMessage(`Tentative ${attempt}/3…`)
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  onRetry?: (attempt: number, delayMs: number) => void,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Ne pas réessayer si : c'est la dernière tentative OU ce n'est pas une erreur réseau
      const isLast = attempt === maxRetries;
      if (isLast || !isNetworkError(error)) {
        throw error;
      }

      // Délai exponentiel : 2s, 4s, 8s (+ légère variation aléatoire pour éviter thundering herd)
      const baseDelay = Math.pow(2, attempt + 1) * 1000;
      const jitter = Math.random() * 500;
      const delayMs = Math.min(baseDelay + jitter, 15_000); // cap à 15s

      onRetry?.(attempt + 1, Math.round(delayMs));

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export default api;