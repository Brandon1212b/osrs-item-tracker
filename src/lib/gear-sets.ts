/**
 * Wiki gear-set stages under each progression tier.
 * Extra tradeable PvM items are merged at filter time via extraItemsForSet().
 */
import { extraItemsForSet } from "./gear-sets-extra";
import { GEAR_SETS as BASE_GEAR_SETS } from "./gear-sets-data";

export type GearSetDef = {
  key: string;
  label: string;
  tier: "early" | "mid" | "late" | "end";
  combat?: "melee" | "range" | "magic";
  items: readonly string[];
};

export const GEAR_SETS: GearSetDef[] = BASE_GEAR_SETS;

export function gearSetsForTier(
  tier: string,
  combat: string,
): GearSetDef[] {
  if (tier === "all") return [];
  return GEAR_SETS.filter(
    (s) =>
      s.tier === tier &&
      (!s.combat || combat === "all" || s.combat === combat),
  ).map((s) => ({
    ...s,
    items: [...s.items, ...extraItemsForSet(s.key)],
  }));
}

export function gearSetItemNames(setKey: string): Set<string> | null {
  if (!setKey || setKey === "all") return null;
  const def = GEAR_SETS.find((s) => s.key === setKey);
  return def
    ? new Set([...def.items, ...extraItemsForSet(setKey)].map((n) => n.toLowerCase()))
    : null;
}
