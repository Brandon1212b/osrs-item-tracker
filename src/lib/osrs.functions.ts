import { createServerFn } from "@tanstack/react-start";
import { CATALOG } from "./osrs-catalog";
import { craftingMethodItemNames } from "./crafting-methods";
import type { ItemDetail, PriceRow, RangeKey, Trend } from "./osrs.server";

const allNames = () => {
  const fromCatalog = CATALOG.flatMap((g) => g.items.map((i) => i.name));
  return [...new Set([...fromCatalog, ...craftingMethodItemNames()])];
};

export const fetchSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<PriceRow[]> => {
  const { getSnapshot } = await import("./osrs.server");
  return getSnapshot(allNames());
});

export const fetchTrends = createServerFn({ method: "GET" })
  .inputValidator((d: { range?: RangeKey } | undefined) => d ?? {})
  .handler(async ({ data }): Promise<Record<number, Trend>> => {
    const { getTrends } = await import("./osrs.server");
    return getTrends(allNames(), data.range ?? "6m");
  });

export const fetchItemDetail = createServerFn({ method: "GET" })
  .inputValidator((d: { id: number; range: RangeKey }) => d)
  .handler(async ({ data }): Promise<ItemDetail> => {
    const { getItemDetail } = await import("./osrs.server");
    return getItemDetail(allNames(), data.id, data.range);
  });
