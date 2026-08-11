/**
 * Sailing Barracuda Trials — highest XP/hr training (active).
 * XP/hr from wiki target-time bands (Swordfish / Shark / Marlin ranks).
 * https://oldschool.runescape.wiki/w/Sailing_training
 * https://oldschool.runescape.wiki/w/Barracuda_Trials
 */
import type { ActivityMethod } from "@/lib/activity-methods";

export const SAILING_ACTIVITY_METHODS: ActivityMethod[] = [
  {
    id: "barracuda-tempor-tantrum",
    label: "Barracuda — The Tempor Tantrum",
    skillKey: "sailing",
    level: 30,
    rateBands: [
      // Wiki XP/hr at target times (Swordfish / Shark / Marlin)
      { level: 30, xpPerHour: 19_000, expectedLootGpPerHour: 0 },
      { level: 40, xpPerHour: 22_000, expectedLootGpPerHour: 0 },
      { level: 50, xpPerHour: 24_500, expectedLootGpPerHour: 0 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Unlocked at 30. Three ranks (Swordfish → Shark → Marlin). Boat upgrades improve lap times. First completion of each rank gives bonus XP.",
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
    notes: "Unlocked at 55. Shark/Marlin ranks push ~80–90k XP/hr at target times.",
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
      { level: 99, xpPerHour: 198_000, expectedLootGpPerHour: 0 }, // crystal extractor + hull upgrades
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Unlocked at 72. Fastest method. Marlin ~184k XP/hr; rosewood hull + crystal extractor can exceed ~200k. Highest intensity.",
  },
];
