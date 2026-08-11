/**
 * Sailing activities: Barracuda Trials (XP) + shipwreck salvaging (XP + GP).
 *
 * Salvage GP/hr from wiki money-making guides (after tax, cached GE):
 * https://oldschool.runescape.wiki/w/Shipwreck_salvaging
 * Individual MMGs under Money making guide/Salvaging_*_shipwrecks
 *
 * Barracuda XP/hr from wiki target-time bands:
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

  // ── Shipwreck salvaging (wiki MMG hourly profit after tax) ───────────────
  // GP from https://oldschool.runescape.wiki/w/Shipwreck_salvaging table.
  // XP rates from individual MMG pages + training guide (active player on 1 hook).
  {
    id: "salvage-small",
    label: "Salvaging — small shipwrecks",
    skillKey: "sailing",
    level: 15,
    rateBands: [{ level: 15, xpPerHour: 2_500, expectedLootGpPerHour: 22_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Wiki MMG ~22k gp/hr after tax. Low XP. Sort/bank salvage at port. Boat bottle unique.",
  },
  {
    id: "salvage-fisherman",
    label: "Salvaging — fisherman's shipwrecks",
    skillKey: "sailing",
    level: 26,
    rateBands: [{ level: 26, xpPerHour: 5_000, expectedLootGpPerHour: 23_500 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes: "Wiki MMG ~23.5k gp/hr. Requires 9 Fishing for best rates setup on MMG.",
  },
  {
    id: "salvage-barracuda",
    label: "Salvaging — Barracuda shipwrecks",
    skillKey: "sailing",
    level: 35,
    rateBands: [
      { level: 35, xpPerHour: 12_000, expectedLootGpPerHour: 50_000 },
      { level: 45, xpPerHour: 16_000, expectedLootGpPerHour: 53_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes: "Wiki MMG ~50–53k gp/hr. Two mithril hooks push XP toward ~16–18k/hr.",
  },
  {
    id: "salvage-large",
    label: "Salvaging — large shipwrecks",
    skillKey: "sailing",
    level: 53,
    rateBands: [{ level: 53, xpPerHour: 18_000, expectedLootGpPerHour: 177_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Wiki MMG ~177k gp/hr after tax (alchs + rings/caskets). Sailing station on boat recommended. Also ~10k Magic XP/hr from HA.",
  },
  {
    id: "salvage-pirate",
    label: "Salvaging — pirate shipwrecks",
    skillKey: "sailing",
    level: 64,
    rateBands: [{ level: 64, xpPerHour: 30_000, expectedLootGpPerHour: 219_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes: "Wiki MMG ~219k gp/hr. Plundered salvage; rusty coin unique.",
  },
  {
    id: "salvage-mercenary",
    label: "Salvaging — mercenary shipwrecks",
    skillKey: "sailing",
    level: 73,
    rateBands: [{ level: 73, xpPerHour: 45_000, expectedLootGpPerHour: 346_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Wiki MMG ~346k gp/hr (highest stable salvage profit on the hub table). Martial salvage; salvor's paint rare.",
  },
  {
    id: "salvage-fremennik",
    label: "Salvaging — Fremennik shipwrecks",
    skillKey: "sailing",
    level: 80,
    rateBands: [{ level: 80, xpPerHour: 55_000, expectedLootGpPerHour: 241_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes: "Wiki MMG ~241k gp/hr. Northern icy seas; eternal brazier helps reach wrecks.",
  },
  {
    id: "salvage-merchant",
    label: "Salvaging — merchant shipwrecks",
    skillKey: "sailing",
    level: 87,
    rateBands: [{ level: 87, xpPerHour: 70_000, expectedLootGpPerHour: 245_000 }],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Wiki MMG ~245k gp/hr on hub table (individual guide can spike higher with bolt tips / seeds). Opulent salvage; dragon cannon barrel rare.",
  },
];
