import { createServerFn } from "@tanstack/react-start";
import { CATALOG } from "./osrs-catalog";
import type { PriceRow, Trend } from "./osrs.server";

const allNames = () => CATALOG.flatMap((g) => g.items);

export const fetchSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<PriceRow[]> => {
  const { getSnapshot } = await import("./osrs.server");
  return getSnapshot(allNames());
});

export const fetchTrends = createServerFn({ method: "GET" }).handler(async (): Promise<Record<number, Trend>> => {
  const { getTrends } = await import("./osrs.server");
  return getTrends(allNames());
});
