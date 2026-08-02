import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { CRAFTING_METHODS, type CraftingMethod } from "@/lib/crafting-methods";
import type { PriceRow } from "@/lib/osrs.server";
import { gp } from "@/lib/format";

const ICON_BASE = "https://oldschool.runescape.wiki/images/";
const SCROLL_KEY = "ge-watch-home-scroll";

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

type Ranked = {
  method: CraftingMethod;
  xpPerHour: number;
  gpPerHour: number | null;
  score: number | null;
  missing: boolean;
};

export function CraftingMethodsPanel({
  rowsByName,
  moneyPerHour,
  onMoneyPerHourChange,
}: {
  rowsByName: Map<string, PriceRow>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
}) {
  const ranked = useMemo(() => {
    const list: Ranked[] = CRAFTING_METHODS.map((method) => {
      const xpPerHour = method.xp * method.actionsPerHour;
      let inputCost = 0;
      let missing = false;
      for (const part of method.inputs) {
        const p = buyPrice(rowsByName.get(part.name));
        if (p == null) {
          missing = true;
          break;
        }
        inputCost += p * part.qty;
      }
      const out = sellPrice(rowsByName.get(method.output.name));
      if (out == null) missing = true;

      const profitPerAction = missing || out == null ? null : out - inputCost;
      const gpPerHour =
        profitPerAction == null ? null : Math.round(profitPerAction * method.actionsPerHour);

      // Higher score = better. XP earned per unit of effective wealth spent this hour.
      // Effective wealth/hour ≈ money-making rate − training GP/h.
      let score: number | null = null;
      if (gpPerHour != null && moneyPerHour > 0) {
        const effectiveCostPerHour = Math.max(moneyPerHour - gpPerHour, 1);
        score = Math.round((xpPerHour / effectiveCostPerHour) * 1_000_000);
      }

      return { method, xpPerHour, gpPerHour, score, missing };
    });

    return list.sort((a, b) => {
      if (a.score == null && b.score == null) return a.method.level - b.method.level;
      if (a.score == null) return 1;
      if (b.score == null) return -1;
      return b.score - a.score;
    });
  }, [rowsByName, moneyPerHour]);

  return (
    <div className="mt-4 space-y-3">
      <div className="panel flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div>
          <h2 className="text-sm font-semibold">Crafting methods</h2>
          <p className="text-xs text-muted-foreground">
            Ranked for you using live GE prices. Higher score = better given how fast you make money.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <span className="whitespace-nowrap text-muted-foreground">My money-making</span>
          <input
            type="number"
            min={0}
            step={100_000}
            value={moneyPerHour}
            onChange={(e) => onMoneyPerHourChange(Math.max(0, Number(e.target.value) || 0))}
            className="h-9 w-32 rounded-md border border-border bg-background px-2 text-sm font-semibold tabular-nums"
          />
          <span className="text-muted-foreground">gp/h</span>
        </label>
      </div>

      <div className="space-y-2">
        {ranked.map((r, i) => (
          <MethodRow key={r.method.id} rank={i + 1} rowsByName={rowsByName} {...r} />
        ))}
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
  score,
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
            label="Score"
            value={score == null ? "—" : score.toLocaleString()}
            emphasis
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {method.inputs.map((part, idx) => (
          <span key={part.name} className="inline-flex items-center gap-1">
            {idx > 0 && <span className="text-muted-foreground">+</span>}
            <PartChip
              name={part.name}
              qty={part.qty}
              row={rowsByName.get(part.name)}
              kind="input"
            />
          </span>
        ))}
        <span className="px-1 text-muted-foreground">→</span>
        <PartChip
          name={method.output.name}
          qty={method.output.qty}
          row={rowsByName.get(method.output.name)}
          kind="output"
        />
        {missing && (
          <span className="text-[11px] text-muted-foreground">(missing price data)</span>
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
  const color =
    kind === "input"
      ? "text-destructive"
      : "text-[color:var(--deal)]";

  const inner = (
    <>
      <img
        src={iconUrl(row, name)}
        alt=""
        width={18}
        height={18}
        className="size-[18px] object-contain"
        loading="lazy"
      />
      <span className="max-w-[7rem] truncate sm:max-w-none">
        {qty > 1 ? `${qty}× ` : ""}
        {name}
      </span>
      <span className={`font-semibold tabular-nums ${color}`}>
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
        aria-label={`View ${name} price history`}
        onClick={saveScroll}
      >
        {inner}
      </Link>
    );
  }

  return <span className={className}>{inner}</span>;
}

function Stat({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string;
  value: string;
  tone?: "deal" | "steep";
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-[4.5rem]">
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
