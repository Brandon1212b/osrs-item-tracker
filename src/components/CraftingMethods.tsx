import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CRAFTING_METHODS, type CraftingMethod } from "@/lib/crafting-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import { gp, compactNum, formatCost } from "@/lib/format";
import { WikiImage } from "@/components/WikiImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCROLL_KEY = "ge-watch-home-scroll";

const G_MIN = 250_000;
const G_MAX = 10_000_000;
const G_STEP = 250_000;

type CraftSort =
  | "gp_desc"
  | "gp_asc"
  | "xp_desc"
  | "xp_asc"
  | "cost_desc"
  | "cost_asc";

const DEFAULT_SORT: CraftSort = "cost_asc";

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
    /* private mode */
  }
}

function clampG(n: number) {
  if (!Number.isFinite(n) || n <= 0) return G_MIN;
  return Math.min(G_MAX, Math.max(G_MIN, Math.round(n / G_STEP) * G_STEP));
}

/** Effective gp spent per XP once your money-making rate is counted in. Lower = better. */
function effectiveGpPerXp(xpPerHour: number, gpPerHour: number, moneyPerHour: number): number | null {
  if (xpPerHour <= 0 || moneyPerHour <= 0) return null;
  const effectiveCostPerHour = moneyPerHour - gpPerHour;
  return Math.round((effectiveCostPerHour / xpPerHour) * 10) / 10;
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

type Ranked = {
  method: CraftingMethod;
  xpPerHour: number;
  gpPerHour: number | null;
  profitPerCraft: number | null;
  netChangePct: number | null;
  costPerXp: number | null;
  missing: boolean;
  locked: boolean;
};

export function CraftingMethodsPanel({
  rowsByName,
  trendsById,
  moneyPerHour,
  onMoneyPerHourChange,
  playerSkills,
}: {
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  const g = clampG(moneyPerHour);
  const [sort, setSort] = useState<CraftSort>(DEFAULT_SORT);
  const craftingLevel = playerSkills?.["crafting"];

  const ranked = useMemo(() => {
    const list: Ranked[] = CRAFTING_METHODS.map((method) => {
      const xpPerHour = method.xp * method.actionsPerHour;
      let inputCost = 0;
      let baselineInput = 0;
      let missing = false;
      let baselineMissing = false;

      for (const part of method.inputs) {
        const row = rowsByName.get(part.name);
        const p = buyPrice(row);
        if (p == null) {
          missing = true;
          break;
        }
        inputCost += p * part.qty;

        const base = avg30Price(row, trendsById);
        if (base == null) baselineMissing = true;
        else baselineInput += base * part.qty;
      }

      const outRow = rowsByName.get(method.output.name);
      const outUnit = sellPrice(outRow);
      if (outUnit == null) missing = true;

      const baselineOutUnit = avg30Price(outRow, trendsById);
      if (baselineOutUnit == null) baselineMissing = true;

      // Output qty must be applied (e.g. 8 dart tips, 15 bolt tips per action)
      const outQty = method.output.qty;
      const outValue = outUnit == null ? null : outUnit * outQty;
      const baselineOutValue =
        baselineOutUnit == null ? null : baselineOutUnit * outQty;

      const profitPerCraft =
        missing || outValue == null ? null : outValue - inputCost;
      const baselineNet =
        baselineMissing || baselineOutValue == null
          ? null
          : baselineOutValue - baselineInput;

      const netChangePct =
        profitPerCraft != null && baselineNet != null
          ? netPctChange(profitPerCraft, baselineNet)
          : null;

      const gpPerHour =
        profitPerCraft == null ? null : Math.round(profitPerCraft * method.actionsPerHour);

      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, g);

      const locked = craftingLevel != null && craftingLevel < method.level;

      return {
        method,
        xpPerHour,
        gpPerHour,
        profitPerCraft,
        netChangePct,
        costPerXp,
        missing,
        locked,
      };
    });

    return list.sort((a, b) => {
      // Unlocked methods first when player is loaded
      if (craftingLevel != null && a.locked !== b.locked) return a.locked ? 1 : -1;
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
          cmp = nullsLast(a.costPerXp, b.costPerXp, -1);
          break;
        case "cost_asc":
        default:
          cmp = nullsLast(a.costPerXp, b.costPerXp, 1);
          break;
      }
      return cmp || a.method.level - b.method.level;
    });
  }, [rowsByName, trendsById, g, sort, craftingLevel]);

  return (
    <div className="mt-4 space-y-3">
      <div className="panel flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold">Crafting methods</h2>
            <p className="text-xs text-muted-foreground">
              Sorted by what each XP costs <em>you</em> — supplies plus the gold you could have made
              instead. Lower cost is better.
              {craftingLevel != null && (
                <>
                  {" "}
                  Methods above your Crafting level ({craftingLevel}) are greyed out.
                </>
              )}
            </p>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as CraftSort)}>
            <SelectTrigger className="h-9 w-[9.5rem] shrink-0 text-xs" aria-label="Sort methods">
              <SelectValue placeholder="Sort by…" />
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

        <MoneyMakingSlider value={g} onChange={onMoneyPerHourChange} />
      </div>

      <div className="space-y-2">
        {ranked.map((r, i) => (
          <MethodRow key={r.method.id} rank={i + 1} rowsByName={rowsByName} {...r} />
        ))}
      </div>
    </div>
  );
}

function MoneyMakingSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
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
        <span>Slow → Fast money</span>
        <span>10m</span>
      </div>
    </div>
  );
}

function MethodRow({
  rank,
  method,
  rowsByName,
  xpPerHour,
  gpPerHour,
  profitPerCraft,
  netChangePct,
  costPerXp,
  missing,
  locked,
}: Ranked & { rank: number; rowsByName: Map<string, PriceRow> }) {
  // Prefer the product for the title icon; fall back to first input.
  const titlePart = method.output ?? method.inputs[0];
  const titleRow = titlePart ? rowsByName.get(titlePart.name) : undefined;
  const titleIcon = titlePart ? chipIcon(titleRow, titlePart.name) : null;

  return (
    <article
      className={`panel flex flex-col gap-2 p-3 sm:p-3.5 ${locked ? "opacity-45" : ""}`}
      title={locked ? `Requires Crafting ${method.level}` : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
            {rank}
          </span>
          {titleIcon && (
            <WikiImage
              icon={titleIcon}
              alt={titlePart?.name ?? ""}
              width={40}
              height={40}
              className="size-10 shrink-0 drop-shadow-sm"
              lazy={false}
            />
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight">{method.label}</h3>
            <p className={`text-[11px] ${locked ? "font-semibold text-amber-500/90" : "text-muted-foreground"}`}>
              Lvl {method.level}
              {locked ? " · locked" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-right text-xs tabular-nums">
          <Stat label="XP/h" value={compactNum(Math.round(xpPerHour))} />
          <Stat
            label="GP/h"
            value={gpPerHour == null ? "—" : `${gpPerHour > 0 ? "+" : ""}${gp(gpPerHour)}`}
            tone={gpPerHour == null ? undefined : gpPerHour >= 0 ? "deal" : "steep"}
          />
          <Stat
            label="Your cost"
            value={costPerXp == null ? "—" : `${formatCost(costPerXp)} gp/xp`}
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

      <div className="flex flex-nowrap items-center gap-1 overflow-x-auto text-xs">
        {method.inputs.map((part, idx) => (
          <span key={part.name} className="inline-flex shrink-0 items-center gap-1">
            {idx > 0 && <span className="px-0.5 text-muted-foreground">+</span>}
            <PartChip
              name={part.name}
              qty={part.qty}
              row={rowsByName.get(part.name)}
              kind="input"
            />
          </span>
        ))}
        <span className="shrink-0 px-0.5 text-muted-foreground">→</span>
        <PartChip
          name={method.output.name}
          qty={method.output.qty}
          row={rowsByName.get(method.output.name)}
          kind="output"
        />

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
              style={{
                color: profitPerCraft >= 0 ? "var(--deal)" : "var(--steep)",
              }}
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

        {missing && profitPerCraft == null && (
          <span className="shrink-0 text-[11px] text-muted-foreground">(missing price data)</span>
        )}
      </div>
    </article>
  );
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
  const unit = kind === "input" ? buyPrice(row) : sellPrice(row);
  // Show total value for the qty used/produced in this action
  const price = unit == null ? null : unit * qty;

  const inner = (
    <>
      <span className="relative inline-flex">
        <WikiImage
          icon={chipIcon(row, name)}
          alt={name}
          width={24}
          height={24}
          className="size-6"
        />
        {qty > 1 && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded bg-background/90 px-0.5 text-[9px] font-bold leading-none tabular-nums text-foreground ring-1 ring-border/60">
            {qty}
          </span>
        )}
      </span>
      <span className="text-[11px] font-semibold tabular-nums text-foreground">
        {price == null ? "—" : gp(price)}
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
        title={qty > 1 && unit != null ? `${name} × ${qty} @ ${gp(unit)} each` : name}
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
  tone?: "deal" | "steep";
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
