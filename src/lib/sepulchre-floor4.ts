import type { ActivityMethod } from "@/lib/activity-methods";

/**
 * https://oldschool.runescape.wiki/w/Money_making_guide/Hallowed_Sepulchre_(Floor_4)
 *
 * Wiki template: isperkill=y, kph=12, loot Floor 3 + Floor 4 coffins.
 */
const RUNS_PER_HOUR = 12;
const F3_COFFINS = 2;
const F4_COFFINS = 2;
const F5_COFFINS = 0;
const LOW_COFFINS = F3_COFFINS * 0.15; // 0.3 / run
const MED_COFFINS = F3_COFFINS * 0.65 + F4_COFFINS * 0.6 + F5_COFFINS * 0.2; // 2.5 / run
const HIGH_COFFINS = F3_COFFINS * 0.2 + F4_COFFINS * 0.4 + F5_COFFINS * 0.8; // 1.2 / run

function perHourFromRun(qtyPerRun: number): number {
  return qtyPerRun * RUNS_PER_HOUR;
}

export const SEPULCHRE_FLOOR_4: ActivityMethod = {
  id: "sepulchre-floor-4",
  label: "Hallowed Sepulchre (Floor 4)",
  skillKey: "agility",
  secondarySkill: "thieving",
  level: 82,
  rateBands: [
    {
      level: 82,
      xpPerHour: 6_080 * RUNS_PER_HOUR, // 72,960
      secondaryXpPerHour: 800 * RUNS_PER_HOUR, // 9,600 Thieving
      // 204 hallowed marks/hr valued as sack EV (untradeable).
      expectedLootGpPerHour: 189_888,
    },
  ],
  consumables: [
    { name: "Mahogany plank", qty: 1 * RUNS_PER_HOUR },
    { name: "Rune nails", qty: 2.5 * RUNS_PER_HOUR },
    { name: "Vampyre dust", qty: 1 * RUNS_PER_HOUR },
    { name: "Cosmic rune", qty: 1 * RUNS_PER_HOUR },
  ],
  rewards: [
    {
      name: "Strange old lockpick (full)",
      expectedQtyPerHour: perHourFromRun(F4_COFFINS / 60 + F3_COFFINS / 90),
    },
    { name: "Monk's robe top", expectedQtyPerHour: perHourFromRun(LOW_COFFINS * 0.1) },
    { name: "Monk's robe", expectedQtyPerHour: perHourFromRun(LOW_COFFINS * 0.1) },
    { name: "Holy symbol", expectedQtyPerHour: perHourFromRun(LOW_COFFINS * 0.1) },
    {
      name: "Air rune",
      expectedQtyPerHour: perHourFromRun(LOW_COFFINS * ((500 + 750) / 2) * 0.1),
    },
    {
      name: "Fire rune",
      expectedQtyPerHour: perHourFromRun(LOW_COFFINS * ((500 + 750) / 2) * 0.1),
    },
    {
      name: "Chaos rune",
      expectedQtyPerHour: perHourFromRun(LOW_COFFINS * ((25 + 50) / 2) * 0.1),
    },
    {
      name: "Mithril bolts",
      expectedQtyPerHour: perHourFromRun(LOW_COFFINS * ((50 + 200) / 2) * 0.1),
    },
    { name: "Prayer potion(2)", expectedQtyPerHour: perHourFromRun(LOW_COFFINS * 0.1) },
    { name: "Adamant 2h sword", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    { name: "Adamant platebody", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    {
      name: "Cosmic rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Death rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Nature rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Adamant bolts",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((50 + 200) / 2) * 0.1),
    },
    {
      name: "Monkfish",
      expectedQtyPerHour: perHourFromRun(
        MED_COFFINS * ((1 + 3) / 2) * 0.1 + HIGH_COFFINS * ((2 + 6) / 2) * 0.1,
      ),
    },
    { name: "Prayer potion(4)", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    {
      name: "Grimy ranarr weed",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((1 + 2) / 2) * 0.1),
    },
    {
      name: "Coins",
      expectedQtyPerHour: perHourFromRun(
        MED_COFFINS * ((7_500 + 12_500) / 2) * 0.1 +
          HIGH_COFFINS * ((17_500 + 25_000) / 2) * 0.1 +
          LOW_COFFINS * ((1_500 + 3_000) / 2) * 0.1,
      ),
    },
    { name: "Rune 2h sword", expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * 0.1) },
    { name: "Rune platebody", expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * 0.1) },
    {
      name: "Law rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Blood rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Soul rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Runite bolts",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((100 + 300) / 2) * 0.1),
    },
    {
      name: "Sanfew serum(4)",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((1 + 2) / 2) * 0.1),
    },
    {
      name: "Ranarr seed",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((1 + 2) / 2) * 0.1),
    },
  ],
  intensity: "high",
  notes:
    "Wiki MMG Floor 4, 12 runs/hr, F3+F4 coffins. Live GE on coffin loot minus planks/nails/dust/cosmics. 204 hallowed marks/hr valued as sack EV. Also ~3,600 Prayer / 2,400 Magic / 4,200 Construction XP/hr.",
};

export function sepulchreFloor4ItemNames(): string[] {
  const names = new Set<string>();
  for (const p of SEPULCHRE_FLOOR_4.consumables) names.add(p.name);
  for (const r of SEPULCHRE_FLOOR_4.rewards) names.add(r.name);
  return [...names];
}
