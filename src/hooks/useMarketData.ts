import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchSnapshot, fetchTrends } from "@/lib/osrs.functions";
import type { RangeKey } from "@/lib/osrs.server";

/** Shared GE snapshot + range trends. Query keys are stable so / and /methods share the cache. */
export function useMarketData(range: RangeKey = "6m") {
  const snapshotFn = useServerFn(fetchSnapshot);
  const trendsFn = useServerFn(fetchTrends);

  const snapshot = useQuery({
    queryKey: ["osrs-snapshot"],
    queryFn: () => snapshotFn(),
    refetchInterval: 120_000,
  });

  const trends = useQuery({
    queryKey: ["osrs-trends", range],
    queryFn: () => trendsFn({ data: { range } }),
    staleTime: range === "1d" || range === "1w" ? 5 * 60_000 : 30 * 60_000,
  });

  return { snapshot, trends };
}
