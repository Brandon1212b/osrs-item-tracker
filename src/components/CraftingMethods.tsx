import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CRAFTING_METHODS, type CraftingMethod } from "@/lib/crafting-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import { gp } from "@/lib/format";

const ICON_BASE = "https://oldschool.runescape.wiki/images/";
const SCROLL_KEY = "ge-watch-home-scroll";

const G_MIN = 250_000;
const G_MAX = 10_000_000;
const G_STEP = 250_000;

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}

function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}

function iconUrl(row: PriceRow | undefined, name: string) {
  if (row?.icon) {
    return `${ICON_BASE}${encodeURIComponent(row.icon.replace(/ /g, "_"))}`;
  }
  return `${ICON_BASE}${encodeURIComponent(name.replace(/ /g, "_")) + ".png"}`;
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
  // Negative = you're paid to train (better than free)
  return Math.round((effectiveCostPerHour / xpPerHour) * 10) / 10;
}

function formatCost(v: number | null): string {
  if (v == null) return "—";
  if (v <= 0) return "Free+";
  if (Math.abs(v) >= 100) return Math.round(v).toLocaleString();
  return v.toFixed(1);
}

/** Baseline mid price from 30-day trend average. */
function avg30Price(row: PriceRow | undefined, trendsById: Record<number, Trend> | undefined): number | null {
  if (!row) return null;
  const t = trendsById?.[row.id];
  if (t?.avg30 && t.avg30 > 0) return t.avg30;
  return null;
}

/**
 * % change of current net vs net at 30-day average component prices.
 * Positive = net improved (more profit / less loss) vs recent average.
 */
function netPctChange(current: number, baseline: number): number | null {
  const denom = Math.abs(baseline);
  if (denom < 1) return null;
  return Math.round(((current - baseline) / denom) * 1000) / 10;
}

type Ranked = {
  method: CraftingMethod;
  xpPerHour: number;
  gpPerHour: number | null;
  profitPerCraft: number | null;
  netChangePct: number | null;
  costPerXp: number | null;
  missing: boolean;
};

export function CraftingMethodsPanel({
  rowsByName,
  trendsById,
  moneyPerHour,
  onMoneyPerHourChange,
}: {
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
}) {
  const g = clampG(moneyPerHour);

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
      const out = sellPrice(outRow);
      if (out == null) missing = true;

      const baselineOut = avg30Price(outRow, trendsById);
      if (baselineOut == null) baselineMissing = true;

      const profitPerCraft = missing || out == null ? null : out - inputCost;
      const baselineNet =
        baselineMissing || baselineOut == null ? null : baselineOut - baselineInput;

      const netChangePct =
        profitPerCraft != null && baselineNet != null
          ? netPctChange(profitPerCraft, baselineNet)
          : null;

      const gpPerHour =
        profitPerCraft == null ? null : Math.round(profitPerCraft * method.actionsPerHour);

      const costPerXp =
        gpPerHour == null ? null : effectiveGpPerXp(xpPerHour, gpPerHour, g);

      return {
        method,
        xpPerHour,
        gpPerHour,
        profitPerCraft,
        netChangePct,
        costPerXp,
        missing,
      };
    });

    // Lower effective cost/xp is better; nulls last
    return list.sort((a, b) => {
      if (a.costPerXp == null && b.costPerXp == null) return a.method.level - b.method.level;
      if (a.costPerXp == null) return 1;
      if (b.costPerXp == null) return -1;
      return a.costPerXp - b.costPerXp || a.method.level - b.method.level;
    });
  }, [rowsByName, trendsById, g]);

  return (
    <div className="mt-4 space-y-3">
      <div className="panel flex flex-col gap-3 p-3 sm:p-4">
        <div>
          <h2 className="text-sm font-semibold">Crafting methods</h2>
          <p className="text-xs text-muted-foreground">
            Sorted by what each XP costs <em>you</em> — supplies plus the gold you could have made instead.
            Lower cost is better.
          </p>
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
}: Ranked & { rank: number; rowsByName: Map<string, PriceRow> }) {
  return (
    <article className="panel flex flex-col gap-2 p-3 sm:p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
            {rank}
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight">{method.label}</h3>
            <p className="text-[11px] text-muted-foreground">Lvl {method.level}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-right text-xs tabular-nums">
          <Stat label="XP/h" value={Math.round(xpPerHour).toLocaleString()} />
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
  const price = kind === "input" ? buyPrice(row) : sellPrice(row);

  const inner = (
    <>
      <span className="relative inline-flex">
        <img
          src={iconUrl(row, name)}
          alt={name}
          width={24}
          height={24}
          className="size-6 object-contain"
          loading="lazy"
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
        title={name}
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
