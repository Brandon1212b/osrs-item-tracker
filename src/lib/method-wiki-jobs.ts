import { methodLinkTrio } from "@/lib/method-links";
import { CRAFTING_METHODS } from "@/lib/crafting-methods";
import { CONSTRUCTION_METHODS } from "@/lib/construction-methods";
import { PRAYER_METHODS } from "@/lib/prayer-methods";
import { SMITHING_METHODS } from "@/lib/smithing-methods";
import { MAGIC_METHODS } from "@/lib/magic-methods";
import { RUNECRAFT_METHODS } from "@/lib/runecraft-methods";
import { FARMING_METHODS } from "@/lib/farming-methods";
import { FLETCHING_METHODS } from "@/lib/fletching-methods";
import { COOKING_METHODS } from "@/lib/cooking-methods";
import { AGILITY_METHODS } from "@/lib/agility-methods";
import { HERBLORE_METHODS } from "@/lib/herblore-methods";
import { MINING_METHODS } from "@/lib/mining-methods";
import { FISHING_METHODS } from "@/lib/fishing-methods";
import { WOODCUTTING_METHODS } from "@/lib/woodcutting-methods";
import { FIREMAKING_METHODS } from "@/lib/firemaking-methods";
import { THIEVING_METHODS } from "@/lib/thieving-methods";
import { HUNTER_METHODS } from "@/lib/hunter-methods";
import { SAILING_METHODS } from "@/lib/sailing-methods";
import { MIXOLOGY_METHODS } from "@/lib/mixology-methods";
import { FISHING_RATE_TABLES } from "@/lib/fishing-activities";
import { WOODCUTTING_RATE_TABLES } from "@/lib/woodcutting-activities";
import { MINING_RATE_TABLES } from "@/lib/mining-activities";
import { HUNTER_RATE_TABLES } from "@/lib/hunter-activities";
import { THIEVING_RATE_TABLES } from "@/lib/thieving-activities";
import { SAILING_ACTIVITY_METHODS } from "@/lib/sailing-activity-methods";
import { SEPULCHRE_FLOOR_5 } from "@/lib/sepulchre-floor5";
import { activitiesForSkill, type ActivityMethod } from "@/lib/activity-methods";
import {
  TITHE_FARM_METHODS,
  FARMING_CONTRACT_METHODS,
  HESPORI_METHODS,
  FORESTRY_METHODS,
  HUNTER_RUMOUR_METHODS,
  IMPLING_METHODS,
  DEEP_SEA_TRAWL_METHODS,
  WILDERNESS_AGILITY_ACTIVITY,
  SEPULCHRE_ACTIVITY,
  BRIMHAVEN_AGILITY_ACTIVITY,
  AGILITY_PYRAMID_ACTIVITY,
} from "@/lib/wiki-audit-activities";
import type { WikiSlotKey } from "@/lib/wiki-page-rates";

export type MethodWikiJob = {
  methodId: string;
  skillKey: string;
  siteXp: number;
  pages: { slot: WikiSlotKey; href: string }[];
};

type RecipeLike = { id: string; xp: number; actionsPerHour: number };

const RECIPE_GROUPS: { skillKey: string; methods: RecipeLike[] }[] = [
  { skillKey: "crafting", methods: CRAFTING_METHODS },
  { skillKey: "construction", methods: CONSTRUCTION_METHODS },
  { skillKey: "prayer", methods: PRAYER_METHODS },
  { skillKey: "smithing", methods: SMITHING_METHODS },
  { skillKey: "magic", methods: MAGIC_METHODS },
  { skillKey: "runecraft", methods: RUNECRAFT_METHODS },
  { skillKey: "farming", methods: FARMING_METHODS },
  { skillKey: "fletching", methods: FLETCHING_METHODS },
  { skillKey: "cooking", methods: COOKING_METHODS },
  { skillKey: "agility", methods: AGILITY_METHODS },
  { skillKey: "herblore", methods: HERBLORE_METHODS },
  { skillKey: "mining", methods: MINING_METHODS },
  { skillKey: "fishing", methods: FISHING_METHODS },
  { skillKey: "woodcutting", methods: WOODCUTTING_METHODS },
  { skillKey: "firemaking", methods: FIREMAKING_METHODS },
  { skillKey: "thieving", methods: THIEVING_METHODS },
  { skillKey: "hunter", methods: HUNTER_METHODS },
  { skillKey: "sailing", methods: SAILING_METHODS },
];

const SKILLS = RECIPE_GROUPS.map((g) => g.skillKey);

function activityXp(a: ActivityMethod): number {
  const last = a.rateBands[a.rateBands.length - 1];
  return last?.xpPerHour ?? 0;
}

function jobFrom(methodId: string, skillKey: string, siteXp: number): MethodWikiJob {
  const links = methodLinkTrio(methodId, skillKey);
  const pages = (
    [
      links.mmg ? { slot: "mmg" as const, href: links.mmg.href } : null,
      links.skillGuide ? { slot: "skillGuide" as const, href: links.skillGuide.href } : null,
      links.wiki ? { slot: "wiki" as const, href: links.wiki.href } : null,
    ].filter(Boolean) as { slot: WikiSlotKey; href: string }[]
  );
  return { methodId, skillKey, siteXp, pages };
}

export function listMethodWikiJobs(): MethodWikiJob[] {
  const seen = new Set<string>();
  const jobs: MethodWikiJob[] = [];
  const add = (id: string, skillKey: string, siteXp: number) => {
    const key = `${skillKey}:${id}`;
    if (seen.has(key)) return;
    seen.add(key);
    jobs.push(jobFrom(id, skillKey, siteXp));
  };

  for (const group of RECIPE_GROUPS) {
    for (const m of group.methods) add(m.id, group.skillKey, m.xp * m.actionsPerHour);
  }

  const activities: ActivityMethod[] = [
    ...SKILLS.flatMap((s) => activitiesForSkill(s)),
    ...MIXOLOGY_METHODS,
    ...FISHING_RATE_TABLES,
    ...WOODCUTTING_RATE_TABLES,
    ...MINING_RATE_TABLES,
    ...HUNTER_RATE_TABLES,
    ...THIEVING_RATE_TABLES,
    ...SAILING_ACTIVITY_METHODS,
    SEPULCHRE_FLOOR_5,
    ...TITHE_FARM_METHODS,
    ...FARMING_CONTRACT_METHODS,
    ...HESPORI_METHODS,
    ...FORESTRY_METHODS,
    ...HUNTER_RUMOUR_METHODS,
    ...IMPLING_METHODS,
    ...DEEP_SEA_TRAWL_METHODS,
    ...WILDERNESS_AGILITY_ACTIVITY,
    ...SEPULCHRE_ACTIVITY,
    ...BRIMHAVEN_AGILITY_ACTIVITY,
    ...AGILITY_PYRAMID_ACTIVITY,
  ];
  for (const a of activities) add(a.id, a.skillKey, activityXp(a));
  return jobs;
}

export function uniqueWikiHrefs(jobs = listMethodWikiJobs()): string[] {
  const hrefs = new Set<string>();
  for (const job of jobs) {
    for (const p of job.pages) hrefs.add(p.href);
  }
  return [...hrefs];
}
