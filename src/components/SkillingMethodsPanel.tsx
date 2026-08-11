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
  const [hideLocked, setHideLocked] = useState(true);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const skillLevel = readSkillLevel(playerSkills, skillKey);
  const isHerblore = skillKey === "herblore";
  const { addMany } = useWatchlistMutations();

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
        intensity: deriveIntensity(method),
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
        intensity: deriveIntensity(activity, true),
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
    let list = ranked;
    if (hideLocked && skillLevel != null) list = list.filter((r) => !r.locked);
    if (selectedCategories.size > 0) list = list.filter((r) => selectedCategories.has(r.category));
    return list;
  }, [ranked, selectedCategories, hideLocked, skillLevel]);
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

        {skillLevel != null && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHideLocked((v) => !v)}
              aria-pressed={hideLocked}
              className={`inline-flex h-8 items-center rounded-full border px-3 text-[11px] font-medium transition-colors ${
                hideLocked
                  ? "border-primary/70 bg-primary/15 text-primary"
                  : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {hideLocked ? "Hide locked" : "Show locked"}
            </button>
            <span className="text-[11px] text-muted-foreground">
              {skillLabel} {skillLevel}
              {hideLocked ? ` · ${filtered.length} available` : ""}
            </span>
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
              if (!r.method) { toast("Activity methods don't map to simple GE inputs"); return; }
              const items: { itemId: number; itemName: string }[] = [];
              for (const p of r.method.inputs) {
                if (p.name === "Coins") continue;
                const row = rowsByName.get(p.name);
                if (row?.id != null) items.push({ itemId: row.id, itemName: p.name });
              }
              if (items.length === 0) { toast("No priced inputs to watch"); return; }
              addMany.mutate(items, {
                onSuccess: (n) => toast(n > 0 ? `Added ${n} input${n === 1 ? "" : "s"} to watchlist` : "Already watching those inputs"),
              });
            }}
            {...r}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {hideLocked && skillLevel != null
              ? "No methods available at your level. Toggle Show locked to plan ahead."
              : "No methods match the selected activity types."}
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
