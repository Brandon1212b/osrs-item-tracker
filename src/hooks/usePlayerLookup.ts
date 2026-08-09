import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { fetchPlayerStats, fetchItemRequirements } from "@/lib/osrs.functions";
import { PLAYER_STORAGE_KEY, type PlayerSkills } from "@/lib/player-stats";

/**
 * RSN input state, localStorage persistence, and player/item-req queries.
 * Shared by / and /methods so the cache and stored RSN stay in sync.
 */
export function usePlayerLookup() {
  const [rsnDraft, setRsnDraft] = useState("");
  const [activeRsn, setActiveRsn] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PLAYER_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (activeRsn) setRsnDraft(activeRsn);
  }, [activeRsn]);

  const playerStatsFn = useServerFn(fetchPlayerStats);
  const itemReqsFn = useServerFn(fetchItemRequirements);

  const playerQuery = useQuery({
    queryKey: ["osrs-player", activeRsn],
    queryFn: () => playerStatsFn({ data: { rsn: activeRsn! } }),
    enabled: !!activeRsn,
    staleTime: 10 * 60_000,
    retry: 1,
  });

  const playerSkills: PlayerSkills | null = playerQuery.data?.skills ?? null;

  const itemReqsQuery = useQuery({
    queryKey: ["osrs-item-reqs"],
    queryFn: () => itemReqsFn(),
    enabled: !!playerSkills,
    staleTime: 24 * 60 * 60_000,
  });

  const itemReqs = itemReqsQuery.data ?? {};

  const loadRsn = (rsn: string) => {
    const next = rsn.trim();
    if (!next) return;
    try {
      localStorage.setItem(PLAYER_STORAGE_KEY, next);
    } catch {
      /* private mode */
    }
    setActiveRsn(next);
  };

  const clearRsn = () => {
    try {
      localStorage.removeItem(PLAYER_STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setActiveRsn(null);
    setRsnDraft("");
  };

  return {
    rsnDraft,
    setRsnDraft,
    activeRsn,
    playerQuery,
    playerSkills,
    itemReqs,
    loadRsn,
    clearRsn,
  };
}
