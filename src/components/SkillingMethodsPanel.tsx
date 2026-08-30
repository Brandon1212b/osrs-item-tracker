import { useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import { deriveIntensity } from "@/components/methods-ux";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import type { ActivityMethod } from "@/lib/activity-methods";
import { resolveActivityBand } from "@/lib/activity-methods";
import { gp } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MethodRow } from "@/components/MethodRow";
import { getActivityType } from "@/components/activity-type";
import { MethodsGoalBar, useMethodsGoal } from "@/components/MethodsGoalBar";
import { hoursToXp } from "@/lib/osrs-xp";
import { usePlayerLookup } from "@/hooks/usePlayerLookup";
import { FilterCollapse, SkillsPanel } from "@/routes/home-ui";
import { useMethodSkillsNav } from "@/components/method-skills-nav";
export type { MethodPart, SkillingMethod, RankedMethod } from "@/components/skilling-types";
import type { MethodPart, SkillingMethod, RankedMethod } from "@/components/skilling-types";

const G_MIN = 250_000;
const G_MAX = 10_000_000;
const G_STEP = 250_000;

const AMULET_BONUS_DOSE_CHANCE = { none: 0, chemistry: 0.05, alchemist: 0.15 } as const;
type AmuletChoice = keyof typeof AMULET_BONUS_DOSE_CHANCE;
type CraftSort = "gp_desc" | "gp_asc" | "xp_desc" | "xp_asc" | "cost_desc" | "cost_asc";
const DEFAULT_SORT: CraftSort = "cost_asc";

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}
function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}
function afterTaxSell(unitPrice: number): number {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return unitPrice;
  const tax = Math.min(Math.floor(unitPrice * 0.02), 5_000_000);
  return unitPrice - tax;
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

type Ranked = RankedMethod;

export function SkillingMethodsPanel({
  title,
  skillKey,
  skillLabel,
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
  methods: SkillingMethod[];
  activities?: ActivityMethod[];
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  const [sort, setSort] = useState<CraftSort>(DEFAULT_SORT);
  const [amulet, setAmulet] = useState<AmuletChoice>("none");
  const [goggles, setGoggles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sectionOpen, setSectionOpen] = useState(true);
  const [listFiltersOpen, setListFiltersOpen] = useState(false);
  const skillsNav = useMethodSkillsNav();
  const skillLevel = readSkillLevel(playerSkills, skillKey);
  const magicLevel = readSkillLevel(playerSkills, "magic");
  const { playerXp } = usePlayerLookup();
  const hiscoreXp = playerXp?.[skillKey] ?? playerXp?.[skillKey.toLowerCase()];
  const goal = useMethodsGoal(skillLevel, hiscoreXp);
  const isHerblore = skillKey === "herblore";

  const ranked = useMemo(() => {
    const chemistryPrice = isHerblore ? buyPrice(rowsByName.get("Amulet of chemistry")) : null;
    const list: Ranked[] = methods.map((method) => {
      let inputCost = 0;
      let missing = false;
      for (const p of method.inputs) {
        if (p.name === "Coins") {
          inputCost += p.qty;
          continue;
        }
        const row = rowsByName.get(p.name);
        const unit = buyPrice(row);
        if (unit == null) {
          missing = true;
          continue;
        }
        inputCost += unit * p.qty;
      }
      if (isHerblore) inputCost += amuletChargeCost(amulet, chemistryPrice);

      let outputValue = 0;
      const outs =
        method.outputs && method.outputs.length > 0
          ? method.outputs
          : method.output
            ? [method.output]
            : [];
      for (const p of outs) {
        if (p.name === "Coins") {
          outputValue += p.qty;
          continue;
        }
        const row = rowsByName.get(p.name);
        const unit = sellPrice(row);
        if (unit == null) {
          missing = true;
          continue;
        }
        outputValue += afterTaxSell(unit) * p.qty;
      }

      const profitPerCraft = missing ? null : outputValue - inputCost;
      const xpPerHour = method.xp * method.actionsPerHour;
      const gpPerHour =
        profitPerCraft == null ? null : Math.round(profitPerCraft * method.actionsPerHour);

      let baselineIn = 0;
      let baselineOut = 0;
      let hasBaseline = true;
      for (const p of method.inputs) {
        if (p.name === "Coins") {
          baselineIn += p.qty;
          continue;
        }
        const avg = avg30Price(rowsByName.get(p.name), trendsById);
        if (avg == null) {
          hasBaseline = false;
          break;
        }
        baselineIn += avg * p.qty;
      }
      if (hasBaseline) {
        for (const p of outs) {
          if (p.name === "Coins") {
            baselineOut += p.qty;
            continue;
          }
          const avg = avg30Price(rowsByName.get(p.name), trendsById);
          if (avg == null) {
            hasBaseline = false;
            break;
          }
          baselineOut += afterTaxSell(avg) * p.qty;
        }
      }
      const baselineProfit = hasBaseline ? baselineOut - baselineIn : null;
      const netChangePct =
        profitPerCraft != null && baselineProfit != null
          ? netPctChange(profitPerCraft, baselineProfit)
          : null;

      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, moneyPerHour);

      let locked = skillLevel != null && skillLevel < method.level;
      if (
        !locked &&
        method.magicLevel != null &&
        magicLevel != null &&
        magicLevel < method.magicLevel
      ) {
        locked = true;
      }
      const secondaryLine =
        method.magicLevel != null ? `Magic ${method.magicLevel}` : null;
      const hoursToTarget = hoursToXp(goal.xpRemaining, xpPerHour);
      const totalGp =
        gpPerHour == null || hoursToTarget == null ? null : Math.round(gpPerHour * hoursToTarget);

      return {
        id: method.id,
        label: method.label,
        level: method.level,
        xpPerHour,
        gpPerHour,
        hoursToTarget,
        totalGp,
        profitPerCraft,
        netChangePct,
        costPerXp,
        netValuePerHour: null,
        missing,
        locked,
        method,
        secondaryLine,
        intensity: deriveIntensity(method),
        category: getActivityType(skillKey, method),
      };
    });

    for (const activity of activities) {
      const band = resolveActivityBand(activity, skillLevel ?? 1);
      const xpPerHour = band.xpPerHour;

      let rewardValue = 0;
      let consumableCost = 0;
      let missing = false;

      for (const r of activity.rewards) {
        if (r.name === "Coins") {
          rewardValue += r.expectedQtyPerHour;
          continue;
        }
        const row = rowsByName.get(r.name);
        const unit = sellPrice(row);
        if (unit == null) {
          missing = true;
          continue;
        }
        rewardValue += afterTaxSell(unit) * r.expectedQtyPerHour;
      }

      for (const c of activity.consumables) {
        if (c.name === "Coins") {
          consumableCost += c.qty;
          continue;
        }
        const row = rowsByName.get(c.name);
        const unit = buyPrice(row);
        if (unit == null) {
          missing = true;
          continue;
        }
        consumableCost += unit * c.qty;
      }

      const residual = band.expectedLootGpPerHour ?? 0;
      const hasAnyValue =
        activity.rewards.length > 0 || activity.consumables.length > 0 || residual !== 0;
      const gpPerHour = !hasAnyValue
        ? null
        : Math.round(rewardValue + residual - consumableCost);

      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, moneyPerHour);
      const locked = skillLevel != null && skillLevel < activity.level;

      const secondaryParts: string[] = [];
      if (activity.secondarySkill) {
        const secXp = band.secondaryXpPerHour;
        secondaryParts.push(
          secXp != null
            ? `${activity.secondarySkill} ${Math.round(secXp).toLocaleString()} xp/h`
            : activity.secondarySkill,
        );
      }
      const secondaryLine = secondaryParts.length > 0 ? secondaryParts.join(" · ") : null;

      const hoursToTarget = hoursToXp(goal.xpRemaining, xpPerHour);
      const totalGp =
        gpPerHour == null || hoursToTarget == null ? null : Math.round(gpPerHour * hoursToTarget);

      list.push({
        id: activity.id,
        label: activity.label,
        level: activity.level,
        xpPerHour,
        gpPerHour,
        hoursToTarget,
        totalGp,
        profitPerCraft: null,
        netChangePct: null,
        costPerXp,
        netValuePerHour: gpPerHour,
        missing,
        locked,
        activity,
        secondaryLine,
        notes: activity.notes ?? null,
        intensity: deriveIntensity(activity, true),
        rateBandLevel: band.level,
        category: getActivityType(skillKey, activity, true),
      });
    }

    list.sort((a, b) => {
      if (skillLevel != null && a.locked !== b.locked) return a.locked ? 1 : -1;
      switch (sort) {
        case "gp_desc":
          return goal.view === "goal"
            ? nullsLast(b.totalGp ?? null, a.totalGp ?? null, 1)
            : nullsLast(b.gpPerHour, a.gpPerHour, 1);
        case "gp_asc":
          return goal.view === "goal"
            ? nullsLast(a.totalGp ?? null, b.totalGp ?? null, 1)
            : nullsLast(a.gpPerHour, b.gpPerHour, 1);
        case "xp_desc":
          return goal.view === "goal"
            ? nullsLast(a.hoursToTarget ?? null, b.hoursToTarget ?? null, 1)
            : b.xpPerHour - a.xpPerHour;
        case "xp_asc":
          return goal.view === "goal"
            ? nullsLast(b.hoursToTarget ?? null, a.hoursToTarget ?? null, 1)
            : a.xpPerHour - b.xpPerHour;
        case "cost_desc":
          return nullsLast(b.costPerXp, a.costPerXp, 1);
        case "cost_asc":
        default:
          return nullsLast(a.costPerXp, b.costPerXp, 1);
      }
    });

    return list;
  }, [
    methods,
    activities,
    rowsByName,
    trendsById,
    moneyPerHour,
    skillLevel,
    magicLevel,
    sort,
    amulet,
    isHerblore,
    skillKey,
    goal.view,
    goal.xpRemaining,
  ]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of ranked) set.add(r.category);
    return Array.from(set).sort();
  }, [ranked]);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return ranked;
    return ranked.filter((r) => r.category === selectedCategory);
  }, [ranked, selectedCategory]);

  const g = clampG(moneyPerHour);
  const filtersActive = sort !== DEFAULT_SORT || selectedCategory !== "all";

  return (
    <section className="mt-3 space-y-3">
      <FilterCollapse title="Skills" open={sectionOpen} onToggle={() => setSectionOpen((open) => !open)}>
        <div className="flex flex-col gap-3">
          {skillsNav && (
            <div className="flex justify-center">
              <SkillsPanel
                active={skillsNav.active}
                onSelect={skillsNav.onSelect}
                levels={skillsNav.levels}
                enabledKeys={skillsNav.enabledKeys}
              />
            </div>
          )}

          <MethodsGoalBar
            view={goal.view}
            onViewChange={goal.setView}
            currentLevel={goal.currentLevel}
            onCurrentLevelChange={goal.setCurrentLevel}
            targetLevel={goal.targetLevel}
            onTargetLevelChange={goal.setTargetLevel}
            skillLabel={skillLabel}
            trailing={
              <button
                type="button"
                onClick={() => setListFiltersOpen((open) => !open)}
                aria-expanded={listFiltersOpen}
                className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium ${
                  listFiltersOpen || filtersActive
                    ? "border-primary/70 bg-primary/15 text-primary"
                    : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListFilter className="size-3.5" />
                Filter
              </button>
            }
          />

          {listFiltersOpen && (
            <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-secondary/20 p-2">
              <Select value={sort} onValueChange={(v) => setSort(v as CraftSort)}>
                <SelectTrigger className="h-8 w-full min-w-0 text-xs">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost_asc">Your cost ↑ (best)</SelectItem>
                  <SelectItem value="cost_desc">Your cost ↓</SelectItem>
                  <SelectItem value="gp_desc">{goal.view === "goal" ? "Total GP ↓" : "GP/h ↓"}</SelectItem>
                  <SelectItem value="gp_asc">{goal.view === "goal" ? "Total GP ↑" : "GP/h ↑"}</SelectItem>
                  <SelectItem value="xp_desc">{goal.view === "goal" ? "Hours ↑ (fastest)" : "XP/h ↓"}</SelectItem>
                  <SelectItem value="xp_asc">{goal.view === "goal" ? "Hours ↓" : "XP/h ↑"}</SelectItem>
                </SelectContent>
              </Select>

              {categories.length > 1 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-8 w-full min-w-0 text-xs">
                    <SelectValue placeholder="Activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {isHerblore && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">Amulet</span>
                    <Select value={amulet} onValueChange={(v) => setAmulet(v as AmuletChoice)}>
                      <SelectTrigger className="h-8 w-[8.5rem] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="alchemist">Alchemist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 text-[11px] font-medium text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={goggles}
                      onChange={(e) => setGoggles(e.target.checked)}
                      className="size-3.5 rounded border-border"
                    />
                    Amylase goggles
                  </label>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border/40 pt-2.5">
            <MoneyMakingSlider value={g} onChange={onMoneyPerHourChange} />
          </div>
        </div>
      </FilterCollapse>

      <div className="space-y-2">
        {filtered.map((r, i) => (
          <MethodRow
            key={r.id}
            rank={i + 1}
            rowsByName={rowsByName}
            skillLabel={skillLabel}
            metricView={goal.view}
            xpRemaining={goal.xpRemaining}
            {...r}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No methods match the selected activity types.
          </p>
        )}
      </div>
    </section>
  );
}

function MoneyMakingSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-foreground">Your rate</p>
          <p className="text-[11px] text-muted-foreground">Opportunity cost used to rank methods.</p>
        </div>
        <span className="shrink-0 text-[12px] font-semibold tabular-nums text-foreground">{gp(value)}/h</span>
      </div>
      <input
        type="range"
        min={G_MIN}
        max={G_MAX}
        step={G_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label="Your money-making rate per hour"
      />
    </div>
  );
}
