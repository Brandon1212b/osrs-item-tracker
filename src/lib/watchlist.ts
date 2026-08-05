import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Trend } from "@/lib/osrs.server";

export type WatchItem = {
  id: string;
  item_id: number;
  item_name: string;
  target_price: number | null;
  drop_pct: number | null;
  created_at: string;
};

export type Profile = {
  id: string;
  rsn: string | null;
  email: string | null;
  email_alerts: boolean;
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

export function useWatchlist(enabled: boolean) {
  return useQuery({
    queryKey: ["watchlist"],
    enabled,
    queryFn: async (): Promise<WatchItem[]> => {
      const { data, error } = await supabase
        .from("watchlist_items")
        .select("id, item_id, item_name, target_price, drop_pct, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WatchItem[];
    },
  });
}

export function useWatchlistMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["watchlist"] });

  const add = useMutation({
    mutationFn: async (input: { itemId: number; itemName: string; userId: string }) => {
      const { error } = await supabase.from("watchlist_items").insert({
        user_id: input.userId,
        item_id: input.itemId,
        item_name: input.itemName,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("watchlist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (input: { id: string; target_price?: number | null; drop_pct?: number | null }) => {
      const { id, ...patch } = input;
      const { error } = await supabase.from("watchlist_items").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, remove, update };
}

export function useProfile(enabled: boolean) {
  return useQuery({
    queryKey: ["profile"],
    enabled,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, rsn, email, email_alerts")
        .maybeSingle();
      if (error) throw error;
      return (data as Profile | null) ?? null;
    },
  });
}

export function useProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { userId: string; email?: string | null; rsn?: string | null; email_alerts?: boolean }) => {
      const { userId, ...patch } = input;
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...patch }, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
