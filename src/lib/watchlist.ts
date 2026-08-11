import { useCallback, useEffect, useState } from "react";
import type { Trend } from "@/lib/osrs.server";

const STORAGE_KEY = "ge-watch-watchlist";
const CHANGE_EVENT = "ge-watch-watchlist";

export type WatchItem = {
  id: string;
  item_id: number;
  item_name: string;
  target_price: number | null;
  drop_pct: number | null;
  created_at: string;
};

/** Percent vs the range high — negative means cheaper than the peak. */
export function pctFromHigh(price: number | null | undefined, trend?: Trend): number | null {
  if (price == null || !trend?.high180 || trend.high180 <= 0) return null;
  return Math.round(((price - trend.high180) / trend.high180) * 1000) / 10;
}

/** True when the item's live price satisfies any configured trigger. */
export function isTriggered(
  item: Pick<WatchItem, "target_price" | "drop_pct">,
  price: number | null | undefined,
  trend?: Trend,
): boolean {
  if (price == null) return false;
  if (item.target_price != null && price <= item.target_price) return true;
  if (item.drop_pct != null) {
    const pct = pctFromHigh(price, trend);
    if (pct != null && pct <= -item.drop_pct) return true;
  }
  return false;
}

function readList(): WatchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(items: WatchItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* private mode / quota */
  }
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `w-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Live watchlist from localStorage (this browser only). */
export function useWatchlist(_enabled = true) {
  const [data, setData] = useState<WatchItem[]>([]);

  useEffect(() => {
    const refresh = () => setData(readList());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, []);

  return { data, isLoading: false, isError: false, error: null as Error | null };
}

export function useWatchlistMutations() {
  const [pending, setPending] = useState(false);

  const add = {
    isPending: pending,
    mutate: (
      input: { itemId: number; itemName: string; userId?: string },
      opts?: { onSuccess?: () => void; onError?: (e: Error) => void },
    ) => {
      setPending(true);
      try {
        const list = readList();
        if (list.some((w) => w.item_id === input.itemId)) {
          opts?.onSuccess?.();
          return;
        }
        const next: WatchItem = {
          id: makeId(),
          item_id: input.itemId,
          item_name: input.itemName,
          target_price: null,
          drop_pct: null,
          created_at: new Date().toISOString(),
        };
        writeList([next, ...list]);
        opts?.onSuccess?.();
      } catch (e) {
        opts?.onError?.(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setPending(false);
      }
    },
  };

  /** Add multiple GE items at once (skips duplicates). Returns count of newly added. */
  const addMany = {
    isPending: pending,
    mutate: (
      inputs: { itemId: number; itemName: string }[],
      opts?: { onSuccess?: (added: number) => void; onError?: (e: Error) => void },
    ) => {
      setPending(true);
      try {
        const list = readList();
        const existing = new Set(list.map((w) => w.item_id));
        const fresh: WatchItem[] = [];
        for (const input of inputs) {
          if (existing.has(input.itemId)) continue;
          existing.add(input.itemId);
          fresh.push({
            id: makeId(),
            item_id: input.itemId,
            item_name: input.itemName,
            target_price: null,
            drop_pct: null,
            created_at: new Date().toISOString(),
          });
        }
        if (fresh.length > 0) writeList([...fresh, ...list]);
        opts?.onSuccess?.(fresh.length);
      } catch (e) {
        opts?.onError?.(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setPending(false);
      }
    },
  };

  const remove = {
    isPending: pending,
    mutate: (id: string, opts?: { onSuccess?: () => void; onError?: (e: Error) => void }) => {
      setPending(true);
      try {
        writeList(readList().filter((w) => w.id !== id));
        opts?.onSuccess?.();
      } catch (e) {
        opts?.onError?.(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setPending(false);
      }
    },
  };

  const update = {
    isPending: pending,
    mutate: (
      input: { id: string; target_price?: number | null; drop_pct?: number | null },
      opts?: { onSuccess?: () => void; onError?: (e: Error) => void },
    ) => {
      setPending(true);
      try {
        const list = readList().map((w) =>
          w.id === input.id
            ? {
                ...w,
                target_price: input.target_price !== undefined ? input.target_price : w.target_price,
                drop_pct: input.drop_pct !== undefined ? input.drop_pct : w.drop_pct,
              }
            : w,
        );
        writeList(list);
        opts?.onSuccess?.();
      } catch (e) {
        opts?.onError?.(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setPending(false);
      }
    },
  };

  return { add, addMany, remove, update };
}

/** Local RSN only (same key the rest of the app already uses). */
export function useLocalRsn() {
  const [rsn, setRsnState] = useState("");

  useEffect(() => {
    try {
      setRsnState(localStorage.getItem("ge-watch-player-rsn") ?? "");
    } catch {
      /* private mode */
    }
  }, []);

  const setRsn = useCallback((value: string) => {
    const next = value.trim();
    setRsnState(next);
    try {
      if (next) localStorage.setItem("ge-watch-player-rsn", next);
      else localStorage.removeItem("ge-watch-player-rsn");
    } catch {
      /* private mode */
    }
  }, []);

  return { rsn, setRsn };
}
