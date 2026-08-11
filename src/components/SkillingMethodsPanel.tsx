import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, PinOff } from "lucide-react";
import { toast } from "sonner";
import { useWatchlistMutations } from "@/lib/watchlist";
import { deriveIntensity, MONEY_PRESETS } from "@/components/methods-ux";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import type { ActivityMethod } from "@/lib/activity-methods";
import { resolveActivityBand } from "@/lib/activity-methods";
import { gp, compactNum, formatCost } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MethodRow } from "@/components/MethodRow";
import { getActivityType } from "@/components/activity-type";
export type { MethodPart, SkillingMethod, RankedMethod } from "@/components/skilling-types";
import type { MethodPart, SkillingMethod, RankedMethod } from "@/components/skilling-types";

const G_MIN = 250_000;
const G_MAX = 10_000_000;
const G_STEP = 250_000;

const AMULET_BONUS_DOSE_CHANCE = { none: 0, chemistry: 0.05, alchemist: 0.15 } as const;
const GOGGLES_SKIP_CHANCE = 0.1;
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
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  const [sort, setSort] = useState<CraftSort>(DEFAULT_SORT);
  const [amulet, setAmulet] = useState<AmuletChoice>("none");
  const [goggles, setGoggles] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const skillLevel = readSkillLevel(playerSkills, skillKey);
  const isHerblore = skillKey === "herblore";
  const { addMany } = useWatchlistMutations();

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
        outputValue += unit * p.qty;
      }

      const profitPerCraft = missing ? null : outputValue - inputCost;
      const xpPerHour = method.xp * method.actionsPerHour;
      const gpPerHour =
        profitPerCraft == null ? null : Math.round(profitPerCraft * method.actionsPerHour);

      // Net vs 30d avg
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
          baselineOut += avg * p.qty;
        }
      }
      const baselineProfit = hasBaseline ? baselineOut - baselineIn : null;
      const netChangePct =
        profitPerCraft != null && baselineProfit != null
          ? netPctChange(profitPerCraft, baselineProfit)
          : null;

      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, moneyPerHour);

      const locked = skillLevel != null && skillLevel < method.level;

      return {
        id: method.id,
        label: method.label,
        level: method.level,
        xpPerHour,
        gpPerHour,
        profitPerCraft,
        netChangePct,
        costPerXp,
        netValuePerHour: null,
        missing,
        locked,
        method,
        intensity: deriveIntensity(method),
        category: getActivityType(skillKey, method),
      };
    });

    for (const activity of activities) {
      const band = resolveActivityBand(activity, skillLevel ?? 1);
      const xpPerHour = band.xpPerHour;
      // activity GP from expected rewards — approximate from band if present
      const gpPerHour = band.gpPerHour ?? null;
      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, moneyPerHour);
      const locked = skillLevel != null && skillLevel < activity.level;
      const secondaryLine =
        band.label && band.label !== activity.label ? band.label : null;

      list.push({
        id: activity.id,
        label: activity.label,
        level: activity.level,
        xpPerHour,
        gpPerHour,
        profitPerCraft: null,
        netChangePct: null,
        costPerXp,
        netValuePerHour: gpPerHour,
        missing: false,
        locked,
        activity,
        secondaryLine,
        notes: activity.notes ?? null,
        intensity: deriveIntensity(activity, true),
        rateBandLevel: band.level,
        category: getActivityType(skillKey, activity, true),
      });
    }

    // sort locked to bottom when skill known
    const unlocked = list.filter((r) => !r.locked);
    const refPool = unlocked.length > 0 ? unlocked : list;

    list.sort((a, b) => {
      if (skillLevel != null && a.locked !== b.locked) return a.locked ? 1 : -1;
      switch (sort) {
        case "gp_desc":
          return nullsLast(b.gpPerHour, a.gpPerHour, 1);
        case "gp_asc":
          return nullsLast(a.gpPerHour, b.gpPerHour, 1);
        case "xp_desc":
          return b.xpPerHour - a.xpPerHour;
        case "xp_asc":
          return a.xpPerHour - b.xpPerHour;
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
    sort,
    amulet,
    isHerblore,
    skillKey,
  ]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of ranked) set.add(r.category);
    return Array.from(set).sort();
  }, [ranked]);

  const filtered = useMemo(() => {
    if (selectedCategories.size === 0) return ranked;
    return ranked.filter((r) => selectedCategories.has(r.category));
  }, [ranked, selectedCategories]);

  const compared = useMemo(() => ranked.filter((r) => compareIds.has(r.id)), [ranked, compareIds]);
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      else toast("Compare up to 3 methods at a time");
      return next;
    });
  };
  const clearCompare = () => setCompareIds(new Set());

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const g = clampG(moneyPerHour);

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description ?? DEFAULT_DESCRIPTION}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as CraftSort)}>
            <SelectTrigger className="h-8 w-[11.5rem] text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost_asc">Your cost ↑ (best)</SelectItem>
              <SelectItem value="cost_desc">Your cost ↓</SelectItem>
              <SelectItem value="gp_desc">GP/h ↓</SelectItem>
              <SelectItem value="gp_asc">GP/h ↑</SelectItem>
              <SelectItem value="xp_desc">XP/h ↓</SelectItem>
              <SelectItem value="xp_asc">XP/h ↑</SelectItem>
            </SelectContent>
          </Select>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
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
              {selectedCategories.size > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategories(new Set())}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

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

        <MoneyMakingSlider value={g} onChange={onMoneyPerHourChange} />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">Your cost</span> = supply cost + opportunity
          cost of not making {gp(g)}/h instead, per XP. Lower is better; negative means the method beats
          your money-making rate.
        </p>
      </div>

      {compared.length > 0 && (
        <div className="panel space-y-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Comparing {compared.length}/3
            </h3>
            <button type="button" onClick={clearCompare} className="text-[11px] text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {compared.map((r) => (
              <div key={`cmp-${r.id}`} className="rounded-lg border border-border/50 bg-secondary/20 p-2.5 text-xs">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-semibold leading-tight">{r.label}</p>
                  <button type="button" onClick={() => toggleCompare(r.id)} className="text-muted-foreground hover:text-foreground">
                    <PinOff className="size-3.5" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 tabular-nums">
                  <div><div className="text-[9px] uppercase text-muted-foreground">XP/h</div><div className="font-semibold">{compactNum(Math.round(r.xpPerHour))}</div></div>
                  <div><div className="text-[9px] uppercase text-muted-foreground">GP/h</div><div className="font-semibold">{r.gpPerHour == null ? "-" : `${r.gpPerHour > 0 ? "+" : ""}${gp(r.gpPerHour)}`}</div></div>
                  <div><div className="text-[9px] uppercase text-muted-foreground">Cost</div><div className="font-semibold">{r.costPerXp == null ? "-" : formatCost(r.costPerXp)}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((r, i) => (
          <MethodRow
            key={r.id}
            rank={i + 1}
            rowsByName={rowsByName}
            skillLabel={skillLabel}
            comparing={compareIds.has(r.id)}
            onToggleCompare={() => toggleCompare(r.id)}
            onWatchInputs={() => {
              if (!r.method) {
                toast("Activity methods don't map to simple GE inputs");
                return;
              }
              const items: { itemId: number; itemName: string }[] = [];
              for (const p of r.method.inputs) {
                if (p.name === "Coins") continue;
                const row = rowsByName.get(p.name);
                if (row?.id != null) items.push({ itemId: row.id, itemName: p.name });
              }
              if (items.length === 0) {
                toast("No priced inputs to watch");
                return;
              }
              addMany.mutate(items, {
                onSuccess: (n) =>
                  toast(n > 0 ? `Added ${n} input${n === 1 ? "" : "s"} to watchlist` : "Already watching those inputs"),
              });
            }}
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
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = Number(draft.replace(/[,_\s]/g, ""));
    if (Number.isFinite(n) && n > 0) onChange(clampG(n));
    else setDraft(String(value));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Your money-making rate
        </label>
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="h-7 w-24 rounded-md border border-border/60 bg-background px-2 text-right text-xs tabular-nums"
          />
          <span className="text-[11px] text-muted-foreground">gp/h</span>
          {value !== G_MIN && (
            <button
              type="button"
              onClick={() => onChange(G_MIN)}
              className="text-[11px] text-muted-foreground hover:text-foreground"
              title="Reset to minimum"
            >
              <ArrowDown className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {MONEY_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.value)}
            className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors ${
              value === p.value
                ? "border-primary/70 bg-primary/15 text-primary"
                : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <input
        type="range"
        min={G_MIN}
        max={G_MAX}
        step={G_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
        <span>{gp(G_MIN)}</span>
        <span>{gp(G_MAX)}</span>
      </div>
    </div>
  );
}
