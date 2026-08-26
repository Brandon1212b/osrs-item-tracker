/**
 * Every method that appears on /methods, grouped by skill.
 * Keep in sync with METHOD_SKILLS + each *Methods panel.
 */
import type { ActivityMethod } from "@/lib/activity-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { SkillingMethod } from "@/components/skilling-types";
import { AGILITY_METHODS } from "@/lib/agility-methods";
import { CONSTRUCTION_METHODS } from "@/lib/construction-methods";
import { COOKING_METHODS } from "@/lib/cooking-methods";
import { CRAFTING_METHODS } from "@/lib/crafting-methods";
import { FARMING_METHODS } from "@/lib/farming-methods";
import { FIREMAKING_METHODS } from "@/lib/firemaking-methods";
import { FISHING_METHODS } from "@/lib/fishing-methods";
import { FLETCHING_METHODS } from "@/lib/fletching-methods";
import { HERBLORE_METHODS } from "@/lib/herblore-methods";
import { HUNTER_METHODS } from "@/lib/hunter-methods";
import { MAGIC_METHODS } from "@/lib/magic-methods";
import { MINING_METHODS } from "@/lib/mining-methods";
import { MIXOLOGY_METHODS } from "@/lib/mixology-methods";
import { PRAYER_METHODS } from "@/lib/prayer-methods";
import { RUNECRAFT_METHODS } from "@/lib/runecraft-methods";
import { SAILING_METHODS } from "@/lib/sailing-methods";
import { SAILING_ACTIVITY_METHODS } from "@/lib/sailing-activity-methods";
import { SMITHING_METHODS } from "@/lib/smithing-methods";
import { THIEVING_METHODS } from "@/lib/thieving-methods";
import { WOODCUTTING_METHODS } from "@/lib/woodcutting-methods";

export type CatalogSkill = {
  key: string;
  label: string;
  wikiIcon: string;
  methods: SkillingMethod[];
  activities: ActivityMethod[];
};

const asMethods = (rows: readonly object[]) => rows as unknown as SkillingMethod[];

export const CATALOG_SKILLS: CatalogSkill[] = [
  { key: "herblore", label: "Herblore", wikiIcon: "Herblore_icon.png", methods: asMethods(HERBLORE_METHODS), activities: MIXOLOGY_METHODS },
  { key: "construction", label: "Construction", wikiIcon: "Construction_icon.png", methods: asMethods(CONSTRUCTION_METHODS), activities: activitiesForSkill("construction") },
  { key: "prayer", label: "Prayer", wikiIcon: "Prayer_icon.png", methods: asMethods(PRAYER_METHODS), activities: [] },
  { key: "crafting", label: "Crafting", wikiIcon: "Crafting_icon.png", methods: asMethods(CRAFTING_METHODS), activities: [] },
  { key: "smithing", label: "Smithing", wikiIcon: "Smithing_icon.png", methods: asMethods(SMITHING_METHODS), activities: activitiesForSkill("smithing") },
  { key: "magic", label: "Magic", wikiIcon: "Magic_icon.png", methods: asMethods(MAGIC_METHODS), activities: activitiesForSkill("magic") },
  { key: "runecraft", label: "Runecraft", wikiIcon: "Runecraft_icon.png", methods: asMethods(RUNECRAFT_METHODS), activities: activitiesForSkill("runecraft") },
  { key: "farming", label: "Farming", wikiIcon: "Farming_icon.png", methods: asMethods(FARMING_METHODS), activities: activitiesForSkill("farming") },
  { key: "fletching", label: "Fletching", wikiIcon: "Fletching_icon.png", methods: asMethods(FLETCHING_METHODS), activities: [] },
  { key: "cooking", label: "Cooking", wikiIcon: "Cooking_icon.png", methods: asMethods(COOKING_METHODS), activities: [] },
  { key: "agility", label: "Agility", wikiIcon: "Agility_icon.png", methods: asMethods(AGILITY_METHODS), activities: activitiesForSkill("agility") },
  { key: "mining", label: "Mining", wikiIcon: "Mining_icon.png", methods: asMethods(MINING_METHODS), activities: activitiesForSkill("mining") },
  { key: "fishing", label: "Fishing", wikiIcon: "Fishing_icon.png", methods: asMethods(FISHING_METHODS), activities: activitiesForSkill("fishing") },
  { key: "woodcutting", label: "Woodcutting", wikiIcon: "Woodcutting_icon.png", methods: asMethods(WOODCUTTING_METHODS), activities: activitiesForSkill("woodcutting") },
  { key: "firemaking", label: "Firemaking", wikiIcon: "Firemaking_icon.png", methods: asMethods(FIREMAKING_METHODS), activities: activitiesForSkill("firemaking") },
  { key: "thieving", label: "Thieving", wikiIcon: "Thieving_icon.png", methods: asMethods(THIEVING_METHODS), activities: activitiesForSkill("thieving") },
  { key: "hunter", label: "Hunter", wikiIcon: "Hunter_icon.png", methods: asMethods(HUNTER_METHODS), activities: activitiesForSkill("hunter") },
  { key: "sailing", label: "Sailing", wikiIcon: "Sailing_icon.png", methods: asMethods(SAILING_METHODS), activities: SAILING_ACTIVITY_METHODS },
];
