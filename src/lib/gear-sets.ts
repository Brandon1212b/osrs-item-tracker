/**
 * Wiki gear-set stages under each progression tier.
 * Labels follow the cost-table headers on:
 * - https://oldschool.runescape.wiki/w/Guide:Melee_Gear_Progression
 * - https://oldschool.runescape.wiki/w/Guide:Ranged_Gear_Progression
 * - https://oldschool.runescape.wiki/w/Guide:Magic_Gear_Progression
 *
 * Shared stage names (20+, Pre-RfD, 75+, …) are grouped into one entry
 * across combat styles. Combat-specific sets keep a `combat` tag.
 * Item-level combat filtering still applies via catalog tags.
 * Only tradeable GE items that exist in CATALOG (exact names).
 *
 * Items that appear in multiple wiki loadouts are listed in each matching set
 * (e.g. Amulet of rancour on 90+, 95+, and endgame stages).
 */
import { extraItemsForSet } from "./gear-sets-extra";

export type GearSetDef = {
  key: string;
  label: string;
  tier: "early" | "mid" | "late" | "end";
  /** When set, only offered while that combat style (or All) is selected. */
  combat?: "melee" | "range" | "magic";
  items: readonly string[];
};

export const GEAR_SETS: GearSetDef[] = [
  // Early through end sets stay in this file; extra PvM items are merged via extraItemsForSet().
  ...([] as GearSetDef[]),
];
