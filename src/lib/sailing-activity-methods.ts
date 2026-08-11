/**
 * Sailing activities: Barracuda Trials (XP) + shipwreck salvaging (XP + live GE).
 *
 * Salvage rewards use wiki MMG expected quantities per hour so gp/hr tracks
 * the live GE snapshot (refetch ~2 min). Residual expectedLootGpPerHour covers
 * coins, rare uniques, and thin-volume items without reliable GE names.
 *
 * Sources:
 * https://oldschool.runescape.wiki/w/Shipwreck_salvaging
 * https://oldschool.runescape.wiki/w/Money_making_guide/Salvaging_*_shipwrecks
 * https://oldschool.runescape.wiki/w/Sailing_training
 */
import type { ActivityMethod } from "@/lib/activity-methods";

export const SAILING_ACTIVITY_METHODS: ActivityMethod[] = [
  // ── Barracuda Trials (fastest XP; negligible direct GE loot) ─────────────
  {
    id: "barracuda-tempor-tantrum",
    label: "Barracuda — The Tempor Tantrum",
    skillKey: "sailing",
    level: 30,
    rateBands: [
      { level: 30, xpPerHour: 19_000, expectedLootGpPerHour: 0 },
      { level: 40, xpPerHour: 22_000, expectedLootGpPerHour: 0 },
      { level: 50, xpPerHour: 24_500, expectedLootGpPerHour: 0 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Unlocked at 30. Swordfish → Shark → Marlin ranks. Boat upgrades improve lap times. First completion of each rank gives bonus XP.",
  },
  {
    id: "barracuda-jubbly-jive",
    label: "Barracuda — The Jubbly Jive",
    skillKey: "sailing",
    level: 55,
    rateBands: [
      { level: 55, xpPerHour: 65_000, expectedLootGpPerHour: 0 },
      { level: 65, xpPerHour: 81_000, expectedLootGpPerHour: 0 },
      { level: 70, xpPerHour: 89_000, expectedLootGpPerHour: 0 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes: "Unlocked at 55. Shark/Marlin ranks ~80–90k XP/hr at target times.",
  },
  {
    id: "barracuda-gwenith-glide",
    label: "Barracuda — The Gwenith Glide",
    skillKey: "sailing",
    level: 72,
    rateBands: [
      { level: 72, xpPerHour: 114_000, expectedLootGpPerHour: 0 },
      { level: 85, xpPerHour: 145_000, expectedLootGpPerHour: 0 },
      { level: 93, xpPerHour: 184_000, expectedLootGpPerHour: 0 },
      { level: 99, xpPerHour: 198_000, expectedLootGpPerHour: 0 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Unlocked at 72. Fastest method. Marlin ~184k XP/hr; rosewood hull + crystal extractor can exceed ~200k.",
  },

  // ── Shipwreck salvaging (itemized from wiki MMG qty/hr) ─────────────────
  {
    id: "salvage-small",
    label: "Salvaging — small shipwrecks",
    skillKey: "sailing",
    level: 15,
    rateBands: [{ level: 15, xpPerHour: 2_500, expectedLootGpPerHour: 5_500 }],
    consumables: [],
    rewards: [
      { name: "Plank", expectedQtyPerHour: 8.23 },
      { name: "Oak plank", expectedQtyPerHour: 4.13 },
      { name: "Bronze bar", expectedQtyPerHour: 16.32 },
      { name: "Iron bar", expectedQtyPerHour: 4.02 },
      { name: "Logs", expectedQtyPerHour: 16.22 },
      { name: "Oak logs", expectedQtyPerHour: 8.25 },
      { name: "Bronze nails", expectedQtyPerHour: 47.95 },
      { name: "Iron nails", expectedQtyPerHour: 24.1 },
      { name: "Water rune", expectedQtyPerHour: 44.15 },
      { name: "Air rune", expectedQtyPerHour: 44.08 },
      { name: "Bones", expectedQtyPerHour: 8.06 },
    ],
    intensity: "low",
    notes:
      "Live GE on common salvage. Residual ~5.5k for coins + boat bottle EV. Sort/bank at port.",
  },
  {
    id: "salvage-fisherman",
    label: "Salvaging — fisherman's shipwrecks",
    skillKey: "sailing",
    level: 26,
    rateBands: [{ level: 26, xpPerHour: 5_000, expectedLootGpPerHour: 5_000 }],
    consumables: [],
    rewards: [
      { name: "Fishing bait", expectedQtyPerHour: 835 },
      { name: "Feather", expectedQtyPerHour: 1_464 },
      { name: "Raw swordfish", expectedQtyPerHour: 13.64 },
      { name: "Raw lobster", expectedQtyPerHour: 13.64 },
      { name: "Oak plank", expectedQtyPerHour: 6.78 },
      { name: "Iron bar", expectedQtyPerHour: 6.75 },
      { name: "Oak logs", expectedQtyPerHour: 13.65 },
      { name: "Iron nails", expectedQtyPerHour: 20.38 },
      { name: "Steel nails", expectedQtyPerHour: 10.28 },
      { name: "Plank", expectedQtyPerHour: 3.42 },
    ],
    intensity: "low",
    notes: "Live GE. Residual ~5k for boat bottle / thin drops. 9 Fishing on wiki MMG setup.",
  },
  {
    id: "salvage-barracuda",
    label: "Salvaging — Barracuda shipwrecks",
    skillKey: "sailing",
    level: 35,
    rateBands: [
      { level: 35, xpPerHour: 10_000, expectedLootGpPerHour: 10_000 },
      { level: 45, xpPerHour: 12_000, expectedLootGpPerHour: 10_000 },
    ],
    consumables: [],
    rewards: [
      { name: "Steel cannonball", expectedQtyPerHour: 29.04 },
      { name: "Teak logs", expectedQtyPerHour: 28.95 },
      { name: "Oak logs", expectedQtyPerHour: 38.53 },
      { name: "Oak plank", expectedQtyPerHour: 9.64 },
      { name: "Teak plank", expectedQtyPerHour: 1.96 },
      { name: "Steel nails", expectedQtyPerHour: 58 },
      { name: "Swamp paste", expectedQtyPerHour: 212 },
      { name: "Rope", expectedQtyPerHour: 9.62 },
      { name: "Raw swordfish", expectedQtyPerHour: 3.87 },
      { name: "Raw shark", expectedQtyPerHour: 1.93 },
      { name: "Hemp seed", expectedQtyPerHour: 1.96 },
    ],
    intensity: "low",
    notes:
      "Live GE. Residual ~10k for boat bottle / repair kits / thin drops. Two mithril hooks raise XP.",
  },
  {
    id: "salvage-large",
    label: "Salvaging — large shipwrecks",
    skillKey: "sailing",
    level: 53,
    rateBands: [{ level: 53, xpPerHour: 18_000, expectedLootGpPerHour: 20_000 }],
    consumables: [{ name: "Nature rune", qty: 163 }],
    rewards: [
      { name: "Diamond ring", expectedQtyPerHour: 32.46 },
      { name: "Emerald ring", expectedQtyPerHour: 48.69 },
      { name: "Sapphire ring", expectedQtyPerHour: 48.69 },
      { name: "Oyster pearls", expectedQtyPerHour: 32.46 },
      { name: "Casket", expectedQtyPerHour: 16.23 },
      { name: "Steel nails", expectedQtyPerHour: 97.39 },
      { name: "Mithril cannonball", expectedQtyPerHour: 28.4 },
      { name: "Mithril nails", expectedQtyPerHour: 14.61 },
      { name: "Adamant cannonball", expectedQtyPerHour: 6.49 },
      { name: "Oak plank", expectedQtyPerHour: 8.12 },
      { name: "Hemp seed", expectedQtyPerHour: 4.87 },
      { name: "Cotton seed", expectedQtyPerHour: 2.43 },
    ],
    intensity: "low",
    notes:
      "Live GE on rings/caskets/seeds. Nature runes for HA. Residual ~20k for facility bottle EV + frags. ~10k Magic XP/hr from alchs.",
  },
  {
    id: "salvage-pirate",
    label: "Salvaging — pirate shipwrecks",
    skillKey: "sailing",
    level: 64,
    rateBands: [{ level: 64, xpPerHour: 27_000, expectedLootGpPerHour: 20_000 }],
    consumables: [{ name: "Nature rune", qty: 279 }],
    rewards: [
      { name: "Ruby bracelet", expectedQtyPerHour: 26.06 },
      { name: "Emerald bracelet", expectedQtyPerHour: 34.75 },
      { name: "Diamond bracelet", expectedQtyPerHour: 8.69 },
      { name: "Diamond ring", expectedQtyPerHour: 8.69 },
      { name: "Sapphire ring", expectedQtyPerHour: 34.75 },
      { name: "Emerald ring", expectedQtyPerHour: 17.37 },
      { name: "Gold ring", expectedQtyPerHour: 69.5 },
      { name: "Oyster pearls", expectedQtyPerHour: 34.75 },
      { name: "Mithril scimitar", expectedQtyPerHour: 34.75 },
      { name: "Casket", expectedQtyPerHour: 17.37 },
      { name: "Mithril cannonball", expectedQtyPerHour: 60.81 },
      { name: "Adamant cannonball", expectedQtyPerHour: 30.41 },
      { name: "Rune cannonball", expectedQtyPerHour: 10.42 },
      { name: "Rune scimitar", expectedQtyPerHour: 0.35 },
    ],
    intensity: "low",
    notes:
      "Live GE on jewellery + weapons. Nature runes for HA. Residual ~20k for facility bottle / repair kits.",
  },
  {
    id: "salvage-mercenary",
    label: "Salvaging — mercenary shipwrecks",
    skillKey: "sailing",
    level: 73,
    rateBands: [{ level: 73, xpPerHour: 49_000, expectedLootGpPerHour: 25_000 }],
    consumables: [{ name: "Nature rune", qty: 118 }],
    rewards: [
      { name: "Green d'hide body", expectedQtyPerHour: 12.91 },
      { name: "Amulet of power", expectedQtyPerHour: 25.82 },
      { name: "Adamant 2h sword", expectedQtyPerHour: 12.91 },
      { name: "Adamant longsword", expectedQtyPerHour: 25.82 },
      { name: "Mithril longsword", expectedQtyPerHour: 38.73 },
      { name: "Rune longsword", expectedQtyPerHour: 1.29 },
      { name: "Adamant dart tip", expectedQtyPerHour: 51.64 },
      { name: "Mithril dart tip", expectedQtyPerHour: 116 },
      { name: "Adamant arrowtips", expectedQtyPerHour: 116 },
      { name: "Adamant bolts (unf)", expectedQtyPerHour: 25.82 },
      { name: "Adamant cannonball", expectedQtyPerHour: 45.18 },
      { name: "Rune cannonball", expectedQtyPerHour: 19.36 },
      { name: "Rune arrow", expectedQtyPerHour: 25.82 },
      { name: "Adamantite nails", expectedQtyPerHour: 12.91 },
      { name: "Camphor seed", expectedQtyPerHour: 1.29 },
      { name: "Ironwood seed", expectedQtyPerHour: 0.13 },
    ],
    intensity: "low",
    notes:
      "Live GE on alchables + tips. Nature runes for HA. Residual ~25k for facility bottle / salvor's paint / frags. Often best salvage profit.",
  },
  {
    id: "salvage-fremennik",
    label: "Salvaging — Fremennik shipwrecks",
    skillKey: "sailing",
    level: 80,
    rateBands: [{ level: 80, xpPerHour: 52_000, expectedLootGpPerHour: 25_000 }],
    consumables: [{ name: "Nature rune", qty: 5 }],
    rewards: [
      { name: "Berserker helm", expectedQtyPerHour: 0.93 },
      { name: "Archer helm", expectedQtyPerHour: 0.93 },
      { name: "Farseer helm", expectedQtyPerHour: 0.93 },
      { name: "Warrior helm", expectedQtyPerHour: 0.93 },
      { name: "Fremennik helm", expectedQtyPerHour: 0.93 },
      { name: "Rune cannonball", expectedQtyPerHour: 20.32 },
      { name: "Mahogany plank", expectedQtyPerHour: 5.81 },
      { name: "Rune nails", expectedQtyPerHour: 11.61 },
      { name: "Adamantite nails", expectedQtyPerHour: 23.22 },
      { name: "Astral rune", expectedQtyPerHour: 46.44 },
      { name: "Cotton seed", expectedQtyPerHour: 2.32 },
      { name: "Ironwood seed", expectedQtyPerHour: 0.58 },
      { name: "Rosewood seed", expectedQtyPerHour: 0.12 },
    ],
    intensity: "low",
    notes:
      "Live GE on Fremennik helms + seeds. Residual ~25k for facility bottle / frags. Eternal brazier for icy seas.",
  },
  {
    id: "salvage-merchant",
    label: "Salvaging — merchant shipwrecks",
    skillKey: "sailing",
    level: 87,
    rateBands: [{ level: 87, xpPerHour: 60_000, expectedLootGpPerHour: 85_000 }],
    consumables: [{ name: "Nature rune", qty: 8 }],
    rewards: [
      { name: "Uncut red topaz", expectedQtyPerHour: 19.81 },
      { name: "Uncut jade", expectedQtyPerHour: 19.81 },
      { name: "Uncut opal", expectedQtyPerHour: 19.81 },
      { name: "Uncut sapphire", expectedQtyPerHour: 3.25 },
      { name: "Uncut emerald", expectedQtyPerHour: 1.63 },
      { name: "Uncut ruby", expectedQtyPerHour: 0.81 },
      { name: "Uncut diamond", expectedQtyPerHour: 0.2 },
      { name: "Grimy snapdragon", expectedQtyPerHour: 1.65 },
      { name: "Grimy ranarr weed", expectedQtyPerHour: 1.65 },
      { name: "Grimy avantoe", expectedQtyPerHour: 2.06 },
      { name: "Grimy kwuarm", expectedQtyPerHour: 2.06 },
      { name: "Grimy torstol", expectedQtyPerHour: 1.24 },
      { name: "Grimy cadantine", expectedQtyPerHour: 1.65 },
      { name: "Grimy dwarf weed", expectedQtyPerHour: 1.65 },
      { name: "Grimy lantadyme", expectedQtyPerHour: 1.24 },
      { name: "Snapdragon seed", expectedQtyPerHour: 0.28 },
      { name: "Snape grass seed", expectedQtyPerHour: 0.36 },
      { name: "Toadflax seed", expectedQtyPerHour: 1.31 },
      { name: "Kwuarm seed", expectedQtyPerHour: 0.42 },
      { name: "Cadantine seed", expectedQtyPerHour: 0.19 },
      { name: "Torstol seed", expectedQtyPerHour: 0.055 },
      { name: "Rune cannonball", expectedQtyPerHour: 6.93 },
      { name: "Dragon cannonball", expectedQtyPerHour: 2.31 },
      { name: "Dragon nails", expectedQtyPerHour: 0.28 },
      { name: "Platinum token", expectedQtyPerHour: 39.62 },
      { name: "Shield left half", expectedQtyPerHour: 0.027 },
      { name: "Dragon spear", expectedQtyPerHour: 0.02 },
      { name: "Rune spear", expectedQtyPerHour: 0.054 },
    ],
    intensity: "low",
    notes:
      "Live GE on gems/herbs/seeds/tokens. Residual ~85k for coins + facility bottle + ironwood repair kits + rare dragon cannon barrel EV.",
  },
];

/** GE item names used by sailing activities (for price snapshot). */
export function sailingActivityItemNames(): string[] {
  const names = new Set<string>();
  for (const m of SAILING_ACTIVITY_METHODS) {
    for (const p of m.consumables) names.add(p.name);
    for (const r of m.rewards) names.add(r.name);
  }
  return [...names];
}
