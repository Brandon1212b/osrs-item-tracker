import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { Trend } from "@/lib/osrs.server";

const STORAGE_KEY = "ge-watch-watchlist";

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
    window.dispatchEvent(new Event("ge-watch-watchlist"));
  } catch {
    /* private mode / quota */
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("ge-watch-watchlist", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("ge-watch-watchlist", handler);
  };
}

function getSnapshot(): WatchItem[] {
  return readList();
}

function getServerSnapshot(): WatchItem[] {
  return [];
}

/** Live watchlist from localStorage (this browser only). */
export function useWatchlist(_enabled = true) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
          id: crypto.randomUUID(),
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

  return { add, remove, update };
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
