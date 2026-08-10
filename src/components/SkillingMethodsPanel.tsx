import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, CircleHelp } from "lucide-react";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import type { ActivityMethod } from "@/lib/activity-methods";
import { resolveActivityBand } from "@/lib/activity-methods";
import { gp, compactNum, formatCost } from "@/lib/format";
import { WikiImage } from "@/components/WikiImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SCROLL_KEY = "ge-watch-home-scroll";
const G_MIN = 250_000;
const G_MAX = 10_000_000;
const G_STEP = 250_000;

const AMULET_BONUS_DOSE_CHANCE = { none: 0, chemistry: 0.05, alchemist: 0.15 } as const;
const GOGGLES_SKIP_CHANCE = 0.1;
type AmuletChoice = keyof typeof AMULET_BONUS_DOSE_CHANCE;
type CraftSort = "gp_desc" | "gp_asc" | "xp_desc" | "xp_asc" | "cost_desc" | "cost_asc";
const DEFAULT_SORT: CraftSort = "cost_asc";

export type MethodPart = { name: string; qty: number; isSecondary?: boolean };
export type SkillingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
  outputs?: MethodPart[];
};

/** Derive a human-friendly activity type for filtering (e.g. Battlestaves, D'hide). */
function getActivityType(
  skillKey: string,
  m: { id: string; label: string },
  isActivity = false,
): string {
  const id = m.id.toLowerCase();
  const label = m.label.toLowerCase();

  if (isActivity) {
    if (id.includes("wintertodt")) return "Wintertodt";
    if (id.includes("tempoross")) return "Tempoross";
    if (id.includes("gotr") || id.includes("guardians")) return "GOTR";
    if (id.includes("foundry")) return "Giants' Foundry";
    if (id.includes("mahogany")) return "Mahogany Homes";
    if (id.includes("motherlode")) return "Motherlode Mine";
    if (id.includes("volcanic")) return "Volcanic Mine";
    if (id.includes("blast-mine")) return "Blast Mine";
    if (id.includes("shooting")) return "Shooting Stars";
    if (id.includes("pyramid")) return "Pyramid Plunder";
    if (id.includes("artefacts")) return "Stealing artefacts";
    if (id.includes("mta")) return "MTA";
    if (id.includes("herbiboar")) return "Herbiboar";
    return "Minigames";
  }

  switch (skillKey) {
    case "crafting":
      if (id.includes("battlestaff") || label.includes("battlestaff")) return "Battlestaves";
      if (id.includes("dhide") || label.includes("d'hide") || label.includes("dragon leather"))
        return "D'hide";
      if (id.includes("golem")) return "Golem crafting";
      if (id.startsWith("cut-") || label.startsWith("cut ")) return "Gem cutting";
      if (
        id.includes("glass") ||
        id.includes("orb") ||
        id.includes("vial") ||
        label.includes("glass") ||
        label.includes("orb")
      )
        return "Glassblowing";
      if (id.includes("amethyst")) return "Amethyst";
      return "Jewellery";

    case "fletching":
      if (id.includes("bow") || label.includes("bow")) return "Bows";
      if (id.includes("dart")) return "Darts";
      if (id.includes("bolt") && !id.includes("tip") && !label.includes("tip")) return "Bolts";
      if (id.includes("tip") || label.includes("bolt tips")) return "Bolt tips";
      if (id.includes("arrow") || label.includes("arrow")) return "Arrows";
      return "Other";

    case "herblore":
      if (id.startsWith("clean-")) return "Herb cleaning";
      if (id.startsWith("degrime-")) return "Degrime";
      return "Potions";

    case "smithing":
      if (id.startsWith("bf-")) return "Blast Furnace";
      if (id.includes("dart-tip")) return "Dart tips";
      if (id.includes("nails")) return "Nails";
      if (id.includes("cannon")) return "Cannonballs";
      if (
        id.includes("plate") ||
        id.includes("2h") ||
        id.includes("legs") ||
        id.includes("skirt") ||
        id.includes("shield") ||
        id.includes("axe") ||
        id.includes("warhammer")
      )
        return "Armour & weapons";
      return "Other";

    case "prayer":
      if (id.includes("ensouled")) return "Ensouled heads";
      if (id.includes("ashes") || id.includes("demonic")) return "Demonic offering";
      if (id.includes("shards")) return "Bone shards";
      return "Bones";

    case "cooking":
      if (id.includes("wine")) return "Wine";
      if (id.includes("karambwan")) return "Karambwan";
      return "Fish";

    case "mining":
      if (id.includes("granite") || label.includes("granite")) return "Granite";
      if (id.includes("sandstone") || label.includes("sandstone")) return "Sandstone";
      return "Ores";

    case "fishing":
      if (id.includes("karambwan")) return "Karambwan";
      if (id.includes("minnow") || label.includes("minnow")) return "Minnows";
      if (id.includes("angler") || label.includes("angler")) return "Anglerfish";
      return "Fish";

    case "woodcutting":
      if (id.includes("teak") || label.includes("teak")) return "Teaks";
      if (id.includes("redwood") || label.includes("redwood")) return "Redwoods";
      if (id.includes("sulliuscep") || label.includes("sulliuscep")) return "Sulliusceps";
      return "Logs";

    case "firemaking":
      if (id.includes("wintertodt")) return "Wintertodt";
      return "Logs";

    case "runecraft":
      if (id.includes("blood") || label.includes("blood")) return "Bloods";
      if (id.includes("soul") || label.includes("soul")) return "Souls";
      if (id.includes("zmi") || label.includes("ourania") || label.includes("zmi")) return "ZMI";
      return "Runes";

    case "agility":
      if (id.includes("rooftop") || label.includes("rooftop")) return "Rooftops";
      if (id.includes("sepulchre") || label.includes("sepulchre")) return "Hallowed Sepulchre";
      if (id.includes("brimhaven") || label.includes("brimhaven")) return "Brimhaven";
      return "Courses";

    case "thieving":
      if (id.includes("blackjack") || label.includes("blackjack")) return "Blackjacking";
      if (id.includes("pickpocket") || label.includes("pickpocket") || label.includes("knight"))
        return "Pickpocketing";
      if (id.includes("stall") || label.includes("stall")) return "Stalls";
      return "Other";

    case "hunter":
      if (id.includes("chinchompa") || label.includes("chin")) return "Chinchompas";
      if (id.includes("herbiboar")) return "Herbiboar";
      if (id.includes("bird") || label.includes("bird")) return "Bird houses";
      return "Creatures";

    case "farming":
      if (id.includes("tree") || label.includes("tree")) return "Trees";
      if (id.includes("herb") || label.includes("herb")) return "Herbs";
      if (id.includes("fruit") || label.includes("fruit")) return "Fruit trees";
      if (id.includes("allot") || label.includes("allot")) return "Allotments";
      return "Patches";

    case "construction":
      if (id.includes("mahogany") || label.includes("mahogany")) return "Mahogany Homes";
      if (id.includes("table") || label.includes("table")) return "Tables";
      if (id.includes("bench") || label.includes("bench")) return "Benches";
      return "Furniture";

    case "magic":
      if (id.includes("alch") || label.includes("alch")) return "High Alchemy";
      if (
        id.includes("burst") ||
        id.includes("barrage") ||
        label.includes("burst") ||
        label.includes("barrage")
      )
        return "Burst / Barrage";
      if (id.includes("mta") || label.includes("mta")) return "MTA";
      return "Spells";

    default:
      return "Methods";
  }
}

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}
function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}
function chipIcon(row: PriceRow | undefined, name: string): string {
  if (row?.icon) return row.icon;
  return `${name.replace(/ /g, "_")}.png`;
}
function saveScroll() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {
    /* */
  }
}
function clampG(n: number) {
  if (!Number.isFinite(n) || n <= 0) return G_MIN;
  return Math.min(G_MAX, Math.max(G_MIN, Math.round(n / G_STEP) * G_STEP));
}
function effectiveGpPerXp(xpPerHour: number, gpPerHour: number, moneyPerHour: number): number | null {
  if (xpPerHour <= 0 || moneyPerHour <= 0) return null;
  return Math.round(((moneyPerHour - gpPerHour) / xpPerHour) * 10) / 10;
}
function avg30Price(row: PriceRow | undefined, trendsById: Record<number, Trend> | undefined): number | null {
  if (!row) return null;
  const t = trendsById?.[row.id];
  if (t?.avg30 && t.avg30 > 0) return t.avg30;
  return null;
}
function netPctChange(current: number, baseline: number): number | null {
  const denom = Math.abs(baseline);
  if (denom < 1) return null;
  return Math.round(((current - baseline) / denom) * 1000) / 10;
}
function nullsLast(a: number | null, b: number | null, dir: 1 | -1): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * dir;
}
function amuletChargeCost(amulet: AmuletChoice, chemistryPrice: number | null): number {
  if (amulet === "none" || chemistryPrice == null) return 0;
  return amulet === "chemistry" ? chemistryPrice / 5 : chemistryPrice / 10;
}
function readSkillLevel(skills: PlayerSkills | null | undefined, skillKey: string): number | undefined {
  if (!skills) return undefined;
  const direct = skills[skillKey];
  if (typeof direct === "number" && Number.isFinite(direct)) return direct;
  const lower = skillKey.toLowerCase();
  for (const [k, v] of Object.entries(skills)) {
    if (k.toLowerCase() === lower && typeof v === "number" && Number.isFinite(v)) return v;
  }
  return undefined;
}

type Ranked = {
  id: string;
  label: string;
  level: number;
  xpPerHour: number;
  gpPerHour: number | null;
  profitPerCraft: number | null;
  netChangePct: number | null;
  costPerXp: number | null;
  netValuePerHour: number | null;
  missing: boolean;
  locked: boolean;
  method?: SkillingMethod;
  activity?: ActivityMethod;
  secondaryLine?: string | null;
  notes?: string | null;
  intensity?: "low" | "medium" | "high" | null;
  rateBandLevel?: number | null;
  category: string;
};

const DEFAULT_DESCRIPTION =
  "XP rates from OSRS Wiki focused training guides (static). GP values update live from the Grand Exchange. Your cost = supplies + opportunity cost vs your money-making rate — lower is better.";

export function SkillingMethodsPanel({
  title,
  skillKey,
  skillLabel,
  description,
  methods,
  activities = [],
  rowsByName,
  trendsById,
  moneyPerHour,
  onMoneyPerHourChange,
  playerSkills,
}: {
  title: string;
  skillKey: string;
  skillLabel: string;
  description?: string;
  methods: SkillingMethod[];
  activities?: ActivityMethod[];
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend> | undefined;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null | undefined;
}) {
  const g = clampG(moneyPerHour);
  const [sort, setSort] = useState<CraftSort>(DEFAULT_SORT);
  const [amulet, setAmulet] = useState<AmuletChoice>("none");
  const [goggles, setGoggles] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const skillLevel = readSkillLevel(playerSkills, skillKey);
  const isHerblore = skillKey === "herblore";

  const ranked = useMemo(() => {
    const chemistryPrice = isHerblore ? buyPrice(rowsByName.get("Amulet of chemistry")) : null;
    const chargeCost = isHerblore ? amuletChargeCost(amulet, chemistryPrice) : 0;
    const expectedDoses = isHerblore ? 3 + AMULET_BONUS_DOSE_CHANCE[amulet] : 3;
    const secondaryMult = isHerblore && goggles ? 1 - GOGGLES_SKIP_CHANCE : 1;

    const list: Ranked[] = methods.map((method) => {
      const xpPerHour = method.xp * method.actionsPerHour;
      let inputCost = 0,
        baselineInput = 0,
        missing = false,
        baselineMissing = false;
      for (const part of method.inputs) {
        const row = rowsByName.get(part.name);
        const p = buyPrice(row);
        if (p == null) {
          missing = true;
          continue;
        }
        const qty = isHerblore && part.isSecondary ? part.qty * secondaryMult : part.qty;
        inputCost += p * qty;
        const base = avg30Price(row, trendsById);
        if (base == null) baselineMissing = true;
        else baselineInput += base * qty;
      }
      if (isHerblore && chargeCost > 0) inputCost += chargeCost;

      const outParts: MethodPart[] =
        method.outputs && method.outputs.length > 0
          ? method.outputs
          : method.output
            ? [method.output]
            : [];

      let outValue = 0;
      let baselineOutValue: number | null = 0;
      if (outParts.length > 0) {
        let sum = 0,
          baseSum = 0,
          anyBaseMissing = false;
        for (const part of outParts) {
          if (part.name === "Coins") {
            sum += part.qty;
            baseSum += part.qty;
            continue;
          }
          const outRow = rowsByName.get(part.name);
          const outUnit = sellPrice(outRow);
          if (outUnit == null) {
            missing = true;
            continue;
          }
          const doseScale = isHerblore && part.name.includes("(3)") ? expectedDoses / 3 : 1;
          sum += outUnit * part.qty * doseScale;
          const baselineOutUnit = avg30Price(outRow, trendsById);
          if (baselineOutUnit == null) anyBaseMissing = true;
          else baseSum += baselineOutUnit * part.qty * doseScale;
        }
        outValue = sum;
        baselineOutValue = anyBaseMissing ? null : baseSum;
        if (anyBaseMissing) baselineMissing = true;
      }

      const profitPerCraft = outValue - inputCost;
      const baselineNet =
        baselineMissing || baselineOutValue == null ? null : baselineOutValue - baselineInput;
      const netChangePct = baselineNet != null ? netPctChange(profitPerCraft, baselineNet) : null;
      const gpPerHour = Math.round(profitPerCraft * method.actionsPerHour);
      const costPerXp = effectiveGpPerXp(xpPerHour, gpPerHour, g);
      const locked = skillLevel != null && skillLevel < method.level;
      return {
        id: method.id,
        label: method.label,
        level: method.level,
        method,
        xpPerHour,
        gpPerHour,
        profitPerCraft,
        netChangePct,
        costPerXp,
        netValuePerHour: null,
        missing,
        locked,
        category: getActivityType(skillKey, method),
      };
    });

    for (const activity of activities) {
      const band = resolveActivityBand(activity, skillLevel);
      let consumableCost = 0,
        missing = false;
      for (const part of activity.consumables) {
        const p = buyPrice(rowsByName.get(part.name));
        if (p == null) {
          missing = true;
          continue;
        }
        consumableCost += p * part.qty;
      }
      let rewardValue = band.expectedLootGpPerHour ?? 0;
      for (const r of activity.rewards) {
        const unit = sellPrice(rowsByName.get(r.name));
        if (unit == null) {
          missing = true;
          continue;
        }
        rewardValue += unit * r.expectedQtyPerHour;
      }
      const gpPerHour = Math.round(rewardValue - consumableCost);
      const costPerXp = effectiveGpPerXp(band.xpPerHour, gpPerHour, g);
      const locked = skillLevel != null && skillLevel < activity.level;
      const secondaryLine =
        activity.secondarySkill && band.secondaryXpPerHour
          ? `+${compactNum(Math.round(band.secondaryXpPerHour))} ${activity.secondarySkill} XP/h`
          : null;
      list.push({
        id: activity.id,
        label: activity.label,
        level: activity.level,
        activity,
        xpPerHour: band.xpPerHour,
        gpPerHour,
        profitPerCraft: null,
        netChangePct: null,
        costPerXp,
        netValuePerHour: null,
        missing,
        locked,
        secondaryLine,
        notes: activity.notes ?? null,
        intensity: activity.intensity ?? null,
        rateBandLevel: band.level,
        category: getActivityType(skillKey, activity, true),
      });
    }

    const unlocked = list.filter((r) => !r.locked);
    const refPool = unlocked.length > 0 ? unlocked : list;
    let refXpPerHour = 0;
    for (const r of refPool) {
      if (Number.isFinite(r.xpPerHour) && r.xpPerHour > refXpPerHour) {
        refXpPerHour = r.xpPerHour;
      }
    }
    const xpValue = refXpPerHour > 0 && g > 0 ? g / refXpPerHour : 0;

    for (const r of list) {
      if (r.gpPerHour == null || !Number.isFinite(r.xpPerHour)) {
        r.netValuePerHour = null;
      } else {
        const nv = r.gpPerHour + r.xpPerHour * xpValue;
        r.netValuePerHour = Number.isFinite(nv) ? nv : null;
      }
    }

    return list.sort((a, b) => {
      if (skillLevel != null && a.locked !== b.locked) return a.locked ? 1 : -1;
      let cmp = 0;
      switch (sort) {
        case "gp_desc":
          cmp = nullsLast(a.gpPerHour, b.gpPerHour, -1);
          break;
        case "gp_asc":
          cmp = nullsLast(a.gpPerHour, b.gpPerHour, 1);
          break;
        case "xp_desc":
          cmp = b.xpPerHour - a.xpPerHour;
          break;
        case "xp_asc":
          cmp = a.xpPerHour - b.xpPerHour;
          break;
        case "cost_desc":
          cmp = nullsLast(a.netValuePerHour, b.netValuePerHour, 1);
          break;
        case "cost_asc":
        default:
          cmp = nullsLast(a.netValuePerHour, b.netValuePerHour, -1);
          break;
      }
      return cmp || a.level - b.level;
    });
  }, [
    methods,
    activities,
    rowsByName,
    trendsById,
    g,
    sort,
    skillLevel,
    isHerblore,
    amulet,
    goggles,
    skillKey,
  ]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of ranked) set.add(r.category);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [ranked]);

  const filtered = useMemo(() => {
    if (selectedCategories.size === 0) return ranked;
    return ranked.filter((r) => selectedCategories.has(r.category));
  }, [ranked, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      if (next.size === categories.length) return new Set();
      return next;
    });
  };

  const clearCategories = () => setSelectedCategories(new Set());

  return (
    <div className="mt-4 space-y-3">
      <div className="panel flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {description ?? DEFAULT_DESCRIPTION}
              {skillLevel != null && (
                <> Methods above your {skillLabel} level ({skillLevel}) are greyed out.</>
              )}
            </p>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as CraftSort)}>
            <SelectTrigger className="h-9 w-[9.5rem] shrink-0 text-xs" aria-label="Sort methods">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gp_desc">
                <span className="inline-flex items-center gap-1">
                  GP/h <ArrowUp className="size-3" />
                </span>
              </SelectItem>
              <SelectItem value="gp_asc">
                <span className="inline-flex items-center gap-1">
                  GP/h <ArrowDown className="size-3" />
                </span>
              </SelectItem>
              <SelectItem value="xp_desc">
                <span className="inline-flex items-center gap-1">
                  XP/h <ArrowUp className="size-3" />
                </span>
              </SelectItem>
              <SelectItem value="xp_asc">
                <span className="inline-flex items-center gap-1">
                  XP/h <ArrowDown className="size-3" />
                </span>
              </SelectItem>
              <SelectItem value="cost_desc">
                <span className="inline-flex items-center gap-1">
                  Your cost <ArrowUp className="size-3" />
                </span>
              </SelectItem>
              <SelectItem value="cost_asc">
                <span className="inline-flex items-center gap-1">
                  Your cost <ArrowDown className="size-3" />
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 text-[11px] text-muted-foreground">Type</span>
            <button
              type="button"
              onClick={clearCategories}
              className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors ${
                selectedCategories.size === 0
                  ? "border-primary/70 bg-primary/15 text-primary"
                  : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const active = selectedCategories.has(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors ${
                    active
                      ? "border-primary/70 bg-primary/15 text-primary"
                      : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {isHerblore && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Amulet</span>
              <Select value={amulet} onValueChange={(v) => setAmulet(v as AmuletChoice)}>
                <SelectTrigger className="h-8 w-[11.5rem] text-xs" aria-label="Amulet modifier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="chemistry">Amulet of chemistry</SelectItem>
                  <SelectItem value="alchemist">Alchemist's amulet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              type="button"
              onClick={() => setGoggles((v) => !v)}
              aria-pressed={goggles}
              className={`inline-flex h-8 items-center rounded-full border px-3 text-[11px] font-medium transition-colors ${
                goggles
                  ? "border-primary/70 bg-primary/15 text-primary"
                  : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
              title="Prescription goggles - 10% chance not to consume secondary"
            >
              Goggles
            </button>
          </div>
        )}
        <MoneyMakingSlider value={g} onChange={onMoneyPerHourChange} />
      </div>
      <div className="space-y-2">
        {filtered.map((r, i) => (
          <MethodRow key={r.id} rank={i + 1} rowsByName={rowsByName} skillLabel={skillLabel} {...r} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No methods match the selected activity types.
          </p>
        )}
      </div>
    </div>
  );
}

function MoneyMakingSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);
  const commit = () => {
    const raw = draft.replace(/,/g, "").trim().toLowerCase();
    let n = Number(raw);
    if (raw.endsWith("m")) n = Number(raw.slice(0, -1)) * 1_000_000;
    else if (raw.endsWith("k")) n = Number(raw.slice(0, -1)) * 1_000;
    if (Number.isFinite(n) && n > 0) onChange(clampG(n));
    setEditing(false);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">My money-making rate</span>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="h-7 w-28 rounded-full border border-primary/60 bg-primary/10 px-2.5 text-right text-sm font-bold tabular-nums outline-none"
            aria-label="Money-making gp per hour"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(String(value));
              setEditing(true);
            }}
            className="inline-flex h-7 items-center rounded-full border border-border/60 bg-secondary/40 px-2.5 text-sm font-bold tabular-nums transition-colors hover:border-primary/50 hover:bg-primary/10"
            title="Tap to type a value"
          >
            {gp(value)}
            <span className="ml-1 text-[10px] font-medium text-muted-foreground">gp/h</span>
          </button>
        )}
      </div>
      <input
        type="range"
        min={G_MIN}
        max={G_MAX}
        step={G_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        aria-label="Money-making rate slider"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>250k</span>
        <span>Slow to Fast money</span>
        <span>10m</span>
      </div>
    </div>
  );
}

function MethodRow({
  rank,
  method,
  activity,
  label,
  level,
  rowsByName,
  skillLabel,
  xpPerHour,
  gpPerHour,
  profitPerCraft,
  netChangePct,
  costPerXp,
  missing,
  locked,
  secondaryLine,
  notes,
  intensity,
  rateBandLevel,
}: Ranked & { rank: number; rowsByName: Map<string, PriceRow>; skillLabel: string }) {
  const isActivity = activity != null;
  const titlePart = method
    ? (method.outputs && method.outputs.length > 0 ? method.outputs[0] : method.output) ??
      method.inputs[0]
    : undefined;
  const titleRow =
    titlePart && titlePart.name !== "Coins" ? rowsByName.get(titlePart.name) : undefined;
  const titleIcon = titlePart ? chipIcon(titleRow, titlePart.name) : null;

  return (
    <article
      className={`panel flex flex-col gap-2 p-3 sm:p-3.5 ${locked ? "opacity-45" : ""}`}
      title={locked ? `Requires ${skillLabel} ${level}` : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
            {rank}
          </span>
          {titleIcon && (
            <span className="flex size-10 shrink-0 items-center justify-center">
              <WikiImage
                icon={titleIcon}
                alt={titlePart?.name ?? ""}
                width={40}
                height={40}
                className="size-10 drop-shadow-sm"
                lazy={false}
              />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold leading-tight">{label}</h3>
              {isActivity && intensity && (
                <span className="rounded-full border border-border/60 bg-secondary/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {intensity}
                </span>
              )}
              <RateSourceHelp isActivity={isActivity} notes={notes} method={method} />
            </div>
            <p
              className={`text-[11px] ${
                locked ? "font-semibold text-amber-500/90" : "text-muted-foreground"
              }`}
            >
              {isActivity && rateBandLevel != null
                ? `Unlock ${level} | rates @ ${rateBandLevel}`
                : `Lvl ${level}`}
              {locked ? " | locked" : ""}
              {secondaryLine ? ` | ${secondaryLine}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-right text-xs tabular-nums">
          <Stat label="XP/h" value={compactNum(Math.round(xpPerHour))} />
          <Stat
            label="GP/h"
            value={gpPerHour == null ? "-" : `${gpPerHour > 0 ? "+" : ""}${gp(gpPerHour)}`}
            tone={gpPerHour == null ? undefined : gpPerHour >= 0 ? "deal" : "steep"}
          />
          <Stat
            label="Your cost"
            value={costPerXp == null ? "-" : `${formatCost(costPerXp)} gp/xp`}
            emphasis
            tone={
              costPerXp == null
                ? undefined
                : costPerXp <= 0
                  ? "deal"
                  : costPerXp <= 15
                    ? "deal"
                    : costPerXp >= 40
                      ? "steep"
                      : undefined
            }
            title="Supplies + opportunity cost of not money-making, per XP. Lower is better."
          />
        </div>
      </div>
      {isActivity ? (
        <div className="space-y-1 text-xs">
          <p className="text-[11px] text-muted-foreground">
            Activity method — expected reward value (not a single GE output)
          </p>
          {notes && <p className="text-[11px] text-muted-foreground">{notes}</p>}
          {missing && (
            <p className="text-[11px] text-muted-foreground">(partial / missing price data)</p>
          )}
        </div>
      ) : method ? (
        <div className="flex flex-nowrap items-center gap-1 overflow-x-auto text-xs">
          {method.inputs.length === 0 &&
            !method.output &&
            !(method.outputs && method.outputs.length > 0) && (
              <span className="text-[11px] text-muted-foreground">No GE inputs (course XP)</span>
            )}
          {method.inputs.map((part, idx) => (
            <span key={`in-${part.name}-${idx}`} className="inline-flex shrink-0 items-center gap-1">
              {idx > 0 && <span className="px-0.5 text-muted-foreground">+</span>}
              <PartChip
                name={part.name}
                qty={part.qty}
                row={part.name === "Coins" ? undefined : rowsByName.get(part.name)}
                kind="input"
              />
            </span>
          ))}
          {(() => {
            const outs =
              method.outputs && method.outputs.length > 0
                ? method.outputs
                : method.output
                  ? [method.output]
                  : [];
            if (outs.length === 0) return null;
            return (
              <>
                <span className="shrink-0 px-0.5 text-muted-foreground">{"\u2192"}</span>
                {outs.map((part, idx) => (
                  <span
                    key={`out-${part.name}-${idx}`}
                    className="inline-flex shrink-0 items-center gap-1"
                  >
                    {idx > 0 && <span className="px-0.5 text-muted-foreground">+</span>}
                    <PartChip
                      name={part.name}
                      qty={part.qty}
                      row={part.name === "Coins" ? undefined : rowsByName.get(part.name)}
                      kind="output"
                    />
                  </span>
                ))}
              </>
            );
          })()}
          {profitPerCraft != null && (
            <span
              className="ml-auto inline-flex shrink-0 items-center gap-1 tabular-nums"
              title="Net vs 30-day average component prices"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Net
              </span>
              <span
                className="font-bold"
                style={{ color: profitPerCraft >= 0 ? "var(--deal)" : "var(--steep)" }}
              >
                {profitPerCraft > 0 ? "+" : ""}
                {gp(profitPerCraft)}
              </span>
              {netChangePct != null && (
                <span
                  className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none"
                  style={{
                    background:
                      netChangePct > 0
                        ? "color-mix(in oklab, var(--deal) 22%, transparent)"
                        : netChangePct < 0
                          ? "color-mix(in oklab, var(--steep) 22%, transparent)"
                          : "var(--secondary)",
                    color:
                      netChangePct > 0
                        ? "var(--deal)"
                        : netChangePct < 0
                          ? "var(--steep)"
                          : "var(--muted-foreground)",
                  }}
                  title="Change in net vs 30-day average prices"
                >
                  {netChangePct > 0 ? "+" : ""}
                  {netChangePct}%
                </span>
              )}
            </span>
          )}
          {missing && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              (partial / missing price data)
            </span>
          )}
        </div>
      ) : null}
    </article>
  );
}

/** Clickable ? that explains where XP rates and live GP numbers come from. */
function RateSourceHelp({
  isActivity,
  notes,
  method,
}: {
  isActivity: boolean;
  notes?: string | null;
  method?: SkillingMethod;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Where do these rates come from?"
        >
          <CircleHelp className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[min(18rem,calc(100vw-2rem))] space-y-2 p-3 text-xs"
      >
        <p className="font-semibold text-foreground">Where these numbers come from</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">XP/h</span> — Focused rates from the OSRS
            Wiki training guides (static). Assumes attentive play and normal banking; not max
            tick-perfect unless the method says so.
          </li>
          <li>
            <span className="font-medium text-foreground">GP/h & Net</span> — Calculated live from
            current Grand Exchange prices (buy high / sell low). Updates automatically with the
            price feed.
          </li>
          <li>
            <span className="font-medium text-foreground">Your cost</span> — Supply cost plus the
            opportunity cost of spending that time training instead of money-making, per XP. Lower
            is better.
          </li>
        </ul>
        {isActivity && notes && (
          <p className="border-t border-border/60 pt-2 text-muted-foreground">
            <span className="font-medium text-foreground">This method:</span> {notes}
          </p>
        )}
        {!isActivity && method && (
          <p className="border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
            {method.xp} XP × {method.actionsPerHour.toLocaleString()} actions/h ={" "}
            {Math.round(method.xp * method.actionsPerHour).toLocaleString()} XP/h
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function formatQty(qty: number): string {
  if (Number.isInteger(qty)) return String(qty);
  return qty.toFixed(1);
}

function PartChip({
  name,
  qty,
  row,
  kind,
}: {
  name: string;
  qty: number;
  row: PriceRow | undefined;
  kind: "input" | "output";
}) {
  const unit = name === "Coins" ? 1 : kind === "input" ? buyPrice(row) : sellPrice(row);
  const price = unit == null ? null : unit * qty;
  const qtyLabel = formatQty(qty);
  const showQty = qty !== 1;
  const inner = (
    <>
      <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
        <WikiImage icon={chipIcon(row, name)} alt={name} width={24} height={24} className="size-6" />
        {showQty && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded bg-background/90 px-0.5 text-[9px] font-bold leading-none tabular-nums text-foreground ring-1 ring-border/60">
            {qtyLabel}
          </span>
        )}
      </span>
      <span className="text-[11px] font-semibold tabular-nums text-foreground">
        {price == null ? "-" : gp(price)}
      </span>
    </>
  );
  const className =
    "inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary/30 px-1.5 py-1 transition-colors hover:border-primary/50 hover:bg-primary/10";
  if (row?.id != null) {
    return (
      <Link
        to="/item/$id"
        params={{ id: String(row.id) }}
        className={className}
        title={showQty && unit != null ? `${name} x ${qtyLabel} @ ${gp(unit)} each` : name}
        aria-label={`View ${name} price history`}
        onClick={saveScroll}
      >
        {inner}
      </Link>
    );
  }
  return (
    <span className={className} title={name}>
      {inner}
    </span>
  );
}

function Stat({
  label,
  value,
  tone,
  emphasis,
  title,
}: {
  label: string;
  value: string;
  tone?: "deal" | "steep" | undefined;
  emphasis?: boolean;
  title?: string;
}) {
  return (
    <div className="min-w-[4.5rem]" title={title}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={`font-semibold ${emphasis ? "text-sm text-foreground" : ""}`}
        style={tone ? { color: `var(--${tone})` } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
