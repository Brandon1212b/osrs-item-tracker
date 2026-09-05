/** Browser persistence so repeat visits paint immediately. */

const PREFIX = "ge-watch-qc:";

export function readClientCache<T>(key: string, maxAgeMs: number): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { at: number; value: T };
    if (!parsed?.at || Date.now() - parsed.at > maxAgeMs) return undefined;
    return parsed.value;
  } catch {
    return undefined;
  }
}

export function writeClientCache<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    /* quota / private mode */
  }
}
