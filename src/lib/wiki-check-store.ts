export const LIVE_CHECK_KEY = "ge-watch-wiki-check";
export const PAGE_RATES_KEY = "ge-watch-wiki-pages";
export const SWEEP_META_KEY = "ge-watch-wiki-sweep-meta";
export const SWEEP_EVENT = "ge-watch-wiki-sweep";

export type LiveCheckRecord = {
  date: string;
  matched: boolean;
  hadRates: boolean;
};

export type StoredPageRates = {
  href: string;
  date: string;
  xpPerHour?: number;
  gpPerHour?: number;
  error?: string;
};

export type SweepMeta = {
  startedAt?: string;
  finishedAt?: string;
  pages?: number;
  methods?: number;
  status?: "running" | "done" | "error";
};

export function storageKey(methodId: string, skillKey?: string) {
  return skillKey ? `${skillKey}:${methodId}` : methodId;
}

export function readAllLiveChecks(): Record<string, LiveCheckRecord> {
  try {
    const raw = localStorage.getItem(LIVE_CHECK_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LiveCheckRecord>) : {};
  } catch {
    return {};
  }
}

export function readLiveCheck(methodId: string, skillKey?: string): LiveCheckRecord | null {
  return readAllLiveChecks()[storageKey(methodId, skillKey)] ?? null;
}

export function writeLiveCheck(methodId: string, skillKey: string | undefined, rec: LiveCheckRecord) {
  try {
    const all = readAllLiveChecks();
    all[storageKey(methodId, skillKey)] = rec;
    localStorage.setItem(LIVE_CHECK_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(SWEEP_EVENT));
  } catch {
    /* */
  }
}

export function writeLiveChecks(entries: Record<string, LiveCheckRecord>) {
  try {
    const all = { ...readAllLiveChecks(), ...entries };
    localStorage.setItem(LIVE_CHECK_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(SWEEP_EVENT));
  } catch {
    /* */
  }
}

export function readPageRates(): Record<string, StoredPageRates> {
  try {
    const raw = localStorage.getItem(PAGE_RATES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredPageRates>) : {};
  } catch {
    return {};
  }
}

export function writePageRates(pages: Record<string, StoredPageRates>) {
  try {
    const all = { ...readPageRates(), ...pages };
    localStorage.setItem(PAGE_RATES_KEY, JSON.stringify(all));
  } catch {
    /* */
  }
}

export function readSweepMeta(): SweepMeta | null {
  try {
    const raw = localStorage.getItem(SWEEP_META_KEY);
    return raw ? (JSON.parse(raw) as SweepMeta) : null;
  } catch {
    return null;
  }
}

export function writeSweepMeta(meta: SweepMeta) {
  try {
    localStorage.setItem(SWEEP_META_KEY, JSON.stringify(meta));
  } catch {
    /* */
  }
}

export function notifySweep() {
  try {
    window.dispatchEvent(new Event(SWEEP_EVENT));
  } catch {
    /* */
  }
}
