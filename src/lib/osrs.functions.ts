import { createServerFn } from "@tanstack/react-start";
import { CATALOG } from "./osrs-catalog";
import type { ItemDetail, PriceRow, RangeKey, Trend } from "./osrs.server";

const allNames = () => CATALOG.flatMap((g) => g.items.map((i) => i.name));

export const fetchSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<PriceRow[]> => {
  const { getSnapshot } = await import("./osrs.server");
  return getSnapshot(allNames());
});

export const fetchTrends = createServerFn({ method: "GET" }).handler(async (): Promise<Record<number, Trend>> => {
  const { getTrends } = await import("./osrs.server");
  return getTrends(allNames());
});

export const fetchItemDetail = createServerFn({ method: "GET" })
  .inputValidator((d: { id: number; range: RangeKey }) => d)
  .handler(async ({ data }): Promise<ItemDetail> => {
    const { getItemDetail } = await import("./osrs.server");
    return getItemDetail(allNames(), data.id, data.range);
  });
