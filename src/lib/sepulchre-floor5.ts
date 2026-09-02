import type { ActivityMethod } from "@/lib/activity-methods";

function perHour(runs: number, qtyPerRun: number): number {
  return qtyPerRun * runs;
}

/**
 * https://oldschool.runescape.wiki/w/Money_making_guide/Hallowed_Sepulchre_(Floor_5)
 * isperkill=y, kph=7, F4+F5 coffins + grand coffin (2 extra high rolls).
 */
const F5_RUNS = 7;
const F5_F4 = 2;
const F5_F5 = 3;
const F5_MED = F5_F4 * 0.6 + F5_F5 * 0.2;
const F5_HIGH = F5_F4 * 0.4 + F5_F5 * 0.8 + 2;

export const SEPULCHRE_FLOOR_5: ActivityMethod = {
  id: "sepulchre-floor-5-loot",
  label: "Hallowed Sepulchre (Floor 5)",
  skillKey: "agility",
  secondarySkill: "thieving",
  level: 92,
  rateBands: [
    {
      level: 92,
      xpPerHour: 12_580 * F5_RUNS,
      secondaryXpPerHour: 1_200 * F5_RUNS,
      expectedLootGpPerHour: 194_813,
    },
  ],
  consumables: [
    { name: "Mahogany plank", qty: 3 * F5_RUNS },
    { name: "Rune nails", qty: 7.5 * F5_RUNS },
    { name: "Vampyre dust", qty: 1 * F5_RUNS },
  ],
  rewards: [
    { name: "Ring of endurance (uncharged)", expectedQtyPerHour: perHour(F5_RUNS, 1 / 200) },
    {
      name: "Strange old lockpick (full)",
      expectedQtyPerHour: perHour(F5_RUNS, F5_F4 / 60 + F5_F5 / 40),
    },
    { name: "Adamant 2h sword", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 0.1) },
    { name: "Adamant platebody", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 0.1) },
    { name: "Cosmic rune", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 80 * 0.1) },
    { name: "Death rune", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 80 * 0.1) },
    { name: "Nature rune", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 80 * 0.1) },
    { name: "Adamant bolts", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 125 * 0.1) },
    {
      name: "Monkfish",
      expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 2 * 0.1 + F5_HIGH * 4 * 0.1),
    },
    { name: "Prayer potion(4)", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 0.1) },
    { name: "Grimy ranarr weed", expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 1.5 * 0.1) },
    {
      name: "Coins",
      expectedQtyPerHour: perHour(F5_RUNS, F5_MED * 10_000 * 0.1 + F5_HIGH * 21_250 * 0.1),
    },
    { name: "Rune 2h sword", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 0.1) },
    { name: "Rune platebody", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 0.1) },
    { name: "Law rune", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 200 * 0.1) },
    { name: "Blood rune", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 200 * 0.1) },
    { name: "Soul rune", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 200 * 0.1) },
    { name: "Runite bolts", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 200 * 0.1) },
    { name: "Sanfew serum(4)", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 1.5 * 0.1) },
    { name: "Ranarr seed", expectedQtyPerHour: perHour(F5_RUNS, F5_HIGH * 1.5 * 0.1) },
  ],
  intensity: "high",
  notes:
    "Wiki MMG Floor 5, 7 runs/hr. Live GE on coffin loot minus supplies. 231 marks/hr as sack EV. Also Prayer/Magic/Construction XP.",
};

/**
 * https://oldschool.runescape.wiki/w/Money_making_guide/Hallowed_Sepulchre_(Floor_4)
 * isperkill=y, kph=12, looting F3+F4 coffins (no floor 5).
 */
const F4_RUNS = 12;
const F4_F3 = 2;
const F4_F4 = 2;
const F4_LOW = F4_F3 * 0.15;
const F4_MED = F4_F3 * 0.65 + F4_F4 * 0.6;
const F4_HIGH = F4_F3 * 0.2 + F4_F4 * 0.4;

export const SEPULCHRE_FLOOR_4: ActivityMethod = {
  id: "sepulchre-floor-4",
  label: "Hallowed Sepulchre (Floor 4)",
  skillKey: "agility",
  secondarySkill: "thieving",
  level: 77,
  rateBands: [
    {
      level: 77,
      xpPerHour: 6_080 * F4_RUNS,
      secondaryXpPerHour: 800 * F4_RUNS,
      expectedLootGpPerHour: 189_888,
    },
  ],
  consumables: [
    { name: "Mahogany plank", qty: 1 * F4_RUNS },
    { name: "Rune nails", qty: 2.5 * F4_RUNS },
    { name: "Vampyre dust", qty: 1 * F4_RUNS },
    { name: "Cosmic rune", qty: 1 * F4_RUNS },
  ],
  rewards: [
    {
      name: "Strange old lockpick (full)",
      expectedQtyPerHour: perHour(F4_RUNS, F4_F4 / 60 + F4_F3 / 90),
    },
    { name: "Monk's robe top", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 0.1) },
    { name: "Monk's robe", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 0.1) },
    { name: "Holy symbol", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 0.1) },
    { name: "Air rune", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 625 * 0.1) },
    { name: "Fire rune", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 625 * 0.1) },
    { name: "Chaos rune", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 37.5 * 0.1) },
    { name: "Mithril bolts", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 125 * 0.1) },
    { name: "Prayer potion(2)", expectedQtyPerHour: perHour(F4_RUNS, F4_LOW * 0.1) },
    { name: "Adamant 2h sword", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 0.1) },
    { name: "Adamant platebody", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 0.1) },
    { name: "Cosmic rune", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 80 * 0.1) },
    { name: "Death rune", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 80 * 0.1) },
    { name: "Nature rune", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 80 * 0.1) },
    { name: "Adamant bolts", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 125 * 0.1) },
    {
      name: "Monkfish",
      expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 2 * 0.1 + F4_HIGH * 4 * 0.1),
    },
    { name: "Prayer potion(4)", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 0.1) },
    { name: "Grimy ranarr weed", expectedQtyPerHour: perHour(F4_RUNS, F4_MED * 1.5 * 0.1) },
    {
      name: "Coins",
      expectedQtyPerHour: perHour(
        F4_RUNS,
        F4_LOW * 2_250 * 0.1 + F4_MED * 10_000 * 0.1 + F4_HIGH * 21_250 * 0.1,
      ),
    },
    { name: "Rune 2h sword", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 0.1) },
    { name: "Rune platebody", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 0.1) },
    { name: "Law rune", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 200 * 0.1) },
    { name: "Blood rune", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 200 * 0.1) },
    { name: "Soul rune", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 200 * 0.1) },
    { name: "Runite bolts", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 200 * 0.1) },
    { name: "Sanfew serum(4)", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 1.5 * 0.1) },
    { name: "Ranarr seed", expectedQtyPerHour: perHour(F4_RUNS, F4_HIGH * 1.5 * 0.1) },
  ],
  intensity: "high",
  notes:
    "Wiki MMG Floor 4, 12 runs/hr, F3+F4 coffins. Live GE on coffin loot minus supplies. 204 marks/hr as sack EV.",
};

export function sepulchreFloor5ItemNames(): string[] {
  const names = new Set<string>();
  for (const method of [SEPULCHRE_FLOOR_5, SEPULCHRE_FLOOR_4]) {
    for (const p of method.consumables) names.add(p.name);
    for (const r of method.rewards) names.add(r.name);
  }
  return [...names];
}
